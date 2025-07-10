// import { invokeAction, getMyInstancesV2 } from "@/ikon/utils/api/processRuntimeService";

// export const invokeExpenses = async (updatedExpenseData: Record<string, any>) => {
//     try {
//         const eventData = await getMyInstancesV2({
//             processName: "Product",
//             predefinedFilters: { taskName: "Expenses" },
//             mongoWhereClause: `this.Data.productIdentifier == "${updatedExpenseData.productIdentifier}"`,
//         });

//         if (!eventData || eventData.length === 0) {
//             throw new Error("No task data found.");
//         }

//         const result = await invokeAction({
//             taskId: eventData[0].taskId,
//             transitionName: "Update Expenses",
//             data: eventData,
//             processInstanceIdentifierField: "",
//         });

//         console.log("Note updated successfully:", result);
//     } catch (error) {
//         console.error("Failed to invoke action:", error);
//         throw error;
//     }
// };

import { invokeAction } from "@/ikon/utils/api/processRuntimeService";

export const invokeExpenses = async (taskId: string, updatedExpenseData: Record<string, any>) => {
    try {
        const result = await invokeAction({
            taskId,
            transitionName: "Update Expenses",
            data: updatedExpenseData,
            processInstanceIdentifierField: "",
        });

        console.log("Expenses updated successfully:", result);
    } catch (error) {
        console.error("Failed to invoke action:", error);
        throw error;
    }
};

