import { invokeAction, getMyInstancesV2 } from "@/ikon/utils/api/processRuntimeService";

export const invokeContactProcess = async (editCotact: Record<string, any>) => {
  try {

    // Fetch task data for the note
    const contactData = await getMyInstancesV2<any>({
      processName: "Contact",
      predefinedFilters: { taskName: "Edit Contact" },
      mongoWhereClause: `this.Data.contactIdentifier == "${editCotact.contactIdentifier}"`,
    });

    if (!contactData || contactData.length === 0) {
      throw new Error("No task data found for the given note.");
    }

    // Perform the action to update the note
    const result = await invokeAction({
      taskId: contactData[0].taskId,
      transitionName: "Update in Edit Contact",
      data: editCotact,
      processInstanceIdentifierField: "email,phoneNo,source,leadIdentifier,contactIdentifier",
    });

    console.log("Note updated successfully:", result);
  } catch (error) {
    console.error("Failed to invoke action:", error);
    throw error;
  }
};
