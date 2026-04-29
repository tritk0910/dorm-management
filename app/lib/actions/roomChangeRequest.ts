"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import prisma from "../../../lib/db";

export async function submitRoomChangeRequest(formData: FormData) {
  const studentId = Number(formData.get("studentId"));
  const fromRoomId = Number(formData.get("fromRoomId"));
  const reason = formData.get("reason") as string;

  await prisma.roomChangeRequest.create({
    data: {
      studentId,
      fromRoomId,
      reason,
      status: "Pending",
    },
  });

  revalidatePath("/portal/room-change");
  revalidatePath("/admin/applications");
  redirect("/portal?change=1");
}
