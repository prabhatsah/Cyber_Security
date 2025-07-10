import { z } from "zod";

export const BankingDetailsSchema = z.object({
    Bank_Name: z.string().min(1, "Bank Name is required"),
    Branch_Name: z.string().min(1, "Branch Name is required"),
    Account_Name: z.string().min(1, "Account Name is required"),
    AED_Number: z.string().min(1, "Account Number is required"),
    IBAN_Code: z.string().min(1, "IBAN Code is required"),
    Account_Nickname: z.string().min(1, "Account Nickname is required"),
    Default_Bank: z.boolean().optional(),
});