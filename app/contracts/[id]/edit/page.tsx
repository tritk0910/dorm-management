import { notFound } from "next/navigation";
import prisma from "../../../../lib/db";
import { updateContract } from "../../../lib/actions/contract";
import { ContractForm } from "../../contract-form";

export const dynamic = "force-dynamic";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const contract = await prisma.contract.findUnique({
    where: { contractId: Number(id) },
  });

  if (!contract) notFound();

  const update = updateContract.bind(null, contract.contractId);

  return <ContractForm mode="edit" action={update} contract={contract} />;
}
