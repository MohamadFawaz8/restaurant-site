import { Badge } from "@/components/ui/badge";
import { ReservationForm } from "@/app/(site)/reservations/reservation-form";

export default function ReservationsPage() {
  return (
    <div className="space-y-6">
      <div>
        <Badge className="w-fit">Reservations</Badge>
        <h1 className="mt-3 text-2xl font-semibold tracking-tight">Reserve a table</h1>
        <p className="mt-2 max-w-prose text-sm text-muted-foreground sm:text-base">
          Tell us when you’re coming — we’ll confirm your reservation as soon as possible.
        </p>
      </div>

      <ReservationForm />
    </div>
  );
}


