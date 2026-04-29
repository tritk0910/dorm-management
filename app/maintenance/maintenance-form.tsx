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
  MaintenanceRequest,
  Room,
  Staff,
  Student,
  Building,
} from "@/app/generated/prisma/client";

type Mode = "create" | "edit";

type RoomWithBuilding = Room & { building: Building };

export function MaintenanceForm({
  mode,
  action,
  request,
  rooms,
  students,
  staff,
}: {
  mode: Mode;
  action: (formData: FormData) => void | Promise<void>;
  request?: MaintenanceRequest;
  rooms: RoomWithBuilding[];
  students: Student[];
  staff: Staff[];
}) {
  const isEdit = mode === "edit";

  return (
    <>
      <Nav />

      <main className="mx-auto w-full max-w-xl px-6 py-12 sm:px-8">
        <Link
          href="/maintenance"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <IconArrowLeft className="size-3.5" />
          Back to maintenance
        </Link>

        <h1 className="mt-3 text-3xl tracking-tight sm:text-4xl">
          {isEdit ? (
            <>
              Edit <span className="font-serif italic text-warm">request</span>
            </>
          ) : (
            <>
              New{" "}
              <span className="font-serif italic text-warm">
                maintenance request
              </span>
            </>
          )}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {isEdit
            ? "Update the request details below."
            : "Log a repair or service issue for a room."}
        </p>

        <Card className="mt-8 ring-foreground/8">
          <CardHeader className="border-b border-border/70 pb-4">
            <CardTitle className="text-base">Request details</CardTitle>
            <CardDescription>All fields are required.</CardDescription>
          </CardHeader>
          <CardContent>
            <form action={action} className="flex flex-col gap-5">
              <Row>
                <Field label="Room" htmlFor="roomId">
                  <NativeSelect
                    id="roomId"
                    name="roomId"
                    required
                    defaultValue={request?.roomId?.toString() ?? ""}
                  >
                    <option value="" disabled>Select a room…</option>
                    {rooms.map((r) => (
                      <option key={r.roomId} value={r.roomId.toString()}>
                        {r.building.buildingName} — Room {r.roomNumber}
                      </option>
                    ))}
                  </NativeSelect>
                </Field>
                <Field label="Reported by (student)" htmlFor="studentId">
                  <NativeSelect
                    id="studentId"
                    name="studentId"
                    required
                    defaultValue={request?.studentId?.toString() ?? ""}
                  >
                    <option value="" disabled>Select a student…</option>
                    {students.map((s) => (
                      <option key={s.studentId} value={s.studentId.toString()}>
                        {s.firstName} {s.lastName}
                      </option>
                    ))}
                  </NativeSelect>
                </Field>
              </Row>

              <Field label="Description" htmlFor="description">
                <NativeTextarea
                  id="description"
                  name="description"
                  required
                  rows={4}
                  defaultValue={request?.description ?? ""}
                  placeholder="Describe the issue in detail…"
                />
              </Field>

              <Row>
                <Field label="Request date" htmlFor="requestDate">
                  <Input
                    id="requestDate"
                    name="requestDate"
                    type="date"
                    required
                    defaultValue={
                      request
                        ? request.requestDate.toISOString().split("T")[0]
                        : undefined
                    }
                    className="rounded-md"
                  />
                </Field>
                <Field label="Status" htmlFor="status">
                  <NativeSelect
                    id="status"
                    name="status"
                    required
                    defaultValue={request?.status ?? ""}
                  >
                    <option value="" disabled>Select…</option>
                    <option value="Pending">Pending</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Resolved">Resolved</option>
                  </NativeSelect>
                </Field>
              </Row>

              <Field label="Assigned staff" htmlFor="staffId">
                <NativeSelect
                  id="staffId"
                  name="staffId"
                  defaultValue={request?.staffId?.toString() ?? ""}
                >
                  <option value="">— Unassigned —</option>
                  {staff.map((s) => (
                    <option key={s.staffId} value={s.staffId.toString()}>
                      {s.name} ({s.role})
                    </option>
                  ))}
                </NativeSelect>
              </Field>

              <div className="mt-2 flex items-center justify-end gap-2">
                <Button asChild variant="ghost" size="lg">
                  <Link href="/maintenance">Cancel</Link>
                </Button>
                <Button type="submit" size="lg">
                  <IconCheck />
                  {isEdit ? "Save changes" : "Submit request"}
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

function NativeTextarea({
  className,
  ...props
}: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      className={[
        "w-full min-w-0 rounded-md border border-input bg-input/30 px-3 py-2 text-sm transition-colors outline-none resize-none",
        "focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50",
        className ?? "",
      ].join(" ")}
    />
  );
}


