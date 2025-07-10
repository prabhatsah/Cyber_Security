import { z } from "zod";

// export const schema = z.object({
//     policies: z.array(
//         z.object({
//             policyName: z.string().min(1),
//             controls: z.array(
//                 z.object({
//                     indexName: z.string().min(1),
//                     controlSource: z.enum(["existing", "custom"]),
//                     customeControlName: z.string().optional(),
//                     controlName: z.string().min(1),
//                     controlWeight: z.string().min(1),
//                     objectives: z
//                         .array(
//                             z.object({
//                                 objectiveSource: z.enum(["existing", "custom"]),
//                                 objectiveName: z.string().optional(),
//                                 existingObjective: z.string().optional(),
//                                 objectiveWeight: z.string().min(1),
//                                 objectiveType: z.string().min(1),
//                                 objectiveDescription: z.string().optional(),
//                                 objectiveIndex: z.string().min(2),
//                                 objectivePracticeArea: z.string().min(1)
//                             }).refine(
//                                 (data) =>
//                                     (data.objectiveSource === "custom" && data.objectiveName?.trim()) ||
//                                     (data.objectiveSource === "existing" && data.existingObjective?.trim()),
//                                 {
//                                     message: "Objective name is required",
//                                     path: ["objectiveName", "existingObjective"], // attach error here
//                                 }
//                             )
//                         )
//                         .min(1, "At least one objective is required"),
//                 }).refine(
//                     (data) =>
//                         (data.controlSource === "custom" && data.customeControlName?.trim()) ||
//                         (data.controlSource === "existing" && data.controlName?.trim()),
//                     {
//                         message: "Control Name is required",
//                         path: ["customeControlName", "controlName"], // attach error here
//                     }
//                 )
//             ),
//         })
//     ),
// });


export const schema = z.object({
    policyName: z.string().min(1, "Policy name is required"),
    controls: z.array(
        z.object({
            indexName: z.string().min(1),
            controlSource: z.enum(["existing", "custom"]),
            customeControlName: z.string().optional(),
            controlName: z.string().optional(),
            controlWeight: z.string().min(1),
            objectives: z
                .array(
                    z.object({
                        objectiveSource: z.enum(["existing", "custom"]),
                        objectiveName: z.string().optional(),
                        existingObjective: z.string().optional(),
                        objectiveWeight: z.string().min(1),
                        objectiveType: z.string().min(1),
                        objectiveDescription: z.string().optional(),
                        objectiveIndex: z.string().min(2),
                        objectivePracticeArea: z.string().min(1)
                    }).refine(
                        (data) =>
                            (data.objectiveSource === "custom" && data.objectiveName?.trim()) ||
                            (data.objectiveSource === "existing" && data.existingObjective?.trim()),
                        {
                            message: "Objective name is required",
                            path: ["objectiveName", "existingObjective"],
                        }
                    )
                )
                .min(1, "At least one objective is required"),
        }).refine(
            (data) =>
                (data.controlSource === "custom" && data.customeControlName?.trim()) ||
                (data.controlSource === "existing" && data.controlName?.trim()),
            {
                message: "Control Name is required",
                path: ["customeControlName", "controlName"], // attach error here
            }
        )
    ),
});

export type FormData = z.infer<typeof schema>;