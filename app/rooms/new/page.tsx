import prisma from "../../../lib/db";
import { createRoom } from "../../lib/actions/room";
import { RoomForm } from "../room-form";

export const dynamic = "force-dynamic";

export default async function Page() {
  const buildings = await prisma.building.findMany({
    orderBy: { buildingName: "asc" },
  });

  return <RoomForm mode="create" action={createRoom} buildings={buildings} />;
}
