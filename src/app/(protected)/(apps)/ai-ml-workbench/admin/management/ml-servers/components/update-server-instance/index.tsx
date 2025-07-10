import { MLServer } from "@/app/(protected)/(apps)/ai-ml-workbench/components/type";
import {
  getMyInstancesV2,
  invokeAction,
  mapProcessName,
  startProcessV2,
} from "@/ikon/utils/api/processRuntimeService";
import { invokeActionProps } from "@/ikon/utils/api/processRuntimeService/type";

export const updateSelectedServer = async (
  workspaceId: string,
  updatedWorkspaceName: string
) => {
  const instances = await getMyInstancesV2<MLServer>({
    processName: "ML Workspace",
    predefinedFilters: { taskName: "Update Workspace Activity" },
    processVariableFilters: { workspaceId: workspaceId },
  });

  const thisTaskId = instances[0].taskId;
  const thisData = instances[0].data;

  thisData.workspaceName = updatedWorkspaceName;

  const invokeActionArgs: invokeActionProps = {
    taskId: thisTaskId,
    transitionName: "Update Workspace",
    data: thisData,
    processInstanceIdentifierField: "workspaceId",
  };
  await invokeAction(invokeActionArgs);
};
