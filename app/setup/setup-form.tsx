"use client";

import { useActionState } from "react";
import { IconClipboardList, IconLoader2, IconShield } from "@tabler/icons-react";
import { setupAccount } from "@/app/lib/actions/user";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

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

function Field({
  label,
  htmlFor,
  children,
}: {
  label: string;
  htmlFor: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <Label htmlFor={htmlFor} className="text-sm">
        {label}
      </Label>
      {children}
    </div>
  );
}

export function SetupForm({
  isFirstUser,
  error,
}: {
  isFirstUser: boolean;
  error?: string;
}) {
  const [, action, pending] = useActionState(
    async (_prev: null, formData: FormData) => {
      await setupAccount(formData);
      return null;
    },
    null,
  );

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6 py-12">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center gap-3">
          <span className="grid size-10 place-items-center rounded-xl bg-foreground text-background">
            <IconClipboardList className="size-5" />
          </span>
          <div className="text-center">
            <div className="text-xl tracking-tight">
              Hearth<span className="font-serif italic text-warm">stead</span>
            </div>
            <div className="mt-0.5 text-sm text-muted-foreground">
              {isFirstUser ? "First-time setup" : "Create your account"}
            </div>
          </div>
        </div>

        <div className="mb-5 flex items-start gap-3 rounded-lg border border-border bg-card px-4 py-3 text-sm text-muted-foreground">
          <IconShield className="mt-0.5 size-4 shrink-0 text-warm" />
          <span>
            {isFirstUser
              ? "No accounts exist yet. This account will become the admin."
              : "A student profile will be created and linked to your account automatically."}
          </span>
        </div>

        {error === "invalid" && (
          <div className="mb-4 rounded-lg border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm text-destructive">
            All fields are required and password must be at least 6 characters.
          </div>
        )}
        {error === "mismatch" && (
          <div className="mb-4 rounded-lg border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm text-destructive">
            Passwords do not match.
          </div>
        )}

        <form action={action} className="flex flex-col gap-4">
          {/* Account credentials */}
          <Field label="Username" htmlFor="username">
            <Input
              id="username"
              name="username"
              autoComplete="username"
              required
              autoFocus
              placeholder={isFirstUser ? "admin" : "your_username"}
            />
          </Field>

          <Field label="Password (min 6 chars)" htmlFor="password">
            <Input
              id="password"
              name="password"
              type="password"
              required
              minLength={6}
              placeholder="••••••••"
            />
          </Field>

          <Field label="Confirm password" htmlFor="confirmPassword">
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              required
              placeholder="••••••••"
            />
          </Field>

          {/* Student profile fields — only for non-admin accounts */}
          {!isFirstUser && (
            <>
              <hr className="border-border/60" />
              <p className="text-xs text-muted-foreground">Student profile</p>

              <div className="grid grid-cols-2 gap-3">
                <Field label="First name" htmlFor="firstName">
                  <Input id="firstName" name="firstName" required placeholder="Jane" />
                </Field>
                <Field label="Last name" htmlFor="lastName">
                  <Input id="lastName" name="lastName" required placeholder="Doe" />
                </Field>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Field label="Date of birth" htmlFor="dob">
                  <Input id="dob" name="dob" type="date" required />
                </Field>
                <Field label="Gender" htmlFor="gender">
                  <NativeSelect id="gender" name="gender" required defaultValue="">
                    <option value="" disabled>Select…</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </NativeSelect>
                </Field>
              </div>

              <Field label="Email" htmlFor="email">
                <Input id="email" name="email" type="email" required placeholder="name@school.edu" />
              </Field>

              <div className="grid grid-cols-2 gap-3">
                <Field label="Phone" htmlFor="phone">
                  <Input id="phone" name="phone" required placeholder="555-0142" />
                </Field>
                <Field label="Year" htmlFor="year">
                  <Input id="year" name="year" type="number" min={1} max={6} required placeholder="1–6" />
                </Field>
              </div>

              <Field label="Major" htmlFor="major">
                <Input id="major" name="major" required placeholder="Computer Science" />
              </Field>
            </>
          )}

          <Button type="submit" size="lg" disabled={pending} className="mt-1">
            {pending && <IconLoader2 className="animate-spin" />}
            {pending
              ? "Creating account…"
              : isFirstUser
                ? "Create admin account"
                : "Create account"}
          </Button>
        </form>

        <p className="mt-6 text-center text-xs text-muted-foreground">
          Already have an account?{" "}
          <a href="/login" className="text-foreground hover:underline">
            Sign in
          </a>
        </p>
      </div>
    </div>
  );
}