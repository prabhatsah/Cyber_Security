import { z } from 'zod'

export const EventFormSchema = z.object({
    firstName: z.string().nonempty("Please enter First Name"),
    middleName: z.string().optional(),
    lastName: z.string().nonempty("Please enter Last Name"),
    email: z.string().email("Invalid email address"),
    phoneNo: z.string().regex(/^\+?[1-9]\d{1,14}$/, "Please enter a valid phone number").optional(),
    mobileNo: z.string().optional(),
    department: z.string().optional(),
    fax: z.string().optional(),
    address1: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
    pinCode: z.union([z.string(), z.number()]).optional(),
    country: z.string().optional(),
})