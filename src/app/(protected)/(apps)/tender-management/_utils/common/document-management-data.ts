import { getAccount } from "@/ikon/utils/actions/account";
import { getAllSubscribedSoftwares } from "@/ikon/utils/actions/software";
import { getMyInstancesV2 } from "@/ikon/utils/api/processRuntimeService";

export const getDocumentManagementFileList = async () => {
  const accountData = await getAccount()
  const subscribedSoftwares = await getAllSubscribedSoftwares(accountData?.ACCOUNT_ID);
  console.log('subscribedSoftwares',subscribedSoftwares);

  const filteredData = subscribedSoftwares.filter((software: any) => {
    if (software?.SOFTWARE_NAME === "Document Management") {
      return software;
    }
  })
  console.log('filteredData',filteredData);

  if(filteredData.length > 0){
    console.log('in if')
    const response = await getMyInstancesV2({
        softwareId : filteredData[0].SOFTWARE_ID,
        processName: "File Manager - DM",
        predefinedFilters: { taskName: "Viewer Access" },
      });
      console.log('response', response);
      const templates = Array.isArray(response)
        ? response.map((e: any) => e.data)
        : [];
    
      return templates;
  }

    
}