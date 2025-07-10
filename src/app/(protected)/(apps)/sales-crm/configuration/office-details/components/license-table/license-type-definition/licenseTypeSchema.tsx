import { z } from "zod";

export const LicenseSchema = z.object({
    LicenseType: z.string().min(1, "License Type is required"),
    LicenseCost: z.string().min(1, "Cost/license/month is required"),
});