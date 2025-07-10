import { z } from "zod";
import { invokeAction } from "@/ikon/utils/api/processRuntimeService";
import { WorkingDaysSchema } from "../working-days-definition/workingDaysSchema";

export async function invokeWorkingDays(data: { workingDaysDetails: z.infer<typeof WorkingDaysSchema> },taskId: any) { 
  try {
    const result = await invokeAction({
      taskId: taskId,
      transitionName: "Update Edit State",
      data: { workingDaysDetails: data }, 
      processInstanceIdentifierField: "",
    });
    console.log("working result",result);
  } catch (error) {
    console.error("Failed to invoke action:", error);
  }
}
