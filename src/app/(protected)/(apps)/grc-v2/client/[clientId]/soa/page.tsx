import { getMyInstancesV2 } from "@/ikon/utils/api/processRuntimeService";
import { CreateUserMap } from "../bau/page";
import SoaDataTable from "./soaDatatable";

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

    return Array.isArray(fetchSOAInstanceData)
      ? fetchSOAInstanceData.map((e: any) => e.data)
      : [];
  } catch (error) {
    console.error("Error fetching SOA instances:", error);
    return [];
  }
}

export async function ControlData(frameworkIds: string[]) {
  try {
    if (!frameworkIds || frameworkIds.length === 0) {
      return [];
    }

    const clause = `this.Data.Frameworks.some(f => ${frameworkIds
      .map((id) => `f.frameworkId == "${id}"`)
      .join(" || ")})`;

    const customControlInsData = await getMyInstancesV2({
      processName: "Custom Controls",
      predefinedFilters: { taskName: "Edit Rules" },
      mongoWhereClause: clause,
    });

    const customControlData = Array.isArray(customControlInsData)
      ? customControlInsData.map((e: any) => e.data)
      : [];

    // For each control, keep only the frameworks that match the subscribed frameworkIds
    const frameworkWiseData = customControlData.map((control) => {
      return {
        ...control,
        Frameworks: control.Frameworks?.filter((framework: any) =>
          frameworkIds.includes(framework.frameworkId)
        ),
      };
    });

    return frameworkWiseData.filter((e) => e.Frameworks?.length > 0);
  } catch (error) {
    console.error("Failed to fetch control data:", error);
    return [];
  }
}

export async function getFrameworkIDs(clientId: string) {
  try {
    if (!clientId) return [];

    const subscribedFrameworkIds = await getMyInstancesV2({
      processName: "Subscribed Frameworks",
      predefinedFilters: { taskName: "View Subscription" },
      mongoWhereClause: `this.Data.clientId == "${clientId}" && this.Data.soaExists == true`,
      projections: ["Data.frameworkId"],
    });

    const frameworkIdsObj = Array.isArray(subscribedFrameworkIds)
      ? (subscribedFrameworkIds.map(
          (subscribedFrameworkId) => subscribedFrameworkId.data
        ) as { frameworkId: string }[])
      : [];

    return frameworkIdsObj.map(
      (frameworkIdsObj) => frameworkIdsObj.frameworkId
    );
  } catch (error) {
    console.error("Failed to fetch framework IDs:", error);
    return [];
  }
}

export default async function SOAPage({ params }: { params: any }) {
  const { clientId } = params;

  if (!clientId) {
    return (
      <div className="h-full flex items-center justify-center">
        <p className="text-red-500">Client ID is missing</p>
      </div>
    );
  }

  try {
    const [soaInstanceData, allUsers, subscribedFrameworkIds] =
      await Promise.all([
        fetchSOAInstances(),
        CreateUserMap(),
        getFrameworkIDs(clientId),
      ]);

    const refIdMap: Record<string, RefItem> = (soaInstanceData || []).reduce(
      (acc, item) => {
        if (item?.refId) {
          acc[item.refId] = {
            applicable: item.applicable || "",
            justification: item.justification || "",
            clientId: item.clientId || "",
          };
        }
        return acc;
      },
      {} as Record<string, RefItem>
    );

    const controlData = await ControlData(subscribedFrameworkIds || []);
    const tableData = Array.isArray(controlData) ? controlData : [];

    // Safely merge SOA instance data with control data
    for (const eachControl of tableData) {
      if (eachControl?.refId && refIdMap[eachControl.refId]) {
        eachControl.applicable = refIdMap[eachControl.refId].applicable;
        eachControl.justification = refIdMap[eachControl.refId].justification;
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
          {tableData.length > 0 ? (
            <SoaDataTable
              controlData={tableData}
              clientId={clientId}
              allUsers={allUsers}
            />
          ) : (
            <div className="h-full flex items-center justify-center">
              <p className="text-gray-500">
                No control data available for the selected frameworks
              </p>
            </div>
          )}
        </div>
      </div>
    );
  } catch (error) {
    console.error("Error in SOA page:", error);
    return (
      <div className="h-full flex items-center justify-center">
        <p className="text-red-500">
          Failed to load SOA data. Please try again later.
        </p>
      </div>
    );
  }
}
