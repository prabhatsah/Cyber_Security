import { z } from "zod";

export const leadSchema = z.object({
  organisationDetails: z.object({
    organisationName: z.string().min(1, "Organization name is required"),
    email: z.string().optional(),
    orgContactNo: z.string().optional(),
    noOfEmployees: z.string().optional(),
    sector: z.string().optional(),
    source: z.string().optional(),
    website: z.string().optional(),
    street: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
    postalCode: z.string().optional(),
    country: z.string().optional(),
    landmark: z.string().optional(),
  }),
  teamInformation: z.object({
    salesManager: z.string().optional(),
    salesteam: z.array(z.string()).optional(),
  }),
  leadIdentifier: z.string().optional(),
  leadStatus: z.string().optional(),
  updatedOn: z.string().optional(),
});