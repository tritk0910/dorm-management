"use server";

import { revalidatePath } from "next/cache";
import prisma from "../../../lib/db";

export async function autoMatchRoom(studentId: number) {
  const student = await prisma.student.findUnique({ where: { studentId } });
  if (!student) return null;

  const studentPrefs = student.preferences.split(",").filter(Boolean);

  const rooms = await prisma.room.findMany({
    include: {
      building: true,
      assignments: {
        where: { moveOutDate: null },
        include: { student: true },
      },
    },
  });

  const scored = rooms
    .filter((r) => r.assignments.length < r.capacity)
    .map((room) => {
      let score = 0;
      const occupants = room.assignments.map((a) => a.student);

      // Gender compatibility
      if (
        occupants.length === 0 ||
        occupants.every((o) => o.gender === student.gender)
      ) {
        score += 30;
      } else if (occupants.some((o) => o.gender === student.gender)) {
        score += 5;
      }

      // Year proximity (freshman with freshman, seniors with seniors)
      for (const o of occupants) {
        if (Math.abs(o.year - student.year) <= 1) score += 15;
      }

      // Preference overlap with existing occupants
      for (const o of occupants) {
        const oPrefs = o.preferences.split(",").filter(Boolean);
        const overlap = studentPrefs.filter((p) => oPrefs.includes(p)).length;
        score += overlap * 10;
      }

      // Quiet preference → prefer empty or low-occupancy rooms
      if (studentPrefs.includes("quiet")) {
        score += Math.max(0, 20 - occupants.length * 10);
      }

      // Social preference → prefer rooms with occupants
      if (studentPrefs.includes("social") && occupants.length > 0) {
        score += 20;
      }

      // Slight preference for rooms that aren't at max capacity (more space)
      const fillRatio = occupants.length / room.capacity;
      score += Math.round((1 - fillRatio) * 5);

      return { room, score };
    })
    .sort((a, b) => b.score - a.score);

  return scored[0]?.room ?? null;
}

export async function runAutoMatch(applicationId: number, studentId: number) {
  const match = await autoMatchRoom(studentId);
  if (!match) return { matched: false } as const;

  await prisma.housingApplication.update({
    where: { applicationId },
    data: { matchedRoomId: match.roomId },
  });

  revalidatePath("/admin/applications");
  return { matched: true, room: match } as const;
}

export async function approveApplication(applicationId: number) {
  await prisma.housingApplication.update({
    where: { applicationId },
    data: { status: "Approved" },
  });
  revalidatePath("/admin/applications");
}

export async function rejectApplication(applicationId: number) {
  await prisma.housingApplication.update({
    where: { applicationId },
    data: { status: "Rejected" },
  });
  revalidatePath("/admin/applications");
}

export async function approveRoomChange(changeRequestId: number) {
  await prisma.roomChangeRequest.update({
    where: { changeRequestId },
    data: { status: "Approved" },
  });
  revalidatePath("/admin/applications");
}

export async function rejectRoomChange(changeRequestId: number) {
  await prisma.roomChangeRequest.update({
    where: { changeRequestId },
    data: { status: "Rejected" },
  });
  revalidatePath("/admin/applications");
}
