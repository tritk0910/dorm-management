import Link from "next/link";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import { IconArrowLeft, IconCheck } from "@tabler/icons-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { Staff } from "@/app/generated/prisma/client";

type Mode = "create" | "edit";

export function StaffForm({
  mode,
  action,
  staff,
}: {
  mode: Mode;
  action: (formData: FormData) => void | Promise<void>;
  staff?: Staff;
}) {
  const isEdit = mode === "edit";

  return (
    <>
      <Nav />

      <main className="mx-auto w-full max-w-xl px-6 py-12 sm:px-8">
        <Link
          href="/staff"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <IconArrowLeft className="size-3.5" />
          Back to staff
        </Link>

        <h1 className="mt-3 text-3xl tracking-tight sm:text-4xl">
          {isEdit ? (
            <>
              Edit{" "}
              <span className="font-serif italic text-warm">
                {staff?.name ?? "staff member"}
              </span>
            </>
          ) : (
            <>
              Add a{" "}
              <span className="font-serif italic text-warm">staff member</span>
            </>
          )}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {isEdit
            ? "Update the details below — the registry will keep up."
            : "Just the basics. You can always change anything later."}
        </p>

        <Card className="mt-8 ring-foreground/8">
          <CardHeader className="border-b border-border/70 pb-4">
            <CardTitle className="text-base">Staff details</CardTitle>
            <CardDescription>All fields are required.</CardDescription>
          </CardHeader>
          <CardContent>
            <form action={action} className="flex flex-col gap-5">
              <Row>
                <Field label="Full name" htmlFor="name">
                  <Input
                    id="name"
                    name="name"
                    required
                    autoComplete="name"
                    defaultValue={staff?.name ?? ""}
                    placeholder="Jordan Lee"
                    className="rounded-md"
                  />
                </Field>
                <Field label="Role" htmlFor="role">
                  <NativeSelect
                    id="role"
                    name="role"
                    required
                    defaultValue={staff?.role ?? ""}
                  >
                    <option value="" disabled>Select a role…</option>
                    <option value="Maintenance">Maintenance</option>
                    <option value="Administrator">Administrator</option>
                    <option value="Security">Security</option>
                    <option value="Housekeeper">Housekeeper</option>
                    <option value="Manager">Manager</option>
                  </NativeSelect>
                </Field>
              </Row>

              <Row>
                <Field label="Email" htmlFor="email">
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    required
                    autoComplete="email"
                    defaultValue={staff?.email ?? ""}
                    placeholder="staff@school.edu"
                    className="rounded-md"
                  />
                </Field>
                <Field label="Phone" htmlFor="phone">
                  <Input
                    id="phone"
                    name="phone"
                    required
                    autoComplete="tel"
                    inputMode="tel"
                    defaultValue={staff?.phone ?? ""}
                    placeholder="555-0199"
                    className="rounded-md"
                  />
                </Field>
              </Row>

              <div className="mt-2 flex items-center justify-end gap-2">
                <Button asChild variant="ghost" size="lg">
                  <Link href="/staff">Cancel</Link>
                </Button>
                <Button type="submit" size="lg">
                  <IconCheck />
                  {isEdit ? "Save changes" : "Add staff member"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>

      <Footer />
    </>
  );
}

/* ——————————————————————————————————————————————————————————— */

function Row({ children }: { children: React.ReactNode }) {
  return <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">{children}</div>;
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


