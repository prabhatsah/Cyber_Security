import React from 'react'
import { getUserIdWiseUserDetailsMap } from '@/ikon/utils/actions/users';
import { getMyInstancesV2 } from '@/ikon/utils/api/processRuntimeService';
import { WidgetProps } from '@/ikon/components/widgets/type';
import Widgets from '@/ikon/components/widgets';
import IncidentTab from './components/incidentTab';

async function getUserDetailMap() {
    const allUsers = await getUserIdWiseUserDetailsMap();
    console.log(allUsers);
    return allUsers;
}

export async function createUserMap() {
    const allUsers = await getUserDetailMap();
    const userIdNameMap: { value: string; label: string }[] = Object.values(allUsers)
        .map((user) => {
            if (user.userActive) {
                return {
                    value: user.userId,
                    label: user.userName
                };
            }
            return undefined;
        })
        .filter((user): user is { value: string; label: string } => user !== undefined);

    return userIdNameMap;
}

async function getIncidentCreateData() {
    const incidentCreateInstances = await getMyInstancesV2({
        processName: "Incident Create",
        predefinedFilters: { taskName: "View Incident" },
    })

    console.log(incidentCreateInstances);
    const incidentCreateDatas = incidentCreateInstances.length ? incidentCreateInstances.map((incidentCreateInstance) => incidentCreateInstance.data) : []
    console.log(incidentCreateDatas);
    return incidentCreateDatas;
}

async function getIncidentProgressData() {
    const incidentProgressInstances = await getMyInstancesV2({
        processName: "Incident Progress",
        predefinedFilters: { taskName: "View Incident Progress" },
    })

    console.log(incidentProgressInstances);
    const incidentProgressDatas = incidentProgressInstances.length ? incidentProgressInstances.map((incidentProgressInstance) => incidentProgressInstance.data) : []
    console.log(incidentProgressDatas);
    return incidentProgressDatas;
}

async function generateWidgetData(){
    const incidentCreateDatas = await getIncidentCreateData();
    console.log(incidentCreateDatas);
    let openIncident=0,inProgressIncident=0,resolvedIncident=0,closedIncident=0;
    (incidentCreateDatas as Record<string, string>[])
    .map(
        (incidentCreateData) => {
            if(incidentCreateData.incidentStatus === "Open"){
                openIncident++;
            }else if(incidentCreateData.incidentStatus === "InProgress"){
                inProgressIncident++;
            }else if(incidentCreateData.incidentStatus === "ResolvedIncident"){
                resolvedIncident++;
            }else if(incidentCreateData.closedIncident=== "ClosedIncident"){
                closedIncident++;
            }
        }
    );

    const widgetData: WidgetProps[] = [
        {
            id: "openIncident",
            widgetText: "No. of Open Incidents",
            widgetNumber: openIncident.toString(),
            iconName: "folder-open" as const,
        },
        {
            id: "inProgressIncident",
            widgetText: "No. of InProgress Incidents",
            widgetNumber: inProgressIncident.toString(),
            iconName: "loader" as const,

        },
        {
            id: "resolvedIncident",
            widgetText: "No. of Resolved Incidents",
            widgetNumber: resolvedIncident.toString(),
            iconName: "badge-check" as const,
        },
        {
            id: "closedIncident",
            widgetText: "No. of Closed Incidents",
            widgetNumber: closedIncident.toString(),
            iconName: "archive" as const,
        },
    ];
    return widgetData;
}
    

export default async function IncidentManagement() {
    const incidentCreateDatas = await getIncidentCreateData();
    console.log(incidentCreateDatas);
    const userIdNameMap: { value: string, label: string }[] = await createUserMap();
    const allUsers = await getUserDetailMap();
    console.log(userIdNameMap);
    const widgetData = await generateWidgetData();

    const incidentProgressDatas = await getIncidentProgressData();
    console.log(incidentProgressDatas);

    return (
        <>
            <div className="flex flex-col gap-3">
                <Widgets widgetData={widgetData} />
                <IncidentTab incidentCreateDatas={incidentCreateDatas} incidentProgressDatas={incidentProgressDatas} allUsers={allUsers} userIdNameMap={userIdNameMap} />
            </div>
        </>
    )
}
