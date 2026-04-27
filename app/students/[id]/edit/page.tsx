import Link from "next/link";
import { notFound } from "next/navigation";
import prisma from "../../../../lib/db";
import { updateStudent } from "../../../lib/actions/student";

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

  return (
    <main className="p-8 max-w-lg">
      <div className="flex items-center gap-4 mb-6">
        <Link href="/students" className="text-gray-500 hover:underline">
          ← Back
        </Link>
        <h1 className="text-2xl font-bold">Edit Student</h1>
      </div>

      <form action={update} className="flex flex-col gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">First Name</label>
          <input
            name="firstName"
            defaultValue={student.firstName}
            required
            className="border rounded w-full p-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Last Name</label>
          <input
            name="lastName"
            defaultValue={student.lastName}
            required
            className="border rounded w-full p-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">
            Date of Birth
          </label>
          <input
            name="dob"
            type="date"
            defaultValue={student.dob.toISOString().split("T")[0]}
            required
            className="border rounded w-full p-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Gender</label>
          <select
            name="gender"
            defaultValue={student.gender}
            required
            className="border rounded w-full p-2"
          >
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Phone</label>
          <input
            name="phone"
            defaultValue={student.phone}
            required
            className="border rounded w-full p-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <input
            name="email"
            type="email"
            defaultValue={student.email}
            required
            className="border rounded w-full p-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Major</label>
          <input
            name="major"
            defaultValue={student.major}
            required
            className="border rounded w-full p-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Year</label>
          <input
            name="year"
            type="number"
            min={1}
            max={6}
            defaultValue={student.year}
            required
            className="border rounded w-full p-2"
          />
        </div>
        <button
          type="submit"
          className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700 mt-2"
        >
          Save Changes
        </button>
      </form>
    </main>
  );
}
