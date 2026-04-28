import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export default function Page() {
  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <main className="relative isolate overflow-hidden">
      {/* —— Masthead —— */}
      <header className="border-b border-foreground/15">
        <div className="mx-auto flex max-w-[1300px] items-end justify-between px-6 pt-6 pb-3 sm:px-10">
          <div className="num text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
            Vol. I — No. I
            <span className="mx-2 text-foreground/30">·</span>
            {today}
          </div>
          <div className="hidden num text-[11px] uppercase tracking-[0.18em] text-muted-foreground sm:block">
            Edition · Spring Term
          </div>
        </div>

        <div className="mx-auto flex max-w-[1300px] flex-col items-center px-6 pb-6 text-center sm:px-10">
          <span className="num mb-3 text-[10px] uppercase tracking-[0.4em] text-clay">
            ✻ The Hearthstead Registry ✻
          </span>
          <h1 className="font-display text-[clamp(3.5rem,11vw,9.5rem)] leading-[0.85] tracking-[-0.04em] ink-bleed">
            Hearth<span className="font-display-italic text-clay">stead</span>
          </h1>
          <p className="num mt-3 max-w-2xl text-[11px] uppercase tracking-[0.32em] text-muted-foreground">
            A small, well-kept ledger for the everyday work of student housing
          </p>
        </div>

        <div className="rule-thick text-foreground/40" />
        <div className="mx-auto flex max-w-[1300px] items-center justify-between px-6 py-2 sm:px-10">
          <nav className="num flex gap-5 text-[11px] uppercase tracking-[0.18em]">
            <Link href="/" className="text-foreground hover:text-clay">
              Front
            </Link>
            <Link
              href="/students"
              className="text-muted-foreground hover:text-clay"
            >
              Residents
            </Link>
            <span className="text-foreground/30">Rooms</span>
            <span className="text-foreground/30">Contracts</span>
          </nav>
          <span className="num hidden text-[11px] uppercase tracking-[0.18em] text-muted-foreground sm:inline">
            Three Cents
          </span>
        </div>
        <div className="rule text-foreground/40" />
      </header>

      {/* —— Hero —— */}
      <section className="mx-auto max-w-[1300px] px-6 pt-14 sm:px-10 sm:pt-20">
        <div className="grid grid-cols-12 gap-x-8 gap-y-10">
          {/* Lede column */}
          <div className="col-span-12 lg:col-span-7">
            <span className="num rise text-[10px] uppercase tracking-[0.4em] text-clay [animation-delay:60ms]">
              ¶ Front Page · The Lede
            </span>

            <h2 className="rise mt-5 font-display text-[clamp(2.5rem,6vw,5.25rem)] leading-[0.95] tracking-[-0.03em] [animation-delay:160ms]">
              A registry for the
              <br />
              <span className="font-display-italic text-clay">
                quiet, unglamorous{" "}
              </span>
              work of keeping
              <br />a building full of people
              <br />
              warm, fed, and{" "}
              <span className="underline decoration-clay decoration-2 underline-offset-[10px]">
                accounted for
              </span>
              .
            </h2>

            <div className="rise mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 [animation-delay:280ms]">
              <p className="text-[15px] leading-relaxed text-foreground/85">
                <span className="font-display text-3xl leading-none text-clay">
                  H
                </span>
                earthstead is a modest, no-nonsense tool for the student housing
                office. It keeps a tidy record of who lives where, which forms
                were filed, and what is, frankly, leaking. Nothing more — and,
                more importantly, nothing less.
              </p>
              <p className="text-[15px] leading-relaxed text-foreground/85">
                Built for a single college course as a small CRUD exercise, it
                takes its cues from old residence-hall logbooks: ruled paper,
                ink, terracotta accents, and the conviction that a good index is
                worth a hundred dashboards.
              </p>
            </div>

            <div className="rise mt-10 flex flex-wrap items-center gap-3 [animation-delay:380ms]">
              <Button
                asChild
                size="lg"
                className="num bg-foreground text-background tracking-[0.14em] uppercase hover:bg-clay hover:text-paper"
              >
                <Link href="/students">
                  Open the Registry
                  <span aria-hidden className="ml-1">
                    →
                  </span>
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="num tracking-[0.14em] uppercase"
              >
                <Link href="/students/new">Enroll a Resident</Link>
              </Button>
              <span className="num ml-1 text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
                no login · no fluff · entirely local
              </span>
            </div>
          </div>

          {/* Decorative architectural plate */}
          <aside className="col-span-12 lg:col-span-5">
            <div className="relative">
              <div className="ink-shadow rise rounded-md border border-foreground/15 bg-card p-6 [animation-delay:240ms]">
                <div className="flex items-center justify-between">
                  <span className="num text-[10px] uppercase tracking-[0.32em] text-muted-foreground">
                    Plate I — Elevation
                  </span>
                  <span className="num text-[10px] uppercase tracking-[0.32em] text-clay">
                    fig. 01
                  </span>
                </div>

                <ResidenceHallPlate />

                <div className="rule mt-1 text-foreground/30" />
                <div className="mt-3 grid grid-cols-3 gap-4 text-[11px]">
                  <Stat label="Buildings" value="04" />
                  <Stat label="Rooms" value="148" />
                  <Stat label="Beds" value="312" />
                </div>
              </div>

              {/* corner stamp */}
              <div
                aria-hidden
                className="rise absolute -top-4 -right-3 hidden rotate-[6deg] border-2 border-clay px-3 py-1 sm:block [animation-delay:520ms]"
              >
                <span className="num block text-[9px] uppercase tracking-[0.3em] text-clay">
                  Approved
                </span>
                <span className="num block text-[9px] uppercase tracking-[0.3em] text-clay">
                  Reg’r Office
                </span>
              </div>
            </div>
          </aside>
        </div>
      </section>

      {/* —— Marquee divider —— */}
      <section
        aria-hidden
        className="mt-20 overflow-hidden border-y border-foreground/15 bg-secondary/40 py-3"
      >
        <div className="drift flex w-max whitespace-nowrap">
          <MarqueeRow />
          <MarqueeRow />
        </div>
      </section>

      {/* —— Three columns: features —— */}
      <section className="mx-auto max-w-[1300px] px-6 py-20 sm:px-10">
        <div className="mb-10 flex items-end justify-between">
          <div>
            <span className="num text-[10px] uppercase tracking-[0.4em] text-clay">
              § Sections
            </span>
            <h3 className="mt-2 font-display text-4xl tracking-[-0.02em] sm:text-5xl">
              What this little book{" "}
              <span className="font-display-italic">remembers</span>
            </h3>
          </div>
          <span className="num hidden text-[11px] uppercase tracking-[0.2em] text-muted-foreground sm:inline">
            ¶ A · B · C
          </span>
        </div>

        <div className="grid grid-cols-1 gap-px bg-foreground/15 md:grid-cols-3">
          <Feature
            tag="A"
            title="Residents"
            italic="who lives here"
            body="Names, majors, years, and the small details that make a roster a community. Add, edit, and gracefully part with each entry."
            href="/students"
            cta="Open the roster"
          />
          <Feature
            tag="B"
            title="Rooms & Buildings"
            italic="the bones of the place"
            body="Every door, capacity, and floor — modeled in Prisma, ready for the assignment ledger when you’re ready to wire it up."
          />
          <Feature
            tag="C"
            title="Contracts & Repair"
            italic="the bookkeeping"
            body="Move-in, move-out, deposits, and the occasional broken radiator. The schema is patient; build the screens at your own pace."
          />
        </div>
      </section>

      {/* —— A sample row, from the registry —— */}
      <section className="mx-auto max-w-[1300px] px-6 pb-20 sm:px-10">
        <div className="grid grid-cols-12 gap-8">
          <div className="col-span-12 md:col-span-4">
            <span className="num text-[10px] uppercase tracking-[0.4em] text-clay">
              ¶ Excerpt
            </span>
            <h3 className="mt-2 font-display text-4xl leading-[0.95] tracking-[-0.02em]">
              From the{" "}
              <span className="font-display-italic">resident ledger</span>
            </h3>
            <p className="mt-4 max-w-xs text-[15px] leading-relaxed text-foreground/80">
              A small preview of how the registry looks under the hood. Numbers
              run in tabular columns; names in a quiet sans; everything just so.
            </p>
            <Separator className="my-6 bg-foreground/15" />
            <Button
              asChild
              variant="link"
              className="num h-auto p-0 text-clay tracking-[0.14em] uppercase"
            >
              <Link href="/students">See the full registry →</Link>
            </Button>
          </div>

          <div className="col-span-12 md:col-span-8">
            <div className="overflow-hidden rounded-md border border-foreground/15 bg-card">
              <div className="grid grid-cols-12 border-b border-foreground/10 bg-secondary/40 px-5 py-2 text-[10px] uppercase tracking-[0.22em] text-muted-foreground num">
                <div className="col-span-1">№</div>
                <div className="col-span-5">Resident</div>
                <div className="col-span-3">Major</div>
                <div className="col-span-2">Year</div>
                <div className="col-span-1 text-right">Status</div>
              </div>
              <SampleRow
                n="001"
                name="Adaeze Okafor"
                major="Architecture"
                year="3"
                status="In"
              />
              <SampleRow
                n="002"
                name="Theodore Wren"
                major="Comp. Literature"
                year="2"
                status="In"
              />
              <SampleRow
                n="003"
                name="Mira Halvorsen"
                major="Marine Biology"
                year="4"
                status="Out"
              />
              <SampleRow
                n="004"
                name="Jules Castellanos"
                major="Mathematics"
                year="1"
                status="In"
              />
            </div>
            <p className="num mt-3 text-right text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
              ⌃ Sample data — not stored in the database
            </p>
          </div>
        </div>
      </section>

      {/* —— Colophon footer —— */}
      <footer className="border-t border-foreground/15">
        <div className="mx-auto grid max-w-[1300px] grid-cols-1 gap-6 px-6 py-10 sm:grid-cols-3 sm:px-10">
          <div>
            <span className="num text-[10px] uppercase tracking-[0.32em] text-clay">
              Colophon
            </span>
            <p className="mt-3 text-[13px] leading-relaxed text-foreground/80">
              Set in <em className="font-display-italic">Fraunces</em> &
              Instrument Sans, with JetBrains Mono. Built on Next.js, Prisma,
              shadcn, and a great deal of patience.
            </p>
          </div>
          <div>
            <span className="num text-[10px] uppercase tracking-[0.32em] text-clay">
              The Office
            </span>
            <p className="mt-3 text-[13px] leading-relaxed text-foreground/80">
              Hearthstead is a college coursework project. No actual residents
              were inconvenienced in the making of this CRUD app.
            </p>
          </div>
          <div>
            <span className="num text-[10px] uppercase tracking-[0.32em] text-clay">
              Index
            </span>
            <ul className="mt-3 space-y-1 text-[13px]">
              <li>
                <Link href="/students" className="hover:text-clay">
                  → The Registry of Residents
                </Link>
              </li>
              <li>
                <Link href="/students/new" className="hover:text-clay">
                  → Enroll a New Resident
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-foreground/10">
          <div className="mx-auto flex max-w-[1300px] items-center justify-between px-6 py-3 sm:px-10">
            <span className="num text-[10px] uppercase tracking-[0.32em] text-muted-foreground">
              © Hearthstead — printed on the local server
            </span>
            <span className="num text-[10px] uppercase tracking-[0.32em] text-muted-foreground">
              ✻ End of Front Page ✻
            </span>
          </div>
        </div>
      </footer>
    </main>
  );
}

