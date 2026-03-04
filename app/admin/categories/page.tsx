import { CategoriesClient } from "@/app/admin/categories/categories-client";

export default function AdminCategoriesPage() {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Categories</h1>
        <p className="mt-1 text-sm text-muted-foreground">Create and manage menu categories.</p>
      </div>
      <CategoriesClient />
    </div>
  );
}


