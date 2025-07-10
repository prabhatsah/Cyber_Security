import { IconTextButtonWithTooltip } from '@/ikon/components/buttons';
import { UserRoundPlus } from 'lucide-react';
import React, { useState } from 'react'
import VariationOrderForm from './variationOrderForm';

export default function CreateVariationOrderForm() {
    const [openNewUsersForm, setOpenNewUsersForm] = useState<boolean>(false);

    const createNewUser = () => {
        console.log('Creating New Variation Order Form......');
        setOpenNewUsersForm(true);
    }
    return (
        <>
            {
                openNewUsersForm &&
                <VariationOrderForm open={openNewUsersForm} setOpen={setOpenNewUsersForm} />
            }
            <IconTextButtonWithTooltip tooltipContent={"Create Variation Order"} onClick={createNewUser}>
                <UserRoundPlus />
            </IconTextButtonWithTooltip>
        </>
    )
}
