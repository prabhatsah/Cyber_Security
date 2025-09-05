import { ProbeDetails } from "@/app/globalType";
import {
  getDataForTaskId,
  getMyInstancesV2,
} from "@/ikon/utils/api/processRuntimeService";

export async function fetchAllProbes() {
  const probeManagementInstance = await getMyInstancesV2({
    processName: "Probe Management Process",
    predefinedFilters: { taskName: "View Probe" },
    projections: ["Data"],
  });

  const allProbesDetails = await getDataForTaskId<{
    probeDetails: ProbeDetails[];
  }>({
    taskId: probeManagementInstance[0].taskId,
  });

  return allProbesDetails ? allProbesDetails.probeDetails : [];
}
