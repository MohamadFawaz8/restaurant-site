import { ContactsClient } from "@/app/admin/contacts/contacts-client";

export default function AdminContactsPage() {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Contact messages</h1>
        <p className="mt-1 text-sm text-muted-foreground">Review messages and update statuses.</p>
      </div>
      <ContactsClient />
    </div>
  );
}


