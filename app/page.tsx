import Link from "next/link";
import {
  IconArrowRight,
  IconBuildingCommunity,
  IconClipboardList,
  IconTool,
  IconUsers,
} from "@tabler/icons-react";

import prisma from "../lib/db";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

// The live count is read at request time; if the DB isn't reachable,
// we fall back to a quiet "—" so the landing page never breaks.
export const dynamic = "force-dynamic";

async function getResidentCount(): Promise<number | null> {
  try {
    return await prisma.student.count();
  } catch {
    return null;
  }
}

function greeting() {
  const h = new Date().getHours();
  if (h < 5) return "Late night";
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  if (h < 21) return "Good evening";
  return "Quiet hours";
}

export default async function Page() {
  const count = await getResidentCount();

  return (
    <>
      <Nav />

      <main className="mx-auto w-full max-w-5xl px-6 sm:px-8">
        {/* Hero */}
        <section className="fade-up flex flex-col items-start gap-6 pt-20 pb-16 sm:pt-28">
          <span className="num inline-flex items-center gap-2 text-[12px] tracking-tight text-muted-foreground">
            <span className="size-1.5 rounded-full bg-warm" />
            {greeting()} — welcome back to Hearthstead
          </span>

          <h1 className="max-w-3xl text-4xl leading-[1.05] tracking-tight sm:text-6xl">
            Dorm management,{" "}
            <span className="font-serif italic text-warm">made simple.</span>
          </h1>

          <p className="max-w-xl text-lg leading-relaxed text-muted-foreground">
            Hearthstead keeps a tidy record of who lives in your residence
            halls — names, majors, years, and the small details that make a
            roster a community.
          </p>

          <div className="mt-2 flex flex-wrap items-center gap-3">
            <Button asChild size="lg">
              <Link href="/students">
                Open the registry
                <IconArrowRight className="ml-1" data-icon="inline-end" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/students/new">Add a student</Link>
            </Button>
          </div>

          {/* Live stat strip */}
          <LiveStat count={count} />
        </section>

        {/* Feature row */}
        <section className="grid grid-cols-1 gap-4 pb-20 sm:grid-cols-3">
          <FeatureCard
            icon={<IconUsers className="size-5" />}
            title="Residents"
            body="Add, edit, and quietly retire student records — sorted by surname, the way a good roster should be."
            href="/students"
            cta="Browse residents"
          />
          <FeatureCard
            icon={<IconBuildingCommunity className="size-5" />}
            title="Rooms & buildings"
            body="The schema is already in place for rooms, capacities, and assignments — ready when you are."
          />
          <FeatureCard
            icon={<IconTool className="size-5" />}
            title="Maintenance"
            body="Track maintenance requests against rooms and staff. Wire up the screens at your own pace."
          />
        </section>
      </main>

      <Footer />
    </>
  );
}

/* ——————————————————————————————————————————————————————————— */

function Nav() {
  return (
    <header className="sticky top-0 z-10 border-b border-border/70 bg-background/80 backdrop-blur">
      <div className="mx-auto flex w-full max-w-5xl items-center justify-between px-6 py-3 sm:px-8">
        <Link href="/" className="flex items-center gap-2">
          <span className="grid size-7 place-items-center rounded-md bg-foreground text-background">
            <IconClipboardList className="size-4" />
          </span>
          <span className="text-base tracking-tight">
            Hearth<span className="font-serif italic text-warm">stead</span>
          </span>
        </Link>
        <nav className="flex items-center gap-1">
          <Button asChild variant="ghost" size="sm">
            <Link href="/students">Residents</Link>
          </Button>
          <Button asChild size="sm">
            <Link href="/students/new">Add student</Link>
          </Button>
        </nav>
      </div>
    </header>
  );
}

function LiveStat({ count }: { count: number | null }) {
  return (
    <div className="mt-6 flex w-full max-w-xl items-center gap-4 rounded-2xl border border-border bg-card p-4 ring-1 ring-foreground/5">
      <div className="grid size-10 place-items-center rounded-xl bg-warm/12 text-warm">
        <IconUsers className="size-5" />
      </div>
      <div className="flex-1">
        <div className="num text-2xl tracking-tight">
          {count === null ? "—" : count.toString().padStart(2, "0")}
        </div>
        <div className="text-xs text-muted-foreground">
          {count === null
            ? "Connect your database to see live counts"
            : count === 0
              ? "No residents yet — start with the first one"
              : `resident${count === 1 ? "" : "s"} currently on file`}
        </div>
      </div>
      <Button asChild variant="ghost" size="sm" className="shrink-0">
        <Link href="/students">
          View
          <IconArrowRight data-icon="inline-end" />
        </Link>
      </Button>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  body,
  href,
  cta,
}: {
  icon: React.ReactNode;
  title: string;
  body: string;
  href?: string;
  cta?: string;
}) {
  const inner = (
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
      {href && cta && (
        <CardContent>
          <span className="inline-flex items-center gap-1 text-sm text-warm">
            {cta}
            <IconArrowRight className="size-3.5" />
          </span>
        </CardContent>
      )}
    </Card>
  );

  return href ? (
    <Link href={href} className="group">
      {inner}
    </Link>
  ) : (
    inner
  );
}

function Footer() {
  return (
    <footer className="mt-auto border-t border-border/70">
      <div className="mx-auto flex w-full max-w-5xl flex-col items-start justify-between gap-2 px-6 py-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:px-8">
        <span>
          Hearthstead — a small{" "}
          <span className="font-serif italic">CRUD</span> exercise for a college
          course.
        </span>
        <span className="num">Built with Next.js · Prisma · shadcn</span>
      </div>
    </footer>
  );
}
