import Link from "next/link";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import {
  IconArrowLeft,
  IconEdit,
  IconPlus,
  IconTrash,
  IconUsers,
} from "@tabler/icons-react";

import prisma from "../../lib/db";
import { deleteStaff } from "../lib/actions/staff";
import type { Staff } from "@/app/generated/prisma/client";
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

const ROLE_COLOR: Record<string, string> = {
  Maintenance: "bg-orange-500/10 text-orange-700 dark:text-orange-300",
  Administrator: "bg-blue-500/10 text-blue-700 dark:text-blue-300",
  Security: "bg-red-500/10 text-red-700 dark:text-red-300",
  Housekeeper: "bg-green-500/10 text-green-700 dark:text-green-300",
  Manager: "bg-purple-500/10 text-purple-700 dark:text-purple-300",
};

export default async function Page() {
  const staff = await prisma.staff.findMany({
    orderBy: { name: "asc" },
  });

  const total = staff.length;
  const roles = new Set(staff.map((s) => s.role)).size;
  const maintenance = staff.filter((s) => s.role === "Maintenance").length;

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
            <h1 className="mt-2 text-3xl tracking-tight sm:text-4xl">Staff</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Personnel responsible for running the residence.
            </p>
          </div>
          <Button asChild size="lg">
            <Link href="/staff/new">
              <IconPlus />
              Add staff
            </Link>
          </Button>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-3">
          <Stat label="Staff" value={total} caption="total members" />
          <Stat label="Roles" value={roles} caption="distinct roles" />
          <Stat label="Maintenance" value={maintenance} caption="on maintenance crew" />
        </div>

        <Card className="mt-6 ring-foreground/8">
          <CardHeader className="border-b border-border/70 pb-4">
            <CardTitle className="text-base">All staff</CardTitle>
            <CardDescription>
              {total === 0
                ? "Nothing to see yet — add the first one."
                : `${total} ${total === 1 ? "member" : "members"}, sorted by name.`}
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            {total === 0 ? <EmptyState /> : <StaffTable staff={staff} />}
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

function StaffTable({ staff }: { staff: Staff[] }) {
  return (
    <Table>
      <TableHeader>
        <TableRow className="hover:bg-transparent">
          <TableHead>Name</TableHead>
          <TableHead>Role</TableHead>
          <TableHead className="hidden sm:table-cell">Email</TableHead>
          <TableHead className="hidden md:table-cell">Phone</TableHead>
          <TableHead className="text-right">&nbsp;</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {staff.map((s) => (
          <TableRow key={s.staffId} className="group">
            <TableCell>
              <div className="font-medium">{s.name}</div>
              <div className="text-xs text-muted-foreground sm:hidden">{s.email}</div>
            </TableCell>
            <TableCell>
              <Badge variant="secondary" className={ROLE_COLOR[s.role] ?? ""}>
                {s.role}
              </Badge>
            </TableCell>
            <TableCell className="hidden text-muted-foreground sm:table-cell">
              <a href={`mailto:${s.email}`} className="hover:text-foreground">
                {s.email}
              </a>
            </TableCell>
            <TableCell className="hidden text-muted-foreground md:table-cell">
              {s.phone}
            </TableCell>
            <TableCell className="text-right">
              <div className="flex justify-end gap-1 opacity-70 transition-opacity group-hover:opacity-100">
                <Button asChild size="icon-sm" variant="ghost" title="Edit">
                  <Link href={`/staff/${s.staffId}/edit`}>
                    <IconEdit />
                  </Link>
                </Button>
                <form
                  action={async () => {
                    "use server";
                    await deleteStaff(s.staffId);
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
      <h3 className="mt-4 text-base">No staff yet</h3>
      <p className="mt-1 max-w-sm text-sm text-muted-foreground">
        Add staff members to assign them to maintenance requests.
      </p>
      <Button asChild className="mt-5">
        <Link href="/staff/new">
          <IconPlus />
          Add the first staff member
        </Link>
      </Button>
    </div>
  );
}

