import { invokeAction, getMyInstancesV2 } from "@/ikon/utils/api/processRuntimeService";
import { getSoftwareIdByNameVersion } from "@/ikon/utils/actions/software";
import { getActiveAccountId } from "@/ikon/utils/actions/account";

export const invokeLeadUserNotesProcess = async (editNote: Record<string, any>) => {
  try {
    // Get Software and Account IDs
    const softwareId = await getSoftwareIdByNameVersion("Sales CRM", "1");
    const accountId = await getActiveAccountId();

    // Fetch task data for the note
    const noteData = await getMyInstancesV2<any>({
      softwareId,
      processName: "Lead User Notes",
      accountId,
      predefinedFilters: { taskName: "View Or Edit Note" },
      mongoWhereClause: `this.Data.id == "${editNote.id}"`,
    });

    if (!noteData || noteData.length === 0) {
      throw new Error("No task data found for the given note.");
    }

    // Perform the action to update the note
    const result = await invokeAction({
      taskId: noteData[0].taskId,
      transitionName: "Update Note",
      data: editNote,
      processInstanceIdentifierField: "id,userId,source",
    });

    console.log("Note updated successfully:", result);
  } catch (error) {
    console.error("Failed to invoke action:", error);
    throw error;
  }
};
