import { z } from "zod";

import { invokeAction } from "@/ikon/utils/api/processRuntimeService";
import { TeamDetailsSchema } from "../edit_team_form_component/editTeamFormSchema";

export async function ediTeamSubmit(
  data: z.infer<typeof TeamDetailsSchema>,
  taskId: any
) {
  console.log("Form Data Submitted:", data);

  const teamData = {
    teamInformation: data
  }
  console.log("team Data ",teamData)
  try {
    const result = await invokeAction({
      taskId: taskId,
      transitionName: "Update Team",
      data: teamData,
      processInstanceIdentifierField: "leadIdentifier",
    });
    console.log(result)
} catch (error) {
    console.error("Failed to invoke action:", error);
  }
}
