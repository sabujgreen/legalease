import { z } from "zod";

export const createCaseSchema = z.object({
  title: z.string().optional(),
  description: z.string().min(20),
  location: z.object({
    city: z.string().optional(),
    state: z.string().optional(),
  }).optional(),
});
