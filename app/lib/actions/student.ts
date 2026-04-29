"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import prisma from "../../../lib/db";

export async function createStudent(formData: FormData) {
  const preferences = formData.getAll("preferences").join(",");

  await prisma.student.create({
    data: {
      firstName: formData.get("firstName") as string,
      lastName: formData.get("lastName") as string,
      dob: new Date(formData.get("dob") as string),
      gender: formData.get("gender") as string,
      phone: formData.get("phone") as string,
      email: formData.get("email") as string,
      major: formData.get("major") as string,
      year: Number(formData.get("year")),
      preferences,
    },
  });

  revalidatePath("/students");
  redirect("/students");
}

export async function updateStudent(id: number, formData: FormData) {
  const preferences = formData.getAll("preferences").join(",");

  await prisma.student.update({
    where: { studentId: id },
    data: {
      firstName: formData.get("firstName") as string,
      lastName: formData.get("lastName") as string,
      dob: new Date(formData.get("dob") as string),
      gender: formData.get("gender") as string,
      phone: formData.get("phone") as string,
      email: formData.get("email") as string,
      major: formData.get("major") as string,
      year: Number(formData.get("year")),
      preferences,
    },
  });

  revalidatePath("/students");
  redirect("/students");
}

export async function deleteStudent(id: number) {
  await prisma.student.delete({ where: { studentId: id } });
  revalidatePath("/students");
}
