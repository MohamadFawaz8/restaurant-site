import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { YoloImage } from "@/components/yolo/yolo-image";
import { jsonStringArray } from "@/lib/json";

export default async function HomePage() {
  const featured = await prisma.menuItem.findMany({
    where: { featured: true, archived: false, availability: true },
    orderBy: { updatedAt: "desc" },
    take: 3,
    select: {
      id: true,
      name: true,
      slug: true,
      description: true,
      price: true,
      images: true,
      tags: true,
      dietaryFlags: true,
    },
  });

  return (
    <div className="space-y-10">
      <section className="relative overflow-hidden rounded-2xl border border-border bg-card p-8 shadow-sm">
        <div className="absolute inset-0 bg-[radial-gradient(900px_circle_at_10%_10%,rgba(125,211,252,.22),transparent_35%),radial-gradient(700px_circle_at_90%_30%,rgba(251,146,60,.16),transparent_40%)]" />
        <div className="relative grid gap-8 lg:grid-cols-2">
          <div className="space-y-4">
            <Badge className="w-fit">Bottle-themed modern dining</Badge>
            <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              M&amp;N (Mohamad &amp; Noor) — warm dishes with glassy highlights
            </h1>
            <p className="max-w-prose text-sm text-muted-foreground sm:text-base">
              Explore a menu designed like a bottle: clean lines, subtle bubbles, and a warm finish.
              Reserve a table or plan your next event with our catering team.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button asChild aria-label="Explore menu">
                <Link href="/menu">Explore menu</Link>
              </Button>
              <Button asChild variant="outline" aria-label="Make a reservation">
                <Link href="/reservations">Reserve a table</Link>
              </Button>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="sm:row-span-2">
              <YoloImage
                src={jsonStringArray(featured[0]?.images ?? []).at(0) ?? "/images/food/dish-1.svg"}
                alt={featured[0]?.name ?? "Featured dish"}
                className="h-full min-h-[220px]"
                boxes={[{ x: 18, y: 35, w: 56, h: 40, label: "tasty" }]}
                priority
              />
            </div>
            <YoloImage
              src={jsonStringArray(featured[1]?.images ?? []).at(0) ?? "/images/food/dish-2.svg"}
              alt={featured[1]?.name ?? "Featured dish"}
              className="min-h-[160px]"
              boxes={[{ x: 30, y: 42, w: 50, h: 36, label: "tasty" }]}
            />
            <YoloImage
              src={jsonStringArray(featured[2]?.images ?? []).at(0) ?? "/images/food/dish-3.svg"}
              alt={featured[2]?.name ?? "Featured dish"}
              className="min-h-[160px]"
              boxes={[{ x: 26, y: 40, w: 54, h: 40, label: "tasty" }]}
            />
          </div>
        </div>
      </section>

      <section>
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold tracking-tight">Featured today</h2>
            <p className="mt-1 text-sm text-muted-foreground">Handpicked plates with a warm, modern finish.</p>
          </div>
          <Button asChild variant="secondary" aria-label="See full menu">
            <Link href="/menu">Full menu</Link>
          </Button>
        </div>

        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((item) => {
            const images = jsonStringArray(item.images);
            const dietaryFlags = jsonStringArray(item.dietaryFlags);
            return (
            <Link
              key={item.id}
              href={`/menu/${item.slug}`}
              className="group rounded-2xl border border-border bg-card shadow-sm transition-colors hover:bg-muted/30"
            >
              <div className="p-4">
                <div className="text-base font-medium group-hover:opacity-90">{item.name}</div>
                <div className="mt-1 line-clamp-2 text-sm text-muted-foreground">{item.description}</div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {dietaryFlags.slice(0, 2).map((f) => (
                    <Badge key={f} variant="secondary">
                      {f}
                    </Badge>
                  ))}
                </div>
              </div>
            </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}