/* ——————————————————————————————————————————————————————————— */

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <span className="num block text-[9px] uppercase tracking-[0.32em] text-muted-foreground">
        {label}
      </span>
      <span className="num mt-1 block text-2xl tracking-tight text-foreground">
        {value}
      </span>
    </div>
  );
}

function Feature({
  tag,
  title,
  italic,
  body,
  href,
  cta,
}: {
  tag: string;
  title: string;
  italic: string;
  body: string;
  href?: string;
  cta?: string;
}) {
  return (
    <article className="group bg-background p-8 transition-colors hover:bg-card">
      <div className="flex items-baseline justify-between">
        <span className="font-display text-5xl leading-none text-clay">
          {tag}
        </span>
        <span className="num text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
          §{tag}.01
        </span>
      </div>
      <h4 className="mt-6 font-display text-3xl tracking-[-0.02em]">
        {title}{" "}
        <span className="font-display-italic text-foreground/60">
          — {italic}
        </span>
      </h4>
      <p className="mt-3 text-[14px] leading-relaxed text-foreground/80">
        {body}
      </p>
      {href && cta && (
        <Link
          href={href}
          className="num mt-6 inline-block text-[11px] uppercase tracking-[0.22em] text-clay underline-offset-4 group-hover:underline"
        >
          {cta} →
        </Link>
      )}
    </article>
  );
}

