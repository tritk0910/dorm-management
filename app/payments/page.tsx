import Link from "next/link";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import {
  IconArrowLeft,
  IconCreditCard,
  IconEdit,
  IconPlus,
  IconTrash,
} from "@tabler/icons-react";

import prisma from "../../lib/db";
import { deletePayment } from "../lib/actions/payment";
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

const STATUS_COLOR: Record<string, string> = {
  Paid: "bg-green-500/10 text-green-700 dark:text-green-300",
  Pending: "bg-yellow-500/10 text-yellow-700 dark:text-yellow-300",
  Overdue: "bg-red-500/10 text-red-700 dark:text-red-300",
};

const TYPE_COLOR: Record<string, string> = {
  Rent: "bg-blue-500/10 text-blue-700 dark:text-blue-300",
  Deposit: "bg-purple-500/10 text-purple-700 dark:text-purple-300",
  Fee: "bg-orange-500/10 text-orange-700 dark:text-orange-300",
  Refund: "bg-teal-500/10 text-teal-700 dark:text-teal-300",
};

function fmt(date: Date) {
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default async function Page() {
  const payments = await prisma.payment.findMany({
    orderBy: { paymentDate: "desc" },
    include: { contract: true },
  });

  const total = payments.length;
  const paid = payments.filter((p) => p.status === "Paid").length;
  const totalAmount = payments.reduce((sum, p) => sum + Number(p.amount), 0);
  const overdue = payments.filter((p) => p.status === "Overdue").length;

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
              Payments
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              All financial transactions tied to housing contracts.
            </p>
          </div>
          <Button asChild size="lg">
            <Link href="/payments/new">
              <IconPlus />
              Record payment
            </Link>
          </Button>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-4">
          <Stat label="Payments" value={total} caption="total on file" />
          <Stat label="Paid" value={paid} caption="completed" />
          <Stat label="Overdue" value={overdue} caption="need attention" />
          <StatMoney label="Total collected" value={totalAmount} caption="across all records" />
        </div>

        <Card className="mt-6 ring-foreground/8">
          <CardHeader className="border-b border-border/70 pb-4">
            <CardTitle className="text-base">All payments</CardTitle>
            <CardDescription>
              {total === 0
                ? "Nothing to see yet — record the first one."
                : `${total} ${total === 1 ? "record" : "records"}, newest first.`}
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            {total === 0 ? <EmptyState /> : <PaymentTable payments={payments} />}
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

function StatMoney({
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
        <span className="num text-xl tracking-tight">
          ${value.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </span>
        <span className="text-xs text-muted-foreground">{caption}</span>
      </CardContent>
    </Card>
  );
}

type PaymentWithContract = Awaited<
  ReturnType<typeof prisma.payment.findMany>
>[number];

function PaymentTable({ payments }: { payments: PaymentWithContract[] }) {
  return (
    <Table>
      <TableHeader>
        <TableRow className="hover:bg-transparent">
          <TableHead>Date</TableHead>
          <TableHead>Type</TableHead>
          <TableHead className="hidden sm:table-cell">Contract</TableHead>
          <TableHead className="num">Amount</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">&nbsp;</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {payments.map((p) => (
          <TableRow key={p.paymentId} className="group">
            <TableCell>
              <div className="num text-sm">{fmt(p.paymentDate)}</div>
              <div className="text-xs text-muted-foreground">
                Due {fmt(p.dueDate)}
              </div>
            </TableCell>
            <TableCell>
              <Badge
                variant="secondary"
                className={TYPE_COLOR[p.paymentType] ?? ""}
              >
                {p.paymentType}
              </Badge>
            </TableCell>
            <TableCell className="hidden text-muted-foreground sm:table-cell">
              #{p.contractId.toString().padStart(4, "0")}
            </TableCell>
            <TableCell className="num font-medium">
              ${Number(p.amount).toFixed(2)}
            </TableCell>
            <TableCell>
              <Badge
                variant="secondary"
                className={STATUS_COLOR[p.status] ?? ""}
              >
                {p.status}
              </Badge>
            </TableCell>
            <TableCell className="text-right">
              <div className="flex justify-end gap-1 opacity-70 transition-opacity group-hover:opacity-100">
                <Button asChild size="icon-sm" variant="ghost" title="Edit">
                  <Link href={`/payments/${p.paymentId}/edit`}>
                    <IconEdit />
                  </Link>
                </Button>
                <form
                  action={async () => {
                    "use server";
                    await deletePayment(p.paymentId);
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
        <IconCreditCard className="size-6" />
      </div>
      <h3 className="mt-4 text-base">No payments yet</h3>
      <p className="mt-1 max-w-sm text-sm text-muted-foreground">
        Once contracts are in place, record payments against them here.
      </p>
      <Button asChild className="mt-5">
        <Link href="/payments/new">
          <IconPlus />
          Record the first payment
        </Link>
      </Button>
    </div>
  );
}

