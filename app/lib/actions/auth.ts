"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import prisma from "../../../lib/db";
import {
  verifyPassword,
  encodeSession,
  SESSION_COOKIE,
  type Role,
} from "../../../lib/auth";

export async function login(
  _prev: { error: string } | null,
  formData: FormData,
): Promise<{ error: string }> {
  const username = ((formData.get("username") as string) ?? "").trim();
  const password = (formData.get("password") as string) ?? "";

  if (!username || !password) {
    return { error: "Username and password are required." };
  }

  const user = await prisma.user.findUnique({ where: { username } });
  if (!user || !verifyPassword(password, user.passwordHash)) {
    return { error: "Invalid username or password." };
  }

  const session = {
    userId: user.userId,
    role: user.role as Role,
    name: user.username,
    ...(user.studentId != null ? { studentId: user.studentId } : {}),
    ...(user.staffId != null ? { staffId: user.staffId } : {}),
  };

  const token = encodeSession(session);
  const jar = await cookies();
  jar.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  redirect(user.role === "student" ? "/portal" : "/admin");
}

export async function logout() {
  "use server";
  const jar = await cookies();
  jar.delete(SESSION_COOKIE);
  redirect("/login");
}
