import { z } from "zod";

export const dealSchema = z.object({
  dealNo: z.string().optional(),
  dealName: z.string().nonempty("Deal Name is required"),
  currency: z.string().nonempty("Currency is required"),
  expectedRevenue: z.string().nonempty("Expected Revenue is required"),
  dealStartDate: z.date({
    required_error: "Expected Closing Date is required",
  }),
  accountDetails: z
    .object({
      accountIdentifier: z.string().optional(),
      accountName: z.string().nonempty("Account Name is required"),
      accountManager: z.string().optional(),
      accountCode: z.string().optional(),
    })
    .optional(),
  productDetails: z
    .object({
      productIdentifier: z.string().optional(),
      productType: z.string().optional(),
      projectManager: z.string().optional(),
      productDescription: z.string().optional(),
    })

    .optional(),
  isDebtRevenue: z.boolean().optional(),
  copyDealCheck: z.boolean().optional(),
  dealIdentifier: z.string().optional(),
  olddealIdentifier: z.string().optional(),
  //dealStartDate: z.union([z.string(), z.date()]).optional(),
  //dealStartDate: z.string().optional(),
  contactDetails: z.record(z.string()).optional(),
  dealStatus: z.string().optional(),
  updatedOn: z.string().optional(),
  createdBy: z.string().optional(),
});
