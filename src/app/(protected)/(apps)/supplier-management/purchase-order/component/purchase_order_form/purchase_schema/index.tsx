import { z } from "zod";

export const poSchema = z.object({
  selectedPO: z.string().optional(),
  deliveryDate: z.date({
    required_error: "Delivery Date is required",
  }),
  vendor: z.string().nonempty("Vendor is required"),
  paymentTerms: z.string().optional(),
  vat: z.string().optional(),
  currency: z.string().min(1, "Currency is required"),
  billingAmount: z.string().optional(),
  discountPercent: z.string().optional(),
  discountedAmount: z.string().optional(),
  vatPercent: z.string().optional(),
  vatAmount: z.string().optional(),
  finalAmount: z.string().optional(),
  remark: z.string().optional(),
  namePo: z.string().optional(),
});