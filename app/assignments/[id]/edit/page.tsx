import { notFound } from "next/navigation";
import prisma from "../../../../lib/db";
import { updateRoomAssignment } from "../../../lib/actions/roomAssignment";
import { AssignmentForm } from "../../assignment-form";

export const dynamic = "force-dynamic";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [assignment, students, rooms, contracts] = await Promise.all([
    prisma.roomAssignment.findUnique({ where: { assignmentId: Number(id) } }),
    prisma.student.findMany({ orderBy: [{ lastName: "asc" }, { firstName: "asc" }] }),
    prisma.room.findMany({
      orderBy: [{ building: { buildingName: "asc" } }, { roomNumber: "asc" }],
      include: { building: true },
    }),
    prisma.contract.findMany({ orderBy: { startDate: "desc" } }),
  ]);

  if (!assignment) notFound();

  const update = updateRoomAssignment.bind(null, assignment.assignmentId);

  return (
    <AssignmentForm
      mode="edit"
      action={update}
      assignment={assignment}
      students={students}
      rooms={rooms}
      contracts={contracts}
    />
  );
}
