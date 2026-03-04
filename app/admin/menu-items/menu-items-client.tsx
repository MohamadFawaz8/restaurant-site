"use client";

import { useEffect, useMemo, useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { slugify } from "@/lib/slugify";
import { jsonStringArray } from "@/lib/json";

type Category = { id: string; name: string; slug: string };
type MenuItem = {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: { toFixed: (n: number) => string };
  categoryId: string;
  category: Category;
  images: any;
  tags: any;
  dietaryFlags: any;
  allergens: any;
  availability: boolean;
  featured: boolean;
  archived: boolean;
  createdAt: string;
  updatedAt: string;
};

const formSchema = z.object({
  name: z.string().min(2),
  slug: z.string().optional(),
  description: z.string().min(10),
  price: z.number().min(0),
  categoryId: z.string().min(1),
  images: z.string().min(1),
  tags: z.string().optional(),
  dietaryFlags: z.string().optional(),
  allergens: z.string().optional(),
  availability: z.boolean(),
  featured: z.boolean(),
});

function splitCSV(v: string | undefined) {
  return (v ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

export function MenuItemsClient() {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [q, setQ] = useState("");
  const [archived, setArchived] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const pages = useMemo(() => Math.max(1, Math.ceil(total / pageSize)), [total, pageSize]);

  async function loadCategories() {
    const res = await fetch(`/api/admin/categories?page=1&pageSize=50&q=`);
    const data = await res.json().catch(() => null);
    if (res.ok) setCategories(data.items);
  }

  async function load() {
    setLoading(true);
    setError(null);
    const res = await fetch(
      `/api/admin/menu-items?q=${encodeURIComponent(q)}&page=${page}&pageSize=${pageSize}&archived=${archived}`
    );
    const data = await res.json().catch(() => null);
    if (!res.ok) {
      setError(data?.error ?? "Failed to load menu items.");
      setLoading(false);
      return;
    }
    setItems(data.items);
    setTotal(data.total);
    setLoading(false);
  }

  useEffect(() => {
    void loadCategories();
  }, []);

  useEffect(() => {
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, pageSize, q, archived]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      slug: "",
      description: "",
      price: 0,
      categoryId: "",
      images: "/images/food/dish-1.svg",
      tags: "",
      dietaryFlags: "",
      allergens: "",
      availability: true,
      featured: false,
    },
  });

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<MenuItem | null>(null);

  function openCreate() {
    setEditing(null);
    form.reset({
      name: "",
      slug: "",
      description: "",
      price: 0,
      categoryId: categories[0]?.id ?? "",
      images: "/images/food/dish-1.svg",
      tags: "",
      dietaryFlags: "",
      allergens: "",
      availability: true,
      featured: false,
    });
    setOpen(true);
  }

  function openEdit(item: MenuItem) {
    setEditing(item);
    const images = jsonStringArray(item.images);
    const tags = jsonStringArray(item.tags);
    const dietaryFlags = jsonStringArray(item.dietaryFlags);
    const allergens = jsonStringArray(item.allergens);
    form.reset({
      name: item.name,
      slug: item.slug,
      description: item.description,
      price: Number(item.price.toFixed(2)),
      categoryId: item.categoryId,
      images: images.join(", "),
      tags: tags.join(", "),
      dietaryFlags: dietaryFlags.join(", "),
      allergens: allergens.join(", "),
      availability: item.availability,
      featured: item.featured,
    });
    setOpen(true);
  }

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const payload = {
      name: values.name,
      slug: slugify(values.slug?.trim() || values.name),
      description: values.description,
      price: values.price,
      categoryId: values.categoryId,
      images: splitCSV(values.images),
      tags: splitCSV(values.tags),
      dietaryFlags: splitCSV(values.dietaryFlags),
      allergens: splitCSV(values.allergens),
      availability: values.availability,
      featured: values.featured,
    };

    const res = await fetch(editing ? `/api/admin/menu-items/${editing.id}` : "/api/admin/menu-items", {
      method: editing ? "PATCH" : "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await res.json().catch(() => null);
    if (!res.ok) {
      setError(data?.error ?? "Save failed.");
      return;
    }
    setOpen(false);
    await load();
  }

  async function onArchive(id: string) {
    if (!confirm("Archive this menu item? (soft delete)")) return;
    const res = await fetch(`/api/admin/menu-items/${id}`, { method: "DELETE" });
    const data = await res.json().catch(() => null);
    if (!res.ok) {
      setError(data?.error ?? "Archive failed.");
      return;
    }
    await load();
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="flex-row items-center justify-between space-y-0">
          <CardTitle>All menu items</CardTitle>
          <Button type="button" onClick={openCreate} aria-label="Create menu item">
            New item
          </Button>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex flex-col gap-3 md:flex-row md:items-center">
            <Input
              aria-label="Search menu items"
              placeholder="Search…"
              value={q}
              onChange={(e) => {
                setPage(1);
                setQ(e.target.value);
              }}
            />
            <div className="flex items-center gap-2">
              <label className="flex items-center gap-2 text-sm text-muted-foreground">
                <input
                  aria-label="Show archived menu items"
                  type="checkbox"
                  checked={archived}
                  onChange={(e) => {
                    setPage(1);
                    setArchived(e.target.checked);
                  }}
                />
                Show archived
              </label>
              <Button type="button" variant="outline" onClick={() => load()} aria-label="Refresh menu items">
                Refresh
              </Button>
            </div>
          </div>

          {error ? <p className="text-sm text-red-600">{error}</p> : null}
          {loading ? <p className="text-sm text-muted-foreground">Loading…</p> : null}

          <div className="overflow-x-auto rounded-xl border border-border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Flags</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((m) => (
                  <TableRow key={m.id}>
                    <TableCell className="font-medium">
                      <div>{m.name}</div>
                      <div className="text-xs text-muted-foreground">{m.slug}</div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{m.category?.name ?? "—"}</TableCell>
                    <TableCell className="tabular-nums">${m.price.toFixed(2)}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {m.featured ? "featured " : ""}
                      {m.availability ? "available" : "unavailable"}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button type="button" size="sm" variant="outline" onClick={() => openEdit(m)} aria-label="Edit menu item">
                          Edit
                        </Button>
                        {!m.archived ? (
                          <Button type="button" size="sm" variant="destructive" onClick={() => onArchive(m.id)} aria-label="Archive menu item">
                            Archive
                          </Button>
                        ) : null}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {!items.length ? (
                  <TableRow>
                    <TableCell colSpan={5} className="py-10 text-center text-muted-foreground">
                      No menu items found.
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

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <span />
        </DialogTrigger>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editing ? "Edit menu item" : "New menu item"}</DialogTitle>
            <DialogDescription>Menu items power the customer menu and dish details pages.</DialogDescription>
          </DialogHeader>

          <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" aria-label="Menu item name" {...form.register("name")} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="slug">Slug</Label>
              <Input id="slug" aria-label="Menu item slug" placeholder="auto-from-name" {...form.register("slug")} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="price">Price</Label>
              <Input
                id="price"
                aria-label="Price"
                type="number"
                step="0.01"
                min={0}
                {...form.register("price", { valueAsNumber: true })}
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="categoryId">Category</Label>
              <select
                id="categoryId"
                aria-label="Category"
                className="h-10 w-full rounded-md border border-border bg-background px-3 text-sm"
                {...form.register("categoryId")}
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" aria-label="Description" {...form.register("description")} />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="images">Images (comma-separated URLs/paths)</Label>
              <Input id="images" aria-label="Images" {...form.register("images")} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tags">Tags (comma)</Label>
              <Input id="tags" aria-label="Tags" {...form.register("tags")} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dietaryFlags">Dietary flags (comma)</Label>
              <Input id="dietaryFlags" aria-label="Dietary flags" {...form.register("dietaryFlags")} />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="allergens">Allergens (comma)</Label>
              <Input id="allergens" aria-label="Allergens" {...form.register("allergens")} />
            </div>
            <div className="flex items-center gap-4 md:col-span-2">
              <label className="flex items-center gap-2 text-sm text-muted-foreground">
                <input aria-label="Available" type="checkbox" {...form.register("availability")} />
                Available
              </label>
              <label className="flex items-center gap-2 text-sm text-muted-foreground">
                <input aria-label="Featured" type="checkbox" {...form.register("featured")} />
                Featured
              </label>
            </div>
            <div className="md:col-span-2 flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setOpen(false)} aria-label="Cancel">
                Cancel
              </Button>
              <Button type="submit" disabled={form.formState.isSubmitting} aria-label="Save menu item">
                {form.formState.isSubmitting ? "Saving…" : "Save"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}


