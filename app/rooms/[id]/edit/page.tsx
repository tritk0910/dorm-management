import { notFound } from "next/navigation";
import prisma from "../../../../lib/db";
import { updateRoom } from "../../../lib/actions/room";
import { RoomForm } from "../../room-form";

export const dynamic = "force-dynamic";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [room, buildings] = await Promise.all([
    prisma.room.findUnique({ where: { roomId: Number(id) } }),
    prisma.building.findMany({ orderBy: { buildingName: "asc" } }),
  ]);

  if (!room) notFound();

  const update = updateRoom.bind(null, room.roomId);

  return <RoomForm mode="edit" action={update} room={room} buildings={buildings} />;
}
