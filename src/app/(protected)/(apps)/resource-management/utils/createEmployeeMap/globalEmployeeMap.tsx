import { getMyInstancesV2, getParameterizedDataForTaskId } from "@/ikon/utils/api/processRuntimeService";
import { getSoftwareIdByNameVersion } from "@/ikon/utils/actions/software";

const resourceManagementSoftwareId = await getSoftwareIdByNameVersion("Resource Management", "1");
const baseAppSoftwareId = await getSoftwareIdByNameVersion("Base App", "1");

export async function createEmployeeMap() {
    try {
        const globalEmployeeMap: Record<string, any> = {};

        const employeeUploadedData = await getMyInstancesV2<any>({
            processName: "Employee Details Metadata",
            softwareId: resourceManagementSoftwareId,
            predefinedFilters: { taskName: "View Employee Details" },
        });

        const empInstance = await getMyInstancesV2<any>({
            processName: "API Connections",
            softwareId: baseAppSoftwareId,
            predefinedFilters: { taskName: "View Connection" },
            mongoWhereClause: `this.Data.connectorId == "1729163907553"`,
        });

        let employeeData = [];
        if (empInstance && empInstance.length > 0) {
            const employeeDetails = await getParameterizedDataForTaskId<any>({
                taskId: empInstance[0].taskId,
                parameters: null
            });
            employeeData = employeeDetails.employeeDetails || [];
        }

        if (employeeUploadedData && employeeUploadedData.length > 0) {
            const uploadedEmployeeDetails = employeeUploadedData[0].data.employeeDetails || {};

            for (const each in uploadedEmployeeDetails) {
                const foundEmp = employeeData.find(
                    (emp: any) => emp.employeeIdentifier === uploadedEmployeeDetails[each].employeeIdentifier
                );

                if (!foundEmp) {
                    employeeData.push(uploadedEmployeeDetails[each]);
                }
            }
        }

        for (let i = 0; i < employeeData.length; i++) {
            globalEmployeeMap[employeeData[i].employeeIdentifier] = employeeData[i];
        }

        console.log("Employee Map created successfully:", globalEmployeeMap);
        return globalEmployeeMap;
    } catch (error) {
        console.error("Error creating Employee Map:", error);
        throw error; 
    }
}