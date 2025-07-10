import { z } from "zod";

export const serverSchema = z.object({
  workspaceName: z.string().trim().min(1, "Please enter server name"),
  probeName: z.string().trim().min(1, "Please select probe name"),
  hostName: z.string().trim().optional(),
  ipAddress: z.string().trim().optional(),
  probeMachineOsType: z.string().trim().optional(),
});
