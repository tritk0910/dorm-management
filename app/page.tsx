import { redirect } from "next/navigation";
import Link from "next/link";
import {
  IconArrowRight,
  IconClipboardList,
  IconCreditCard,
  IconDoor,
  IconTool,
  IconWriting,
  IconArrowsExchange,
} from "@tabler/icons-react";

import { getSession } from "@/lib/auth";
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

export default async function Page() {
  const session = await getSession();

  if (session) {
    redirect(session.role === "student" ? "/portal" : "/admin");
  }

  return (
    <>
      {/* Minimal public nav */}
      <header className="sticky top-0 z-10 border-b border-border/70 bg-background/80 backdrop-blur">
        <div className="mx-auto flex w-full max-w-5xl items-center justify-between px-6 py-3 sm:px-8">
          <div className="flex items-center gap-2">
            <span className="grid size-7 place-items-center rounded-md bg-foreground text-background">
              <IconClipboardList className="size-4" />
            </span>
            <span className="text-base tracking-tight">
              Hearth<span className="font-serif italic text-warm">stead</span>
            </span>
          </div>
          <Button asChild size="sm">
            <Link href="/login">Sign in</Link>
          </Button>
        </div>
      </header>

      <main className="mx-auto w-full max-w-5xl px-6 sm:px-8">
        {/* Hero */}
        <section className="fade-up flex flex-col items-start gap-6 pt-20 pb-16 sm:pt-28">
          <span className="num inline-flex items-center gap-2 text-[12px] tracking-tight text-muted-foreground">
            <span className="size-1.5 rounded-full bg-warm" />
            Student Housing Portal
          </span>

          <h1 className="max-w-3xl text-4xl leading-[1.05] tracking-tight sm:text-6xl">
            Your home away from home,{" "}
            <span className="font-serif italic text-warm">simplified.</span>
          </h1>

          <p className="max-w-xl text-lg leading-relaxed text-muted-foreground">
            Hearthstead lets you apply for housing, view your room assignment,
            track payments, request changes, and submit maintenance — all in one
            place.
          </p>

          <div className="mt-2 flex flex-wrap items-center gap-3">
            <Button asChild size="lg">
              <Link href="/login">
                Sign in to your portal
                <IconArrowRight className="ml-1" data-icon="inline-end" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/setup">First-time setup</Link>
            </Button>
          </div>
        </section>

        {/* Feature grid */}
        <section className="grid grid-cols-1 gap-4 pb-20 sm:grid-cols-2 md:grid-cols-3">
          <FeatureCard
            icon={<IconWriting className="size-5" />}
            title="Apply for Housing"
            body="Submit a housing application with your preferences. Our auto-match system finds the best room for you."
          />
          <FeatureCard
            icon={<IconDoor className="size-5" />}
            title="View Assignment"
            body="See your current room, building, and contract details in one clear overview."
          />
          <FeatureCard
            icon={<IconArrowsExchange className="size-5" />}
            title="Room Changes"
            body="Request a room transfer and track the status of your request."
          />
          <FeatureCard
            icon={<IconCreditCard className="size-5" />}
            title="Track Payments"
            body="Monitor rent, deposits, and fees — see what's paid, pending, or overdue."
          />
          <FeatureCard
            icon={<IconTool className="size-5" />}
            title="Maintenance"
            body="Report room issues and follow them from submission to resolution."
          />
          <FeatureCard
            icon={<IconClipboardList className="size-5" />}
            title="Admin Access"
            body="Staff and administrators sign in to manage residents, buildings, contracts, and more."
          />
        </section>
      </main>

      <Footer />
    </>
  );
}

function FeatureCard({
  icon,
  title,
  body,
}: {
  icon: React.ReactNode;
  title: string;
  body: string;
}) {
  return (
    <Card
      size="sm"
      className="h-full ring-foreground/8"
    >
      <CardHeader>
        <div className="grid size-8 place-items-center rounded-lg bg-secondary text-foreground">
          {icon}
        </div>
        <CardTitle className="mt-3 text-base">{title}</CardTitle>
        <CardDescription>{body}</CardDescription>
      </CardHeader>
      <CardContent />
    </Card>
  );
}
