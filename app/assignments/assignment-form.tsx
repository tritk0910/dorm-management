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
import type {
  Building,
  Contract,
  Room,
  RoomAssignment,
  Student,
} from "@/app/generated/prisma/client";

type Mode = "create" | "edit";

type RoomWithBuilding = Room & { building: Building };

export function AssignmentForm({
  mode,
  action,
  assignment,
  students,
  rooms,
  contracts,
}: {
  mode: Mode;
  action: (formData: FormData) => void | Promise<void>;
  assignment?: RoomAssignment;
  students: Student[];
  rooms: RoomWithBuilding[];
  contracts: Contract[];
}) {
  const isEdit = mode === "edit";

  return (
    <>
      <Nav />

      <main className="mx-auto w-full max-w-xl px-6 py-12 sm:px-8">
        <Link
          href="/assignments"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <IconArrowLeft className="size-3.5" />
          Back to assignments
        </Link>

        <h1 className="mt-3 text-3xl tracking-tight sm:text-4xl">
          {isEdit ? (
            <>
              Edit{" "}
              <span className="font-serif italic text-warm">assignment</span>
            </>
          ) : (
            <>
              New{" "}
              <span className="font-serif italic text-warm">
                room assignment
              </span>
            </>
          )}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {isEdit
            ? "Update the assignment details below."
            : "Link a student and a room to an existing contract."}
        </p>

        <Card className="mt-8 ring-foreground/8">
          <CardHeader className="border-b border-border/70 pb-4">
            <CardTitle className="text-base">Assignment details</CardTitle>
            <CardDescription>All fields except move-out are required.</CardDescription>
          </CardHeader>
          <CardContent>
            <form action={action} className="flex flex-col gap-5">
              <Field label="Student" htmlFor="studentId">
                <NativeSelect
                  id="studentId"
                  name="studentId"
                  required
                  defaultValue={assignment?.studentId?.toString() ?? ""}
                >
                  <option value="" disabled>Select a student…</option>
                  {students.map((s) => (
                    <option key={s.studentId} value={s.studentId.toString()}>
                      {s.firstName} {s.lastName}
                    </option>
                  ))}
                </NativeSelect>
              </Field>

              <Field label="Room" htmlFor="roomId">
                <NativeSelect
                  id="roomId"
                  name="roomId"
                  required
                  defaultValue={assignment?.roomId?.toString() ?? ""}
                >
                  <option value="" disabled>Select a room…</option>
                  {rooms.map((r) => (
                    <option key={r.roomId} value={r.roomId.toString()}>
                      {r.building.buildingName} — Room {r.roomNumber} ({r.roomType}, cap. {r.capacity})
                    </option>
                  ))}
                </NativeSelect>
              </Field>

              <Field label="Contract" htmlFor="contractId">
                <NativeSelect
                  id="contractId"
                  name="contractId"
                  required
                  defaultValue={assignment?.contractId?.toString() ?? ""}
                >
                  <option value="" disabled>Select a contract…</option>
                  {contracts.map((c) => (
                    <option key={c.contractId} value={c.contractId.toString()}>
                      #{c.contractId.toString().padStart(4, "0")} —{" "}
                      {c.startDate.toLocaleDateString("en-US", { year: "numeric", month: "short" })} to{" "}
                      {c.endDate.toLocaleDateString("en-US", { year: "numeric", month: "short" })}{" "}
                      ({c.status})
                    </option>
                  ))}
                </NativeSelect>
              </Field>

              <Row>
                <Field label="Move-in date" htmlFor="moveInDate">
                  <Input
                    id="moveInDate"
                    name="moveInDate"
                    type="date"
                    required
                    defaultValue={
                      assignment
                        ? assignment.moveInDate.toISOString().split("T")[0]
                        : undefined
                    }
                    className="rounded-md"
                  />
                </Field>
                <Field label="Move-out date (optional)" htmlFor="moveOutDate">
                  <Input
                    id="moveOutDate"
                    name="moveOutDate"
                    type="date"
                    defaultValue={
                      assignment?.moveOutDate
                        ? assignment.moveOutDate.toISOString().split("T")[0]
                        : undefined
                    }
                    className="rounded-md"
                  />
                </Field>
              </Row>

              <div className="mt-2 flex items-center justify-end gap-2">
                <Button asChild variant="ghost" size="lg">
                  <Link href="/assignments">Cancel</Link>
                </Button>
                <Button type="submit" size="lg">
                  <IconCheck />
                  {isEdit ? "Save changes" : "Create assignment"}
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


