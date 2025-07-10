import { getMyInstancesV2 } from "@/ikon/utils/api/processRuntimeService";
import { RfpDraft } from "@/app/(protected)/(apps)/tender-management/utils/types";

export const getProjectDetailsData = async (draftId: string) => {
  const response = await getMyInstancesV2({
    processName: "RFP Draft",
    predefinedFilters: { taskName: "View" },
    processVariableFilters: { id: draftId },
  });
  console.log("received response", response);
  const rfpDraftData: RfpDraft[] = Array.isArray(response)
    ? response.map((e: any) => e.data)
    : [];

  console.log("received data", rfpDraftData);

  return rfpDraftData[0];
};
