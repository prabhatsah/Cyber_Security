import { getMyInstancesV2 } from "@/ikon/utils/api/processRuntimeService";
import { getUserDetailMap } from "../createUserMap";

export const fetchAuditsData = async () => {
    try {
        const auditsData = await getMyInstancesV2({
            processName: "Audit",
            predefinedFilters: { taskName: "View Audit" },
        });
        console.log("auditsData-----", auditsData);
        const auditsDataDynamic = Array.isArray(auditsData)
            ? auditsData.map((e: any) => e.data)
            : [];
        console.log("auditsDataDynamic-----", auditsDataDynamic);
        return auditsDataDynamic;
    } catch (error) {
        console.error("Failed to fetch the process:", error);
        throw error;
    }
};

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