import { invokeAction } from "@/ikon/utils/api/processRuntimeService";

interface LicenseInstanceData {
    licenseObj: Record<
      string,
      {
        LicenseType: string;
        LicenseCost: string;
      }
    >;
  }

//export async function invokeLicense(data: z.infer<typeof LicenseSchema>,taskId: any) { 
export async function invokeLicense(data: LicenseInstanceData, taskId: any) {     
  try {
    const result = await invokeAction({
      taskId: taskId,
      transitionName: "Update in Edit License",
      data: data,
      processInstanceIdentifierField: "",
    });
    console.log(result)
} catch (error) {
    console.error("Failed to invoke action:", error);
  }
}
