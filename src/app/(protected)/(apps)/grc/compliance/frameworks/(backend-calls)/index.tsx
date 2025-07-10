"use server";
import {
  mapProcessName,
  startProcessV2,
} from "@/ikon/utils/api/processRuntimeService";
import { revalidatePath } from "next/cache";

export const startFrameworkData = async (frameworkData: any) => {
  try {
    const processId = await mapProcessName({ processName: "Add Framework" });
    await startProcessV2({
      processId,
      data: frameworkData,
      processIdentifierFields: "",
    });
    console.log("success in staring the process ankit");
    revalidatePath("/grc/compliance/frameworks");
  } catch (error) {
    console.error("Failed to start the process:", error);
    throw error;
  }
};
