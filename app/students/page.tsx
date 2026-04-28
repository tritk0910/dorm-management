import Link from "next/link";
import prisma from "../../lib/db";

// Reads from the DB at request time — opt out of static prerendering.
export const dynamic = "force-dynamic";
import { deleteStudent } from "../lib/actions/student";
import type { Student } from "@/app/generated/prisma/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const YEAR_LABEL: Record<number, string> = {
  1: "Freshman",
  2: "Sophomore",
  3: "Junior",
  4: "Senior",
  5: "Fifth Year",
  6: "Graduate",
};

export default async function Page() {
  const students = await prisma.student.findMany({
    orderBy: [{ lastName: "asc" }, { firstName: "asc" }],
  });

  const total = students.length;
  const byYear = students.reduce<Record<number, number>>((acc, s) => {
    acc[s.year] = (acc[s.year] ?? 0) + 1;
    return acc;
  }, {});
  const majors = new Set(students.map((s) => s.major)).size;

  return (
    <main>
      {/* —— page masthead —— */}
      <header className="border-b border-foreground/15">
        <div className="mx-auto flex max-w-[1300px] items-center justify-between px-6 py-3 sm:px-10">
          <Link
            href="/"
            className="num text-[11px] uppercase tracking-[0.22em] text-muted-foreground hover:text-clay"
          >
            ← Hearthstead
          </Link>
          <span className="num text-[10px] uppercase tracking-[0.32em] text-clay">
            ✻ Section A — Residents ✻
          </span>
          <span className="num hidden text-[11px] uppercase tracking-[0.22em] text-muted-foreground sm:inline">
            Vol. I · No. I
          </span>
        </div>
        <div className="rule text-foreground/40" />
      </header>

      <section className="mx-auto max-w-[1300px] px-6 pt-12 pb-20 sm:px-10">
        {/* —— Page heading —— */}
        <div className="grid grid-cols-12 items-end gap-8">
          <div className="col-span-12 lg:col-span-8">
            <span className="num text-[10px] uppercase tracking-[0.4em] text-clay">
              ¶ The Registry of
            </span>
            <h1 className="mt-3 font-display text-[clamp(2.75rem,7vw,5.5rem)] leading-[0.92] tracking-[-0.03em]">
              Resi<span className="font-display-italic">dents</span>
            </h1>
            <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-foreground/80">
              Names, terms, and a few good details about everyone who calls
              Hearthstead home this semester. Add a new entry, amend an
              existing one, or quietly retire a record from the books.
            </p>
          </div>

          <div className="col-span-12 flex justify-end lg:col-span-4">
            <Button
              asChild
              size="lg"
              className="num bg-foreground text-background tracking-[0.14em] uppercase hover:bg-clay hover:text-paper"
            >
              <Link href="/students/new">
                <span aria-hidden className="mr-1">
                  ✚
                </span>
                Enroll a Resident
              </Link>
            </Button>
          </div>
        </div>

        <div className="rule-thick mt-10 text-foreground/40" />

        {/* —— Stats strip —— */}
        <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
          <StatCard label="Residents on file" value={total.toString().padStart(3, "0")} caption="total entries" />
          <StatCard
            label="Distinct majors"
            value={majors.toString().padStart(2, "0")}
            caption="fields of study"
          />
          <StatCard
            label="Underclassmen"
            value={((byYear[1] ?? 0) + (byYear[2] ?? 0))
              .toString()
              .padStart(2, "0")}
            caption="yr. 1 + 2"
          />
          <StatCard
            label="Upper / Grad"
            value={(
              (byYear[3] ?? 0) +
              (byYear[4] ?? 0) +
              (byYear[5] ?? 0) +
              (byYear[6] ?? 0)
            )
              .toString()
              .padStart(2, "0")}
            caption="yr. 3 +"
          />
        </div>

        {/* —— Table —— */}
        <Card className="mt-10 rounded-md ring-foreground/15">
          <CardHeader className="border-b border-foreground/10">
            <CardTitle className="font-display text-2xl tracking-[-0.01em]">
              The full ledger
            </CardTitle>
            <CardDescription className="num text-[11px] uppercase tracking-[0.22em]">
              {total === 0
                ? "No entries yet — the book is clean."
                : `${total} entr${total === 1 ? "y" : "ies"}, sorted by surname`}
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            {total === 0 ? (
              <EmptyState />
            ) : (
              <Table className="text-[14px]">
                <TableHeader>
                  <TableRow className="border-foreground/10 bg-secondary/40 hover:bg-secondary/40">
                    <TableHead className="num w-[72px] text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                      №
                    </TableHead>
                    <TableHead className="num text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                      Resident
                    </TableHead>
                    <TableHead className="num text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                      Contact
                    </TableHead>
                    <TableHead className="num text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                      Major
                    </TableHead>
                    <TableHead className="num text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                      Standing
                    </TableHead>
                    <TableHead className="num text-right text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {students.map((s: Student, i: number) => (
                    <TableRow
                      key={s.studentId}
                      className="border-foreground/5"
                    >
                      <TableCell className="num text-muted-foreground">
                        {String(i + 1).padStart(3, "0")}
                      </TableCell>
                      <TableCell>
                        <div className="font-display text-lg leading-tight tracking-tight">
                          {s.lastName},{" "}
                          <span className="font-display-italic text-foreground/85">
                            {s.firstName}
                          </span>
                        </div>
                        <div className="num mt-0.5 text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                          ID · {String(s.studentId).padStart(5, "0")} ·{" "}
                          {s.gender}
                        </div>
                      </TableCell>
                      <TableCell>
                        <a
                          href={`mailto:${s.email}`}
                          className="num block text-[12px] text-foreground hover:text-clay"
                        >
                          {s.email}
                        </a>
                        <span className="num block text-[12px] text-muted-foreground">
                          {s.phone}
                        </span>
                      </TableCell>
                      <TableCell className="max-w-[220px]">
                        <span className="text-foreground/90">{s.major}</span>
                      </TableCell>
                      <TableCell>
                        <YearBadge year={s.year} />
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1.5">
                          <Button
                            asChild
                            size="sm"
                            variant="outline"
                            className="num tracking-[0.12em] uppercase"
                          >
                            <Link href={`/students/${s.studentId}/edit`}>
                              Amend
                            </Link>
                          </Button>
                          <form
                            action={async () => {
                              "use server";
                              await deleteStudent(s.studentId);
                            }}
                          >
                            <Button
                              type="submit"
                              size="sm"
                              variant="destructive"
                              className="num tracking-[0.12em] uppercase"
                            >
                              Retire
                            </Button>
                          </form>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        <p className="num mt-4 text-right text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
          ⌃ End of Section A — Residents
        </p>
      </section>
    </main>
  );
}

/* ——————————————————————————————————————————————————————————— */

function StatCard({
  label,
  value,
  caption,
}: {
  label: string;
  value: string;
  caption: string;
}) {
  return (
    <Card className="rounded-md ring-foreground/15" size="sm">
      <CardContent className="flex flex-col gap-2">
        <span className="num text-[10px] uppercase tracking-[0.32em] text-muted-foreground">
          {label}
        </span>
        <span className="num text-3xl tracking-tight text-foreground">
          {value}
        </span>
        <span className="num text-[10px] uppercase tracking-[0.22em] text-clay">
          {caption}
        </span>
      </CardContent>
    </Card>
  );
}

function YearBadge({ year }: { year: number }) {
  // tiered intent: lower years muted, upper years more emphatic
  const variant: "secondary" | "outline" | "default" =
    year <= 2 ? "secondary" : year <= 4 ? "outline" : "default";

  const label = YEAR_LABEL[year] ?? `Year ${year}`;

  return (
    <div className="flex items-center gap-2">
      <span className="num text-[11px] tracking-tight text-foreground">
        Yr·{year}
      </span>
      <Badge
        variant={variant}
        className="num text-[10px] uppercase tracking-[0.22em]"
      >
        {label}
      </Badge>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="px-6 py-16 text-center">
      <div className="mx-auto flex max-w-md flex-col items-center">
        <span className="font-display text-7xl text-clay">∅</span>
        <h3 className="mt-4 font-display text-2xl tracking-tight">
          The book is{" "}
          <span className="font-display-italic">unspoiled</span>
        </h3>
        <p className="mt-2 text-[14px] text-foreground/75">
          Not a single resident has been entered into the registry. Begin
          where every good record begins — with a name.
        </p>
        <Button
          asChild
          size="lg"
          className="num mt-6 bg-foreground text-background tracking-[0.14em] uppercase hover:bg-clay hover:text-paper"
        >
          <Link href="/students/new">Enroll the First Resident</Link>
        </Button>
      </div>
    </div>
  );
}
