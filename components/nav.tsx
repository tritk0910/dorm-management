import Link from "next/link";
import {
  IconClipboardList,
  IconLayoutDashboard,
  IconLogout,
} from "@tabler/icons-react";

import { getSession } from "@/lib/auth";
import { logout } from "@/app/lib/actions/auth";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const ROLE_COLOR: Record<string, string> = {
  admin: "bg-purple-500/10 text-purple-700 dark:text-purple-300",
  staff: "bg-blue-500/10 text-blue-700 dark:text-blue-300",
  security: "bg-red-500/10 text-red-700 dark:text-red-300",
};

export async function Nav() {
  const session = await getSession();

  return (
    <header className="sticky top-0 z-10 border-b border-border/70 bg-background/80 backdrop-blur">
      <div className="mx-auto flex w-full max-w-5xl items-center justify-between px-6 py-3 sm:px-8">
        <Link href="/admin" className="flex items-center gap-2">
          <span className="grid size-7 place-items-center rounded-md bg-foreground text-background">
            <IconClipboardList className="size-4" />
          </span>
          <span className="text-base tracking-tight">
            Hearth<span className="font-serif italic text-warm">stead</span>
          </span>
        </Link>

        <nav className="flex items-center gap-1">
          <Button asChild variant="ghost" size="sm">
            <Link href="/admin">
              <IconLayoutDashboard className="size-4" />
              <span className="hidden sm:inline">Dashboard</span>
            </Link>
          </Button>
          <Button asChild variant="ghost" size="sm" className="hidden sm:inline-flex">
            <Link href="/students">Residents</Link>
          </Button>
          <Button asChild variant="ghost" size="sm" className="hidden md:inline-flex">
            <Link href="/buildings">Buildings</Link>
          </Button>
          <Button asChild variant="ghost" size="sm" className="hidden lg:inline-flex">
            <Link href="/maintenance">Maintenance</Link>
          </Button>

          {session && (
            <Badge
              variant="secondary"
              className={`ml-2 hidden sm:inline-flex ${ROLE_COLOR[session.role] ?? ""}`}
            >
              {session.role}
            </Badge>
          )}

          <form action={logout}>
            <Button
              type="submit"
              variant="ghost"
              size="sm"
              className="ml-1 text-muted-foreground hover:text-foreground"
              title="Sign out"
            >
              <IconLogout className="size-4" />
              <span className="hidden sm:inline">Sign out</span>
            </Button>
          </form>
        </nav>
      </div>
    </header>
  );
}
