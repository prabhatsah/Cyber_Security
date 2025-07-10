import { z } from "zod";

export const GradeSchema = z.object({
    grade: z.string().min(1, "Grade is required"),
  
});