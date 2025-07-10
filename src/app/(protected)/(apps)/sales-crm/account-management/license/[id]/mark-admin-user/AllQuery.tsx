import { getMyInstancesV2, getParameterizedDataForTaskId } from "@/ikon/utils/api/processRuntimeService";

export async function fetchMarkAdminData(accountId: string) {
    try {
        const markAdminInsData = await getMyInstancesV2({
            processName: "Mark Admin Users",
            predefinedFilters: { taskName: "Mark Admin Users" },
            mongoWhereClause: `this.Data.accountId=='${accountId}'`,
        });

        return markAdminInsData?.[0]?.data || null;
    } catch (error) {
        console.error("Error fetching Mark Admin data:", error);
        return null;
    }
}

export async function fetchExcludeUsersInstance(accountId: string) {
    try {
        const excludeUsersData = await getMyInstancesV2({
            processName: "Billing Users Excluder",
            predefinedFilters: { taskName: "Exclude Billing Users" },
            mongoWhereClause: `this.Data.accountId=='${accountId}'`,
        });

        return excludeUsersData?.[0]?.data || null;
        //return excludeUsersData;
    } catch (error) {
        console.error("Error fetching Exclude Users data:", error);
        return null;
    }
}

export async function fetchCombinedConverterDataInstance(accountId: string) {
    try {
        const combinedConverterData = await getMyInstancesV2({
            processName: "Combined Converter Data",
            predefinedFilters: { taskName: "Combine Converter Data" },
            mongoWhereClause: `this.Data.accountId=='${accountId}'`,
        });

        //return combinedConverterData?.[0]?.data || null;
        return combinedConverterData;
    } catch (error) {
        console.error("Error fetching Combined Converter Data:", error);
        return null;
    }
}

export async function fetchBillingAccountConverterData(accountId: string): Promise<any | null> {
    try {
        const combinedConverter = await fetchCombinedConverterDataInstance(accountId);
        const taskId = combinedConverter?.[0]?.taskId;

        if (!taskId) {
            throw new Error('Instance could not be fetched.');
        }

        const parameterizedData = await getParameterizedDataForTaskId<any>({
            taskId: taskId,
            parameters: null
        });

        return parameterizedData?._POST_PROCESSED_DATA_ ?? null;
    } catch (error) {
        console.error("Error fetching Billing Account Converter Data:", error);
        return null;
    }
}

