import Link from "next/link";

export default function Page() {
  return (
    <div className="flex justify-center items-center h-screen w-full">
      <p className="block">
        I set up the{" "}
        <Link href="/students" className="text-blue-500">
          /students
        </Link>{" "}
        page already, check it out.
      </p>
    </div>
  );
}
