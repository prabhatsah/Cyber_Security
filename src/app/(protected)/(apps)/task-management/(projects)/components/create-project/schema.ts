import { z } from "zod";
export const ProjectDetailsForm = z.object({
    PROJECT_NAME: z
        .string()
        .min(2, { message: 'Name must be at least 2 characters long.' })
        .trim(),
    MANAGER_NAME: z
        .string()
        .min(2, { message: 'Select Manager Name' })
        .trim(),
    START_DATE: z.date({
        required_error: "Start Date Is Required",
    }),
    END_DATE: z.date({
        required_error: "End Date is Required",
    }),

})