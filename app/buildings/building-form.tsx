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
import type { Building } from "@/app/generated/prisma/client";

type Mode = "create" | "edit";

export function BuildingForm({
  mode,
  action,
  building,
}: {
  mode: Mode;
  action: (formData: FormData) => void | Promise<void>;
  building?: Building;
}) {
  const isEdit = mode === "edit";

  return (
    <>
      <Nav />

      <main className="mx-auto w-full max-w-xl px-6 py-12 sm:px-8">
        <Link
          href="/buildings"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <IconArrowLeft className="size-3.5" />
          Back to buildings
        </Link>

        <h1 className="mt-3 text-3xl tracking-tight sm:text-4xl">
          {isEdit ? (
            <>
              Edit{" "}
              <span className="font-serif italic text-warm">
                {building?.buildingName ?? "building"}
              </span>
            </>
          ) : (
            <>
              Add a <span className="font-serif italic text-warm">building</span>
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
            <CardTitle className="text-base">Building details</CardTitle>
            <CardDescription>All fields are required.</CardDescription>
          </CardHeader>
          <CardContent>
            <form action={action} className="flex flex-col gap-5">
              <Field label="Building name" htmlFor="buildingName">
                <Input
                  id="buildingName"
                  name="buildingName"
                  required
                  defaultValue={building?.buildingName ?? ""}
                  placeholder="Maple Hall"
                  className="rounded-md"
                />
              </Field>

              <Field label="Address" htmlFor="address">
                <Input
                  id="address"
                  name="address"
                  required
                  defaultValue={building?.address ?? ""}
                  placeholder="123 Campus Drive"
                  className="rounded-md"
                />
              </Field>

              <div className="mt-2 flex items-center justify-end gap-2">
                <Button asChild variant="ghost" size="lg">
                  <Link href="/buildings">Cancel</Link>
                </Button>
                <Button type="submit" size="lg">
                  <IconCheck />
                  {isEdit ? "Save changes" : "Add building"}
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


