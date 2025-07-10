import { MLServer, Probe, ProbeData } from "../../components/type";
import {
  getDataForTaskId,
  getMyInstancesV2,
} from "@/ikon/utils/api/processRuntimeService";

export async function useMlServerData(workspaceId?: string) {
  const processVariableFilter = workspaceId
    ? { workspaceId: workspaceId }
    : null;

  const instances = await getMyInstancesV2<MLServer>({
    processName: "ML Workspace",
    predefinedFilters: { taskName: "View Workspace Activity" },
    processVariableFilters: processVariableFilter,
  });

  const mlServerData = Array.isArray(instances)
    ? instances.map((e: any) => e.data)
    : [];

  return mlServerData;
}

export async function useProbeData() {
  const instances = await getMyInstancesV2({
    processName: "Probe Management Process",
    predefinedFilters: { taskName: "View Probe" },
  });

  const taskId = instances[0].taskId;
  const probeInstance = await getDataForTaskId<Probe>({ taskId });
  const probeData: ProbeData[] = Array.isArray(probeInstance?.probeDetails)
    ? probeInstance.probeDetails
    : [];

  probeData.forEach((eachProbeDetails) => {
    eachProbeDetails.Status = eachProbeDetails.ACTIVE ? "Active" : "Inactive";
  });

  return Array.isArray(probeData) ? probeData : [];
}
