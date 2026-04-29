import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { LoginForm } from "./login-form";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ setup?: string }>;
}) {
  const session = await getSession();
  if (session) {
    redirect(session.role === "student" ? "/portal" : "/admin");
  }

  const params = await searchParams;

  return <LoginForm setupDone={params.setup === "1"} />;
}
