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

export async function ControlData(frameworkId: string) {
  try {
    const clause = `this.Data.Frameworks.some(f => f.frameworkId == "${frameworkId}")`;
    const customControlInsData = await getMyInstancesV2({
      processName: "Custom Controls",
      predefinedFilters: { taskName: "Edit Rules" },
      mongoWhereClause: clause,
    });

    const customControlData = Array.isArray(customControlInsData) ? customControlInsData.map((e: any) => e.data) : [];

    const frameworkWiseData = customControlData.map(control => {
      return {
        ...control,
        Frameworks: control.Frameworks.filter(
          (framework: any) => framework.frameworkId === frameworkId
        ),
      };
    });

    return frameworkWiseData;

  } catch (error) {
    console.error("Failed to fetch the process:", error);
    throw error;
  }
}

export default async function ControlsPage({ params } : { params: { framework: string; clientId?: string }; }) {
  const { framework, clientId } = params;
  
  const userIdNameMap = await createUserMap();
  const controlData = await ControlData(framework);

  return (
    <>
      <div className="mb-5">
        <h1 className="text-2xl font-semibold">Controls Library</h1>
        <p className="text-muted-foreground mt-1">
          Manage and monitor your security and compliance controls
        </p>
      </div>
      <div className="h-[90%] overflow-y-auto">
        <ControlTable frameworkId={framework} userIdNameMap={userIdNameMap} controlData={controlData} />
      </div>
    </>
  );
}
