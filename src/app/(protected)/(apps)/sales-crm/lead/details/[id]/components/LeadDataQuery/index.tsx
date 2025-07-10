import { getMyInstancesV2 } from "@/ikon/utils/api/processRuntimeService";

export default async function LeadDataQuery({
    leadIdentifier,
}: {
    leadIdentifier: string | undefined;
}) {
    const leadsData = await getMyInstancesV2({
        processName: "Leads Pipeline",
        predefinedFilters: { taskName: "View State" },
        mongoWhereClause: `this.Data.leadIdentifier == "${leadIdentifier}"`,
    });

    console.log("leadIdWiseLeadData", leadsData);
    let leadIdWiseLeadData = leadsData[0].data;
    

    const leadsActivityData = await getMyInstancesV2({
        processName: "Activity Logs",
        predefinedFilters: { taskName: "Activity" },
        mongoWhereClause: `this.Data.parentId == "${leadIdentifier}"`,
    });

    console.log("activityLogsData", leadsActivityData);
    let activityLogsData = leadsActivityData[0]?.data;

    return {leadIdWiseLeadData, activityLogsData};
}