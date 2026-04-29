import Link from "next/link";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import {
  IconArrowLeft,
  IconBuildingCommunity,
  IconEdit,
  IconPlus,
  IconTrash,
} from "@tabler/icons-react";

import prisma from "../../lib/db";
import { deleteBuilding } from "../lib/actions/building";
import type { Building } from "@/app/generated/prisma/client";
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

export const dynamic = "force-dynamic";

export default async function Page() {
  const buildings = await prisma.building.findMany({
    orderBy: { buildingName: "asc" },
    include: { _count: { select: { rooms: true } } },
  });

  const total = buildings.length;
  const totalRooms = buildings.reduce((sum, b) => sum + b._count.rooms, 0);

  return (
    <>
      <Nav />

      <main className="mx-auto w-full max-w-5xl px-6 py-12 sm:px-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <Link
              href="/"
              className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
            >
              <IconArrowLeft className="size-3.5" />
              Home
            </Link>
            <h1 className="mt-2 text-3xl tracking-tight sm:text-4xl">
              Buildings
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Residence halls that make up Hearthstead.
            </p>
          </div>
          <Button asChild size="lg">
            <Link href="/buildings/new">
              <IconPlus />
              Add building
            </Link>
          </Button>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-3">
          <Stat label="Buildings" value={total} caption="on campus" />
          <Stat label="Total rooms" value={totalRooms} caption="across all buildings" />
          <Stat label="Avg rooms" value={total > 0 ? Math.round(totalRooms / total) : 0} caption="per building" />
        </div>

        <Card className="mt-6 ring-foreground/8">
          <CardHeader className="border-b border-border/70 pb-4">
            <CardTitle className="text-base">All buildings</CardTitle>
            <CardDescription>
              {total === 0
                ? "Nothing to see yet — add the first one."
                : `${total} ${total === 1 ? "building" : "buildings"}, sorted by name.`}
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            {total === 0 ? <EmptyState /> : <BuildingTable buildings={buildings} />}
          </CardContent>
        </Card>
      </main>

      <Footer />
    </>
  );
}

/* ——————————————————————————————————————————————————————————— */


function Stat({
  label,
  value,
  caption,
}: {
  label: string;
  value: number;
  caption: string;
}) {
  return (
    <Card size="sm" className="ring-foreground/8">
      <CardContent className="flex flex-col gap-1">
        <span className="text-xs text-muted-foreground">{label}</span>
        <span className="num text-2xl tracking-tight">
          {value.toString().padStart(2, "0")}
        </span>
        <span className="text-xs text-muted-foreground">{caption}</span>
      </CardContent>
    </Card>
  );
}

type BuildingWithCount = Building & { _count: { rooms: number } };

function BuildingTable({ buildings }: { buildings: BuildingWithCount[] }) {
  return (
    <Table>
      <TableHeader>
        <TableRow className="hover:bg-transparent">
          <TableHead>Name</TableHead>
          <TableHead className="hidden sm:table-cell">Address</TableHead>
          <TableHead>Rooms</TableHead>
          <TableHead className="text-right">&nbsp;</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {buildings.map((b) => (
          <TableRow key={b.buildingId} className="group">
            <TableCell>
              <div className="font-medium">{b.buildingName}</div>
              <div className="text-xs text-muted-foreground sm:hidden">{b.address}</div>
            </TableCell>
            <TableCell className="hidden text-muted-foreground sm:table-cell">
              {b.address}
            </TableCell>
            <TableCell>
              <Badge variant="secondary" className="num">
                {b._count.rooms}
              </Badge>
            </TableCell>
            <TableCell className="text-right">
              <div className="flex justify-end gap-1 opacity-70 transition-opacity group-hover:opacity-100">
                <Button asChild size="icon-sm" variant="ghost" title="Edit">
                  <Link href={`/buildings/${b.buildingId}/edit`}>
                    <IconEdit />
                  </Link>
                </Button>
                <form
                  action={async () => {
                    "use server";
                    await deleteBuilding(b.buildingId);
                  }}
                >
                  <Button
                    type="submit"
                    size="icon-sm"
                    variant="ghost"
                    title="Delete"
                    className="hover:bg-destructive/10 hover:text-destructive"
                  >
                    <IconTrash />
                  </Button>
                </form>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
      <div className="grid size-12 place-items-center rounded-2xl bg-warm/12 text-warm">
        <IconBuildingCommunity className="size-6" />
      </div>
      <h3 className="mt-4 text-base">No buildings yet</h3>
      <p className="mt-1 max-w-sm text-sm text-muted-foreground">
        Add your first residence hall to start organizing rooms.
      </p>
      <Button asChild className="mt-5">
        <Link href="/buildings/new">
          <IconPlus />
          Add the first building
        </Link>
      </Button>
    </div>
  );
}

