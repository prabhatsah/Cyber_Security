import { string, z } from "zod";
import zxcvbn from "zxcvbn";
export const UserDetailsForm = z.object({
    USER_LOGIN: z
        .string()
        .trim(),
    USER_NAME: z
        .string()
        .min(2, { message: 'Name must be at least 2 characters long.' })
        .trim(),
    USER_EMAIL: z.string().email({ message: 'Please enter a valid email.' }).trim(),
    USER_PHONE: z.string().trim(),
    USER_PASSWORD: z.string().trim().optional(),
    confirmPassword: z.string().trim().optional(),
}).superRefine(({ USER_PASSWORD, confirmPassword }, ctx) => {
    if (USER_PASSWORD && confirmPassword) {
        if (USER_PASSWORD !== confirmPassword) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: 'Password is not the same as confirm password',
                path: ['confirmPassword'],
            })
        } else {
            const testResult = zxcvbn(USER_PASSWORD);
            if (testResult.score < 3) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: 'Password is too weak',
                    path: ['USER_PASSWORD'],
                })
            }
        }
    } else if (USER_PASSWORD && !confirmPassword) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'Confirm password is required',
            path: ['confirmPassword'],
        })
    }
})