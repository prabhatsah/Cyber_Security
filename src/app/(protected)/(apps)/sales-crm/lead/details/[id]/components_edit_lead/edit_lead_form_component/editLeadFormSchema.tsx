import { z } from "zod";

export const LeadFormSchema = z.object({
    organisationName: z
    .string()
    .min(1, { message: "Organization name is required" })
    .trim(),
  email: z.string().optional(),
  orgContactNo: z
    .string()

    .optional(),
  noOfEmployees: z.string().optional(),
  website: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  postalCode: z.string().optional(),
  street: z.string().optional(),
  sector: z.string().optional(),
  source: z.string().optional(),
  country: z.string().optional(),
});
