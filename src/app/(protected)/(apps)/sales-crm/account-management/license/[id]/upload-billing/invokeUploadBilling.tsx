import { invokeAction } from "@/ikon/utils/api/processRuntimeService";

export const invokeUploadBilling = async (taskId: string, finalData: Record<string, any>) => {
    try {
        const result = await invokeAction({
            taskId,
            transitionName: "Update Upload Billing Detail Files",
            data: finalData,
            processInstanceIdentifierField: "",
        });

        console.log("Upload Billing updated successfully:", result);
    } catch (error) {
        console.error("Failed to invoke action:", error);
        throw error;
    }
};