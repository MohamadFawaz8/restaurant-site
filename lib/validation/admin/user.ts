import { z } from "zod";

export const userRoleUpdateSchema = z.object({
  role: z.enum(["USER", "STAFF", "ADMIN"]),
});


