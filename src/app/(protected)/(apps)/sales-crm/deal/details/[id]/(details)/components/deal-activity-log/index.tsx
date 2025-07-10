"use client"
import { ActivitySheet } from '@/ikon/components/activity-sheet';
import { getMyInstancesV2 } from '@/ikon/utils/api/processRuntimeService';
import { useEffect, useState } from 'react'

function DealActivityLog({ dealIdentifier }: { dealIdentifier: string }) {
    const [activityLogs, setActivityLogs] = useState<any[]>([]);
    async function getActivityData() {
        const dealsActivityData = await getMyInstancesV2({
            processName: "Activity Logs",
            predefinedFilters: { taskName: "Activity" },
            mongoWhereClause: `this.Data.parentId == "${dealIdentifier}"`,
        });

        console.log("activityLogsData", dealsActivityData);
        const activityLogsData = dealsActivityData?.map(e => e.data) || [];
        setActivityLogs(activityLogsData)
    }
    useEffect(() => {
        getActivityData();
    }, [dealIdentifier])
    return (
        <ActivitySheet activityLogs={activityLogs} />
    )
}

export default DealActivityLog