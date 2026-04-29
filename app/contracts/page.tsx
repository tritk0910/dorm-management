import Link from "next/link";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import {
  IconArrowLeft,
  IconEdit,
  IconFileText,
  IconPlus,
  IconTrash,
} from "@tabler/icons-react";

import prisma from "../../lib/db";
import { deleteContract } from "../lib/actions/contract";
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
  Active: "bg-green-500/10 text-green-700 dark:text-green-300",
  Expired: "bg-gray-500/10 text-gray-600 dark:text-gray-400",
  Terminated: "bg-red-500/10 text-red-700 dark:text-red-300",
};

function fmt(date: Date) {
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default async function Page() {
  const contracts = await prisma.contract.findMany({
    orderBy: { startDate: "desc" },
    include: {
      assignments: {
        include: { student: true, room: { include: { building: true } } },
      },
      _count: { select: { payments: true } },
    },
  });

  const total = contracts.length;
  const active = contracts.filter((c) => c.status === "Active").length;
  const totalDeposit = contracts.reduce(
    (sum, c) => sum + Number(c.depositAmount),
    0,
  );

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
              Contracts
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Housing agreements between students and the residence office.
            </p>
          </div>
          <Button asChild size="lg">
            <Link href="/contracts/new">
              <IconPlus />
              New contract
            </Link>
          </Button>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-3">
          <Stat label="Contracts" value={total} caption="total on file" />
          <Stat label="Active" value={active} caption="currently active" />
          <StatMoney
            label="Deposits held"
            value={totalDeposit}
            caption="total across all contracts"
          />
        </div>

        <Card className="mt-6 ring-foreground/8">
          <CardHeader className="border-b border-border/70 pb-4">
            <CardTitle className="text-base">All contracts</CardTitle>
            <CardDescription>
              {total === 0
                ? "Nothing to see yet — create the first one."
                : `${total} ${total === 1 ? "contract" : "contracts"}, newest first.`}
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            {total === 0 ? <EmptyState /> : <ContractTable contracts={contracts} />}
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
        <span className="num text-2xl tracking-tight">
          ${value.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </span>
        <span className="text-xs text-muted-foreground">{caption}</span>
      </CardContent>
    </Card>
  );
}

type ContractWithDetails = Awaited<
  ReturnType<typeof prisma.contract.findMany>
>[number];

function ContractTable({ contracts }: { contracts: ContractWithDetails[] }) {
  return (
    <Table>
      <TableHeader>
        <TableRow className="hover:bg-transparent">
          <TableHead>Period</TableHead>
          <TableHead className="hidden md:table-cell">Residents</TableHead>
          <TableHead className="hidden sm:table-cell">Deposit</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">&nbsp;</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {contracts.map((c) => {
          const residents = c.assignments.map(
            (a) => `${a.student.firstName} ${a.student.lastName}`,
          );
          return (
            <TableRow key={c.contractId} className="group">
              <TableCell>
                <div className="num text-sm font-medium">
                  {fmt(c.startDate)} — {fmt(c.endDate)}
                </div>
                <div className="text-xs text-muted-foreground">
                  #{c.contractId.toString().padStart(4, "0")}
                </div>
              </TableCell>
              <TableCell className="hidden text-muted-foreground md:table-cell">
                {residents.length === 0
                  ? "—"
                  : residents.length === 1
                    ? residents[0]
                    : `${residents[0]} +${residents.length - 1}`}
              </TableCell>
              <TableCell className="num hidden text-muted-foreground sm:table-cell">
                ${Number(c.depositAmount).toFixed(2)}
              </TableCell>
              <TableCell>
                <Badge
                  variant="secondary"
                  className={STATUS_COLOR[c.status] ?? ""}
                >
                  {c.status}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-1 opacity-70 transition-opacity group-hover:opacity-100">
                  <Button asChild size="icon-sm" variant="ghost" title="Edit">
                    <Link href={`/contracts/${c.contractId}/edit`}>
                      <IconEdit />
                    </Link>
                  </Button>
                  <form
                    action={async () => {
                      "use server";
                      await deleteContract(c.contractId);
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
          );
        })}
      </TableBody>
    </Table>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
      <div className="grid size-12 place-items-center rounded-2xl bg-warm/12 text-warm">
        <IconFileText className="size-6" />
      </div>
      <h3 className="mt-4 text-base">No contracts yet</h3>
      <p className="mt-1 max-w-sm text-sm text-muted-foreground">
        Create a contract to begin formalising student housing agreements.
      </p>
      <Button asChild className="mt-5">
        <Link href="/contracts/new">
          <IconPlus />
          Create the first contract
        </Link>
      </Button>
    </div>
  );
}

