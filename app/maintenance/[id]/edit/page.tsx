import { notFound } from "next/navigation";
import prisma from "../../../../lib/db";
import { updateMaintenanceRequest } from "../../../lib/actions/maintenance";
import { MaintenanceForm } from "../../maintenance-form";

export const dynamic = "force-dynamic";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [request, rooms, students, staff] = await Promise.all([
    prisma.maintenanceRequest.findUnique({ where: { requestId: Number(id) } }),
    prisma.room.findMany({
      orderBy: [{ building: { buildingName: "asc" } }, { roomNumber: "asc" }],
      include: { building: true },
    }),
    prisma.student.findMany({ orderBy: [{ lastName: "asc" }, { firstName: "asc" }] }),
    prisma.staff.findMany({ orderBy: { name: "asc" } }),
  ]);

  if (!request) notFound();

  const update = updateMaintenanceRequest.bind(null, request.requestId);

  return (
    <MaintenanceForm
      mode="edit"
      action={update}
      request={request}
      rooms={rooms}
      students={students}
      staff={staff}
    />
  );
}
