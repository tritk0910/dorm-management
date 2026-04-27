import Link from "next/link";
import prisma from "../../lib/db";
import { deleteStudent } from "../lib/actions/student";
import type { Student } from "@/app/generated/prisma/client";

export default async function Page() {
  const students = await prisma.student.findMany();

  return (
    <main className="p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Students</h1>
        <Link
          href="/students/new"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Add Student
        </Link>
      </div>

      <table className="w-full border-collapse border border-gray-300 text-sm">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-gray-300 p-2 text-left">Name</th>
            <th className="border border-gray-300 p-2 text-left">Email</th>
            <th className="border border-gray-300 p-2 text-left">Major</th>
            <th className="border border-gray-300 p-2 text-left">Year</th>
            <th className="border border-gray-300 p-2 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {students.map((s: Student) => (
            <tr key={s.studentId}>
              <td className="border border-gray-300 p-2">
                {s.firstName} {s.lastName}
              </td>
              <td className="border border-gray-300 p-2">{s.email}</td>
              <td className="border border-gray-300 p-2">{s.major}</td>
              <td className="border border-gray-300 p-2">{s.year}</td>
              <td className="border border-gray-300 p-2">
                <div className="flex gap-3">
                  <Link
                    href={`/students/${s.studentId}/edit`}
                    className="text-blue-600 hover:underline"
                  >
                    Edit
                  </Link>
                  <form
                    action={async () => {
                      "use server";
                      await deleteStudent(s.studentId);
                    }}
                  >
                    <button
                      type="submit"
                      className="text-red-600 hover:underline"
                    >
                      Delete
                    </button>
                  </form>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}
