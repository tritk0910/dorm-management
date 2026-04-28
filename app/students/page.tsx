import Link from "next/link";
import {
  IconArrowLeft,
  IconClipboardList,
  IconEdit,
  IconPlus,
  IconTrash,
  IconUsers,
} from "@tabler/icons-react";

import prisma from "../../lib/db";
import { deleteStudent } from "../lib/actions/student";
import type { Student } from "@/app/generated/prisma/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const dynamic = "force-dynamic";

const YEAR_LABEL: Record<number, string> = {
  1: "Freshman",
  2: "Sophomore",
  3: "Junior",
  4: "Senior",
  5: "5th Year",
  6: "Graduate",
};

export default async function Page() {
  const students = await prisma.student.findMany({
    orderBy: [{ lastName: "asc" }, { firstName: "asc" }],
  });

  const total = students.length;
  const majors = new Set(students.map((s) => s.major)).size;
  const upperclass = students.filter((s) => s.year >= 3).length;

  return (
    <>
      <Nav />

      <main className="mx-auto w-full max-w-5xl px-6 py-12 sm:px-8">
        {/* Header */}
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <Link
              href="/"
              className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
            >
              <IconArrowLeft className="size-3.5" />
              Home
            </Link>
            <h1 className="mt-2 text-3xl tracking-tight sm:text-4xl">
              Residents
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Everyone who calls Hearthstead home this term.
            </p>
          </div>
          <Button asChild size="lg">
            <Link href="/students/new">
              <IconPlus />
              Add student
            </Link>
          </Button>
        </div>

        {/* Stats */}
        <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-3">
          <Stat label="On file" value={total} caption="total residents" />
          <Stat label="Majors" value={majors} caption="distinct fields" />
          <Stat
            label="Upperclass"
            value={upperclass}
            caption="year 3 and above"
          />
        </div>

        {/* Table or empty */}
        <Card className="mt-6 ring-foreground/8">
          <CardHeader className="border-b border-border/70 pb-4">
            <CardTitle className="text-base">The roster</CardTitle>
            <CardDescription>
              {total === 0
                ? "Nothing to see yet — add the first one."
                : `${total} ${total === 1 ? "entry" : "entries"}, sorted by surname.`}
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            {total === 0 ? <EmptyState /> : <RosterTable students={students} />}
          </CardContent>
        </Card>
      </main>

      <Footer />
    </>
  );
}

/* ——————————————————————————————————————————————————————————— */

function Nav() {
  return (
    <header className="sticky top-0 z-10 border-b border-border/70 bg-background/80 backdrop-blur">
      <div className="mx-auto flex w-full max-w-5xl items-center justify-between px-6 py-3 sm:px-8">
        <Link href="/" className="flex items-center gap-2">
          <span className="grid size-7 place-items-center rounded-md bg-foreground text-background">
            <IconClipboardList className="size-4" />
          </span>
          <span className="text-base tracking-tight">
            Hearth<span className="font-serif italic text-warm">stead</span>
          </span>
        </Link>
        <nav className="flex items-center gap-1">
          <Button asChild variant="ghost" size="sm">
            <Link href="/students">Residents</Link>
          </Button>
          <Button asChild size="sm">
            <Link href="/students/new">Add student</Link>
          </Button>
        </nav>
      </div>
    </header>
  );
}

function Stat({
  label,
  value,
  caption,
}: {
  label: string;
  value: number;
  caption: string;
}) {
  return (
    <Card size="sm" className="ring-foreground/8">
      <CardContent className="flex flex-col gap-1">
        <span className="text-xs text-muted-foreground">{label}</span>
        <span className="num text-2xl tracking-tight">
          {value.toString().padStart(2, "0")}
        </span>
        <span className="text-xs text-muted-foreground">{caption}</span>
      </CardContent>
    </Card>
  );
}

function RosterTable({ students }: { students: Student[] }) {
  return (
    <Table>
      <TableHeader>
        <TableRow className="hover:bg-transparent">
          <TableHead>Name</TableHead>
          <TableHead className="hidden sm:table-cell">Email</TableHead>
          <TableHead className="hidden md:table-cell">Major</TableHead>
          <TableHead>Year</TableHead>
          <TableHead className="text-right">&nbsp;</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {students.map((s) => (
          <TableRow key={s.studentId} className="group">
            <TableCell>
              <div className="font-medium">
                {s.firstName} {s.lastName}
              </div>
              <div className="text-xs text-muted-foreground sm:hidden">
                {s.email}
              </div>
            </TableCell>
            <TableCell className="hidden sm:table-cell">
              <a
                href={`mailto:${s.email}`}
                className="text-muted-foreground hover:text-foreground"
              >
                {s.email}
              </a>
            </TableCell>
            <TableCell className="hidden text-muted-foreground md:table-cell">
              {s.major}
            </TableCell>
            <TableCell>
              <Badge variant="secondary" className="num">
                {YEAR_LABEL[s.year] ?? `Year ${s.year}`}
              </Badge>
            </TableCell>
            <TableCell className="text-right">
              <div className="flex justify-end gap-1 opacity-70 transition-opacity group-hover:opacity-100">
                <Button asChild size="icon-sm" variant="ghost" title="Edit">
                  <Link href={`/students/${s.studentId}/edit`}>
                    <IconEdit />
                  </Link>
                </Button>
                <form
                  action={async () => {
                    "use server";
                    await deleteStudent(s.studentId);
                  }}
                >
                  <Button
                    type="submit"
                    size="icon-sm"
                    variant="ghost"
                    title="Delete"
                    className="hover:bg-destructive/10 hover:text-destructive"
                  >
                    <IconTrash />
                  </Button>
                </form>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
      <div className="grid size-12 place-items-center rounded-2xl bg-warm/12 text-warm">
        <IconUsers className="size-6" />
      </div>
      <h3 className="mt-4 text-base">No residents yet</h3>
      <p className="mt-1 max-w-sm text-sm text-muted-foreground">
        Start the registry with your first resident — it only takes a minute.
      </p>
      <Button asChild className="mt-5">
        <Link href="/students/new">
          <IconPlus />
          Add the first student
        </Link>
      </Button>
    </div>
  );
}

function Footer() {
  return (
    <footer className="mt-auto border-t border-border/70">
      <div className="mx-auto flex w-full max-w-5xl flex-col items-start justify-between gap-2 px-6 py-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:px-8">
        <span>
          Hearthstead — a small{" "}
          <span className="font-serif italic">CRUD</span> exercise.
        </span>
        <span className="num">Next.js · Prisma · shadcn</span>
      </div>
    </footer>
  );
}
