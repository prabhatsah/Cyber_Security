"use client"
import { ActivityLogProps, ActivitySheet } from '@/ikon/components/activity-sheet'
import { getMyInstancesV2 } from '@/ikon/utils/api/processRuntimeService';
import { useEffect, useState } from 'react'

function ProjectActivityLog({ projectIdentifier }: { projectIdentifier: string }) {
    const [activityLogs, setActivityLogs] = useState<any[]>([]);
    async function getActivityData() {
        const projectActivityData = await getMyInstancesV2({
            processName: "Activity Logs",
            predefinedFilters: { taskName: "Activity" },
            mongoWhereClause: `this.Data.parentId == "${projectIdentifier}"`,
        });

        console.log("activityLogsData", projectActivityData);
        const activityLogsData = projectActivityData?.map(e => e.data) || [];
        setActivityLogs(activityLogsData)
    }
    useEffect(() => {
        getActivityData();
    }, [projectIdentifier])
    return (
        <ActivitySheet activityLogs={activityLogs} />
    )
}

export default ProjectActivityLog