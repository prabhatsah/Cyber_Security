import { z } from "zod";

export const ScheduleSchema = z.object({
  taskName: z.string().min(1, "Task name is required"),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().min(1, "End date is required"),
  duration: z.number().min(0, "Duration must be positive"),
  predecessor: z.string().optional(),
  lag: z.number().optional(),
  dependencyType: z.string().optional(),
  color: z.string().optional(),
  description: z.string().optional(),
});