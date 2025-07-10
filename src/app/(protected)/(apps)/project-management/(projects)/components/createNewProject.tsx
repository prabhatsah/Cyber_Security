"use client"

import { IconButtonWithTooltip, IconTextButtonWithTooltip } from "@/ikon/components/buttons";
import { UserRoundPlus } from "lucide-react";
import { useState } from "react";
import NewProjectDetailsForm from "./newProjectDetailsForm";


export const CreateNewProject: React.FC<any> = ({projectmanager}: {projectmanager:Record<string,string>}) => {

    const [openNewUsersForm, setOpenNewUsersForm] = useState<boolean>(false);

    const createNewUser = () => {
        console.log('Creating New User......');
        setOpenNewUsersForm(true);
    }
    return (
        <>
            {
                openNewUsersForm &&
                <NewProjectDetailsForm open={openNewUsersForm} setOpen={setOpenNewUsersForm} projectmanager={projectmanager}/>
            }
            <IconTextButtonWithTooltip tooltipContent={"Create Users"} onClick={createNewUser}>
                <UserRoundPlus />
                Project
            </IconTextButtonWithTooltip>
        </>
    )
}
