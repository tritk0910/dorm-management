"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import prisma from "../../../lib/db";

export async function createStaff(formData: FormData) {
  await prisma.staff.create({
    data: {
      name: formData.get("name") as string,
      role: formData.get("role") as string,
      phone: formData.get("phone") as string,
      email: formData.get("email") as string,
    },
  });
  revalidatePath("/staff");
  redirect("/staff");
}

export async function updateStaff(id: number, formData: FormData) {
  await prisma.staff.update({
    where: { staffId: id },
    data: {
      name: formData.get("name") as string,
      role: formData.get("role") as string,
      phone: formData.get("phone") as string,
      email: formData.get("email") as string,
    },
  });
  revalidatePath("/staff");
  redirect("/staff");
}

export async function deleteStaff(id: number) {
  await prisma.staff.delete({ where: { staffId: id } });
  revalidatePath("/staff");
}
