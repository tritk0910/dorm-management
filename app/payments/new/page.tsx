import prisma from "../../../lib/db";
import { createPayment } from "../../lib/actions/payment";
import { PaymentForm } from "../payment-form";

export const dynamic = "force-dynamic";

export default async function Page() {
  const contracts = await prisma.contract.findMany({
    orderBy: { startDate: "desc" },
  });

  return <PaymentForm mode="create" action={createPayment} contracts={contracts} />;
}
