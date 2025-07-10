"use client"
import { ActivityLogProps, ActivitySheet } from '@/ikon/components/activity-sheet'
import { getMyInstancesV2 } from '@/ikon/utils/api/processRuntimeService';
import { useEffect, useState } from 'react'

function ProductActivityLog({ productIdentifier }: { productIdentifier: string }) {
    const [activityLogs, setActivityLogs] = useState<any[]>([]);
    async function getActivityData() {
        const productActivityData = await getMyInstancesV2({
            processName: "Activity Logs",
            predefinedFilters: { taskName: "Activity" },
            mongoWhereClause: `this.Data.parentId == "${productIdentifier}"`,
        });

        console.log("activityLogsData", productActivityData);
        const activityLogsData = productActivityData?.map(e => e.data) || [];
        setActivityLogs(activityLogsData)
    }
    useEffect(() => {
        getActivityData();
    }, [productIdentifier])
    return (
        <ActivitySheet activityLogs={activityLogs} />
    )
}

export default ProductActivityLog