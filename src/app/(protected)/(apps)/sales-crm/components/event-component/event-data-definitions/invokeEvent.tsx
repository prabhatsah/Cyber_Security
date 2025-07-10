import { invokeAction, getMyInstancesV2 } from "@/ikon/utils/api/processRuntimeService";

export const invokeEventProcess = async (updatedEventData: Record<string, any>) => {
  try {

    // Fetch task data for the note
    const eventData = await getMyInstancesV2({
      processName: "Event Creation Process",
      predefinedFilters: { taskName: "Event_View" },
      mongoWhereClause: `this.Data.Id == "${updatedEventData.Id}"`,
    });

    if (!eventData || eventData.length === 0) {
      throw new Error("No task data found.");
    }

    // Perform the action to update the note
    const result = await invokeAction({
      taskId: eventData[0].taskId,
      transitionName: "Update_Edit",
      data: eventData,
      processInstanceIdentifierField: "",
    });

    console.log("Note updated successfully:", result);
  } catch (error) {
    console.error("Failed to invoke action:", error);
    throw error;
  }
};
