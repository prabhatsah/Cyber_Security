import { z } from "zod";

// ---------------- Schema ----------------
export const BillingSchema = z.object({
  accountName: z.string().nonempty("Account Name is required"),
  parentAccount: z.string().optional(),
});
