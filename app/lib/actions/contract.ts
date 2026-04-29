"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import prisma from "../../../lib/db";

export async function createContract(formData: FormData) {
  await prisma.contract.create({
    data: {
      startDate: new Date(formData.get("startDate") as string),
      endDate: new Date(formData.get("endDate") as string),
      depositAmount: parseFloat(formData.get("depositAmount") as string),
      status: formData.get("status") as string,
    },
  });
  revalidatePath("/contracts");
  redirect("/contracts");
}

export async function updateContract(id: number, formData: FormData) {
  await prisma.contract.update({
    where: { contractId: id },
    data: {
      startDate: new Date(formData.get("startDate") as string),
      endDate: new Date(formData.get("endDate") as string),
      depositAmount: parseFloat(formData.get("depositAmount") as string),
      status: formData.get("status") as string,
    },
  });
  revalidatePath("/contracts");
  redirect("/contracts");
}

export async function deleteContract(id: number) {
  await prisma.contract.delete({ where: { contractId: id } });
  revalidatePath("/contracts");
}
