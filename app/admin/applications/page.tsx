import Link from "next/link";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import {
  IconArrowLeft,
  IconCheck,
  IconSparkles,
  IconX,
} from "@tabler/icons-react";

import prisma from "../../../lib/db";
import {
  runAutoMatch,
  approveApplication,
  rejectApplication,
  approveRoomChange,
  rejectRoomChange,
} from "@/app/lib/actions/autoMatch";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export const dynamic = "force-dynamic";

const STATUS_COLOR: Record<string, string> = {
  Pending: "bg-yellow-500/10 text-yellow-700 dark:text-yellow-300",
  Approved: "bg-green-500/10 text-green-700 dark:text-green-300",
  Rejected: "bg-red-500/10 text-red-700 dark:text-red-300",
};

function fmt(d: Date) {
  return d.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
}

export default async function Page() {
  const [applications, changes] = await Promise.all([
    prisma.housingApplication.findMany({
      orderBy: { submittedAt: "desc" },
      include: {
        student: true,
        matchedRoom: { include: { building: true } },
      },
    }),
    prisma.roomChangeRequest.findMany({
      orderBy: { submittedAt: "desc" },
      include: {
        student: true,
        fromRoom: { include: { building: true } },
      },
    }),
  ]);

  return (
    <>
      <Nav />
      <main className="mx-auto w-full max-w-5xl px-6 py-12 sm:px-8">
        <Link
          href="/admin"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <IconArrowLeft className="size-3.5" />
          Admin dashboard
        </Link>
        <h1 className="mt-2 text-3xl tracking-tight sm:text-4xl">
          Applications
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Housing applications and room-change requests from students.
        </p>

        {/* Housing applications */}
        <Card className="mt-8 ring-foreground/8">
          <CardHeader className="border-b border-border/70 pb-4">
            <CardTitle className="text-base">Housing Applications</CardTitle>
            <CardDescription>
              {applications.length === 0
                ? "No applications yet."
                : `${applications.length} total — use Auto-match to find the best room.`}
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            {applications.length === 0 ? (
              <div className="py-12 text-center text-sm text-muted-foreground">
                No housing applications submitted yet.
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead>Student</TableHead>
                    <TableHead className="hidden sm:table-cell">Preferred type</TableHead>
                    <TableHead className="hidden md:table-cell">Submitted</TableHead>
                    <TableHead>Matched room</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">&nbsp;</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {applications.map((app) => (
                    <TableRow key={app.applicationId} className="group">
                      <TableCell>
                        <div className="font-medium">
                          {app.student.firstName} {app.student.lastName}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Yr {app.student.year} · {app.student.gender}
                          {app.student.preferences
                            ? ` · ${app.student.preferences.split(",").join(", ")}`
                            : ""}
                        </div>
                      </TableCell>
                      <TableCell className="hidden text-muted-foreground sm:table-cell">
                        {app.preferredRoomType}
                      </TableCell>
                      <TableCell className="num hidden text-muted-foreground md:table-cell">
                        {fmt(app.submittedAt)}
                      </TableCell>
                      <TableCell>
                        {app.matchedRoom ? (
                          <div>
                            <div className="text-sm font-medium">
                              {app.matchedRoom.building.buildingName}
                            </div>
                            <div className="num text-xs text-muted-foreground">
                              Room {app.matchedRoom.roomNumber}
                            </div>
                          </div>
                        ) : (
                          <span className="text-xs text-muted-foreground">—</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" className={STATUS_COLOR[app.status] ?? ""}>
                          {app.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1 opacity-70 transition-opacity group-hover:opacity-100">
                          <form
                            action={async () => {
                              "use server";
                              await runAutoMatch(app.applicationId, app.studentId);
                            }}
                          >
                            <Button
                              type="submit"
                              size="icon-sm"
                              variant="ghost"
                              title="Auto-match room"
                              className="hover:bg-warm/10 hover:text-warm"
                            >
                              <IconSparkles />
                            </Button>
                          </form>
                          <form
                            action={async () => {
                              "use server";
                              await approveApplication(app.applicationId);
                            }}
                          >
                            <Button
                              type="submit"
                              size="icon-sm"
                              variant="ghost"
                              title="Approve"
                              className="hover:bg-green-500/10 hover:text-green-600"
                            >
                              <IconCheck />
                            </Button>
                          </form>
                          <form
                            action={async () => {
                              "use server";
                              await rejectApplication(app.applicationId);
                            }}
                          >
                            <Button
                              type="submit"
                              size="icon-sm"
                              variant="ghost"
                              title="Reject"
                              className="hover:bg-destructive/10 hover:text-destructive"
                            >
                              <IconX />
                            </Button>
                          </form>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Room change requests */}
        <Card id="changes" className="mt-6 ring-foreground/8">
          <CardHeader className="border-b border-border/70 pb-4">
            <CardTitle className="text-base">Room-Change Requests</CardTitle>
            <CardDescription>
              {changes.length === 0
                ? "No room-change requests."
                : `${changes.length} total.`}
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            {changes.length === 0 ? (
              <div className="py-12 text-center text-sm text-muted-foreground">
                No room-change requests yet.
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead>Student</TableHead>
                    <TableHead>Current room</TableHead>
                    <TableHead className="hidden md:table-cell">Reason</TableHead>
                    <TableHead className="hidden sm:table-cell">Submitted</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">&nbsp;</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {changes.map((cr) => (
                    <TableRow key={cr.changeRequestId} className="group">
                      <TableCell>
                        <div className="font-medium">
                          {cr.student.firstName} {cr.student.lastName}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {cr.fromRoom.building.buildingName}
                        </div>
                        <div className="num text-xs text-muted-foreground">
                          Room {cr.fromRoom.roomNumber}
                        </div>
                      </TableCell>
                      <TableCell className="hidden max-w-[200px] truncate text-muted-foreground md:table-cell">
                        {cr.reason}
                      </TableCell>
                      <TableCell className="num hidden text-muted-foreground sm:table-cell">
                        {fmt(cr.submittedAt)}
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" className={STATUS_COLOR[cr.status] ?? ""}>
                          {cr.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1 opacity-70 transition-opacity group-hover:opacity-100">
                          <form
                            action={async () => {
                              "use server";
                              await approveRoomChange(cr.changeRequestId);
                            }}
                          >
                            <Button
                              type="submit"
                              size="icon-sm"
                              variant="ghost"
                              title="Approve"
                              className="hover:bg-green-500/10 hover:text-green-600"
                            >
                              <IconCheck />
                            </Button>
                          </form>
                          <form
                            action={async () => {
                              "use server";
                              await rejectRoomChange(cr.changeRequestId);
                            }}
                          >
                            <Button
                              type="submit"
                              size="icon-sm"
                              variant="ghost"
                              title="Reject"
                              className="hover:bg-destructive/10 hover:text-destructive"
                            >
                              <IconX />
                            </Button>
                          </form>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </main>
      <Footer />
    </>
  );
}
