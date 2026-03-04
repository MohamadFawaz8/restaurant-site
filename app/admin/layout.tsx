import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { AuthActions } from "@/components/site/auth-actions";

const nav = [
  { href: "/admin", label: "Overview" },
  { href: "/admin/menu-items", label: "Menu items" },
  { href: "/admin/categories", label: "Categories" },
  { href: "/admin/reservations", label: "Reservations" },
  { href: "/admin/contacts", label: "Contacts" },
  { href: "/admin/users", label: "Users" },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");
  if (session.user.role !== "ADMIN" && session.user.role !== "STAFF") redirect("/");

  return (
    <div className="min-h-dvh bg-background text-foreground">
      <header className="sticky top-0 z-40 border-b border-border bg-background/70 backdrop-blur">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-4 py-3">
          <Link href="/" className="text-sm font-semibold tracking-tight">
            M&amp;N <span className="text-muted-foreground">Admin</span>
          </Link>
          <AuthActions />
        </div>
      </header>

      <div className="mx-auto grid w-full max-w-6xl gap-6 px-4 py-8 lg:grid-cols-[240px_1fr]">
        <aside className="rounded-2xl border border-border bg-card p-4 shadow-sm">
          <div className="mb-3 text-xs font-semibold text-muted-foreground">Dashboard</div>
          <nav className="space-y-1" aria-label="Admin navigation">
            {nav.map((n) => (
              <Link
                key={n.href}
                href={n.href}
                className="block rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-muted/50 hover:text-foreground"
              >
                {n.label}
              </Link>
            ))}
          </nav>
          <div className="mt-4 rounded-xl border border-border bg-muted/30 p-3 text-xs text-muted-foreground">
            Signed in as <span className="font-medium text-foreground">{session.user.email}</span>
          </div>
        </aside>

        <div>{children}</div>
      </div>
    </div>
  );
}


