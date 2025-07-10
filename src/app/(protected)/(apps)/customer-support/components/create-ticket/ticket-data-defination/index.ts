import { z } from 'zod'

 const AddTicketFormSchema = z.object({
    subject: z.string().nonempty("Please enter Subject"),
    accountName: z.string().nonempty("Please enter Account Name"),
    application: z.string().nonempty("Please enter Application Name"),
   // issueDate: z.string().nonempty("Please enter issueDate"),
    issueDate: z.coerce.date({
        required_error: "Please enter issueDate.",
    }),
    type: z.string().nonempty("Please enter type"),
    priority: z.string().nonempty("Please enter priority"),
    supportMessage: z.string().nonempty("Please enter supportMessage"),
    mobile: z.string().regex(/^\+?[1-9]\d{1,14}$/, "Please enter a valid phone number").optional(),
    uploadfile: z.instanceof(File, { message: "Please select a file" }).optional(),
    clientUploadedResources: z.any().optional(),
})

export { AddTicketFormSchema };