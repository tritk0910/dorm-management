import Link from "next/link";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import {
  IconArrowLeft,
  IconEdit,
  IconPlus,
  IconTool,
  IconTrash,
} from "@tabler/icons-react";

import prisma from "../../lib/db";
import { deleteMaintenanceRequest } from "../lib/actions/maintenance";
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

const STATUS_COLOR: Record<string, string> = {
  Pending: "bg-yellow-500/10 text-yellow-700 dark:text-yellow-300",
  "In Progress": "bg-blue-500/10 text-blue-700 dark:text-blue-300",
  Resolved: "bg-green-500/10 text-green-700 dark:text-green-300",
};

function fmt(date: Date) {
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default async function Page() {
  const requests = await prisma.maintenanceRequest.findMany({
    orderBy: { requestDate: "desc" },
    include: {
      room: { include: { building: true } },
      student: true,
      staff: true,
    },
  });

  const total = requests.length;
  const pending = requests.filter((r) => r.status === "Pending").length;
  const inProgress = requests.filter((r) => r.status === "In Progress").length;
  const resolved = requests.filter((r) => r.status === "Resolved").length;

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
              Maintenance
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Repair and service requests across all residence halls.
            </p>
          </div>
          <Button asChild size="lg">
            <Link href="/maintenance/new">
              <IconPlus />
              New request
            </Link>
          </Button>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-4">
          <Stat label="Total" value={total} caption="all requests" />
          <Stat label="Pending" value={pending} caption="awaiting action" />
          <Stat label="In progress" value={inProgress} caption="being handled" />
          <Stat label="Resolved" value={resolved} caption="completed" />
        </div>

        <Card className="mt-6 ring-foreground/8">
          <CardHeader className="border-b border-border/70 pb-4">
            <CardTitle className="text-base">All requests</CardTitle>
            <CardDescription>
              {total === 0
                ? "Nothing to see yet — submit the first request."
                : `${total} ${total === 1 ? "request" : "requests"}, newest first.`}
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            {total === 0 ? <EmptyState /> : <MaintenanceTable requests={requests} />}
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

type RequestWithDetails = Awaited<
  ReturnType<typeof prisma.maintenanceRequest.findMany>
>[number];

function MaintenanceTable({ requests }: { requests: RequestWithDetails[] }) {
  return (
    <Table>
      <TableHeader>
        <TableRow className="hover:bg-transparent">
          <TableHead>Room</TableHead>
          <TableHead className="hidden md:table-cell">Reporter</TableHead>
          <TableHead className="hidden lg:table-cell">Assigned to</TableHead>
          <TableHead className="hidden sm:table-cell">Date</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">&nbsp;</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {requests.map((r) => (
          <TableRow key={r.requestId} className="group">
            <TableCell>
              <div className="font-medium">
                {r.room.building.buildingName} — {r.room.roomNumber}
              </div>
              <div
                className="mt-0.5 max-w-[200px] truncate text-xs text-muted-foreground"
                title={r.description}
              >
                {r.description}
              </div>
            </TableCell>
            <TableCell className="hidden text-muted-foreground md:table-cell">
              {r.student.firstName} {r.student.lastName}
            </TableCell>
            <TableCell className="hidden text-muted-foreground lg:table-cell">
              {r.staff?.name ?? "Unassigned"}
            </TableCell>
            <TableCell className="num hidden text-muted-foreground sm:table-cell">
              {fmt(r.requestDate)}
            </TableCell>
            <TableCell>
              <Badge
                variant="secondary"
                className={STATUS_COLOR[r.status] ?? ""}
              >
                {r.status}
              </Badge>
            </TableCell>
            <TableCell className="text-right">
              <div className="flex justify-end gap-1 opacity-70 transition-opacity group-hover:opacity-100">
                <Button asChild size="icon-sm" variant="ghost" title="Edit">
                  <Link href={`/maintenance/${r.requestId}/edit`}>
                    <IconEdit />
                  </Link>
                </Button>
                <form
                  action={async () => {
                    "use server";
                    await deleteMaintenanceRequest(r.requestId);
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
        <IconTool className="size-6" />
      </div>
      <h3 className="mt-4 text-base">No requests yet</h3>
      <p className="mt-1 max-w-sm text-sm text-muted-foreground">
        Submit a maintenance request when a room needs attention.
      </p>
      <Button asChild className="mt-5">
        <Link href="/maintenance/new">
          <IconPlus />
          Submit the first request
        </Link>
      </Button>
    </div>
  );
}

