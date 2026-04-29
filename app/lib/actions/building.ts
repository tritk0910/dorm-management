"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import prisma from "../../../lib/db";

export async function createBuilding(formData: FormData) {
  await prisma.building.create({
    data: {
      buildingName: formData.get("buildingName") as string,
      address: formData.get("address") as string,
    },
  });
  revalidatePath("/buildings");
  redirect("/buildings");
}

export async function updateBuilding(id: number, formData: FormData) {
  await prisma.building.update({
    where: { buildingId: id },
    data: {
      buildingName: formData.get("buildingName") as string,
      address: formData.get("address") as string,
    },
  });
  revalidatePath("/buildings");
  redirect("/buildings");
}

export async function deleteBuilding(id: number) {
  await prisma.building.delete({ where: { buildingId: id } });
  revalidatePath("/buildings");
}
