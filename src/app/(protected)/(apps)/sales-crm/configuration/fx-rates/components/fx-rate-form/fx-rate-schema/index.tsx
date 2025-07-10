import { z } from "zod";

export const FXRateSchema = z.object({
  currency: z.string().optional(),
  year: z.string().min(1, "Year is required"),
  fxRate: z.string().optional(),
});
