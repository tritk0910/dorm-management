import Link from "next/link";
import {
  IconClipboardList,
  IconHome,
  IconLogout,
  IconTool,
  IconWriting,
} from "@tabler/icons-react";

import { getSession } from "@/lib/auth";
import { logout } from "@/app/lib/actions/auth";
import { Button } from "@/components/ui/button";

export async function PortalNav() {
  const session = await getSession();

  return (
    <header className="sticky top-0 z-10 border-b border-border/70 bg-background/80 backdrop-blur">
      <div className="mx-auto flex w-full max-w-5xl items-center justify-between px-6 py-3 sm:px-8">
        <Link href="/portal" className="flex items-center gap-2">
          <span className="grid size-7 place-items-center rounded-md bg-foreground text-background">
            <IconClipboardList className="size-4" />
          </span>
          <span className="text-base tracking-tight">
            Hearth<span className="font-serif italic text-warm">stead</span>
          </span>
        </Link>

        <nav className="flex items-center gap-1">
          <Button asChild variant="ghost" size="sm">
            <Link href="/portal">
              <IconHome className="size-4" />
              <span className="hidden sm:inline">My Portal</span>
            </Link>
          </Button>
          <Button asChild variant="ghost" size="sm" className="hidden sm:inline-flex">
            <Link href="/portal/apply">
              <IconWriting className="size-4" />
              Apply
            </Link>
          </Button>
          <Button asChild variant="ghost" size="sm" className="hidden md:inline-flex">
            <Link href="/portal/maintenance">
              <IconTool className="size-4" />
              Maintenance
            </Link>
          </Button>

          {session && (
            <span className="ml-2 hidden text-xs text-muted-foreground sm:inline">
              {session.name}
            </span>
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
