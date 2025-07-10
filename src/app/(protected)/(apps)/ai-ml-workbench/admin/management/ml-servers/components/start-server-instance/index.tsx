import { MLServer } from "@/app/(protected)/(apps)/ai-ml-workbench/components/type";
import {
  mapProcessName,
  startProcessV2,
} from "@/ikon/utils/api/processRuntimeService";

export const startNewServer = async (newServer: MLServer) => {
  const processId = await mapProcessName({ processName: "ML Workspace" });
  await startProcessV2({
    processId,
    data: newServer,
    processIdentifierFields: "probeId,workspaceId",
  });
};
