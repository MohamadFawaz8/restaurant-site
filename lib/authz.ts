import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export type AppRole = "USER" | "STAFF" | "ADMIN";

export function isStaff(role: AppRole | undefined) {
  return role === "ADMIN" || role === "STAFF";
}

export function isAdmin(role: AppRole | undefined) {
  return role === "ADMIN";
}

export async function getSessionRole() {
  const session = await getServerSession(authOptions);
  const role = session?.user?.role as AppRole | undefined;
  return { session, role };
}


