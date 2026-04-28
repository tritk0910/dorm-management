import Link from "next/link";
import {
  IconArrowLeft,
  IconCheck,
  IconClipboardList,
} from "@tabler/icons-react";

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
import type { Student } from "@/app/generated/prisma/client";

type Mode = "create" | "edit";

export function StudentForm({
  mode,
  action,
  student,
}: {
  mode: Mode;
  action: (formData: FormData) => void | Promise<void>;
  student?: Student;
}) {
  const isEdit = mode === "edit";

  return (
    <>
      <Nav />

      <main className="mx-auto w-full max-w-xl px-6 py-12 sm:px-8">
        <Link
          href="/students"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <IconArrowLeft className="size-3.5" />
          Back to residents
        </Link>

        <h1 className="mt-3 text-3xl tracking-tight sm:text-4xl">
          {isEdit ? (
            <>
              Edit{" "}
              <span className="font-serif italic text-warm">
                {student?.firstName ?? "resident"}
              </span>
            </>
          ) : (
            <>
              Add a <span className="font-serif italic text-warm">resident</span>
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
            <CardTitle className="text-base">Student details</CardTitle>
            <CardDescription>All fields are required.</CardDescription>
          </CardHeader>
          <CardContent>
            <form action={action} className="flex flex-col gap-5">
              <Row>
                <Field label="First name" htmlFor="firstName">
                  <Input
                    id="firstName"
                    name="firstName"
                    required
                    autoComplete="given-name"
                    defaultValue={student?.firstName ?? ""}
                    placeholder="Adaeze"
                    className="rounded-md"
                  />
                </Field>
                <Field label="Last name" htmlFor="lastName">
                  <Input
                    id="lastName"
                    name="lastName"
                    required
                    autoComplete="family-name"
                    defaultValue={student?.lastName ?? ""}
                    placeholder="Okafor"
                    className="rounded-md"
                  />
                </Field>
              </Row>

              <Row>
                <Field label="Date of birth" htmlFor="dob">
                  <Input
                    id="dob"
                    name="dob"
                    type="date"
                    required
                    defaultValue={
                      student
                        ? student.dob.toISOString().split("T")[0]
                        : undefined
                    }
                    className="rounded-md"
                  />
                </Field>
                <Field label="Gender" htmlFor="gender">
                  <NativeSelect
                    id="gender"
                    name="gender"
                    required
                    defaultValue={student?.gender ?? ""}
                  >
                    <option value="" disabled>
                      Select…
                    </option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
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
                    defaultValue={student?.email ?? ""}
                    placeholder="name@school.edu"
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
                    defaultValue={student?.phone ?? ""}
                    placeholder="555-0142"
                    className="rounded-md"
                  />
                </Field>
              </Row>

              <Row>
                <Field label="Major" htmlFor="major">
                  <Input
                    id="major"
                    name="major"
                    required
                    defaultValue={student?.major ?? ""}
                    placeholder="Architecture"
                    className="rounded-md"
                  />
                </Field>
                <Field label="Year" htmlFor="year">
                  <Input
                    id="year"
                    name="year"
                    type="number"
                    min={1}
                    max={6}
                    required
                    defaultValue={student?.year ?? ""}
                    placeholder="1–6"
                    className="rounded-md"
                  />
                </Field>
              </Row>

              <div className="mt-2 flex items-center justify-end gap-2">
                <Button asChild variant="ghost" size="lg">
                  <Link href="/students">Cancel</Link>
                </Button>
                <Button type="submit" size="lg">
                  <IconCheck />
                  {isEdit ? "Save changes" : "Add student"}
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
        </nav>
      </div>
    </header>
  );
}

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
  // Native <select> styled to match shadcn Input — keeps the form a server-
  // action form (no client-side wrapper required for Radix Select).
  return (
    <select
      {...props}
      className={[
        "h-9 w-full min-w-0 rounded-md border border-input bg-input/30 px-3 py-1 text-sm transition-colors outline-none",
        "focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50",
        "appearance-none bg-no-repeat bg-[right_0.6rem_center]",
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

function Footer() {
  return (
    <footer className="mt-auto border-t border-border/70">
      <div className="mx-auto flex w-full max-w-5xl flex-col items-start justify-between gap-2 px-6 py-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:px-8">
        <span>
          Hearthstead — a small{" "}
          <span className="font-serif italic">CRUD</span> exercise.
        </span>
        <span className="num">Next.js · Prisma · shadcn</span>
      </div>
    </footer>
  );
}
