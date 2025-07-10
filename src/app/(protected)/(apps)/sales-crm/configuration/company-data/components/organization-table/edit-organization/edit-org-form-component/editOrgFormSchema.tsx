import { z } from "zod";

export const OrgDetailsSchema = z.object({
  name: z.string().min(1, "Organization name is required"),
  region: z.string().min(1, "Region is required"),
  workingHours: z.string().min(1, "Working hours is required"),
});