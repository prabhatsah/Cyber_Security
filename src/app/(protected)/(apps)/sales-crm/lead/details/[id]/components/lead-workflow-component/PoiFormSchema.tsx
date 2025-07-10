import { z } from "zod";

export const POIFormSchema = z.object({
   
  remarks: z.string().optional(),
  updatedBy: z.string().optional(),
  updatedOn: z.string().optional()
  
});
