import { getAccount } from "@/ikon/utils/actions/account";
import { getMyInstancesV2 } from "@/ikon/utils/api/processRuntimeService";

export const getMyProfileData = async (accountId : string) => {
    try {
        const response: any[] = await getMyInstancesV2({
          processName: "Tender Management User Register",
          predefinedFilters: { taskName: "View User registration" },
          processVariableFilters: { accountId: accountId },
        });
        console.log("response", response);
          const profileData = response.length > 0 ? response[0].data : null;
        
          return profileData;
    } catch (error) {
        console.error("failed", error);
    }
}