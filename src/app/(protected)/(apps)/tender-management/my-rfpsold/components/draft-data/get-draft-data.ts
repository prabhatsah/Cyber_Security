
import { getMyInstancesV2 } from "@/ikon/utils/api/processRuntimeService";
import { RfpDraft } from "../../../utils/types";

export default async function  GetDraftData(id: string) : Promise<RfpDraft> {
    
    const response : any[] = await getMyInstancesV2({
      //processName: "RFP Draft",
      processName : "RFP Draft",
      predefinedFilters: { taskName: "View" },
      processVariableFilters : { id: id }
    });
      const rfpDraftData: RfpDraft = response[0].data;

    return rfpDraftData;

}