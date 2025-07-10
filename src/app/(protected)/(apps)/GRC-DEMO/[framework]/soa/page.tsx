import { getMyInstancesV2 } from "@/ikon/utils/api/processRuntimeService";
import SoaDataTable from "./soaDatatable";

async function fetchControlObjectivesData() {
  try {
    const controlObjectiveInsData = await getMyInstancesV2<any>({
      processName: "Control Objectives V2",
      predefinedFilters: { taskName: "view control objecitve" },
    });

    const controlObjectiveData = Array.isArray(controlObjectiveInsData)
      ? controlObjectiveInsData.map((e: any) => e.data)
      : [];
    return controlObjectiveData;
  } catch (error) {
    console.error("Error fetching control objective data:", error);
  }
}
export default async function RiskLibraryPage() {
  const soaData = await fetchControlObjectivesData();

  return (
   <div className="h-full flex flex-col">
  <div className="h-fit pb-4">
    <h1 className="text-2xl font-semibold">Statement of Applicability (SOA)</h1>
    <p className="text-muted-foreground mt-1">
 This report details the applicability of security controls from selected frameworks,
      including justification for implemented and excluded controls in accordance with ISO 27001 requirements.    </p>
  </div>
  <div className="flex-1 overflow-y-auto">
    <SoaDataTable soaData={soaData} />
  </div>
</div>
 
)
}