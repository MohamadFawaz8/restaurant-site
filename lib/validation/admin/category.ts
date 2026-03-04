import { z } from "zod";

export const categoryCreateSchema = z.object({
  name: z.string().min(2).max(80),
  slug: z.string().min(2).max(80).optional().or(z.literal("")),
  description: z.string().max(200).optional().or(z.literal("")),
});

export const categoryUpdateSchema = categoryCreateSchema.partial().refine(
  (v) => Object.keys(v).length > 0,
  "No updates provided"
);


