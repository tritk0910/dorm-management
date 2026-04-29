import { notFound } from "next/navigation";
import prisma from "../../../../lib/db";
import { updatePayment } from "../../../lib/actions/payment";
import { PaymentForm } from "../../payment-form";

export const dynamic = "force-dynamic";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [payment, contracts] = await Promise.all([
    prisma.payment.findUnique({ where: { paymentId: Number(id) } }),
    prisma.contract.findMany({ orderBy: { startDate: "desc" } }),
  ]);

  if (!payment) notFound();

  const update = updatePayment.bind(null, payment.paymentId);

  return <PaymentForm mode="edit" action={update} payment={payment} contracts={contracts} />;
}
