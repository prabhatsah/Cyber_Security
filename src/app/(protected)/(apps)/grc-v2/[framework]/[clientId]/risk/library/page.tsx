

import { getMyInstancesV2 } from "@/ikon/utils/api/processRuntimeService";
import RiskLibraryDataTable from "./riskLibraryDataTable";
import { getProfileData } from "@/ikon/utils/actions/auth";


async function fetchRiskLibraryData(): Promise<any[]> {
  try {
    const findInsData = await getMyInstancesV2<any>({
      processName: "Risk Library",
      predefinedFilters: { taskName: "View Library" }
    });
    return findInsData.map((e: any) => e.data);
  } catch (error) {
    console.error("Error fetching risk library data:", error);
    return [];
  }
}

async function fetchRiskRegisterData(): Promise<any[]> {
  try {
    const findInsData = await getMyInstancesV2<any>({
      processName: "Risk Register",
      predefinedFilters: { taskName: "View Register" }
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
      processName: "Metadata - Risk Category",
      predefinedFilters: { taskName: "View Config" }
    });
    return metaDataInstance.map((e: any) => e.data);
  } catch (error) {
    console.error("Error fetching Metadata - Risk Category data:", error);
    return [];
  }
}

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

async function fetchUserActivityApprovalData(userId:String): Promise<any[]> {
  try {
    const findInsData = await getMyInstancesV2<any>({
      processName: "User Approval Activities",
      predefinedFilters: { taskName: "View User Activity" },
      mongoWhereClause: `this.Data.userId == "${userId}"`,
    });
    if (!findInsData || findInsData.length === 0) {
      return [];
    }
    return findInsData.map((e: any) => e.data);
  } catch (error) {
    console.error("Error fetching risk library data:", error);
    return [];
  }
}



export default async function RiskLibraryPage() {
  const riskLibraryData = await fetchRiskLibraryData();
  const riskRegisterData = await fetchRiskRegisterData();
  const riskCategoryData = await fetchMetadataRiskCategoryData();
  const globalRiskLibraryData = await fetchGlobalRiskLibraryData();
  const profileData = await getProfileData();
  const userActivityApprovalData = await fetchUserActivityApprovalData(profileData.USER_ID);
  // console.log("Risk Library Data:", riskLibraryData);

  return (
    <>
      <h1 className="text-2xl font-bold mb-2 text-foreground">Risk Library</h1>
      <p className="mb-4 text-muted-foreground">
        Select the risk that apply to your business and track them on your risk register.
      </p>
      <RiskLibraryDataTable riskLibraryData={riskLibraryData} riskRegisterData={riskRegisterData} riskCategoryData={riskCategoryData} globalRiskLibraryData={globalRiskLibraryData} profileData={profileData} userActivityApprovalData={userActivityApprovalData}/>
    </>

  );
}