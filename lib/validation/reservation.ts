import { z } from "zod";

export const reservationSchema = z.object({
  name: z.string().min(2).max(80),
  email: z.string().email(),
  phone: z.string().min(7).max(30).optional().or(z.literal("")),
  partySize: z.number().int().min(1).max(20),
  dateTime: z.string().min(5),
  notes: z.string().max(500).optional().or(z.literal("")),
});


