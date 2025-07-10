import { getUserIdWiseUserDetailsMap } from "@/ikon/utils/actions/users";
import ControlTable from "./controlsDataTable";
import { getMyInstancesV2 } from "@/ikon/utils/api/processRuntimeService";

async function getUserDetailMap() {
  const allUsers = await getUserIdWiseUserDetailsMap();
  // console.log(allUsers);
  return allUsers;
}
export async function createUserMap() {
  const allUsers = await getUserDetailMap();
  const userIdNameMap: { value: string; label: string }[] = Object.values(allUsers)
    .map((user) => {
      if (user.userActive) {
        return {
          value: user.userId,
          label: user.userName
        };
      }
      return undefined;
    })
    .filter((user): user is { value: string; label: string } => user !== undefined);

  return userIdNameMap;
}

export async function subscribeFrameworkData(clientId?: string) {
  const subscribedFrameworkIds = await getMyInstancesV2({
    processName: "Subscribed Frameworks",
    predefinedFilters: { taskName: "View Subscription" },
    mongoWhereClause: `this.Data.clientId == "${clientId}"`,
    projections: ["Data.frameworkId"],
  });

  const frameworkIdsObj = subscribedFrameworkIds.length > 0 ? 
    (subscribedFrameworkIds.map((subscribedFrameworkId) => subscribedFrameworkId.data) as { frameworkId: string }[]) : [];

  const frameworkIds = frameworkIdsObj.map((frameworkIdsObj) => frameworkIdsObj.frameworkId);
  return frameworkIds;
}

export async function ControlData(frameworkIds: string[]) {
  try {
    if (!frameworkIds || frameworkIds.length === 0) {
      console.log("frameworkIds is empty. Returning an empty array.");
      return [];
    }

    const clause = `this.Data.Frameworks.some(f => ${frameworkIds.map((id) => `f.frameworkId == "${id}"`).join(" || ")})`;
    console.log("clause-----", clause);

    const customControlInsData = await getMyInstancesV2({
      processName: "Custom Controls",
      predefinedFilters: { taskName: "Edit Rules" },
      mongoWhereClause: clause,
    });

    const customControlData = Array.isArray(customControlInsData) ? customControlInsData.map((e: any) => e.data) : [];

    // For each control, keep only the frameworks that match the subscribed frameworkIds
    const frameworkWiseData = customControlData.map((control) => {
      return {
        ...control,
        Frameworks: control.Frameworks.filter((framework: any) =>
          frameworkIds.includes(framework.frameworkId)
        ),
      };
    });

    return frameworkWiseData.filter((e) => e.Frameworks.length > 0);
  } catch (error) {
    console.error("Failed to fetch the process:", error);
    throw error;
  }
}


export default async function ControlsPage({ params }: { params: { clientId: string } }) {
  const { clientId } = params;
  
  const userIdNameMap = await createUserMap();
  const subscribedFrameworks = await subscribeFrameworkData(clientId);
  console.log("Subscribed Frameworks:", subscribedFrameworks);
  const controlData = await ControlData(subscribedFrameworks || []);
  console.log("Control Data:", controlData);

  return (
    <>
      <div className="mb-5">
        <h1 className="text-2xl font-semibold">Controls Library</h1>
        <p className="text-muted-foreground mt-1">
          Manage and monitor your security and compliance controls
        </p>
      </div>
      <div className="h-[90%] overflow-y-auto">
        <ControlTable userIdNameMap={userIdNameMap} controlData={controlData} />
      </div>
    </>
  );
}
