export function Footer() {
  return (
    <footer className="mt-auto border-t border-border/70">
      <div className="mx-auto flex w-full max-w-5xl flex-col items-start justify-between gap-2 px-6 py-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:px-8">
        <span>
          Hearthstead — a small{" "}
          <span className="font-serif italic">CRUD</span> exercise for a college
          course.
        </span>
        <span className="num">Next.js · Prisma · shadcn</span>
      </div>
    </footer>
  );
}
