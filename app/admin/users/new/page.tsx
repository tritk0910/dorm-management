import Link from "next/link";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import { IconArrowLeft, IconCheck } from "@tabler/icons-react";

import prisma from "../../../../lib/db";
import { createUser } from "@/app/lib/actions/user";
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

export const dynamic = "force-dynamic";

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

export default async function Page() {
  const [students, staff] = await Promise.all([
    prisma.student.findMany({ orderBy: { lastName: "asc" } }),
    prisma.staff.findMany({ orderBy: { name: "asc" } }),
  ]);

  return (
    <>
      <Nav />
      <main className="mx-auto w-full max-w-xl px-6 py-12 sm:px-8">
        <Link
          href="/admin/users"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <IconArrowLeft className="size-3.5" />
          Back to users
        </Link>

        <h1 className="mt-3 text-3xl tracking-tight sm:text-4xl">Add a user</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Create a login account and optionally link it to a student or staff record.
        </p>

        <Card className="mt-8 ring-foreground/8">
          <CardHeader className="border-b border-border/70 pb-4">
            <CardTitle className="text-base">Account details</CardTitle>
            <CardDescription>Username, password, and role are required.</CardDescription>
          </CardHeader>
          <CardContent>
            <form action={createUser} className="flex flex-col gap-5">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="username">Username</Label>
                  <Input id="username" name="username" required placeholder="jane.doe" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    required
                    minLength={6}
                    placeholder="min 6 characters"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="role">Role</Label>
                <NativeSelect id="role" name="role" required defaultValue="student">
                  <option value="student">Student</option>
                  <option value="staff">Staff</option>
                  <option value="security">Security</option>
                  <option value="admin">Admin</option>
                </NativeSelect>
              </div>

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="studentId">Link to student (optional)</Label>
                <NativeSelect id="studentId" name="studentId" defaultValue="">
                  <option value="">— None —</option>
                  {students.map((s) => (
                    <option key={s.studentId} value={s.studentId}>
                      {s.firstName} {s.lastName} (#{s.studentId})
                    </option>
                  ))}
                </NativeSelect>
              </div>

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="staffId">Link to staff (optional)</Label>
                <NativeSelect id="staffId" name="staffId" defaultValue="">
                  <option value="">— None —</option>
                  {staff.map((s) => (
                    <option key={s.staffId} value={s.staffId}>
                      {s.name} — {s.role} (#{s.staffId})
                    </option>
                  ))}
                </NativeSelect>
              </div>

              <div className="mt-2 flex items-center justify-end gap-2">
                <Button asChild variant="ghost" size="lg">
                  <Link href="/admin/users">Cancel</Link>
                </Button>
                <Button type="submit" size="lg">
                  <IconCheck />
                  Create user
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
