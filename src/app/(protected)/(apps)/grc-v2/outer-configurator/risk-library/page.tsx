import { getMyInstancesV2 } from "@/ikon/utils/api/processRuntimeService";
import RiskLibraryDataTable from "./riskLibraryDataTable";
import { getProfileData } from "@/ikon/utils/actions/auth";



async function fetchGlobalRiskLibraryData(): Promise<any[]> {
  try {
    const findInsData = await getMyInstancesV2<any>({
      processName: "Global Risk Library",
      predefinedFilters: { taskName: "View Global Risk Library" }
    });
    return findInsData.map((e: any) => e.data);
  } catch (error) {
    console.error("Error fetching risk library data:", error);
    return [];
  }
}


async function fetchMetadataRiskCategoryData(): Promise<any[]> {
  try {
    const metaDataInstance = await getMyInstancesV2<any>({
      processName: "Metadata - Risk Category - Global Account",
      predefinedFilters: { taskName: "View Risk Category" },
      projections: ["Data.riskCategory"]
    });
    return metaDataInstance.map((e: any) => e.data);
  } catch (error) {
    console.error("Error fetching Metadata - Risk Category data:", error);
    return [];
  }
}





export default async function RiskLibraryPage() {
  const riskLibraryData = await fetchGlobalRiskLibraryData();
  const riskCategoryData = await fetchMetadataRiskCategoryData();
  const profileData = await getProfileData();

  console.log("risk category data", riskCategoryData);
  console.log("risk library data", riskLibraryData);
 // const riskCategoryObj = riskCategoryData[0]?.riskCategory || {};

  return (
    <>
      <h1 className="text-2xl font-bold mb-2 text-foreground">Risk Library</h1>
      <p className="mb-4 text-muted-foreground">
        A centralized Risk Library within GRC where the organization can define, manage, and customize its own set of risks tailored to its operational landscape.
      </p>
      <RiskLibraryDataTable riskLibraryData={riskLibraryData} riskCategoryData={riskCategoryData} profileData={profileData.USER_ID} />
    </>

  );
}