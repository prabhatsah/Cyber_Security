import { z } from "zod";
import { invokeAction } from "@/ikon/utils/api/processRuntimeService";
import { OfficeDetailsSchema } from "../office-details-definition/officeDetailsSchema";

export async function invokeOfficeDetails(data: { addressInfo: z.infer<typeof OfficeDetailsSchema> },taskId: any) { 
  try {
    const result = await invokeAction({
      taskId: taskId,
      transitionName: "Update in Edit Address Info",
      data: { addressInfo: data.addressInfo }, 
      processInstanceIdentifierField: "",
    });
    console.log("addres result",result);
  } catch (error) {
    console.error("Failed to invoke action:", error);
  }
}
