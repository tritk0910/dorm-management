import prisma from "../../../lib/db";
import { createMaintenanceRequest } from "../../lib/actions/maintenance";
import { MaintenanceForm } from "../maintenance-form";

export const dynamic = "force-dynamic";

export default async function Page() {
  const [rooms, students, staff] = await Promise.all([
    prisma.room.findMany({
      orderBy: [{ building: { buildingName: "asc" } }, { roomNumber: "asc" }],
      include: { building: true },
    }),
    prisma.student.findMany({ orderBy: [{ lastName: "asc" }, { firstName: "asc" }] }),
    prisma.staff.findMany({ orderBy: { name: "asc" } }),
  ]);

  return (
    <MaintenanceForm
      mode="create"
      action={createMaintenanceRequest}
      rooms={rooms}
      students={students}
      staff={staff}
    />
  );
}
