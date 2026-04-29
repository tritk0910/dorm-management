import Link from "next/link";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import {
  IconArrowLeft,
  IconDoor,
  IconEdit,
  IconPlus,
  IconTrash,
} from "@tabler/icons-react";

import prisma from "../../lib/db";
import { deleteRoomAssignment } from "../lib/actions/roomAssignment";
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

function fmt(date: Date) {
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default async function Page() {
  const assignments = await prisma.roomAssignment.findMany({
    orderBy: { moveInDate: "desc" },
    include: {
      student: true,
      room: { include: { building: true } },
      contract: true,
    },
  });

  const total = assignments.length;
  const active = assignments.filter((a) => !a.moveOutDate).length;
  const past = assignments.filter((a) => !!a.moveOutDate).length;

  return (
    <>
      <Nav />

      <main className="mx-auto w-full max-w-5xl px-6 py-12 sm:px-8">
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
              Room Assignments
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Which students are assigned to which rooms under which contracts.
            </p>
          </div>
          <Button asChild size="lg">
            <Link href="/assignments/new">
              <IconPlus />
              New assignment
            </Link>
          </Button>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-3">
          <Stat label="Assignments" value={total} caption="total on record" />
          <Stat label="Active" value={active} caption="currently occupying" />
          <Stat label="Past" value={past} caption="moved out" />
        </div>

        <Card className="mt-6 ring-foreground/8">
          <CardHeader className="border-b border-border/70 pb-4">
            <CardTitle className="text-base">All assignments</CardTitle>
            <CardDescription>
              {total === 0
                ? "Nothing to see yet — create the first one."
                : `${total} ${total === 1 ? "assignment" : "assignments"}, newest first.`}
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            {total === 0 ? <EmptyState /> : <AssignmentTable assignments={assignments} />}
          </CardContent>
        </Card>
      </main>

      <Footer />
    </>
  );
}

/* ——————————————————————————————————————————————————————————— */


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

type AssignmentWithDetails = Awaited<
  ReturnType<typeof prisma.roomAssignment.findMany>
>[number];

function AssignmentTable({
  assignments,
}: {
  assignments: AssignmentWithDetails[];
}) {
  return (
    <Table>
      <TableHeader>
        <TableRow className="hover:bg-transparent">
          <TableHead>Student</TableHead>
          <TableHead>Room</TableHead>
          <TableHead className="hidden sm:table-cell">Contract</TableHead>
          <TableHead className="hidden md:table-cell">Move-in</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">&nbsp;</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {assignments.map((a) => (
          <TableRow key={a.assignmentId} className="group">
            <TableCell>
              <div className="font-medium">
                {a.student.firstName} {a.student.lastName}
              </div>
            </TableCell>
            <TableCell>
              <div className="text-sm">
                {a.room.building.buildingName}
              </div>
              <div className="num text-xs text-muted-foreground">
                Room {a.room.roomNumber}
              </div>
            </TableCell>
            <TableCell className="num hidden text-muted-foreground sm:table-cell">
              #{a.contractId.toString().padStart(4, "0")}
            </TableCell>
            <TableCell className="num hidden text-muted-foreground md:table-cell">
              {fmt(a.moveInDate)}
            </TableCell>
            <TableCell>
              {a.moveOutDate ? (
                <Badge variant="secondary" className="bg-gray-500/10 text-gray-600 dark:text-gray-400">
                  Moved out {fmt(a.moveOutDate)}
                </Badge>
              ) : (
                <Badge variant="secondary" className="bg-green-500/10 text-green-700 dark:text-green-300">
                  Active
                </Badge>
              )}
            </TableCell>
            <TableCell className="text-right">
              <div className="flex justify-end gap-1 opacity-70 transition-opacity group-hover:opacity-100">
                <Button asChild size="icon-sm" variant="ghost" title="Edit">
                  <Link href={`/assignments/${a.assignmentId}/edit`}>
                    <IconEdit />
                  </Link>
                </Button>
                <form
                  action={async () => {
                    "use server";
                    await deleteRoomAssignment(a.assignmentId);
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
        <IconDoor className="size-6" />
      </div>
      <h3 className="mt-4 text-base">No assignments yet</h3>
      <p className="mt-1 max-w-sm text-sm text-muted-foreground">
        Assign a student to a room under an active contract to get started.
      </p>
      <Button asChild className="mt-5">
        <Link href="/assignments/new">
          <IconPlus />
          Create the first assignment
        </Link>
      </Button>
    </div>
  );
}

