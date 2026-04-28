import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
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
    <main>
      {/* —— page masthead —— */}
      <header className="border-b border-foreground/15">
        <div className="mx-auto flex max-w-[1300px] items-center justify-between px-6 py-3 sm:px-10">
          <Link
            href="/students"
            className="num text-[11px] uppercase tracking-[0.22em] text-muted-foreground hover:text-clay"
          >
            ← Back to the registry
          </Link>
          <span className="num text-[10px] uppercase tracking-[0.32em] text-clay">
            ✻ {isEdit ? "Amendment Form" : "Enrollment Form"} ✻
          </span>
          <span className="num hidden text-[11px] uppercase tracking-[0.22em] text-muted-foreground sm:inline">
            Form {isEdit ? "RH-2" : "RH-1"}
          </span>
        </div>
        <div className="rule text-foreground/40" />
      </header>

      <section className="mx-auto max-w-[1100px] px-6 pt-12 pb-20 sm:px-10">
        <div className="grid grid-cols-12 gap-10">
          {/* Left rail — title + intent */}
          <aside className="col-span-12 lg:col-span-5">
            <span className="num text-[10px] uppercase tracking-[0.4em] text-clay">
              ¶ {isEdit ? "Amend an existing entry" : "A new entry, freshly inked"}
            </span>
            <h1 className="mt-3 font-display text-[clamp(2.5rem,6vw,4.5rem)] leading-[0.95] tracking-[-0.03em]">
              {isEdit ? (
                <>
                  Amend the
                  <br />
                  <span className="font-display-italic">record</span>
                </>
              ) : (
                <>
                  Enroll a
                  <br />
                  new <span className="font-display-italic">resident</span>
                </>
              )}
            </h1>
            <p className="mt-4 max-w-sm text-[15px] leading-relaxed text-foreground/80">
              {isEdit
                ? "Make corrections, change a major, mend a phone number — the registrar will not mind. The book forgives all amendments."
                : "Fill the entry slowly and well. Names tend to stick around longer than rooms do."}
            </p>

            {isEdit && student && (
              <div className="mt-8 rounded-md border border-foreground/15 bg-card p-5">
                <span className="num text-[10px] uppercase tracking-[0.32em] text-muted-foreground">
                  Currently on file
                </span>
                <p className="mt-2 font-display text-2xl tracking-tight">
                  {student.lastName},{" "}
                  <span className="font-display-italic text-foreground/85">
                    {student.firstName}
                  </span>
                </p>
                <p className="num mt-1 text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
                  ID · {String(student.studentId).padStart(5, "0")} · Yr {student.year}
                </p>
              </div>
            )}

            <div className="rule mt-8 text-foreground/40" />
            <ul className="num mt-4 space-y-1.5 text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
              <li>· All fields are required</li>
              <li>· Year between 1 and 6</li>
              <li>· Email kept private to the office</li>
            </ul>
          </aside>

          {/* Right — the form proper */}
          <div className="col-span-12 lg:col-span-7">
            <Card className="rounded-md ring-foreground/15">
              <CardContent>
                <form action={action} className="flex flex-col gap-7">
                  {/* identity */}
                  <Fieldset legend="Identity" code="§I">
                    <Row>
                      <Field label="First name" htmlFor="firstName">
                        <Input
                          id="firstName"
                          name="firstName"
                          required
                          autoComplete="given-name"
                          defaultValue={student?.firstName ?? ""}
                          className="rounded-md"
                          placeholder="e.g. Adaeze"
                        />
                      </Field>
                      <Field label="Last name" htmlFor="lastName">
                        <Input
                          id="lastName"
                          name="lastName"
                          required
                          autoComplete="family-name"
                          defaultValue={student?.lastName ?? ""}
                          className="rounded-md"
                          placeholder="e.g. Okafor"
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
                  </Fieldset>

                  {/* contact */}
                  <Fieldset legend="Contact" code="§II">
                    <Row>
                      <Field label="Email" htmlFor="email">
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          required
                          autoComplete="email"
                          defaultValue={student?.email ?? ""}
                          className="rounded-md"
                          placeholder="name@school.edu"
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
                          className="rounded-md"
                          placeholder="555-0142"
                        />
                      </Field>
                    </Row>
                  </Fieldset>

                  {/* studies */}
                  <Fieldset legend="Studies" code="§III">
                    <Row>
                      <Field label="Major" htmlFor="major" wide>
                        <Input
                          id="major"
                          name="major"
                          required
                          defaultValue={student?.major ?? ""}
                          className="rounded-md"
                          placeholder="e.g. Architecture"
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
                          className="rounded-md"
                          placeholder="1–6"
                        />
                      </Field>
                    </Row>
                  </Fieldset>

                  <div className="rule text-foreground/40" />

                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <span className="num text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                      Signed at the registrar’s desk
                    </span>
                    <div className="flex gap-2">
                      <Button
                        asChild
                        variant="ghost"
                        size="lg"
                        className="num tracking-[0.14em] uppercase"
                      >
                        <Link href="/students">Cancel</Link>
                      </Button>
                      <Button
                        type="submit"
                        size="lg"
                        className="num bg-foreground text-background tracking-[0.14em] uppercase hover:bg-clay hover:text-paper"
                      >
                        {isEdit ? "Save Amendments" : "Inscribe"}
                        <span aria-hidden className="ml-1">
                          →
                        </span>
                      </Button>
                    </div>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </main>
  );
}

/* ——————————————————————————————————————————————————————————— */

function Fieldset({
  legend,
  code,
  children,
}: {
  legend: string;
  code: string;
  children: React.ReactNode;
}) {
  return (
    <fieldset className="border-0 p-0">
      <div className="mb-3 flex items-baseline justify-between">
        <legend className="font-display text-2xl tracking-[-0.01em]">
          {legend}
        </legend>
        <span className="num text-[10px] uppercase tracking-[0.32em] text-clay">
          {code}
        </span>
      </div>
      <div className="rule mb-4 text-foreground/30" />
      <div className="flex flex-col gap-4">{children}</div>
    </fieldset>
  );
}

function Row({ children }: { children: React.ReactNode }) {
  return <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">{children}</div>;
}

function Field({
  label,
  htmlFor,
  wide,
  children,
}: {
  label: string;
  htmlFor: string;
  wide?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className={wide ? "sm:col-span-1" : undefined}>
      <Label
        htmlFor={htmlFor}
        className="num mb-1.5 text-[10px] uppercase tracking-[0.28em] text-muted-foreground"
      >
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
  // Mimic shadcn Input look so the form is visually cohesive without a Radix
  // Select (which would force a client component on a server-action form).
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
