import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { jsonStringArray } from "@/lib/json";

export default async function MenuPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; category?: string }>;
}) {
  const sp = await searchParams;
  const q = (sp.q ?? "").trim();
  const category = (sp.category ?? "").trim();

  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
    select: { id: true, name: true, slug: true },
  });

  const items = await prisma.menuItem.findMany({
    where: {
      archived: false,
      ...(category ? { category: { slug: category } } : {}),
      ...(q
        ? {
            OR: [
              { name: { contains: q } },
              { description: { contains: q } },
            ],
          }
        : {}),
    },
    orderBy: [{ featured: "desc" }, { updatedAt: "desc" }],
    select: {
      id: true,
      name: true,
      slug: true,
      description: true,
      price: true,
      category: { select: { name: true, slug: true } },
      dietaryFlags: true,
      tags: true,
    },
    take: 60,
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Menu</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Filter by category or search by name/description.
        </p>
      </div>

      <form className="grid gap-3 rounded-2xl border border-border bg-card p-4 md:grid-cols-3" action="/menu">
        <div className="md:col-span-2">
          <label className="sr-only" htmlFor="q">
            Search menu
          </label>
          <Input id="q" name="q" defaultValue={q} placeholder="Search… (e.g. citrus, pasta)" aria-label="Search menu" />
        </div>
        <div className="flex gap-3">
          <label className="sr-only" htmlFor="category">
            Category
          </label>
          <select
            id="category"
            name="category"
            defaultValue={category}
            aria-label="Filter by category"
            className="h-10 w-full rounded-md border border-border bg-background px-3 text-sm"
          >
            <option value="">All categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.slug}>
                {c.name}
              </option>
            ))}
          </select>
          <Button type="submit" aria-label="Apply filters">
            Apply
          </Button>
        </div>
      </form>

      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <div>
          Showing <span className="font-medium text-foreground">{items.length}</span> items
        </div>
        <Button asChild variant="ghost" aria-label="Clear filters">
          <Link href="/menu">Clear</Link>
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => {
          const dietaryFlags = jsonStringArray(item.dietaryFlags);
          const tags = jsonStringArray(item.tags);
          return (
          <Link
            key={item.id}
            href={`/menu/${item.slug}`}
            className="group rounded-2xl border border-border bg-card p-5 shadow-sm transition-colors hover:bg-muted/30"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="text-base font-medium group-hover:opacity-90">{item.name}</div>
              <div className="text-sm font-semibold tabular-nums">${item.price.toFixed(2)}</div>
            </div>
            <div className="mt-1 text-xs text-muted-foreground">{item.category.name}</div>
            <div className="mt-3 line-clamp-2 text-sm text-muted-foreground">{item.description}</div>
            <div className="mt-4 flex flex-wrap gap-2">
              {dietaryFlags.slice(0, 2).map((f) => (
                <Badge key={f} variant="secondary">
                  {f}
                </Badge>
              ))}
              {tags.slice(0, 2).map((t) => (
                <Badge key={t} variant="outline">
                  {t}
                </Badge>
              ))}
            </div>
          </Link>
          );
        })}
      </div>
    </div>
  );
}


