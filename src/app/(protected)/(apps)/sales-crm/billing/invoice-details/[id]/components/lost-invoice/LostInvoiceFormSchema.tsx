import { z } from "zod";

export const LostInvoiceFormSchema = z.object({
  "remarksForLostInv": z.string().optional(),
});
