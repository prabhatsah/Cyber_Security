import { z } from "zod";

export const WonFormSchema = z.object({
    channelPartnerCreation: z.enum(["yes", "no"], {
        required_error: "You need to select a Channel Partner",
    }),
    isChannelPartner: z.boolean().default(false).optional(),
    partnerAccount: z.string().optional(),
    ACCOUNT_TYPE: z.enum(["newAccount", "existingAccount"], {
        required_error: "You need to select a Account Type",
    }),
    ACCOUNT_NAME: z
        .string()
        .min(2, { message: 'Name must be at least 2 characters long.' })
        .trim(),
    EXISTING_ACCOUNT_NAME: z.string().optional(),
    ACCOUNT_CODE: z.string().min(1, { message: 'Please Enter Account Code' }),
    ACCOUNT_MANAGER: z.string().min(1, { message: 'Please Select Account Manager Name' }),
    SERVICE_LEVEL_MANAGEMENT: z.string().min(1, { message: 'Please Select Service Level Management' }),
    DEAL_WON_DATE: z.coerce.date({
        required_error: "Deal Won date is required.",
    }),
    PROJECT_NAME: z
        .string()
        .min(2, { message: 'Name must be at least 2 characters long.' })
        .trim(),
    PROJECT_NUMBER: z
        .string()
        .min(2, { message: 'Name must be at least 2 characters long.' })
        .trim(),
    PARENT_PROJECT_NUMBER: z
        .string()
        .min(2, { message: 'Name must be at least 2 characters long.' })
        .trim(),
    START_DATE: z.coerce.date({
        required_error: "Start date is required.",
    }),
    PROJECT_MANAGER: z.string().min(1, { message: 'Please Select Project Manager Name' }),
    TAX_INFORMATION: z.string().min(1, { message: 'Please Select Tax Information Type' }),
    TAX_NUMBER: z.string().optional(),
    CONTRACT_REFERENCE_NO: z.string().min(1, { message: 'Please Enter Contact Information' }),
    UPLOAD_CONTRACT_DOCUMENT:  z
    .custom<File | null>((file) => file instanceof File, {
      message: "File is required",
    }),
    ADDRESS: z.string().min(1, { message: 'Please Enter Your Address' }),
    CITY: z.string().min(1, { message: 'Please Enter City Name' }),
    STATE: z.string().min(1, { message: 'Please Enter State Name' }),
    PO_BOX: z.string().min(1, { message: 'Please Enter PO BOX' }),
    COUNTRY: z.string().min(1, { message: 'Please Enter Country Name' }),
})
