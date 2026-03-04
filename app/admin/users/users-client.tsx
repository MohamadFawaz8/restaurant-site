"use client";

import { useEffect, useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

type UserRow = {
  id: string;
  email: string | null;
  name: string | null;
  role: "USER" | "STAFF" | "ADMIN";
  createdAt: string;
};

const roles: UserRow["role"][] = ["USER", "STAFF", "ADMIN"];

export function UsersClient() {
  const { data: session } = useSession();
  const canEdit = session?.user?.role === "ADMIN";

  const [items, setItems] = useState<UserRow[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const pages = useMemo(() => Math.max(1, Math.ceil(total / pageSize)), [total, pageSize]);

  async function load() {
    setLoading(true);
    setError(null);
    const res = await fetch(`/api/admin/users?q=${encodeURIComponent(q)}&page=${page}&pageSize=${pageSize}`);
    const data = await res.json().catch(() => null);
    if (!res.ok) {
      setError(data?.error ?? "Failed to load users.");
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
  }, [page, pageSize, q]);

  async function updateRole(id: string, role: UserRow["role"]) {
    if (!canEdit) return;
    const res = await fetch(`/api/admin/users/${id}`, {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ role }),
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
        <CardTitle>All users</CardTitle>
        <Button type="button" variant="outline" onClick={() => load()} aria-label="Refresh users">
          Refresh
        </Button>
      </CardHeader>
      <CardContent className="space-y-3">
        <Input
          aria-label="Search users"
          placeholder="Search by email or name…"
          value={q}
          onChange={(e) => {
            setPage(1);
            setQ(e.target.value);
          }}
        />

        {error ? <p className="text-sm text-red-600">{error}</p> : null}
        {loading ? <p className="text-sm text-muted-foreground">Loading…</p> : null}

        <div className="overflow-x-auto rounded-xl border border-border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Created</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Role</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((u) => (
                <TableRow key={u.id}>
                  <TableCell className="whitespace-nowrap text-muted-foreground">
                    {new Date(u.createdAt).toLocaleString()}
                  </TableCell>
                  <TableCell className="font-medium">{u.email ?? "—"}</TableCell>
                  <TableCell className="text-muted-foreground">{u.name ?? "—"}</TableCell>
                  <TableCell>
                    <select
                      aria-label="User role"
                      className="h-9 rounded-md border border-border bg-background px-2 text-sm disabled:opacity-50"
                      value={u.role}
                      onChange={(e) => updateRole(u.id, e.target.value as UserRow["role"])}
                      disabled={!canEdit}
                    >
                      {roles.map((r) => (
                        <option key={r} value={r}>
                          {r}
                        </option>
                      ))}
                    </select>
                    {!canEdit ? (
                      <div className="mt-1 text-xs text-muted-foreground">ADMIN-only</div>
                    ) : null}
                  </TableCell>
                </TableRow>
              ))}
              {!items.length ? (
                <TableRow>
                  <TableCell colSpan={4} className="py-10 text-center text-muted-foreground">
                    No users found.
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


