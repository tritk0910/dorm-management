"use client";

import { useActionState } from "react";
import { IconClipboardList, IconLoader2 } from "@tabler/icons-react";
import { login } from "@/app/lib/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function LoginForm({ setupDone }: { setupDone?: boolean }) {
  const [state, action, pending] = useActionState(login, null);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="mb-8 flex flex-col items-center gap-3">
          <span className="grid size-10 place-items-center rounded-xl bg-foreground text-background">
            <IconClipboardList className="size-5" />
          </span>
          <div className="text-center">
            <div className="text-xl tracking-tight">
              Hearth<span className="font-serif italic text-warm">stead</span>
            </div>
            <div className="mt-0.5 text-sm text-muted-foreground">
              Sign in to continue
            </div>
          </div>
        </div>

        {setupDone && (
          <div className="mb-4 rounded-lg border border-green-500/20 bg-green-500/5 px-4 py-3 text-sm text-green-700 dark:text-green-300">
            Admin account created. Sign in below.
          </div>
        )}

        <form action={action} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              name="username"
              autoComplete="username"
              required
              autoFocus
              placeholder="your_username"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              placeholder="••••••••"
            />
          </div>

          {state?.error && (
            <div className="rounded-lg border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm text-destructive">
              {state.error}
            </div>
          )}

          <Button type="submit" size="lg" disabled={pending} className="mt-1">
            {pending && <IconLoader2 className="animate-spin" />}
            {pending ? "Signing in…" : "Sign in"}
          </Button>
        </form>

        <p className="mt-6 text-center text-xs text-muted-foreground">
          No account?{" "}
          <a href="/setup" className="text-foreground hover:underline">
            First-time setup
          </a>
        </p>
      </div>
    </div>
  );
}
