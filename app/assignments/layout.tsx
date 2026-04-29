import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";

export default async function Layout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  if (!session) redirect("/login");
  if (session.role === "student") redirect("/portal");
  return <>{children}</>;
}
