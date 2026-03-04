import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export default async function AdminHomePage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  const role = session.user.role;
  if (role !== "ADMIN" && role !== "STAFF") redirect("/");

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-10">
      <h1 className="text-2xl font-semibold tracking-tight">Admin Dashboard</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Signed in as <span className="font-medium text-foreground">{session.user.email}</span> ({role})
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[
          { href: "/admin/menu-items", title: "Menu items", desc: "Create, edit, feature, archive." },
          { href: "/admin/categories", title: "Categories", desc: "Organize the menu." },
          { href: "/admin/reservations", title: "Reservations", desc: "Confirm and manage statuses." },
          { href: "/admin/contacts", title: "Contact messages", desc: "Respond and archive." },
          { href: "/admin/users", title: "Users", desc: "Manage roles (ADMIN only)." },
        ].map((c) => (
          <Link
            key={c.href}
            href={c.href}
            className="rounded-xl border border-border bg-card p-5 shadow-sm transition-colors hover:bg-muted/40"
          >
            <div className="text-base font-medium">{c.title}</div>
            <div className="mt-1 text-sm text-muted-foreground">{c.desc}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}


