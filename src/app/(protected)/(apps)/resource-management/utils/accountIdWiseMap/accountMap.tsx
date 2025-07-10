import { getSoftwareIdByNameVersion } from "@/ikon/utils/actions/software";
import { getMyInstancesV2 } from "@/ikon/utils/api/processRuntimeService";

export async function getAccountIdWiseAccountDetails() {
  try {
    const softwareId = await getSoftwareIdByNameVersion("Base App", "1");
    const accountInsData = await getMyInstancesV2<any>({
      softwareId: softwareId,
      processName: "Account",
      predefinedFilters: { taskName: "View State" },
    });

    const accountIdWiseAccountMap: Record<string, any> = {};
    if (Array.isArray(accountInsData) && accountInsData.length > 0) {
        accountInsData.forEach((accountInsData) => {
            accountIdWiseAccountMap[accountInsData.data.accountIdentifier] = accountInsData.data;
      });
    }

    return accountIdWiseAccountMap;
  } catch (error) {
    console.error("Error fetching Account data:", error);
    throw error;
  }
}