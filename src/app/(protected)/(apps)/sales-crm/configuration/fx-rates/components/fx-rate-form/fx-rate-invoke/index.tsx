import { z } from "zod";
import {
  getMyInstancesV2,
  invokeAction,
} from "@/ikon/utils/api/processRuntimeService";
import { FXRateSchema } from "../fx-rate-schema";

export async function saveFXRateData(data: z.infer<typeof FXRateSchema>) {
  let dataRates = { fxRates: {} };

  dataRates["fxRates"] = data;
  console.log("Data Rates:", dataRates);

  try {
    const fxRateInstances = await getMyInstancesV2({
      processName: "Fx Rate",
      predefinedFilters: { taskName: "Edit State" },
    });

    if (fxRateInstances.length === 0) {
      console.error("No instances found for Fx Rate");
      return;
    }

    const taskId = fxRateInstances[0].taskId;

    const result = await invokeAction({
      taskId: taskId,
      transitionName: "Update Edit State",
      data: dataRates, 
      processInstanceIdentifierField: "",
    });

    console.log("API Response:", result);
  } catch (error) {
    console.error("Failed to invoke action:", error);
  }
}
