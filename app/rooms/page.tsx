import Link from "next/link";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import {
  IconArrowLeft,
  IconDoor,
  IconEdit,
  IconPlus,
  IconTrash,
} from "@tabler/icons-react";

import prisma from "../../lib/db";
import { deleteRoom } from "../lib/actions/room";
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
  const rooms = await prisma.room.findMany({
    orderBy: [{ building: { buildingName: "asc" } }, { roomNumber: "asc" }],
    include: { building: true },
  });

  const total = rooms.length;
  const totalCapacity = rooms.reduce((sum, r) => sum + r.capacity, 0);
  const types = new Set(rooms.map((r) => r.roomType)).size;

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
            <h1 className="mt-2 text-3xl tracking-tight sm:text-4xl">Rooms</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Every room across all residence halls.
            </p>
          </div>
          <Button asChild size="lg">
            <Link href="/rooms/new">
              <IconPlus />
              Add room
            </Link>
          </Button>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-3">
          <Stat label="Rooms" value={total} caption="total on record" />
          <Stat label="Capacity" value={totalCapacity} caption="total beds" />
          <Stat label="Room types" value={types} caption="distinct types" />
        </div>

        <Card className="mt-6 ring-foreground/8">
          <CardHeader className="border-b border-border/70 pb-4">
            <CardTitle className="text-base">All rooms</CardTitle>
            <CardDescription>
              {total === 0
                ? "Nothing to see yet — add the first one."
                : `${total} ${total === 1 ? "room" : "rooms"}, sorted by building then number.`}
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            {total === 0 ? <EmptyState /> : <RoomTable rooms={rooms} />}
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

type RoomWithBuilding = Awaited<ReturnType<typeof prisma.room.findMany>>[number];

const TYPE_COLOR: Record<string, string> = {
  Single: "bg-blue-500/10 text-blue-700 dark:text-blue-300",
  Double: "bg-green-500/10 text-green-700 dark:text-green-300",
  Triple: "bg-orange-500/10 text-orange-700 dark:text-orange-300",
  Suite: "bg-purple-500/10 text-purple-700 dark:text-purple-300",
  Studio: "bg-pink-500/10 text-pink-700 dark:text-pink-300",
};

function RoomTable({ rooms }: { rooms: RoomWithBuilding[] }) {
  return (
    <Table>
      <TableHeader>
        <TableRow className="hover:bg-transparent">
          <TableHead>Room</TableHead>
          <TableHead className="hidden sm:table-cell">Building</TableHead>
          <TableHead>Type</TableHead>
          <TableHead>Cap.</TableHead>
          <TableHead className="text-right">&nbsp;</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {rooms.map((r) => (
          <TableRow key={r.roomId} className="group">
            <TableCell>
              <div className="num font-medium">{r.roomNumber}</div>
              <div className="text-xs text-muted-foreground sm:hidden">
                {r.building.buildingName}
              </div>
            </TableCell>
            <TableCell className="hidden text-muted-foreground sm:table-cell">
              {r.building.buildingName}
            </TableCell>
            <TableCell>
              <Badge
                variant="secondary"
                className={TYPE_COLOR[r.roomType] ?? ""}
              >
                {r.roomType}
              </Badge>
            </TableCell>
            <TableCell className="num text-muted-foreground">
              {r.capacity}
            </TableCell>
            <TableCell className="text-right">
              <div className="flex justify-end gap-1 opacity-70 transition-opacity group-hover:opacity-100">
                <Button asChild size="icon-sm" variant="ghost" title="Edit">
                  <Link href={`/rooms/${r.roomId}/edit`}>
                    <IconEdit />
                  </Link>
                </Button>
                <form
                  action={async () => {
                    "use server";
                    await deleteRoom(r.roomId);
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
        <IconDoor className="size-6" />
      </div>
      <h3 className="mt-4 text-base">No rooms yet</h3>
      <p className="mt-1 max-w-sm text-sm text-muted-foreground">
        Add a building first, then start adding rooms to it.
      </p>
      <Button asChild className="mt-5">
        <Link href="/rooms/new">
          <IconPlus />
          Add the first room
        </Link>
      </Button>
    </div>
  );
}