function MarqueeRow() {
  const items = [
    "Hearthstead Registry",
    "✻",
    "Vol. I",
    "✻",
    "Spring Term",
    "✻",
    "Residents · Rooms · Contracts",
    "✻",
    "Est. MMXXVI",
    "✻",
    "A College Coursework Project",
    "✻",
    "Built on Next.js · Prisma · shadcn",
    "✻",
  ];
  return (
    <div className="flex shrink-0 items-center gap-8 px-8 num text-[12px] uppercase tracking-[0.3em] text-foreground/70">
      {items.map((it, i) => (
        <span key={i} className={it === "✻" ? "text-clay" : ""}>
          {it}
        </span>
      ))}
    </div>
  );
}

function SampleRow({
  n,
  name,
  major,
  year,
  status,
}: {
  n: string;
  name: string;
  major: string;
  year: string;
  status: "In" | "Out";
}) {
  return (
    <div className="grid grid-cols-12 items-center border-b border-foreground/5 px-5 py-3 text-[14px] last:border-0 hover:bg-secondary/40">
      <div className="num col-span-1 text-muted-foreground">{n}</div>
      <div className="col-span-5 font-medium tracking-tight">{name}</div>
      <div className="col-span-3 text-foreground/80">{major}</div>
      <div className="num col-span-2 text-foreground/80">Yr · {year}</div>
      <div className="col-span-1 text-right">
        <span
          className={`num text-[10px] uppercase tracking-[0.22em] ${
            status === "In" ? "text-moss" : "text-muted-foreground"
          }`}
        >
          {status === "In" ? "● In" : "○ Out"}
        </span>
      </div>
    </div>
  );
}

