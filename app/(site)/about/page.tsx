import { Badge } from "@/components/ui/badge";

export default function AboutPage() {
  return (
    <div className="space-y-8">
      <div>
        <Badge className="w-fit">Our story</Badge>
        <h1 className="mt-3 text-2xl font-semibold tracking-tight">About M&amp;N</h1>
        <p className="mt-2 max-w-prose text-sm text-muted-foreground sm:text-base">
          M&amp;N (Mohamad &amp; Noor) is built around a simple idea: food should feel as clean and
          intentional as a well-designed bottle. Glassy highlights, subtle bubbles, and a warm modern
          dining vibe — from the first sip to the last bite.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {[
          {
            title: "Bottle-inspired design",
            desc: "Curves, clarity, and a hint of shimmer in every detail.",
          },
          {
            title: "Warm modern dining",
            desc: "Comfort-forward flavors with a contemporary finish.",
          },
          {
            title: "Made for gatherings",
            desc: "From date nights to large events — we love hosting.",
          },
        ].map((c) => (
          <div key={c.title} className="rounded-2xl border border-border bg-card p-5 shadow-sm">
            <div className="text-base font-medium">{c.title}</div>
            <p className="mt-2 text-sm text-muted-foreground">{c.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}


