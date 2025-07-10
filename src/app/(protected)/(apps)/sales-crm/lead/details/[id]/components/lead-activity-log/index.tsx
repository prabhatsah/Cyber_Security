"use client"
import { ActivityLogProps, ActivitySheet } from '@/ikon/components/activity-sheet'
import { getMyInstancesV2 } from '@/ikon/utils/api/processRuntimeService';
import { useEffect, useState } from 'react'

function LeadActivityLog({ leadIdentifier }: { leadIdentifier: string }) {
    const [activityLogs, setActivityLogs] = useState([]);
    async function getActivityData() {
        const leadsActivityData = await getMyInstancesV2({
            processName: "Activity Logs",
            predefinedFilters: { taskName: "Activity" },
            mongoWhereClause: `this.Data.parentId == "${leadIdentifier}"`,
        });

        console.log("activityLogsData", leadsActivityData);
        const activityLogsData = leadsActivityData?.map(e => e.data) || [];
        setActivityLogs(activityLogsData)
    }
    useEffect(() => {
        getActivityData();
    }, [leadIdentifier])
    return (
        <ActivitySheet activityLogs={activityLogs} />
    )
}

export default LeadActivityLog