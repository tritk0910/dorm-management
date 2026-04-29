"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import prisma from "../../../lib/db";

export async function createPayment(formData: FormData) {
  await prisma.payment.create({
    data: {
      contractId: Number(formData.get("contractId")),
      amount: parseFloat(formData.get("amount") as string),
      paymentDate: new Date(formData.get("paymentDate") as string),
      paymentType: formData.get("paymentType") as string,
      status: formData.get("status") as string,
      dueDate: new Date(formData.get("dueDate") as string),
    },
  });
  revalidatePath("/payments");
  redirect("/payments");
}

export async function updatePayment(id: number, formData: FormData) {
  await prisma.payment.update({
    where: { paymentId: id },
    data: {
      contractId: Number(formData.get("contractId")),
      amount: parseFloat(formData.get("amount") as string),
      paymentDate: new Date(formData.get("paymentDate") as string),
      paymentType: formData.get("paymentType") as string,
      status: formData.get("status") as string,
      dueDate: new Date(formData.get("dueDate") as string),
    },
  });
  revalidatePath("/payments");
  redirect("/payments");
}

export async function deletePayment(id: number) {
  await prisma.payment.delete({ where: { paymentId: id } });
  revalidatePath("/payments");
}
