import { z } from "zod";

import { invokeAction } from "@/ikon/utils/api/processRuntimeService";
import { OrgDetailsSchema } from "../edit-org-form-component/editOrgFormSchema";

export async function ediOrgSubmit(
  data: z.infer<typeof OrgDetailsSchema>,
  taskId: any
) { 
  try {
    const result = await invokeAction({
      taskId: taskId,
      transitionName: "Update Edit Task",
      data: data,
      processInstanceIdentifierField: "",
    });
    console.log(result)
} catch (error) {
    console.error("Failed to invoke action:", error);
  }
}
