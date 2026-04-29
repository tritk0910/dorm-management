import Link from "next/link";
import { IconArrowLeft, IconCheck, IconTool } from "@tabler/icons-react";

import prisma from "../../../lib/db";
import { getSession } from "@/lib/auth";
import { PortalNav } from "@/components/portal-nav";
import { Footer } from "@/components/footer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
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
  "In Progress": "bg-blue-500/10 text-blue-700 dark:text-blue-300",
  Resolved: "bg-green-500/10 text-green-700 dark:text-green-300",
};

function fmt(d: Date) {
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default async function Page() {
  const session = await getSession();
  const studentId = session?.studentId;

  const activeAssignment = studentId
    ? await prisma.roomAssignment.findFirst({
        where: { studentId, moveOutDate: null },
        include: { room: { include: { building: true } } },
      })
    : null;

  const requests = studentId
    ? await prisma.maintenanceRequest.findMany({
        where: { studentId },
        orderBy: { requestDate: "desc" },
        include: {
          room: { include: { building: true } },
          staff: true,
        },
      })
    : [];

  if (!studentId) {
    return (
      <>
        <PortalNav />
        <main className="mx-auto w-full max-w-3xl px-6 py-12 sm:px-8">
          <p className="text-sm text-muted-foreground">
            Your account isn&apos;t linked to a student record. Contact admin.
          </p>
        </main>
        <Footer />
      </>
    );
  }

  async function submitRequest(formData: FormData) {
    "use server";
    const sId = Number(formData.get("studentId"));
    const roomId = Number(formData.get("roomId"));
    const description = formData.get("description") as string;

    const { revalidatePath } = await import("next/cache");

    await prisma.maintenanceRequest.create({
      data: {
        studentId: sId,
        roomId,
        description,
        requestDate: new Date(),
        status: "Pending",
        staffId: null,
      },
    });

    revalidatePath("/portal/maintenance");
    revalidatePath("/maintenance");
  }

  return (
    <>
      <PortalNav />
      <main className="mx-auto w-full max-w-3xl px-6 py-12 sm:px-8">
        <Link
          href="/portal"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <IconArrowLeft className="size-3.5" />
          My portal
        </Link>

        <h1 className="mt-3 text-3xl tracking-tight sm:text-4xl">
          <span className="font-serif italic text-warm">Maintenance</span>{" "}
          Requests
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Report issues in your room and track their progress.
        </p>

        {/* Submit form */}
        {activeAssignment ? (
          <Card className="mt-8 ring-foreground/8">
            <CardHeader className="border-b border-border/70 pb-4">
              <CardTitle className="text-base">New request</CardTitle>
              <CardDescription>
                Room: {activeAssignment.room.building.buildingName} —{" "}
                {activeAssignment.room.roomNumber}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form action={submitRequest} className="flex flex-col gap-5">
                <input type="hidden" name="studentId" value={studentId} />
                <input type="hidden" name="roomId" value={activeAssignment.roomId} />

                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="description">Description of the issue</Label>
                  <textarea
                    id="description"
                    name="description"
                    rows={4}
                    required
                    placeholder="e.g. The bathroom faucet is leaking…"
                    className="w-full min-w-0 resize-none rounded-md border border-input bg-input/30 px-3 py-2 text-sm transition-colors outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
                  />
                </div>

                <div className="mt-2 flex justify-end">
                  <Button type="submit" size="lg">
                    <IconCheck />
                    Submit request
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        ) : (
          <Card className="mt-8 ring-foreground/8">
            <CardContent className="py-10 text-center">
              <p className="text-sm text-muted-foreground">
                You need an active room assignment to submit a maintenance request.
              </p>
              <Button asChild className="mt-4">
                <Link href="/portal/apply">Apply for housing</Link>
              </Button>
            </CardContent>
          </Card>
        )}

        {/* History */}
        <Card className="mt-6 ring-foreground/8">
          <CardHeader className="border-b border-border/70 pb-4">
            <CardTitle className="text-base">Your requests</CardTitle>
            <CardDescription>
              {requests.length === 0
                ? "No requests yet."
                : `${requests.length} total.`}
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            {requests.length === 0 ? (
              <div className="flex flex-col items-center py-12 text-center">
                <IconTool className="size-6 text-muted-foreground" />
                <p className="mt-2 text-sm text-muted-foreground">
                  No maintenance requests yet.
                </p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead>Issue</TableHead>
                    <TableHead className="hidden sm:table-cell">Date</TableHead>
                    <TableHead className="hidden md:table-cell">Assigned to</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {requests.map((r) => (
                    <TableRow key={r.requestId}>
                      <TableCell>
                        <div
                          className="max-w-[200px] truncate text-sm"
                          title={r.description}
                        >
                          {r.description}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {r.room.building.buildingName} — {r.room.roomNumber}
                        </div>
                      </TableCell>
                      <TableCell className="num hidden text-muted-foreground sm:table-cell">
                        {fmt(r.requestDate)}
                      </TableCell>
                      <TableCell className="hidden text-muted-foreground md:table-cell">
                        {r.staff?.name ?? "Unassigned"}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="secondary"
                          className={STATUS_COLOR[r.status] ?? ""}
                        >
                          {r.status}
                        </Badge>
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
