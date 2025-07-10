import { getUserIdWiseUserDetailsMap } from "@/ikon/utils/actions/users";
import { getMyInstancesV2 } from "@/ikon/utils/api/processRuntimeService";
import PolicyTable from "./policyModal/PolicyDataTable";
import { getProfileData } from "@/ikon/utils/actions/auth";

interface ControlObjective {

  objectiveDescription: string;
  objectiveIndex: string;
  objectiveName: string;
}

export interface PolicyControl {
  controlObjectives: ControlObjective[];
  controlName: string;
  policyIndex: string;
  type: string;
  controlDescription: string;
}

export interface FrameworkDraftData {
  controls: PolicyControl[];
  frameworkName: string;
  description: string;
  owners: string[];
  frameworkId: string;
  lastUpdatedOn: Date | undefined;
  effectiveDate: Date | undefined;
  version: string;
  currentAccountId: string;
  saveAsDraft: boolean;
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

async function fetchCategoryData(): Promise<any[]> {
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

async function fetchImpactData(): Promise<any[]> {
    try {
        const metaDataInstance = await getMyInstancesV2<any>({
            processName: "Metadata - Risk Impact and Weightage",
            predefinedFilters: { taskName: "View Impact" }
        });
        return metaDataInstance.map((e: any) => e.data);
    } catch (error) {
        console.error("Error fetching Metadata - Risk Impact data:", error);
        return [];
    }
}

export async function fetchRiskLibraryData() {
    try {
        const libraryInsData = await getMyInstancesV2({
            processName: "Risk Library",
            predefinedFilters: { taskName: "View Library" },
        });
        const libraryData = Array.isArray(libraryInsData) ? libraryInsData.map((e: any) => e.data) : [];
        return libraryData;
    } catch (error) {
        console.error("Failed to fetch the process:", error);
        throw error;
    }
};

export async function fetchPolicyData() {
    try {
        const policyInsData = await getMyInstancesV2({
            processName: "Add Policy",
            predefinedFilters: { taskName: "View Policy" },
        });
        const policyData = Array.isArray(policyInsData) ? policyInsData.map((e: any) => e.data) : [];
        return policyData;
    } catch (error) {
        console.error("Failed to fetch the process:", error);
        throw error;
    }
};

export async function createFrameworkControlsDropdown() {
  const isoFrameworkId = "fef2a63e-1c61-4342-a266-e3d983679d61";

  const frameworkInstance = await getMyInstancesV2({
    processName: 'Control Objectives V2',
    predefinedFilters: { taskName: "view control objecitve" },
    mongoWhereClause: `this.Data.frameworkId == "${isoFrameworkId}"`
  });
  const frameworkData = frameworkInstance.length > 0 ? frameworkInstance[0].data as FrameworkDraftData : null;
  const controlData = frameworkData?.controls || [];

  const dropDownControl = controlData.map((controlData) => ({
    id: controlData.type + "_" + controlData.policyIndex,
    label: controlData.controlName+" ("+controlData.type+")",
    options: (controlData.controlObjectives || []).map((objective) => ({
      id: objective.objectiveIndex,
      label: objective.objectiveIndex,
      description: objective.objectiveName
    }))
  })
  );

  return dropDownControl;
}

export default async function RiskRegisterPage() {
    const profileData = await getProfileData();
    const userIdNameMap: { value: string, label: string }[] = await createUserMap();
    const riskLibraryData = await fetchRiskLibraryData();
    const riskCategoryData = await fetchCategoryData();
    const riskImpactData = await fetchImpactData();
    const policyData = await fetchPolicyData();
    console.log("policyData:", policyData);
    const dropDownControl = await createFrameworkControlsDropdown();

    return (
        <>
            <PolicyTable userIdNameMap={userIdNameMap} riskLibraryData={riskLibraryData} riskCategoryData={riskCategoryData} policyData={policyData} profileData={profileData} dropDownControl={dropDownControl} />
        </>
    )
}
