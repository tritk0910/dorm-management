import Link from "next/link";
import { IconArrowLeft, IconCheck } from "@tabler/icons-react";

import prisma from "../../../lib/db";
import { getSession } from "@/lib/auth";
import { submitHousingApplication } from "@/app/lib/actions/housingApplication";
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
import { Label } from "@/components/ui/label";

export const dynamic = "force-dynamic";

const STATUS_COLOR: Record<string, string> = {
  Pending: "bg-yellow-500/10 text-yellow-700 dark:text-yellow-300",
  Approved: "bg-green-500/10 text-green-700 dark:text-green-300",
  Rejected: "bg-red-500/10 text-red-700 dark:text-red-300",
};

function NativeSelect({
  className,
  ...props
}: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      {...props}
      className={[
        "h-9 w-full min-w-0 rounded-md border border-input bg-input/30 px-3 py-1 text-sm transition-colors outline-none",
        "focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50",
        "appearance-none bg-no-repeat bg-position-[right_0.6rem_center]",
        className ?? "",
      ].join(" ")}
      style={{
        backgroundImage:
          "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='10' height='6' viewBox='0 0 10 6'><path fill='none' stroke='%23867f74' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round' d='M1 1l4 4 4-4'/></svg>\")",
        paddingRight: "2rem",
      }}
    />
  );
}

function fmt(d: Date) {
  return d.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
}

export default async function Page() {
  const session = await getSession();
  const studentId = session?.studentId;

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

  const [student, applications] = await Promise.all([
    prisma.student.findUnique({ where: { studentId } }),
    prisma.housingApplication.findMany({
      where: { studentId },
      orderBy: { submittedAt: "desc" },
      include: { matchedRoom: { include: { building: true } } },
    }),
  ]);

  const action = submitHousingApplication.bind(null);

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
          Apply for <span className="font-serif italic text-warm">Housing</span>
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Tell us your preferences and we&apos;ll find the best room match.
        </p>

        <Card className="mt-8 ring-foreground/8">
          <CardHeader className="border-b border-border/70 pb-4">
            <CardTitle className="text-base">New application</CardTitle>
            <CardDescription>
              Your profile — {student?.firstName}, Yr {student?.year},{" "}
              {student?.gender}
              {student?.preferences ? ` · Preferences: ${student.preferences.split(",").join(", ")}` : ""}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form action={action} className="flex flex-col gap-5">
              <input type="hidden" name="studentId" value={studentId} />

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="preferredRoomType">Preferred room type</Label>
                <NativeSelect id="preferredRoomType" name="preferredRoomType" required defaultValue="">
                  <option value="" disabled>Select…</option>
                  <option value="Single">Single</option>
                  <option value="Double">Double</option>
                  <option value="Triple">Triple</option>
                  <option value="Suite">Suite</option>
                  <option value="Studio">Studio</option>
                </NativeSelect>
              </div>

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="notes">Additional notes (optional)</Label>
                <textarea
                  id="notes"
                  name="notes"
                  rows={3}
                  placeholder="Any specific requests or accessibility needs…"
                  className="w-full min-w-0 resize-none rounded-md border border-input bg-input/30 px-3 py-2 text-sm transition-colors outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
                />
              </div>

              <div className="mt-2 flex items-center justify-end gap-2">
                <Button asChild variant="ghost" size="lg">
                  <Link href="/portal">Cancel</Link>
                </Button>
                <Button type="submit" size="lg">
                  <IconCheck />
                  Submit application
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Application history */}
        {applications.length > 0 && (
          <Card className="mt-6 ring-foreground/8">
            <CardHeader className="border-b border-border/70 pb-4">
              <CardTitle className="text-base">Your applications</CardTitle>
            </CardHeader>
            <CardContent className="divide-y divide-border/50">
              {applications.map((app) => (
                <div key={app.applicationId} className="flex items-start justify-between gap-4 py-3">
                  <div>
                    <div className="text-sm font-medium">{app.preferredRoomType}</div>
                    <div className="text-xs text-muted-foreground">
                      Submitted {fmt(app.submittedAt)}
                      {app.matchedRoom
                        ? ` · Matched: ${app.matchedRoom.building.buildingName} Rm ${app.matchedRoom.roomNumber}`
                        : ""}
                    </div>
                  </div>
                  <Badge variant="secondary" className={STATUS_COLOR[app.status] ?? ""}>
                    {app.status}
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
