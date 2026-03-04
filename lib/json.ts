import type { Prisma } from "@prisma/client";

export function jsonStringArray(value: Prisma.JsonValue): string[] {
  if (Array.isArray(value) && value.every((v) => typeof v === "string")) return value as string[];
  return [];
}


