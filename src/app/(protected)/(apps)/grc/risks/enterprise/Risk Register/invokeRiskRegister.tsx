import { invokeAction } from "@/ikon/utils/api/processRuntimeService";

export const invokeRegister = async (taskId: string, registerDetails: Record<string, any>) => {
    try {
        const result = await invokeAction({
            taskId,
            transitionName: "Update Edit Register",
            data: registerDetails,
            processInstanceIdentifierField: "riskRegisterId",
        });

        console.log("Updated successfully:", result);
    } catch (error) {
        console.error("Failed to invoke action:", error);
        throw error;
    }
};