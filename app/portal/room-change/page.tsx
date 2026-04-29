import Link from "next/link";
import { IconArrowLeft, IconCheck } from "@tabler/icons-react";

import prisma from "../../../lib/db";
import { getSession } from "@/lib/auth";
import { submitRoomChangeRequest } from "@/app/lib/actions/roomChangeRequest";
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
  const session = await getSession();
  const studentId = session?.studentId;

  const activeAssignment = studentId
    ? await prisma.roomAssignment.findFirst({
        where: { studentId, moveOutDate: null },
        include: { room: { include: { building: true } } },
      })
    : null;

  const pastRequests = studentId
    ? await prisma.roomChangeRequest.findMany({
        where: { studentId },
        orderBy: { submittedAt: "desc" },
        include: { fromRoom: { include: { building: true } } },
      })
    : [];

  if (!studentId) {
    return (
      <>
        <PortalNav />
        <main className="mx-auto w-full max-w-xl px-6 py-12 sm:px-8">
          <p className="text-sm text-muted-foreground">
            Your account isn&apos;t linked to a student record. Contact admin.
          </p>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <PortalNav />
      <main className="mx-auto w-full max-w-xl px-6 py-12 sm:px-8">
        <Link
          href="/portal"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <IconArrowLeft className="size-3.5" />
          My portal
        </Link>

        <h1 className="mt-3 text-3xl tracking-tight sm:text-4xl">
          Room <span className="font-serif italic text-warm">Change</span>
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Request a transfer to a different room.
        </p>

        {!activeAssignment ? (
          <Card className="mt-8 ring-foreground/8">
            <CardContent className="py-10 text-center">
              <p className="text-sm text-muted-foreground">
                You need an active room assignment to request a change.
              </p>
              <Button asChild className="mt-4">
                <Link href="/portal/apply">Apply for housing</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Card className="mt-8 ring-foreground/8">
            <CardHeader className="border-b border-border/70 pb-4">
              <CardTitle className="text-base">New request</CardTitle>
              <CardDescription>
                Current room: {activeAssignment.room.building.buildingName} —{" "}
                {activeAssignment.room.roomNumber}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form action={submitRoomChangeRequest} className="flex flex-col gap-5">
                <input type="hidden" name="studentId" value={studentId} />
                <input type="hidden" name="fromRoomId" value={activeAssignment.roomId} />

                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="reason">Reason for change</Label>
                  <textarea
                    id="reason"
                    name="reason"
                    rows={4}
                    required
                    placeholder="Describe why you need a room change…"
                    className="w-full min-w-0 resize-none rounded-md border border-input bg-input/30 px-3 py-2 text-sm transition-colors outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
                  />
                </div>

                <div className="mt-2 flex items-center justify-end gap-2">
                  <Button asChild variant="ghost" size="lg">
                    <Link href="/portal">Cancel</Link>
                  </Button>
                  <Button type="submit" size="lg">
                    <IconCheck />
                    Submit request
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {pastRequests.length > 0 && (
          <Card className="mt-6 ring-foreground/8">
            <CardHeader className="border-b border-border/70 pb-4">
              <CardTitle className="text-base">Past requests</CardTitle>
            </CardHeader>
            <CardContent className="divide-y divide-border/50">
              {pastRequests.map((r) => (
                <div key={r.changeRequestId} className="flex items-start justify-between gap-4 py-3">
                  <div>
                    <div className="text-sm font-medium">
                      From {r.fromRoom.building.buildingName} — {r.fromRoom.roomNumber}
                    </div>
                    <div className="mt-0.5 max-w-xs truncate text-xs text-muted-foreground">
                      {r.reason}
                    </div>
                    <div className="text-xs text-muted-foreground">{fmt(r.submittedAt)}</div>
                  </div>
                  <Badge variant="secondary" className={STATUS_COLOR[r.status] ?? ""}>
                    {r.status}
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        )}
      </main>
      <Footer />
    </>
  );
}
