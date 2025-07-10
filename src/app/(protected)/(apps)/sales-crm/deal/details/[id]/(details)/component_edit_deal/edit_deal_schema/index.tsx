import { z } from "zod";

export const editDealSchema = z.object({
  dealNo: z.string().optional(),
  dealName: z.string().nonempty("Deal Name is required"),
  currency: z.string().nonempty("Currency is required"),
  expectedRevenue: z.string().nonempty("Expected Revenue is required"),
  isDebtRevenue: z.boolean().optional(),
  dealIdentifier: z.string().optional(),
  leadIdentifier: z.string().optional(),
  dealStartDate: z.date({
    required_error: "Expected Closing Date is required",
  }),
  inActiveStatusDate: z.string().optional(),
  updatedOn: z.string().optional(),
  createdBy: z.string().optional(),
  contactDetails: z.record(z.string()).optional(),
  dealStatus: z.string().optional(),
  remarkForDealLostOrSuspended: z.string().optional(),
  activeStatus: z.string().optional(),
});
