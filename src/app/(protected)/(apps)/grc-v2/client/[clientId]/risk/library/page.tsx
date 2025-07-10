

import { getMyInstancesV2 } from "@/ikon/utils/api/processRuntimeService";
import RiskLibraryDataTable from "./riskLibraryDataTable";
import { getProfileData } from "@/ikon/utils/actions/auth";


async function fetchRiskLibraryData(clientId:string): Promise<any[]> {
  try {
    const findInsData = await getMyInstancesV2<any>({
      processName: "Risk Library",
      predefinedFilters: { taskName: "View Library" },
      mongoWhereClause: `this.Data.clientId == "${clientId}"`,
    });
    return findInsData.map((e: any) => e.data);
  } catch (error) {
    console.error("Error fetching risk library data:", error);
    return [];
  }
}

async function fetchRiskRegisterData(clientId:string): Promise<any[]> {
  try {
    const findInsData = await getMyInstancesV2<any>({
      processName: "Risk Register",
      predefinedFilters: { taskName: "View Register" },
      mongoWhereClause: `this.Data.clientId == "${clientId}"`,
    });
    return findInsData.map((e: any) => e.data);
  } catch (error) {
    console.error("Error fetching risk library data:", error);
    return [];
  }
}

async function fetchMetadataRiskCategoryData(clientId:string): Promise<any[]> {
  try {
    const metaDataInstance = await getMyInstancesV2<any>({
      processName: "Metadata - Risk Category",
      predefinedFilters: { taskName: "View Config" },
      projections: ["Data.riskCategory"],
      mongoWhereClause: `this.Data.clientId == "${clientId}"`,
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
      predefinedFilters: { taskName: "View Global Risk Library" },
    });
    return findInsData.map((e: any) => e.data);
  } catch (error) {
    console.error("Error fetching risk library data:", error);
    return [];
  }
}



export default async function RiskLibraryPage({
  params,
}: {
  params: { framework: string; clientId: string };
}) {


  console.log("Risk Library Page Params:", params);
  const { clientId } = params;
  console.log("Client ID:", clientId);



  const riskLibraryData = await fetchRiskLibraryData(clientId);
  const riskRegisterData = await fetchRiskRegisterData(clientId);
  const riskCategoryData = await fetchMetadataRiskCategoryData(clientId);
  const globalRiskLibraryData = await fetchGlobalRiskLibraryData();
  const profileData = await getProfileData();
  // console.log("Risk Library Data:", riskLibraryData);

  return (
    <>
      <h1 className="text-2xl font-bold mb-2 text-foreground">Risk Library</h1>
      <p className="mb-4 text-muted-foreground">
        Select the risk that apply to your business and track them on your risk register.
      </p>
      <RiskLibraryDataTable riskLibraryData={riskLibraryData} riskRegisterData={riskRegisterData} riskCategoryData={riskCategoryData} globalRiskLibraryData={globalRiskLibraryData} profileData={profileData} clientId={clientId}/>
    </>

  );
}