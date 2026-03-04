import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { DarkModeToggle } from "@/components/site/theme-toggle";
import { AuthActions } from "@/components/site/auth-actions";

const nav = [
  { href: "/menu", label: "Menu" },
  { href: "/about", label: "About" },
  { href: "/gallery", label: "Gallery" },
  { href: "/locations", label: "Locations & Hours" },
  { href: "/reservations", label: "Reservations" },
  { href: "/contact", label: "Contact" },
  { href: "/catering", label: "Catering/Events" },
];

export async function SiteHeader() {
  const session = await getServerSession(authOptions);
  const role = session?.user?.role;

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/70 backdrop-blur supports-[backdrop-filter]:bg-background/50">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-4 py-3">
        <Link href="/" className="flex items-center gap-2" aria-label="M&N Home">
          <div className="h-9 w-9 rounded-xl border border-border bg-muted/60" aria-hidden />
          <div className="leading-tight">
            <div className="text-sm font-semibold tracking-tight">M&amp;N</div>
            <div className="text-xs text-muted-foreground">Mohamad &amp; Noor</div>
          </div>
        </Link>

        <nav className="hidden items-center gap-5 lg:flex" aria-label="Primary navigation">
          {nav.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              {n.label}
            </Link>
          ))}
          {role === "ADMIN" || role === "STAFF" ? (
            <Link href="/admin" className="text-sm font-medium hover:opacity-80">
              Admin
            </Link>
          ) : null}
        </nav>

        <div className="flex items-center gap-2">
          <DarkModeToggle />
          <AuthActions />
        </div>
      </div>
    </header>
  );
}


