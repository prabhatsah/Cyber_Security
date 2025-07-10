import { z } from "zod";

export const TeamDetailsSchema = z.object({
    salesManager: z.string().min(1, "Sales Manager is required"),
    salesTeam: z.array(z.string()).optional(),
  });