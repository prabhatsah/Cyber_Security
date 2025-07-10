"use client"

import { IconButtonWithTooltip, IconTextButton, IconTextButtonWithTooltip } from "@/ikon/components/buttons";
import { Plus, UserRoundPlus } from "lucide-react";
import { useEffect, useState } from "react";
import AddEpicModal from "./AddEpicForm";
import { getSoftwareIdByNameVersion } from "@/ikon/utils/actions/software";
import { getMyInstancesV2 } from "@/ikon/utils/api/processRuntimeService";
//import NewProjectDetailsForm from "./newProjectDetailsForm";


export const CreateEpic: React.FC<any> = ({projectIdentifier}: {projectIdentifier:string}) => {

    const [openEpicForm, setOpenEpicForm] = useState<boolean>(false);
    const [scheduleData, setScheduleData] = useState<any>([]); // Store data
    const [epicData, setEpicData] = useState<any>({}); // Store data

    const createEpic = () => {
        console.log('Creating New Epic......');
        setOpenEpicForm(true);
    }
    async function fetchData() {
        const pmSoftwareId = await getSoftwareIdByNameVersion("Project Management", "1.0");
        const scheduleResponse: any = await getMyInstancesV2({
          softwareId: pmSoftwareId,
          processName: "Product of Project",
          predefinedFilters: {taskName : "View State"},
          mongoWhereClause: `this.Data.projectIdentifier == "${projectIdentifier}"`,
          projections: ["Data.scheduleData"],
        });
        const scheduleData = scheduleResponse[0]?.data?.scheduleData?.task || [];
        console.log("scheduleData", scheduleData);
        setScheduleData(scheduleData);
        const epicResponse: any = await getMyInstancesV2({
            processName: "Epic",
            predefinedFilters: {taskName : "View State"},
            mongoWhereClause: `this.Data.projectIdentifier == "${projectIdentifier}"`,
        })
        console.log("epicResponse", epicResponse);
        const epicData = epicResponse[0]?.data?.epicData || {};
        console.log("epicData", epicData);
        setEpicData(epicData);
      }
      useEffect(() => {
        // Fetch data when the modal opens  
          fetchData();

        
      },[] );
    return (
        <>
           
           <IconTextButton variant="outline" onClick={createEpic}>
              <Plus/> Epic
                </IconTextButton>
                <AddEpicModal isOpen={openEpicForm} onClose={() => setOpenEpicForm(false)} projectIdentifier={projectIdentifier} scheduleData={scheduleData} epicData={epicData}/>
        </>
    )
}
