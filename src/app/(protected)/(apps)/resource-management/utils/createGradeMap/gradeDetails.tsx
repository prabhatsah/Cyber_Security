import { getMyInstancesV2, getParameterizedDataForTaskId } from "@/ikon/utils/api/processRuntimeService";
import { getSoftwareIdByNameVersion } from "@/ikon/utils/actions/software";

const baseAppSoftwareId = await getSoftwareIdByNameVersion("Base App", "1");
const resourceManagementSoftwareId = await getSoftwareIdByNameVersion("Resource Management", "1");

export async function gradeDetailsMap() {
    try {
        let gradeDetails: { [key: string]: any } = {};
        
        // Fetch API Connections
        const apiConnectionsData = await getMyInstancesV2({
            processName: "API Connections",
            softwareId: baseAppSoftwareId,
            predefinedFilters: { taskName: "View Connection" },
            mongoWhereClause: `this.Data.connectorId == "1729496609580"`,
        });

        if (apiConnectionsData && apiConnectionsData.length > 0) {
            const taskId = apiConnectionsData[0].taskId;
            const parameterizedData = await getParameterizedDataForTaskId<any>({
                taskId: taskId,
                parameters: null
            });

            if (parameterizedData && parameterizedData.gradeDetails) {
                gradeDetails = parameterizedData.gradeDetails;

                const gradeInstancesData = await getMyInstancesV2<any>({
                    processName: "Grade",
                    softwareId: resourceManagementSoftwareId,
                    predefinedFilters: { taskName: "Edit State" },
                });

                if (gradeInstancesData && gradeInstancesData.length > 0) {
                    const additionalGradeDetails = gradeInstancesData[0].data?.gradeDetails || {};

                    for (const key in additionalGradeDetails) {
                        if (gradeDetails[key] === undefined) {
                            gradeDetails[key] = additionalGradeDetails[key];
                        }
                    }
                }
            }
        } else {
            const gradeInstancesData = await getMyInstancesV2<any>({
                processName: "Grade",
                softwareId: resourceManagementSoftwareId,
                predefinedFilters: { taskName: "Edit State" },
            });

            if (gradeInstancesData && gradeInstancesData.length > 0) {
                gradeDetails = gradeInstancesData[0].data?.gradeDetails || {};
            }
        }

        console.log("Grade Map created successfully:", gradeDetails);
        return gradeDetails;
    } catch (error) {
        console.error("Error creating Grade Map:", error);
        throw error;
    }
}