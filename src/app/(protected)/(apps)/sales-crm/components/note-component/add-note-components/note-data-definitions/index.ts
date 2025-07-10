import { z } from 'zod'

export const AddNoteFormSchema = z.object({
    note: z
        .string()
        .min(1, { message: 'Please enter note.' })
        .trim(),
})