import { getMyInstancesV2 } from "@/ikon/utils/api/processRuntimeService";

export async function fxRateMap() {
    try {
        const fxRate = await getMyInstancesV2<any>({
            processName: "Fx Rate",
            predefinedFilters: { taskName: "View State" },
        });
        const fxRatedata = fxRate[0].data.fxRates || {};
        console.log("Fx Rate data fetched successfully:", fxRatedata);
        return fxRatedata;
    } catch (error) {
        console.error("Error fetching data:", error);
        throw error;
    }
}

