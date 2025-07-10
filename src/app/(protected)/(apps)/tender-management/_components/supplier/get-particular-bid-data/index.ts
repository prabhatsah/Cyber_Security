import { getMyInstancesV2 } from "@/ikon/utils/api/processRuntimeService";

export default async function getParticularBidData(tenderId: any, accountId: any) {
const response = await getMyInstancesV2({
      processName: "Tender Response",
      predefinedFilters: { taskName: "View" },
      processVariableFilters: { tenderId: tenderId/*, accountId: accountId*/ },
    });

    const data = response.map((item) => item.data);
    return data

}