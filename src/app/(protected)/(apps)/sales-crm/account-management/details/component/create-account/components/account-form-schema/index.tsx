import { create } from "domain";
import { z } from "zod";

export const accountSchema = z.object({
//   dealNo: z.string().optional(),
  accountName: z.string().nonempty("Account Name is required"),
  accountCode: z.string().nonempty("Account Code is required"),
  accountManager: z.string().nonempty("Account Manager is required"),
  taxinfo: z.string().nonempty("Tax Information is required"),
  taxnumber: z.string().optional(),
  address: z.string().nonempty("Address is required"),
  createdOn: z.string().optional(),
  updatedOn: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  country: z.string().optional(),
  pinCode: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().optional(),
  accountIdentifier: z.string().optional(),
//   dealStartDate: z.date({
//     required_error: "Expected Closing Date is required",
//   }),
//   taxinfo: z
//     .object({
//       accountIdentifier: z.string().optional(),
//       accountName: z.string().nonempty("Account Name is required"),
//       accountManager: z.string().optional(),
//       accountCode: z.string().optional(),
//     })
//     .optional(),
//   productDetails: z
//     .object({
//       productIdentifier: z.string().optional(),
//       productType: z.string().optional(),
//       projectManager: z.string().optional(),
//       productDescription: z.string().optional(),
//     })

//     .optional(),
//   isDebtRevenue: z.boolean().optional(),
//   copyDealCheck: z.boolean().optional(),
//   dealIdentifier: z.string().optional(),
//   olddealIdentifier: z.string().optional(),
//   //dealStartDate: z.union([z.string(), z.date()]).optional(),
//   //dealStartDate: z.string().optional(),
//   contactDetails: z.record(z.string()).optional(),
//   dealStatus: z.string().optional(),
//   updatedOn: z.string().optional(),
//   createdBy: z.string().optional(),
});
