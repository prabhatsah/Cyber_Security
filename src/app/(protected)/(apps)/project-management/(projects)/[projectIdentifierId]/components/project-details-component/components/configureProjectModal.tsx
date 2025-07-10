'use client'
import React, { useState } from 'react'
import ConfigureProjectForm from './configureProjectForm';
import { IconButtonWithTooltip } from '@/ikon/components/buttons';
import { UserRound } from 'lucide-react';

export default function ConfigureProjectModal({projectIdWiseProductData,configureProjectData,projectIdentifier}:{projectIdWiseProductData:Record<string,any>,configureProjectData:Record<string,any>,projectIdentifier:string }) {
    console.log(projectIdWiseProductData);
    // console.log(configureProjectData);
    const [openProjectModal, setOpenProjectModal] = useState<boolean>(false);
    return (
        <>
            <IconButtonWithTooltip size="smIcon" tooltipContent='Configure Project' className="self-center" style={{'margin':'0px'}} onClick={()=>{setOpenProjectModal(true)}}>
                <UserRound />
            </IconButtonWithTooltip>
            <ConfigureProjectForm open={openProjectModal} setOpen={setOpenProjectModal} configureProjectData={configureProjectData} projectIdentifier={projectIdentifier}/>
        </>
    )
}
