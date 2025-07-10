import { z } from "zod";
export const SprintFormSchema = z.object({
    EPIC_NAME: z.string().nonempty({ message: "Epic Name is required" }),
    SPRINT_NAME: z.string().nonempty({ message: "Sprint Name is required" })

})