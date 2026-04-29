import prisma from "../../lib/db";
import { SetupForm } from "./setup-form";

export const dynamic = "force-dynamic";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const count = await prisma.user.count();
  const params = await searchParams;
  const isFirstUser = count === 0;

  return <SetupForm isFirstUser={isFirstUser} error={params.error} />;
}
