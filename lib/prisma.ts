import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

const realPrisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development"
      ? ["query", "warn", "error"]
      : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = realPrisma;

// Create a safe proxy so DB errors don't crash the site
export const prisma: any = new Proxy(realPrisma, {
  get(target, prop) {
    const model = (target as any)[prop];

    if (!model) return model;

    return new Proxy(model, {
      get(modelTarget, method) {
        const original = modelTarget[method];

        if (typeof original !== "function") return original;

        return async (...args: any[]) => {
          try {
            return await original.apply(modelTarget, args);
          } catch (err) {
            console.log("Database unavailable, returning fallback:", err);

            // Return safe fallbacks
            if (method === "findMany") return [];
            if (method === "findFirst") return null;
            if (method === "findUnique") return null;

            return null;
          }
        };
      },
    });
  },
});