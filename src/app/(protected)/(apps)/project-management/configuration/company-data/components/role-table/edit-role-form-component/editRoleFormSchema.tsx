import { z } from "zod";

export const RoleSchema = z.object({
    roleTitle: z.string().min(1, "Role is required"),
  
});