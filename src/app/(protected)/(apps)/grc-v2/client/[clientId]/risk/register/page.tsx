import { getUserIdWiseUserDetailsMap } from "@/ikon/utils/actions/users";
import RiskDataTable from "./RiskModal/RiskDataTable";
import { getMyInstancesV2 } from "@/ikon/utils/api/processRuntimeService";
import { getProfileData } from "@/ikon/utils/actions/auth";

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

export async function fetchRiskLibraryData(clientId: string) {
    try {
        const libraryInsData = await getMyInstancesV2({
            processName: "Risk Library",
            predefinedFilters: { taskName: "View Library" },
            mongoWhereClause: `this.Data.clientId == "${clientId}"`
        });
        const libraryData = Array.isArray(libraryInsData) ? libraryInsData.map((e: any) => e.data) : [];
        return libraryData;
    } catch (error) {
        console.error("Failed to fetch the process:", error);
        throw error;
    }
};

export async function fetchRiskRegisterData(clientId: string) {
    try {
        const registerInsData = await getMyInstancesV2({
            processName: "Risk Register",
            predefinedFilters: { taskName: "View Register" },
            mongoWhereClause: `this.Data.clientId == "${clientId}"`
        });
        const registerData = Array.isArray(registerInsData) ? registerInsData.map((e: any) => e.data) : [];
        return registerData;
    } catch (error) {
        console.error("Failed to fetch the process:", error);
        throw error;
    }
};

async function fetchMetadataRiskCategoryData(clientId:string): Promise<any[]> {
    try {
        const metaDataInstance = await getMyInstancesV2<any>({
            processName: "Metadata - Risk Category",
            predefinedFilters: { taskName: "View Config" },
            projections: ["Data.riskCategory"],
            mongoWhereClause: `this.Data.clientId == "${clientId}"`
        });
        return metaDataInstance.map((e: any) => e.data);
    } catch (error) {
        console.error("Error fetching Metadata - Risk Category data:", error);
        return [];
    }
}

async function fetchMetadataRiskImpactData(clientId:string): Promise<any[]> {
    try {
        const metaDataInstance = await getMyInstancesV2<any>({
            processName: "Metadata - Risk Impact and Weightage",
            predefinedFilters: { taskName: "View Impact" },
            projections: ["Data.riskImpact"],
            mongoWhereClause: `this.Data.clientId == "${clientId}"`
        });
        return metaDataInstance.map((e: any) => e.data);
    } catch (error) {
        console.error("Error fetching Metadata - Risk Impact data:", error);
        return [];
    }
}


export default async function RiskRegisterPage({
    params,
}: {
    params: { framework: string; clientId: string };
}) {

    const { clientId } = params;
    const userIdNameMap: { value: string, label: string }[] = await createUserMap();
    const riskLibraryData = await fetchRiskLibraryData(clientId);
    const riskRegisterData = await fetchRiskRegisterData(clientId);
    const riskCategoryData = await fetchMetadataRiskCategoryData(clientId);
    const riskImpactData = await fetchMetadataRiskImpactData(clientId);
    const profileData = await getProfileData();
    return (
        <>
            <div className="mb-5">

                <h1 className="text-2xl font-semibold">Risk Register</h1>

                <p className="text-muted-foreground mt-1">

                    Track and manage risks that apply to your business.

                </p>

            </div>
            <RiskDataTable userIdNameMap={userIdNameMap} profileData={profileData} riskLibraryData={riskLibraryData} riskRegisterData={riskRegisterData} riskCategoryData={riskCategoryData} riskImpactData={riskImpactData} clientId={clientId}/>
        </>
    )
}