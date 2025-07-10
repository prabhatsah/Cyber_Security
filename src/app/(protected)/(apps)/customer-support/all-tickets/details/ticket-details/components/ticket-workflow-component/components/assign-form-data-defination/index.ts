import { z } from 'zod'

 const AddTicketFormSchema = z.object({
    selectedLevel: z.string().optional(),
    selectedAssignee: z.string().optional(),
    assigneeComment: z.string().optional(),
  })

export { AddTicketFormSchema };


