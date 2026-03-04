import Image from "next/image";
import { cn } from "@/lib/utils";

export type YoloBox = {
  x: number; // 0..100
  y: number; // 0..100
  w: number; // 0..100
  h: number; // 0..100
  label?: string;
};

export function YoloImage({
  src,
  alt,
  className,
  boxes = [],
  priority,
}: {
  src: string;
  alt: string;
  className?: string;
  boxes?: YoloBox[];
  priority?: boolean;
}) {
  return (
    <div className={cn("relative overflow-hidden rounded-xl border border-border bg-muted/40", className)}>
      <Image
        src={src}
        alt={alt}
        width={1200}
        height={800}
        className="h-full w-full object-cover"
        priority={priority}
      />

      {boxes.map((b, i) => (
        <div
          key={i}
          className="absolute rounded-sm border border-emerald-300/90 shadow-[0_0_0_1px_rgba(0,0,0,.25)]"
          style={{
            left: `${b.x}%`,
            top: `${b.y}%`,
            width: `${b.w}%`,
            height: `${b.h}%`,
          }}
          aria-hidden
        >
          <div className="absolute -left-px -top-6 rounded-sm bg-emerald-300 px-1.5 py-0.5 text-[10px] font-semibold tracking-tight text-emerald-950">
            {b.label ?? "tasty"}
          </div>
        </div>
      ))}
    </div>
  );
}


