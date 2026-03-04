import { Badge } from "@/components/ui/badge";

export default function LocationsPage() {
  return (
    <div className="space-y-6">
      <div>
        <Badge className="w-fit">Locations &amp; Hours</Badge>
        <h1 className="mt-3 text-2xl font-semibold tracking-tight">Find M&amp;N</h1>
        <p className="mt-2 max-w-prose text-sm text-muted-foreground sm:text-base">
          Sample locations for the M&amp;N chain. Update these to match your real branches.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {[
          {
            name: "M&N Downtown",
            address: "123 Glass St, City Center",
            hours: ["Mon–Thu: 11:00–22:00", "Fri–Sat: 11:00–23:30", "Sun: 11:00–21:00"],
          },
          {
            name: "M&N Riverside",
            address: "88 Bubble Ave, River District",
            hours: ["Mon–Thu: 12:00–22:00", "Fri–Sat: 12:00–23:30", "Sun: 12:00–21:00"],
          },
        ].map((l) => (
          <div key={l.name} className="rounded-2xl border border-border bg-card p-5 shadow-sm">
            <div className="text-base font-medium">{l.name}</div>
            <div className="mt-1 text-sm text-muted-foreground">{l.address}</div>
            <div className="mt-4">
              <div className="text-sm font-medium">Hours</div>
              <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                {l.hours.map((h) => (
                  <li key={h}>{h}</li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}


