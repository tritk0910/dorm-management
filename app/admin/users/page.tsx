import Link from "next/link";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import {
  IconArrowLeft,
  IconPlus,
  IconTrash,
  IconUserShield,
} from "@tabler/icons-react";

import prisma from "../../../lib/db";
import { deleteUser } from "@/app/lib/actions/user";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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

const ROLE_COLOR: Record<string, string> = {
  admin: "bg-purple-500/10 text-purple-700 dark:text-purple-300",
  staff: "bg-blue-500/10 text-blue-700 dark:text-blue-300",
  security: "bg-red-500/10 text-red-700 dark:text-red-300",
  student: "bg-green-500/10 text-green-700 dark:text-green-300",
};

export default async function Page() {
  const users = await prisma.user.findMany({
    orderBy: { username: "asc" },
    include: { student: true, staff: true },
  });

  return (
    <>
      <Nav />
      <main className="mx-auto w-full max-w-5xl px-6 py-12 sm:px-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <Link
              href="/admin"
              className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
            >
              <IconArrowLeft className="size-3.5" />
              Admin dashboard
            </Link>
            <h1 className="mt-2 text-3xl tracking-tight sm:text-4xl">Users</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Login accounts for all roles.
            </p>
          </div>
          <Button asChild size="lg">
            <Link href="/admin/users/new">
              <IconPlus />
              Add user
            </Link>
          </Button>
        </div>

        <Card className="mt-8 ring-foreground/8">
          <CardHeader className="border-b border-border/70 pb-4">
            <CardTitle className="text-base">All users</CardTitle>
            <CardDescription>
              {users.length === 0
                ? "No users yet."
                : `${users.length} ${users.length === 1 ? "user" : "users"}.`}
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            {users.length === 0 ? (
              <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
                <div className="grid size-12 place-items-center rounded-2xl bg-warm/12 text-warm">
                  <IconUserShield className="size-6" />
                </div>
                <h3 className="mt-4 text-base">No users yet</h3>
                <Button asChild className="mt-5">
                  <Link href="/admin/users/new">
                    <IconPlus />
                    Add the first user
                  </Link>
                </Button>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead>Username</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead className="hidden sm:table-cell">Linked to</TableHead>
                    <TableHead className="text-right">&nbsp;</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((u) => (
                    <TableRow key={u.userId} className="group">
                      <TableCell>
                        <div className="font-medium">{u.username}</div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" className={ROLE_COLOR[u.role] ?? ""}>
                          {u.role}
                        </Badge>
                      </TableCell>
                      <TableCell className="hidden text-muted-foreground sm:table-cell">
                        {u.student
                          ? `${u.student.firstName} ${u.student.lastName} (student)`
                          : u.staff
                            ? `${u.staff.name} (staff)`
                            : "—"}
                      </TableCell>
                      <TableCell className="text-right">
                        <form
                          action={async () => {
                            "use server";
                            await deleteUser(u.userId);
                          }}
                        >
                          <Button
                            type="submit"
                            size="icon-sm"
                            variant="ghost"
                            title="Delete"
                            className="opacity-70 hover:bg-destructive/10 hover:text-destructive group-hover:opacity-100"
                          >
                            <IconTrash />
                          </Button>
                        </form>
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
