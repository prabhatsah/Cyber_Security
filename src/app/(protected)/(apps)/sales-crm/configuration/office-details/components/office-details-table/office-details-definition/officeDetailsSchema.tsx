import { z } from "zod";

export const OfficeDetailsSchema = z.object({
    street: z.string().min(1, "Street is required"),
    city: z.string().min(1, "City is required"),
    state: z.string().min(1, "State is required"),
    postalCode: z.string().min(1, "Postal Code is required"),
    country: z.string().min(1, "Country is required"),
    landmark: z.string().min(1, "Landmark is required"),
    taxinfo: z.string().min(0, ""),
    taxnumber: z.string().min(0, ""),
});