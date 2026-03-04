import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Badge } from "@/components/ui/badge";
import { YoloImage } from "@/components/yolo/yolo-image";
import { jsonStringArray } from "@/lib/json";

export default async function DishDetailsPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const item = await prisma.menuItem.findUnique({
    where: { slug },
    select: {
      name: true,
      slug: true,
      description: true,
      price: true,
      images: true,
      tags: true,
      dietaryFlags: true,
      allergens: true,
      availability: true,
      archived: true,
      category: { select: { name: true, slug: true } },
    },
  });

  if (!item || item.archived) return notFound();
  const images = jsonStringArray(item.images);
  const dietaryFlags = jsonStringArray(item.dietaryFlags);
  const tags = jsonStringArray(item.tags);
  const allergens = jsonStringArray(item.allergens);

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <div>
        <YoloImage
          src={images.at(0) ?? "/images/food/dish-1.svg"}
          alt={item.name}
          className="min-h-[280px]"
          boxes={[]}
        />
      </div>

      <div className="space-y-4">
        <div>
          <div className="text-xs text-muted-foreground">{item.category.name}</div>
          <h1 className="mt-1 text-3xl font-semibold tracking-tight">{item.name}</h1>
          <div className="mt-2 text-lg font-semibold tabular-nums">${item.price.toFixed(2)}</div>
        </div>

        <p className="text-sm text-muted-foreground sm:text-base">{item.description}</p>

        <div className="flex flex-wrap gap-2">
          {dietaryFlags.map((f) => (
            <Badge key={f} variant="secondary">
              {f}
            </Badge>
          ))}
          {tags.map((t) => (
            <Badge key={t} variant="outline">
              {t}
            </Badge>
          ))}
        </div>

        {allergens.length ? (
          <div className="rounded-xl border border-border bg-card p-4">
            <div className="text-sm font-medium">Allergens</div>
            <p className="mt-1 text-sm text-muted-foreground">{allergens.join(", ")}</p>
          </div>
        ) : null}

        <div className="rounded-xl border border-border bg-card p-4">
          <div className="text-sm font-medium">Availability</div>
          <p className="mt-1 text-sm text-muted-foreground">
            {item.availability ? "Available today." : "Currently unavailable."}
          </p>
        </div>
      </div>
    </div>
  );
}


