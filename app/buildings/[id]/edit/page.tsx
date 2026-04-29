import { notFound } from "next/navigation";
import prisma from "../../../../lib/db";
import { updateBuilding } from "../../../lib/actions/building";
import { BuildingForm } from "../../building-form";

export const dynamic = "force-dynamic";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const building = await prisma.building.findUnique({
    where: { buildingId: Number(id) },
  });

  if (!building) notFound();

  const update = updateBuilding.bind(null, building.buildingId);

  return <BuildingForm mode="edit" action={update} building={building} />;
}
