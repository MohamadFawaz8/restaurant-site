import { MenuItemsClient } from "@/app/admin/menu-items/menu-items-client";

export default function AdminMenuItemsPage() {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Menu items</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Create, edit, feature, and archive menu items.
        </p>
      </div>
      <MenuItemsClient />
    </div>
  );
}


