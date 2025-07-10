import { getBaseSoftwareId } from '@/ikon/utils/actions/software';
import { getMyInstancesV2, getParameterizedDataForTaskId } from '@/ikon/utils/api/processRuntimeService'
import React from 'react'

import { getUserIdWiseUserDetailsMap } from '@/ikon/utils/actions/users';
import { getUserMapForCurrentAccount } from '../../project-management/(projects)/components/getProjectManagerDetails';
import ProjectTable from './components/project-table';
// import { getUserMapForCurrentAccount } from './components/getProjectManagerDetails';
// import ProjectTable from './components/projectTable';
// import TotalData from './components/totalData';

export default async function page() {
    // const projectManagersDetails = await getProjectManagerDetails();
    // const usersProjectManagerGroup = await getUserMapForCurrentAccount({ groups: ["Project Manager"] });
    // const activeUsersPMGrp = Object.values(usersProjectManagerGroup).filter((managerDetails) => (
    //     managerDetails?.userActive
    // )).map((activeManagerDetails) => (
    //     {
    //         "value": activeManagerDetails?.userId,
    //         "label": activeManagerDetails?.userName
    //     }
    // ))
   
    //const projectData = await AllProjectData();
      const usersProjectManagerGroup = await getUserMapForCurrentAccount({ groups: ["Project Manager"] });
        type ManagerDetails = {
            userId: string;
            userName: string;
            userActive: boolean;
        };
    
        const activeUsersPMGrp = Object.values(usersProjectManagerGroup as Record<string, ManagerDetails>)
            .filter((managerDetails) => managerDetails.userActive)
            .map((activeManagerDetails) => ({
                value: activeManagerDetails.userId,
                label: activeManagerDetails.userName
            }));
    
    const userIdWiseUserDetailsMap = await getUserIdWiseUserDetailsMap();
    const projectInstanceData = await getMyInstancesV2({
         processName: "Project" ,
         predefinedFilters: {taskName : "View State"}
    });
    const projectData = projectInstanceData.map((e: any) => e.data);
   
    const baseSoftwareId = await getBaseSoftwareId();
    const projectConnectorInstance = await getMyInstancesV2({ softwareId: baseSoftwareId, processName: "API Connections", predefinedFilters: { taskName: "View Connection" }, mongoWhereClause: `this.Data.connectorId == "1729061424998"`, })
    const projectConnectorInstanceTaskId = projectConnectorInstance[0].taskId;
    const projectPConnectorInstanceData = await getParameterizedDataForTaskId({ taskId: projectConnectorInstanceTaskId, parameters: null }) as { projectDetails: { data: any }[] };
    console.log("projectPConnectorInstanceData", projectPConnectorInstanceData)
    const projectConnectorData = projectPConnectorInstanceData.projectDetails.map((e) => e.data);
    console.log("projectConnectorData", projectConnectorData)
    for(var each of projectConnectorData){
        projectData.push(each)
    }
    console.log("projectData", projectData)
    // const totalData = await TotalData();
    // const totalProjectData = totalData.filter((data)=>data.type==="Project")
    // console.log(totalProjectData)
    
    return (
        <>
            <ProjectTable projectTableData={projectData} userIdWiseUserDetailsMap={userIdWiseUserDetailsMap} projectmanager={activeUsersPMGrp}/>
          
        </>
    )
}
