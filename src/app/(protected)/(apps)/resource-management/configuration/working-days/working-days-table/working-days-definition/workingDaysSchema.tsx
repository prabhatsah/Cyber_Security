import { z } from "zod";

export const WorkingDaysSchema = z.object({
    year: z.string()
        .min(4, "Year must be at least 4 digits")
        .max(4, "Year must be exactly 4 digits")
        .regex(/^\d{4}$/, "Year must be a valid 4-digit number"),
});
