import { z } from "zod";

export const probeSchema = z.object({
  probeName: z.string().trim().min(1, "Please select probe name"),
});
