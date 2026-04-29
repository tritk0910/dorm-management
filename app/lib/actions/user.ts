"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import prisma from "../../../lib/db";
import { hashPassword } from "../../../lib/auth";

export async function createUser(formData: FormData) {
  const username = ((formData.get("username") as string) ?? "").trim();
  const password = (formData.get("password") as string) ?? "";
  const role = (formData.get("role") as string) ?? "student";
  const studentIdRaw = formData.get("studentId") as string;
  const staffIdRaw = formData.get("staffId") as string;

  await prisma.user.create({
    data: {
      username,
      passwordHash: hashPassword(password),
      role,
      studentId: studentIdRaw ? Number(studentIdRaw) : null,
      staffId: staffIdRaw ? Number(staffIdRaw) : null,
    },
  });

  revalidatePath("/admin/users");
  redirect("/admin/users");
}

export async function deleteUser(userId: number) {
  await prisma.user.delete({ where: { userId } });
  revalidatePath("/admin/users");
}

export async function setupAccount(formData: FormData) {
  const username = ((formData.get("username") as string) ?? "").trim();
  const password = (formData.get("password") as string) ?? "";

  const confirmPassword = (formData.get("confirmPassword") as string) ?? "";

  if (!username || password.length < 6) redirect("/setup?error=invalid");
  if (password !== confirmPassword) redirect("/setup?error=mismatch");

  const count = await prisma.user.count();
  const isFirstUser = count === 0;
  const role = isFirstUser ? "admin" : "student";

  if (isFirstUser) {
    await prisma.user.create({
      data: { username, passwordHash: hashPassword(password), role },
    });
  } else {
    const firstName = ((formData.get("firstName") as string) ?? "").trim();
    const lastName = ((formData.get("lastName") as string) ?? "").trim();
    const dob = formData.get("dob") as string;
    const gender = formData.get("gender") as string;
    const email = ((formData.get("email") as string) ?? "").trim();
    const phone = ((formData.get("phone") as string) ?? "").trim();
    const year = Number(formData.get("year"));
    const major = ((formData.get("major") as string) ?? "").trim();

    if (!firstName || !lastName || !dob || !gender || !email || !phone || !year || !major) {
      redirect("/setup?error=invalid");
    }

    // Create student and user in a transaction, link them
    await prisma.$transaction(async (tx) => {
      const student = await tx.student.create({
        data: { firstName, lastName, dob: new Date(dob), gender, email, phone, year, major },
      });
      await tx.user.create({
        data: { username, passwordHash: hashPassword(password), role, studentId: student.studentId },
      });
    });
  }

  redirect("/login?setup=1");
}
