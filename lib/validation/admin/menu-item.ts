import { z } from "zod";

export const menuItemCreateSchema = z.object({
  name: z.string().min(2).max(120),
  slug: z.string().min(2).max(120).optional().or(z.literal("")),
  description: z.string().min(10).max(2000),
  price: z.coerce.number().min(0).max(100000),
  categoryId: z.string().min(1),
  images: z.array(z.string().min(1)).min(1),
  tags: z.array(z.string()).default([]),
  dietaryFlags: z.array(z.string()).default([]),
  allergens: z.array(z.string()).default([]),
  availability: z.boolean().default(true),
  featured: z.boolean().default(false),
});

export const menuItemUpdateSchema = menuItemCreateSchema.partial().refine(
  (v) => Object.keys(v).length > 0,
  "No updates provided"
);


