import { invokeAction } from "@/ikon/utils/api/processRuntimeService";

export const invokeAssessment = async (taskId: string, assessmentDetails: Record<string, any>) => {
    try {
        const result = await invokeAction({
            taskId,
            transitionName: "Update Edit Risk",
            data: assessmentDetails,
            processInstanceIdentifierField: "riskId",
        });

        console.log("Updated successfully:", result);
    } catch (error) {
        console.error("Failed to invoke action:", error);
        throw error;
    }
};