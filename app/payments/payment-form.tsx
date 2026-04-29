import Link from "next/link";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import { IconArrowLeft, IconCheck } from "@tabler/icons-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { Contract, Payment } from "@/app/generated/prisma/client";

type Mode = "create" | "edit";

export function PaymentForm({
  mode,
  action,
  payment,
  contracts,
}: {
  mode: Mode;
  action: (formData: FormData) => void | Promise<void>;
  payment?: Payment;
  contracts: Contract[];
}) {
  const isEdit = mode === "edit";

  return (
    <>
      <Nav />

      <main className="mx-auto w-full max-w-xl px-6 py-12 sm:px-8">
        <Link
          href="/payments"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <IconArrowLeft className="size-3.5" />
          Back to payments
        </Link>

        <h1 className="mt-3 text-3xl tracking-tight sm:text-4xl">
          {isEdit ? (
            <>
              Edit <span className="font-serif italic text-warm">payment</span>
            </>
          ) : (
            <>
              Record a{" "}
              <span className="font-serif italic text-warm">payment</span>
            </>
          )}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {isEdit
            ? "Update the payment details below."
            : "Log a transaction against an existing contract."}
        </p>

        <Card className="mt-8 ring-foreground/8">
          <CardHeader className="border-b border-border/70 pb-4">
            <CardTitle className="text-base">Payment details</CardTitle>
            <CardDescription>All fields are required.</CardDescription>
          </CardHeader>
          <CardContent>
            <form action={action} className="flex flex-col gap-5">
              <Field label="Contract" htmlFor="contractId">
                <NativeSelect
                  id="contractId"
                  name="contractId"
                  required
                  defaultValue={payment?.contractId?.toString() ?? ""}
                >
                  <option value="" disabled>Select a contract…</option>
                  {contracts.map((c) => (
                    <option key={c.contractId} value={c.contractId.toString()}>
                      #{c.contractId.toString().padStart(4, "0")} —{" "}
                      {c.startDate.toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                      })}{" "}
                      to{" "}
                      {c.endDate.toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                      })}{" "}
                      ({c.status})
                    </option>
                  ))}
                </NativeSelect>
              </Field>

              <Row>
                <Field label="Amount ($)" htmlFor="amount">
                  <Input
                    id="amount"
                    name="amount"
                    type="number"
                    min={0}
                    step="0.01"
                    required
                    defaultValue={payment ? payment.amount.toString() : ""}
                    placeholder="1200.00"
                    className="rounded-md"
                  />
                </Field>
                <Field label="Payment type" htmlFor="paymentType">
                  <NativeSelect
                    id="paymentType"
                    name="paymentType"
                    required
                    defaultValue={payment?.paymentType ?? ""}
                  >
                    <option value="" disabled>Select…</option>
                    <option value="Rent">Rent</option>
                    <option value="Deposit">Deposit</option>
                    <option value="Fee">Fee</option>
                    <option value="Refund">Refund</option>
                  </NativeSelect>
                </Field>
              </Row>

              <Row>
                <Field label="Payment date" htmlFor="paymentDate">
                  <Input
                    id="paymentDate"
                    name="paymentDate"
                    type="date"
                    required
                    defaultValue={
                      payment
                        ? payment.paymentDate.toISOString().split("T")[0]
                        : undefined
                    }
                    className="rounded-md"
                  />
                </Field>
                <Field label="Due date" htmlFor="dueDate">
                  <Input
                    id="dueDate"
                    name="dueDate"
                    type="date"
                    required
                    defaultValue={
                      payment
                        ? payment.dueDate.toISOString().split("T")[0]
                        : undefined
                    }
                    className="rounded-md"
                  />
                </Field>
              </Row>

              <Field label="Status" htmlFor="status">
                <NativeSelect
                  id="status"
                  name="status"
                  required
                  defaultValue={payment?.status ?? ""}
                >
                  <option value="" disabled>Select…</option>
                  <option value="Paid">Paid</option>
                  <option value="Pending">Pending</option>
                  <option value="Overdue">Overdue</option>
                </NativeSelect>
              </Field>

              <div className="mt-2 flex items-center justify-end gap-2">
                <Button asChild variant="ghost" size="lg">
                  <Link href="/payments">Cancel</Link>
                </Button>
                <Button type="submit" size="lg">
                  <IconCheck />
                  {isEdit ? "Save changes" : "Record payment"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>

      <Footer />
    </>
  );
}

/* ——————————————————————————————————————————————————————————— */

function Row({ children }: { children: React.ReactNode }) {
  return <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">{children}</div>;
}

function Field({
  label,
  htmlFor,
  children,
}: {
  label: string;
  htmlFor: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <Label htmlFor={htmlFor} className="text-sm">
        {label}
      </Label>
      {children}
    </div>
  );
}

function NativeSelect({
  className,
  ...props
}: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      {...props}
      className={[
        "h-9 w-full min-w-0 rounded-md border border-input bg-input/30 px-3 py-1 text-sm transition-colors outline-none",
        "focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50",
        "appearance-none bg-no-repeat bg-position-[right_0.6rem_center]",
        className ?? "",
      ].join(" ")}
      style={{
        backgroundImage:
          "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='10' height='6' viewBox='0 0 10 6'><path fill='none' stroke='%23867f74' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round' d='M1 1l4 4 4-4'/></svg>\")",
        paddingRight: "2rem",
      }}
    />
  );
}