function ResidenceHallPlate() {
  return (
    <svg
      viewBox="0 0 320 220"
      className="mt-4 w-full text-foreground"
      role="img"
      aria-label="Architectural elevation of a residence hall"
    >
      {/* ground line */}
      <line
        x1="0"
        y1="200"
        x2="320"
        y2="200"
        stroke="currentColor"
        strokeWidth="1"
      />
      {/* hatching ground */}
      {Array.from({ length: 16 }).map((_, i) => (
        <line
          key={i}
          x1={i * 22 - 10}
          y1="220"
          x2={i * 22 + 10}
          y2="200"
          stroke="currentColor"
          strokeWidth="0.6"
          opacity="0.4"
        />
      ))}

      {/* main building */}
      <rect
        x="40"
        y="60"
        width="240"
        height="140"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.2"
      />
      {/* roof line */}
      <polyline
        points="30,70 160,28 290,70"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.2"
      />
      {/* chimney */}
      <rect
        x="220"
        y="40"
        width="14"
        height="28"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
      />
      {/* a curl of smoke (clay accent) */}
      <path
        d="M227 38 q -8 -10 4 -16 q 12 -6 0 -16"
        fill="none"
        stroke="var(--clay)"
        strokeWidth="1.4"
        strokeLinecap="round"
      />

      {/* windows grid */}
      {Array.from({ length: 4 }).map((_, row) =>
        Array.from({ length: 7 }).map((__, col) => {
          const x = 56 + col * 32;
          const y = 76 + row * 30;
          // light a few windows in clay
          const lit = (row + col) % 5 === 0;
          return (
            <rect
              key={`${row}-${col}`}
              x={x}
              y={y}
              width="18"
              height="20"
              fill={lit ? "var(--clay)" : "none"}
              fillOpacity={lit ? 0.85 : 0}
              stroke="currentColor"
              strokeWidth="0.8"
            />
          );
        })
      )}

      {/* door */}
      <rect
        x="148"
        y="160"
        width="24"
        height="40"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.2"
      />
      <line
        x1="160"
        y1="160"
        x2="160"
        y2="200"
        stroke="currentColor"
        strokeWidth="0.6"
      />

      {/* steps */}
      <line
        x1="138"
        y1="200"
        x2="182"
        y2="200"
        stroke="currentColor"
        strokeWidth="1"
      />
      <line
        x1="142"
        y1="205"
        x2="178"
        y2="205"
        stroke="currentColor"
        strokeWidth="1"
        opacity="0.6"
      />

      {/* tree (left) */}
      <line
        x1="20"
        y1="200"
        x2="20"
        y2="170"
        stroke="currentColor"
        strokeWidth="1"
      />
      <circle
        cx="20"
        cy="160"
        r="14"
        fill="none"
        stroke="currentColor"
        strokeWidth="0.8"
      />

      {/* tree (right) */}
      <line
        x1="304"
        y1="200"
        x2="304"
        y2="178"
        stroke="currentColor"
        strokeWidth="1"
      />
      <circle
        cx="304"
        cy="170"
        r="11"
        fill="none"
        stroke="currentColor"
        strokeWidth="0.8"
      />

      {/* tiny annotation */}
      <text
        x="40"
        y="56"
        fontSize="7"
        fill="currentColor"
        opacity="0.55"
        fontFamily="var(--font-mono)"
      >
        — west wing —
      </text>
    </svg>
  );
}
