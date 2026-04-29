import { notFound } from "next/navigation";
import prisma from "../../../../lib/db";
import { updateStaff } from "../../../lib/actions/staff";
import { StaffForm } from "../../staff-form";

export const dynamic = "force-dynamic";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const staff = await prisma.staff.findUnique({
    where: { staffId: Number(id) },
  });

  if (!staff) notFound();

  const update = updateStaff.bind(null, staff.staffId);

  return <StaffForm mode="edit" action={update} staff={staff} />;
}
