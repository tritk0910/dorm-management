"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import prisma from "../../../lib/db";

export async function createRoomAssignment(formData: FormData) {
  const moveOutRaw = formData.get("moveOutDate") as string;
  await prisma.roomAssignment.create({
    data: {
      studentId: Number(formData.get("studentId")),
      roomId: Number(formData.get("roomId")),
      contractId: Number(formData.get("contractId")),
      moveInDate: new Date(formData.get("moveInDate") as string),
      moveOutDate: moveOutRaw ? new Date(moveOutRaw) : null,
    },
  });
  revalidatePath("/assignments");
  redirect("/assignments");
}

export async function updateRoomAssignment(id: number, formData: FormData) {
  const moveOutRaw = formData.get("moveOutDate") as string;
  await prisma.roomAssignment.update({
    where: { assignmentId: id },
    data: {
      studentId: Number(formData.get("studentId")),
      roomId: Number(formData.get("roomId")),
      contractId: Number(formData.get("contractId")),
      moveInDate: new Date(formData.get("moveInDate") as string),
      moveOutDate: moveOutRaw ? new Date(moveOutRaw) : null,
    },
  });
  revalidatePath("/assignments");
  redirect("/assignments");
}

export async function deleteRoomAssignment(id: number) {
  await prisma.roomAssignment.delete({ where: { assignmentId: id } });
  revalidatePath("/assignments");
}
