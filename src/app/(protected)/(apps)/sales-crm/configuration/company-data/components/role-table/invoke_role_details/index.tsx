import { z } from "zod";

import { invokeAction } from "@/ikon/utils/api/processRuntimeService";
import { RoleSchema } from "../edit-role-form-component/editRoleFormSchema";


export async function editRoleSubmit(
  data: z.infer<typeof RoleSchema>,
  taskId: any
) { 
  try {
    const result = await invokeAction({
      taskId: taskId,
      transitionName: "Update Edit Assignment",
      data: data,
      processInstanceIdentifierField: "",
    });
    console.log(result)
} catch (error) {
    console.error("Failed to invoke action:", error);
  }
}
