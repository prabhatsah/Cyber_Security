"use client"

import { IconButtonWithTooltip, IconTextButtonWithTooltip } from "@/ikon/components/buttons";
import { UserRoundPlus } from "lucide-react";
import { useState } from "react";
import UsersFormRoleModal from "./usersFormRoleModal";

export const CreateNewUserButton: React.FC<any> = ({ membershipDetails, setUpdateUserDetails}: any) => {

    const [openNewUsersForm, setOpenNewUsersForm] = useState<boolean>(false);

    const createNewUser = () => {
        console.log('Creating New User......');
        setOpenNewUsersForm(true);
    }
    return (
        <>
            {
                openNewUsersForm &&
                <UsersFormRoleModal open={openNewUsersForm} setOpen={setOpenNewUsersForm} editUserDetails={{}} membershipDetails={membershipDetails} setUpdateUserDetails={setUpdateUserDetails}/>
            }
            <IconTextButtonWithTooltip tooltipContent={"Create Users"} onClick={createNewUser}>
                <UserRoundPlus />
                User
            </IconTextButtonWithTooltip>
        </>
    )
}
