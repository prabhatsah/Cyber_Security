import { z } from "zod";

import { invokeAction } from "@/ikon/utils/api/processRuntimeService";
import { GradeSchema } from "../edit-grade-form-component/editGradeFormSchema";

export async function editGradeSubmit(
  data: z.infer<typeof GradeSchema>,
  taskId: any
) { 
  try {
    const gradeData = {
      gradeDetails: data,
    };
    const result = await invokeAction({
      taskId: taskId,
      transitionName: "Update Edit State",
      data: gradeData,
      processInstanceIdentifierField: "",
    });
    console.log(result)
} catch (error) {
    console.error("Failed to invoke action:", error);
  }
}
