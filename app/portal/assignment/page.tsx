import Link from "next/link";
import { IconArrowLeft, IconDoor } from "@tabler/icons-react";

import prisma from "../../../lib/db";
import { getSession } from "@/lib/auth";
import { PortalNav } from "@/components/portal-nav";
import { Footer } from "@/components/footer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const dynamic = "force-dynamic";

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

  const assignments = studentId
    ? await prisma.roomAssignment.findMany({
        where: { studentId },
        orderBy: { moveInDate: "desc" },
        include: {
          room: { include: { building: true } },
          contract: true,
        },
      })
    : [];

  const active = assignments.find((a) => !a.moveOutDate);
  const past = assignments.filter((a) => !!a.moveOutDate);

  return (
    <>
      <PortalNav />
      <main className="mx-auto w-full max-w-2xl px-6 py-12 sm:px-8">
        <Link
          href="/portal"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <IconArrowLeft className="size-3.5" />
          My portal
        </Link>

        <h1 className="mt-3 text-3xl tracking-tight sm:text-4xl">
          My <span className="font-serif italic text-warm">Assignment</span>
        </h1>

        {!studentId ? (
          <p className="mt-4 text-sm text-muted-foreground">
            Your account isn&apos;t linked to a student record. Contact admin.
          </p>
        ) : assignments.length === 0 ? (
          <div className="mt-8 flex flex-col items-center rounded-2xl border border-border py-16 text-center">
            <IconDoor className="size-8 text-muted-foreground" />
            <p className="mt-3 text-sm text-muted-foreground">
              No room assignment yet.
            </p>
            <Button asChild className="mt-4">
              <Link href="/portal/apply">Apply for housing</Link>
            </Button>
          </div>
        ) : (
          <div className="mt-6 flex flex-col gap-4">
            {active && (
              <Card className="ring-green-500/20">
                <CardHeader className="border-b border-border/70 pb-4">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">Current room</CardTitle>
                    <Badge variant="secondary" className="bg-green-500/10 text-green-700 dark:text-green-300">
                      Active
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="flex flex-col gap-2 text-sm">
                    <Row label="Building" value={active.room.building.buildingName} />
                    <Row label="Room" value={active.room.roomNumber} />
                    <Row label="Type" value={active.room.roomType} />
                    <Row label="Capacity" value={String(active.room.capacity)} />
                    <Row label="Move-in" value={fmt(active.moveInDate)} />
                    <Row label="Contract ends" value={fmt(active.contract.endDate)} />
                    <Row label="Contract status" value={active.contract.status} />
                  </div>
                  <div className="mt-4">
                    <Button asChild variant="outline" size="sm">
                      <Link href="/portal/room-change">Request room change</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {past.length > 0 && (
              <Card className="ring-foreground/8">
                <CardHeader className="border-b border-border/70 pb-4">
                  <CardTitle className="text-base">Past assignments</CardTitle>
                </CardHeader>
                <CardContent className="divide-y divide-border/50">
                  {past.map((a) => (
                    <div key={a.assignmentId} className="flex items-center justify-between py-3 text-sm">
                      <div>
                        <div className="font-medium">
                          {a.room.building.buildingName} — Room {a.room.roomNumber}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {fmt(a.moveInDate)} → {fmt(a.moveOutDate!)}
                        </div>
                      </div>
                      <Badge variant="secondary" className="bg-gray-500/10 text-gray-600 dark:text-gray-400">
                        Moved out
                      </Badge>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}
