
import { getMyInstancesV2 } from "@/ikon/utils/api/processRuntimeService";
import RfpDraftDataTable from "../_components/buyer/my-rfps/rfp-draft-datatable";



export default async function MyRFP(){

    const response = await getMyInstancesV2({
      processName: "RFP Draft",
      predefinedFilters: { taskName: "View" },
    });
      const rfpDraftData = Array.isArray(response)
        ? response.map((e: any) => e.data)
        : [];

    return (
      <>
        <div className="w-full h-full flex flex-col gap-3">
          <div className="flex-grow overflow-hidden">
            <RfpDraftDataTable draftData={rfpDraftData} />
          </div>
        </div>
      </>
    );
}