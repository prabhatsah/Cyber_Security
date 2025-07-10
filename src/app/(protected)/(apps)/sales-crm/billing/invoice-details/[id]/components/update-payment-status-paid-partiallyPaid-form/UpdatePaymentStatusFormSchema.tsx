import { z } from "zod";

export const PaidOrPartiallyPaidInvoiceFormSchema = z.object({
    PaymentMode: z.enum(["online", "cheque"], { required_error: "Payment Mode is required" }),
    PaidAmount: z.number(),
    PaymentDate: z.string(),
    DueDate: z.string().optional(),
    DiscountedAmount: z.string().optional(),
    Account_Nickname_Online: z.string().optional(),
    BankName: z.string().optional(),
    BranchName: z.string().optional(),
    AEDNumber: z.string().optional(),
    AccountName: z.string().optional(),
    IBANCode: z.string().optional(),
    Account_Nickname_Cheque: z.string().optional(),
    ChequeNo: z.string().optional(),
});