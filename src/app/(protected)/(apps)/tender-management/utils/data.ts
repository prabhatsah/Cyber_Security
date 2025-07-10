import { getMyInstancesV2 } from "@/ikon/utils/api/processRuntimeService"


export default async function uploadedRfpData(){

    const response = await getMyInstancesV2({
      processName: "RFP Upload",
      predefinedFilters: { taskName: "View" },
    });
      const rfpDraftData = Array.isArray(response)
        ? response.map((e: any) => e.data)
        : [];

    return rfpDraftData;
}