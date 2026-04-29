"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import prisma from "../../../lib/db";

export async function createMaintenanceRequest(formData: FormData) {
  const staffIdRaw = formData.get("staffId") as string;
  await prisma.maintenanceRequest.create({
    data: {
      roomId: Number(formData.get("roomId")),
      studentId: Number(formData.get("studentId")),
      description: formData.get("description") as string,
      requestDate: new Date(formData.get("requestDate") as string),
      status: formData.get("status") as string,
      staffId: staffIdRaw ? Number(staffIdRaw) : null,
    },
  });
  revalidatePath("/maintenance");
  redirect("/maintenance");
}

export async function updateMaintenanceRequest(id: number, formData: FormData) {
  const staffIdRaw = formData.get("staffId") as string;
  await prisma.maintenanceRequest.update({
    where: { requestId: id },
    data: {
      roomId: Number(formData.get("roomId")),
      studentId: Number(formData.get("studentId")),
      description: formData.get("description") as string,
      requestDate: new Date(formData.get("requestDate") as string),
      status: formData.get("status") as string,
      staffId: staffIdRaw ? Number(staffIdRaw) : null,
    },
  });
  revalidatePath("/maintenance");
  redirect("/maintenance");
}

export async function deleteMaintenanceRequest(id: number) {
  await prisma.maintenanceRequest.delete({ where: { requestId: id } });
  revalidatePath("/maintenance");
}
