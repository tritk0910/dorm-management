import Link from "next/link";
import {
  IconArrowRight,
  IconBuildingCommunity,
  IconCreditCard,
  IconDoor,
  IconFileText,
  IconHome,
  IconTool,
  IconUsers,
  IconUserShield,
  IconWriting,
} from "@tabler/icons-react";

import prisma from "../../lib/db";
import { getSession } from "@/lib/auth";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const dynamic = "force-dynamic";

async function getStats() {
  try {
    const [students, buildings, contracts, maintenance, applications, changes] =
      await Promise.all([
        prisma.student.count(),
        prisma.building.count(),
        prisma.contract.count({ where: { status: "Active" } }),
        prisma.maintenanceRequest.count({ where: { status: { not: "Resolved" } } }),
        prisma.housingApplication.count({ where: { status: "Pending" } }),
        prisma.roomChangeRequest.count({ where: { status: "Pending" } }),
      ]);
    return { students, buildings, contracts, maintenance, applications, changes };
  } catch {
    return null;
  }
}

export default async function Page() {
  const [session, stats] = await Promise.all([getSession(), getStats()]);

  const role = session?.role ?? "admin";
  const isReadOnly = role === "security";

  return (
    <>
      <Nav />
      <main className="mx-auto w-full max-w-5xl px-6 py-12 sm:px-8">
        <div className="mb-8">
          <p className="text-sm text-muted-foreground">Admin dashboard</p>
          <h1 className="mt-1 text-3xl tracking-tight sm:text-4xl">
            Welcome back,{" "}
            <span className="font-serif italic text-warm">{session?.name}</span>
          </h1>
          <p className="mt-1 text-sm text-muted-foreground capitalize">
            Role: {role}
            {isReadOnly && " — read-only access"}
          </p>
        </div>

        {/* Stat strip */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-6">
          {[
            { label: "Residents", value: stats?.students, href: "/students" },
            { label: "Buildings", value: stats?.buildings, href: "/buildings" },
            { label: "Active contracts", value: stats?.contracts, href: "/contracts" },
            { label: "Open requests", value: stats?.maintenance, href: "/maintenance" },
            { label: "Pending applications", value: stats?.applications, href: "/admin/applications" },
            { label: "Room-change requests", value: stats?.changes, href: "/admin/applications#changes" },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex flex-col gap-1 rounded-2xl border border-border bg-card p-4 ring-1 ring-foreground/5 transition-all hover:-translate-y-0.5 hover:ring-foreground/12"
            >
              <span className="num text-2xl tracking-tight">
                {item.value == null ? "—" : item.value.toString().padStart(2, "0")}
              </span>
              <span className="text-xs text-muted-foreground">{item.label}</span>
            </Link>
          ))}
        </div>

        {/* Feature grid */}
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
          <AdminCard icon={<IconUsers />} title="Residents" href="/students" body="Student records, contact info, year, major, and roommate preferences." cta="Manage residents" />
          <AdminCard icon={<IconBuildingCommunity />} title="Buildings" href="/buildings" body="Residence halls — names, addresses, and room inventory." cta="Manage buildings" />
          <AdminCard icon={<IconDoor />} title="Rooms" href="/rooms" body="Track every room, its type, capacity, and occupancy." cta="Manage rooms" />
          <AdminCard icon={<IconFileText />} title="Contracts" href="/contracts" body="Housing agreements with status and deposit tracking." cta="Manage contracts" />
          <AdminCard icon={<IconCreditCard />} title="Payments" href="/payments" body="Rent, deposits, fees — paid, pending, and overdue." cta="Manage payments" />
          <AdminCard icon={<IconTool />} title="Maintenance" href="/maintenance" body="Service requests from submission to resolution." cta="Manage requests" />
          <AdminCard icon={<IconHome />} title="Assignments" href="/assignments" body="Which student lives in which room under which contract." cta="Manage assignments" />
          <AdminCard icon={<IconWriting />} title="Applications" href="/admin/applications" body="Pending housing applications with auto-match suggestions." cta="Review applications" />
          <AdminCard icon={<IconUserShield />} title="Users" href="/admin/users" body="Login accounts for students, staff, security, and admins." cta="Manage users" />
        </div>
      </main>
      <Footer />
    </>
  );
}

function AdminCard({
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
