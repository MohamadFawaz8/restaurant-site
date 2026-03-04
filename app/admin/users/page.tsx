import { UsersClient } from "@/app/admin/users/users-client";

export default function AdminUsersPage() {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Users</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          View users. Role management is ADMIN-only.
        </p>
      </div>
      <UsersClient />
    </div>
  );
}


