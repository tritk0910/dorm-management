"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import prisma from "../../../lib/db";

export async function createRoom(formData: FormData) {
  await prisma.room.create({
    data: {
      buildingId: Number(formData.get("buildingId")),
      roomNumber: formData.get("roomNumber") as string,
      capacity: Number(formData.get("capacity")),
      roomType: formData.get("roomType") as string,
    },
  });
  revalidatePath("/rooms");
  redirect("/rooms");
}

export async function updateRoom(id: number, formData: FormData) {
  await prisma.room.update({
    where: { roomId: id },
    data: {
      buildingId: Number(formData.get("buildingId")),
      roomNumber: formData.get("roomNumber") as string,
      capacity: Number(formData.get("capacity")),
      roomType: formData.get("roomType") as string,
    },
  });
  revalidatePath("/rooms");
  redirect("/rooms");
}

export async function deleteRoom(id: number) {
  await prisma.room.delete({ where: { roomId: id } });
  revalidatePath("/rooms");
}
