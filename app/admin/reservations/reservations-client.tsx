"use client";

import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

type Reservation = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  partySize: number;
  dateTime: string;
  notes: string | null;
  status: "PENDING" | "CONFIRMED" | "CANCELLED" | "COMPLETED";
  createdAt: string;
};

const statuses: Reservation["status"][] = ["PENDING", "CONFIRMED", "CANCELLED", "COMPLETED"];

export function ReservationsClient() {
  const [items, setItems] = useState<Reservation[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const pages = useMemo(() => Math.max(1, Math.ceil(total / pageSize)), [total, pageSize]);

  async function load() {
    setLoading(true);
    setError(null);
    const res = await fetch(
      `/api/admin/reservations?q=${encodeURIComponent(q)}&status=${encodeURIComponent(status)}&page=${page}&pageSize=${pageSize}`
    );
    const data = await res.json().catch(() => null);
    if (!res.ok) {
      setError(data?.error ?? "Failed to load reservations.");
      setLoading(false);
      return;
    }
    setItems(data.items);
    setTotal(data.total);
    setLoading(false);
  }

  useEffect(() => {
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, pageSize, q, status]);

  async function updateStatus(id: string, nextStatus: Reservation["status"]) {
    const res = await fetch(`/api/admin/reservations/${id}`, {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ status: nextStatus }),
    });
    const data = await res.json().catch(() => null);
    if (!res.ok) {
      setError(data?.error ?? "Update failed.");
      return;
    }
    await load();
  }

  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between space-y-0">
        <CardTitle>All reservations</CardTitle>
        <Button type="button" variant="outline" onClick={() => load()} aria-label="Refresh reservations">
          Refresh
        </Button>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex flex-col gap-3 md:flex-row md:items-center">
          <Input
            aria-label="Search reservations"
            placeholder="Search by name or email…"
            value={q}
            onChange={(e) => {
              setPage(1);
              setQ(e.target.value);
            }}
          />
          <select
            aria-label="Filter by status"
            className="h-10 rounded-md border border-border bg-background px-3 text-sm"
            value={status}
            onChange={(e) => {
              setPage(1);
              setStatus(e.target.value);
            }}
          >
            <option value="">All statuses</option>
            {statuses.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        {error ? <p className="text-sm text-red-600">{error}</p> : null}
        {loading ? <p className="text-sm text-muted-foreground">Loading…</p> : null}

        <div className="overflow-x-auto rounded-xl border border-border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>When</TableHead>
                <TableHead>Guest</TableHead>
                <TableHead>Party</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Notes</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((r) => (
                <TableRow key={r.id}>
                  <TableCell className="whitespace-nowrap">
                    <div className="font-medium">{new Date(r.dateTime).toLocaleString()}</div>
                    <div className="text-xs text-muted-foreground">Created {new Date(r.createdAt).toLocaleString()}</div>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">{r.name}</div>
                    <div className="text-xs text-muted-foreground">{r.email}</div>
                    {r.phone ? <div className="text-xs text-muted-foreground">{r.phone}</div> : null}
                  </TableCell>
                  <TableCell className="tabular-nums">{r.partySize}</TableCell>
                  <TableCell>
                    <select
                      aria-label="Update reservation status"
                      className="h-9 rounded-md border border-border bg-background px-2 text-sm"
                      value={r.status}
                      onChange={(e) => updateStatus(r.id, e.target.value as Reservation["status"])}
                    >
                      {statuses.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{r.notes ?? "—"}</TableCell>
                </TableRow>
              ))}
              {!items.length ? (
                <TableRow>
                  <TableCell colSpan={5} className="py-10 text-center text-muted-foreground">
                    No reservations found.
                  </TableCell>
                </TableRow>
              ) : null}
            </TableBody>
          </Table>
        </div>
      </CardContent>
      <CardFooter className="justify-between">
        <div className="text-sm text-muted-foreground">
          Page <span className="font-medium text-foreground">{page}</span> of{" "}
          <span className="font-medium text-foreground">{pages}</span> • {total} total
        </div>
        <div className="flex gap-2">
          <Button type="button" variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage((p) => p - 1)} aria-label="Previous page">
            Prev
          </Button>
          <Button type="button" variant="outline" size="sm" disabled={page >= pages} onClick={() => setPage((p) => p + 1)} aria-label="Next page">
            Next
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}


