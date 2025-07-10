import {
  getMyInstancesV2,
  invokeAction,
  mapProcessName,
  startProcessV2,
} from "@/ikon/utils/api/processRuntimeService";

export const getRegisteredSuppliers = async () => {
    try {
        const response = await getMyInstancesV2({
        processName: "RFP Supplier",
        predefinedFilters: { taskNames: ["Sent For Review", 'Approved','Rejected'] },
        });

        const registeredSuppliers = response.map(res => res.data);
    
        return registeredSuppliers;
    } catch (error) {
        console.error("Failed to get data:", error);
        throw error;
    }
};
