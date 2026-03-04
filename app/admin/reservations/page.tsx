import { ReservationsClient } from "@/app/admin/reservations/reservations-client";

export default function AdminReservationsPage() {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Reservations</h1>
        <p className="mt-1 text-sm text-muted-foreground">Review and update reservation statuses.</p>
      </div>
      <ReservationsClient />
    </div>
  );
}


