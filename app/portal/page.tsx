import Link from "next/link";
import {
  IconArrowRight,
  IconCreditCard,
  IconDoor,
  IconTool,
  IconWriting,
  IconArrowsExchange,
} from "@tabler/icons-react";

import prisma from "../../lib/db";
import { getSession } from "@/lib/auth";
import { PortalNav } from "@/components/portal-nav";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
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

  const student = studentId
    ? await prisma.student.findUnique({ where: { studentId } })
    : null;

  const assignment = studentId
    ? await prisma.roomAssignment.findFirst({
        where: { studentId, moveOutDate: null },
        include: { room: { include: { building: true } }, contract: true },
      })
    : null;

  const payments = assignment
    ? await prisma.payment.findMany({
        where: { contractId: assignment.contractId },
        orderBy: { dueDate: "desc" },
        take: 3,
      })
    : [];

  const openMaintenance = studentId
    ? await prisma.maintenanceRequest.count({
        where: { studentId, status: { not: "Resolved" } },
      })
    : 0;

  return (
    <>
      <PortalNav />
      <main className="mx-auto w-full max-w-5xl px-6 py-12 sm:px-8">
        <div className="mb-8">
          <h1 className="text-3xl tracking-tight sm:text-4xl">
            Hello,{" "}
            <span className="font-serif italic text-warm">
              {student ? student.firstName : session?.name}
            </span>
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Your housing portal — everything in one place.
          </p>
        </div>

        {/* Current room card */}
        {assignment ? (
          <Card className="mb-6 ring-foreground/8">
            <CardHeader className="border-b border-border/70 pb-4">
              <CardTitle className="flex items-center gap-2 text-base">
                <IconDoor className="size-4 text-warm" />
                Your Room
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <div className="text-lg font-medium">
                    {assignment.room.building.buildingName} — Room{" "}
                    {assignment.room.roomNumber}
                  </div>
                  <div className="mt-0.5 text-sm text-muted-foreground">
                    {assignment.room.roomType} · Moved in {fmt(assignment.moveInDate)} ·
                    Contract until {fmt(assignment.contract.endDate)}
                  </div>
                </div>
                <Badge variant="secondary" className="bg-green-500/10 text-green-700 dark:text-green-300">
                  Active
                </Badge>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="mb-6 ring-foreground/8">
            <CardContent className="flex flex-col items-center py-10 text-center">
              <IconDoor className="size-8 text-muted-foreground" />
              <p className="mt-3 text-sm text-muted-foreground">
                You don&apos;t have a room assignment yet.
              </p>
              <Button asChild className="mt-4">
                <Link href="/portal/apply">Apply for housing</Link>
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Quick actions */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
          <PortalCard
            icon={<IconWriting className="size-5" />}
            title="Apply for Housing"
            body="Submit a housing application."
            href="/portal/apply"
            cta="Apply now"
          />
          <PortalCard
            icon={<IconArrowsExchange className="size-5" />}
            title="Room Change"
            body="Request a different room."
            href="/portal/room-change"
            cta="Request change"
          />
          <PortalCard
            icon={<IconCreditCard className="size-5" />}
            title="Payments"
            body={`${payments.length} recent payment${payments.length === 1 ? "" : "s"}.`}
            href="/portal/payments"
            cta="View payments"
          />
          <PortalCard
            icon={<IconTool className="size-5" />}
            title="Maintenance"
            body={`${openMaintenance} open request${openMaintenance === 1 ? "" : "s"}.`}
            href="/portal/maintenance"
            cta="Submit request"
          />
        </div>
      </main>
      <Footer />
    </>
  );
}

function PortalCard({
  icon,
  title,
  href,
  body,
  cta,
}: {
  icon: React.ReactNode;
  title: string;
  href: string;
  body: string;
  cta: string;
}) {
  return (
    <Link href={href} className="group">
      <Card
        size="sm"
        className="h-full ring-foreground/8 transition-all hover:-translate-y-0.5 hover:ring-foreground/15"
      >
        <CardHeader>
          <div className="grid size-8 place-items-center rounded-lg bg-secondary text-foreground">
            {icon}
          </div>
          <CardTitle className="mt-3 text-base">{title}</CardTitle>
          <CardDescription>{body}</CardDescription>
        </CardHeader>
        <CardContent>
          <span className="inline-flex items-center gap-1 text-sm text-warm">
            {cta}
            <IconArrowRight className="size-3.5" />
          </span>
        </CardContent>
      </Card>
    </Link>
  );
}
