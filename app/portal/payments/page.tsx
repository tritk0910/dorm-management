import Link from "next/link";
import { IconArrowLeft, IconCreditCard } from "@tabler/icons-react";

import prisma from "../../../lib/db";
import { getSession } from "@/lib/auth";
import { PortalNav } from "@/components/portal-nav";
import { Footer } from "@/components/footer";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

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

function fmt(d: Date) {
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default async function Page() {
  const session = await getSession();
  const studentId = session?.studentId;

  const assignments = studentId
    ? await prisma.roomAssignment.findMany({
        where: { studentId },
        select: { contractId: true },
      })
    : [];

  const contractIds = assignments.map((a) => a.contractId);

  const payments =
    contractIds.length > 0
      ? await prisma.payment.findMany({
          where: { contractId: { in: contractIds } },
          orderBy: { dueDate: "desc" },
          include: { contract: true },
        })
      : [];

  const totalPaid = payments
    .filter((p) => p.status === "Paid")
    .reduce((s, p) => s + Number(p.amount), 0);
  const totalOverdue = payments.filter((p) => p.status === "Overdue").length;

  return (
    <>
      <PortalNav />
      <main className="mx-auto w-full max-w-3xl px-6 py-12 sm:px-8">
        <Link
          href="/portal"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <IconArrowLeft className="size-3.5" />
          My portal
        </Link>

        <h1 className="mt-3 text-3xl tracking-tight sm:text-4xl">
          My <span className="font-serif italic text-warm">Payments</span>
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          All payments tied to your housing contracts.
        </p>

        {/* Summary stats */}
        <div className="mt-6 grid grid-cols-3 gap-3">
          {[
            { label: "Total payments", value: payments.length.toString().padStart(2, "0") },
            { label: "Overdue", value: totalOverdue.toString().padStart(2, "0") },
            {
              label: "Total paid",
              value: `$${totalPaid.toLocaleString("en-US", { minimumFractionDigits: 2 })}`,
            },
          ].map((s) => (
            <Card key={s.label} size="sm" className="ring-foreground/8">
              <CardContent className="flex flex-col gap-1">
                <span className="num text-2xl tracking-tight">{s.value}</span>
                <span className="text-xs text-muted-foreground">{s.label}</span>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="mt-6 ring-foreground/8">
          <CardHeader className="border-b border-border/70 pb-4">
            <CardTitle className="text-base">All payments</CardTitle>
            <CardDescription>
              {payments.length === 0
                ? "No payments on record."
                : `${payments.length} ${payments.length === 1 ? "payment" : "payments"}, newest first.`}
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            {payments.length === 0 ? (
              <div className="flex flex-col items-center py-16 text-center">
                <IconCreditCard className="size-8 text-muted-foreground" />
                <p className="mt-3 text-sm text-muted-foreground">
                  No payments yet. They appear here once your contract is set up.
                </p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead>Date</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead className="num">Amount</TableHead>
                    <TableHead className="hidden sm:table-cell">Due</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {payments.map((p) => (
                    <TableRow key={p.paymentId}>
                      <TableCell className="num text-sm">{fmt(p.paymentDate)}</TableCell>
                      <TableCell>
                        <Badge variant="secondary" className={TYPE_COLOR[p.paymentType] ?? ""}>
                          {p.paymentType}
                        </Badge>
                      </TableCell>
                      <TableCell className="num font-medium">
                        ${Number(p.amount).toFixed(2)}
                      </TableCell>
                      <TableCell className="num hidden text-muted-foreground sm:table-cell">
                        {fmt(p.dueDate)}
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" className={STATUS_COLOR[p.status] ?? ""}>
                          {p.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </main>
      <Footer />
    </>
  );
}
