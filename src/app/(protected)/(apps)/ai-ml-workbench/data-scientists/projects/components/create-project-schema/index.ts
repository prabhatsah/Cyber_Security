import { z } from "zod";

export const projectSchema = z.object({
  assignment: z.string().trim().min(1, "Please select assignment"),
  projectName: z.string().trim().min(1, "Please enter project name"),
  projectDescription: z.string().trim().optional(),
});
