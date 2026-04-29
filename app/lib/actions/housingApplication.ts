"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import prisma from "../../../lib/db";

export async function submitHousingApplication(formData: FormData) {
  const studentId = Number(formData.get("studentId"));
  const preferredRoomType = formData.get("preferredRoomType") as string;
  const notes = (formData.get("notes") as string) ?? "";

  await prisma.housingApplication.create({
    data: {
      studentId,
      preferredRoomType,
      notes,
      status: "Pending",
    },
  });

  revalidatePath("/portal/apply");
  revalidatePath("/admin/applications");
  redirect("/portal?applied=1");
}
