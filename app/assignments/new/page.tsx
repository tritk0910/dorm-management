import prisma from "../../../lib/db";
import { createRoomAssignment } from "../../lib/actions/roomAssignment";
import { AssignmentForm } from "../assignment-form";

export const dynamic = "force-dynamic";

export default async function Page() {
  const [students, rooms, contracts] = await Promise.all([
    prisma.student.findMany({ orderBy: [{ lastName: "asc" }, { firstName: "asc" }] }),
    prisma.room.findMany({
      orderBy: [{ building: { buildingName: "asc" } }, { roomNumber: "asc" }],
      include: { building: true },
    }),
    prisma.contract.findMany({ orderBy: { startDate: "desc" } }),
  ]);

  return (
    <AssignmentForm
      mode="create"
      action={createRoomAssignment}
      students={students}
      rooms={rooms}
      contracts={contracts}
    />
  );
}
