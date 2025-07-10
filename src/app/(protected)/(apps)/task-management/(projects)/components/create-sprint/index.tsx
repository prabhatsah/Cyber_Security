"use client"

import { IconButtonWithTooltip, IconTextButton, IconTextButtonWithTooltip } from "@/ikon/components/buttons";
import { Plus, UserRoundPlus } from "lucide-react";
import { useEffect, useState } from "react";
import { getSoftwareIdByNameVersion } from "@/ikon/utils/actions/software";
import { getMyInstancesV2 } from "@/ikon/utils/api/processRuntimeService";
import AddSprintModal from "./AddSprintForm";
//import NewProjectDetailsForm from "./newProjectDetailsForm";


export const CreateSprint: React.FC<any> = ({projectIdentifier}: {projectIdentifier:string}) => {

    const [openSprintForm, setOpenSprintForm] = useState<boolean>(false);
    const [epicData, setEpicData] = useState<any>({}); // Store data
    

    const createSprint = () => {
        console.log('Creating New Epic......');
        setOpenSprintForm(true);
    }

    async function fetchData() {
       
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
           
           <IconTextButton variant="outline" onClick={createSprint}>
              <Plus/> Sprint
            </IconTextButton>
            <AddSprintModal isOpen={openSprintForm} onClose={() => setOpenSprintForm(false)} projectIdentifier={projectIdentifier} epicData={epicData}/>
     
        </>
    )
}
