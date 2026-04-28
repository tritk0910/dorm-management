import { notFound } from "next/navigation";
import prisma from "../../../../lib/db";
import { updateStudent } from "../../../lib/actions/student";
import { StudentForm } from "../../student-form";

// Reads from the DB at request time — opt out of static prerendering.
export const dynamic = "force-dynamic";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const student = await prisma.student.findUnique({
    where: { studentId: Number(id) },
  });

  if (!student) notFound();

  const update = updateStudent.bind(null, student.studentId);

  return <StudentForm mode="edit" action={update} student={student} />;
}
