

import { getUserIdWiseUserDetailsMap } from "@/ikon/utils/actions/users";
import { getMyInstancesV2 } from "@/ikon/utils/api/processRuntimeService";
import AssetsDataTable from "./assetsDataTable";



async function fetchAssetsData(): Promise<any[]> {
  try {
    const findInsData = await getMyInstancesV2<any>({
      processName: "Assets",
      predefinedFilters: { taskName: "View Asset" }
    });
    return findInsData.map((e: any) => e.data);
  } catch (error) {
    console.error("Error fetching risk library data:", error);
    return [];
  }
}

async function getUserDetailMap() {
    const allUsers = await getUserIdWiseUserDetailsMap();
    console.log(allUsers);
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





export default async function RiskLibraryPage() {
  const assetsData = await fetchAssetsData();
  const userIdNameMap = await createUserMap();
  const allUser = await getUserDetailMap()

  return (
    <>
      <h1 className="text-2xl font-bold mb-2 text-foreground">Assets</h1>
      <p className="mb-4 text-muted-foreground">
        Assets in GRC refer to critical organizational resources—such as systems, data, infrastructure, or people—that must be identified, tracked, and protected to manage risk and ensure compliance.
      </p>
      <AssetsDataTable  assetsData={assetsData} userIdNameMap={userIdNameMap}/>
    </>

  );
}