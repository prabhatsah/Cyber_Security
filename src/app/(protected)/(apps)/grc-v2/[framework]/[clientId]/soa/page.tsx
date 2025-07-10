import { getMyInstancesV2 } from "@/ikon/utils/api/processRuntimeService";
import SoaDataTable from "./soaDatatable";
import { CreateUserMap } from "../policynew/page";
type RefItem = {
  justification: string;
  applicable: string;
  clientId: string;
};
async function fetchSOAInstances() {
  try {
    const fetchSOAInstanceData = await getMyInstancesV2<any>({
      processName: "SOA New",
      predefinedFilters: { taskName: "edit soa task" },
    });

    const soaInstanceData = Array.isArray(fetchSOAInstanceData)
      ? fetchSOAInstanceData.map((e: any) => e.data)
      : [];
    return soaInstanceData;
  } catch (error) {
    console.error("Error fetching control objective data:", error);
  }
}
export async function ControlData(frameworkId: string) {
  try {
    const clause = this?.Data.Frameworks.some(
      (f) => f.frameworkId == "${frameworkId}"
    );
    const customControlInsData = await getMyInstancesV2({
      processName: "Custom Controls",
      predefinedFilters: { taskName: "Edit Rules" },
      mongoWhereClause: clause,
    });

    const customControlData = Array.isArray(customControlInsData)
      ? customControlInsData.map((e: any) => e.data)
      : [];

    const frameworkWiseData = customControlData.map((control) => {
      return {
        ...control,
        Frameworks: control.Frameworks.filter(
          (framework: any) => framework.frameworkId === frameworkId
        ),
      };
    });

    return frameworkWiseData.filter((e) => e.Frameworks.length > 0);
  } catch (error) {
    console.error("Failed to fetch the process:", error);
    throw error;
  }
}
export default async function SOAPage({ params }: { params: any }) {
  const { framework, clientId } = params;
  const soaInstanceData = await fetchSOAInstances();
  const allUsers = await CreateUserMap();
  const refIdMap: Record<string, RefItem> = soaInstanceData?.reduce(
    (acc, item) => {
      acc[item.refId] = {
        applicable: item.applicable,
        justification: item.justification,
        clientId: item.clientId,
      };
      return acc;
    },
    {}
  );
  const controlData = await ControlData(framework);
  // Ensure controlData is properly structured before passing to the table
  const tableData = Array.isArray(controlData) ? controlData : [];

  for (const eachControl of tableData) {
    const match = refIdMap[eachControl.refId];
    if (match) {
      eachControl.applicable = match.applicable;
      eachControl.justification = match.justification;
    }
  }

  return (
    <div className="h-full flex flex-col">
      <div className="h-fit pb-4">
        <h1 className="text-2xl font-semibold">
          Statement of Applicability (SOA)
        </h1>
        <p className="text-muted-foreground mt-1">
          This report details the applicability of security controls from
          selected frameworks, including justification for implemented and
          excluded controls in accordance with ISO 27001 requirements.
        </p>
      </div>
      <div className="flex-1 overflow-y-auto">
        <SoaDataTable
          controlData={tableData}
          clientId={clientId}
          allUsers={allUsers}
        />
      </div>
    </div>
  );
}
