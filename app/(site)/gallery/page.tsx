import { YoloImage } from "@/components/yolo/yolo-image";
import { Badge } from "@/components/ui/badge";

const images = [
  { src: "/images/food/dish-1.svg", alt: "Bottle-Glazed Chicken" },
  { src: "/images/food/dish-2.svg", alt: "Smoked Glass Tomato Soup" },
  { src: "/images/food/dish-3.svg", alt: "Bubbly Citrus Salad" },
  { src: "/images/food/dish-4.svg", alt: "Charred Bottle Pepper Pasta" },
  { src: "/images/food/dish-5.svg", alt: "Glass-Sheen Cheesecake" },
  { src: "/images/food/dish-6.svg", alt: "Warm Vanilla Bubble Pudding" },
];

export default function GalleryPage() {
  return (
    <div className="space-y-6">
      <div>
        <Badge className="w-fit">Gallery</Badge>
        <h1 className="mt-3 text-2xl font-semibold tracking-tight">Glassy highlights &amp; subtle bubbles</h1>
        <p className="mt-2 text-sm text-muted-foreground sm:text-base">
          A peek into the M&amp;N vibe — warm plates, crisp greens, and bottle-inspired design details.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {images.map((img, idx) => (
          <YoloImage
            key={img.src}
            src={img.src}
            alt={img.alt}
            className="min-h-[200px]"
            boxes={
              // Decorative YOLO-style boxes (static, responsive, NOT stored in DB)
              idx === 0
                ? [{ x: 20, y: 38, w: 56, h: 40, label: "tasty" }]
                : idx === 1
                  ? [{ x: 28, y: 44, w: 52, h: 34, label: "tasty" }]
                  : idx === 2
                    ? [{ x: 24, y: 40, w: 56, h: 40, label: "tasty" }]
                    : []
            }
          />
        ))}
      </div>
    </div>
  );
}


