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
import type { Building, Room } from "@/app/generated/prisma/client";

type Mode = "create" | "edit";

export function RoomForm({
  mode,
  action,
  room,
  buildings,
}: {
  mode: Mode;
  action: (formData: FormData) => void | Promise<void>;
  room?: Room;
  buildings: Building[];
}) {
  const isEdit = mode === "edit";

  return (
    <>
      <Nav />

      <main className="mx-auto w-full max-w-xl px-6 py-12 sm:px-8">
        <Link
          href="/rooms"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <IconArrowLeft className="size-3.5" />
          Back to rooms
        </Link>

        <h1 className="mt-3 text-3xl tracking-tight sm:text-4xl">
          {isEdit ? (
            <>
              Edit{" "}
              <span className="font-serif italic text-warm">
                room {room?.roomNumber ?? ""}
              </span>
            </>
          ) : (
            <>
              Add a <span className="font-serif italic text-warm">room</span>
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
            <CardTitle className="text-base">Room details</CardTitle>
            <CardDescription>All fields are required.</CardDescription>
          </CardHeader>
          <CardContent>
            <form action={action} className="flex flex-col gap-5">
              <Field label="Building" htmlFor="buildingId">
                <NativeSelect
                  id="buildingId"
                  name="buildingId"
                  required
                  defaultValue={room?.buildingId?.toString() ?? ""}
                >
                  <option value="" disabled>Select a building…</option>
                  {buildings.map((b) => (
                    <option key={b.buildingId} value={b.buildingId.toString()}>
                      {b.buildingName}
                    </option>
                  ))}
                </NativeSelect>
              </Field>

              <Row>
                <Field label="Room number" htmlFor="roomNumber">
                  <Input
                    id="roomNumber"
                    name="roomNumber"
                    required
                    defaultValue={room?.roomNumber ?? ""}
                    placeholder="101"
                    className="rounded-md"
                  />
                </Field>
                <Field label="Capacity" htmlFor="capacity">
                  <Input
                    id="capacity"
                    name="capacity"
                    type="number"
                    min={1}
                    max={8}
                    required
                    defaultValue={room?.capacity ?? ""}
                    placeholder="2"
                    className="rounded-md"
                  />
                </Field>
              </Row>

              <Field label="Room type" htmlFor="roomType">
                <NativeSelect
                  id="roomType"
                  name="roomType"
                  required
                  defaultValue={room?.roomType ?? ""}
                >
                  <option value="" disabled>Select a type…</option>
                  <option value="Single">Single</option>
                  <option value="Double">Double</option>
                  <option value="Triple">Triple</option>
                  <option value="Suite">Suite</option>
                  <option value="Studio">Studio</option>
                </NativeSelect>
              </Field>

              <div className="mt-2 flex items-center justify-end gap-2">
                <Button asChild variant="ghost" size="lg">
                  <Link href="/rooms">Cancel</Link>
                </Button>
                <Button type="submit" size="lg">
                  <IconCheck />
                  {isEdit ? "Save changes" : "Add room"}
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


