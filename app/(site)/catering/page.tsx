import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function CateringPage() {
  return (
    <div className="space-y-8">
      <div>
        <Badge className="w-fit">Catering &amp; Events</Badge>
        <h1 className="mt-3 text-2xl font-semibold tracking-tight">Bring the bottle vibe to your event</h1>
        <p className="mt-2 max-w-prose text-sm text-muted-foreground sm:text-base">
          Corporate lunches, birthdays, engagement dinners — we handle menus and service with warm modern polish.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {[
          { title: "Custom menus", desc: "Dietary-friendly menus with clear allergens and flags." },
          { title: "On-site or drop-off", desc: "Flexible packages for any venue size." },
          { title: "Staffed events", desc: "Let our team run the room while you enjoy." },
        ].map((c) => (
          <div key={c.title} className="rounded-2xl border border-border bg-card p-5 shadow-sm">
            <div className="text-base font-medium">{c.title}</div>
            <p className="mt-2 text-sm text-muted-foreground">{c.desc}</p>
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
        <div className="text-lg font-semibold tracking-tight">Request catering</div>
        <p className="mt-2 text-sm text-muted-foreground">
          Send us the date, guest count, and location — we’ll reply with options.
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <Button asChild aria-label="Contact catering team">
            <Link href="/contact">Contact us</Link>
          </Button>
          <Button asChild variant="outline" aria-label="View menu">
            <Link href="/menu">View menu</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}


