import { Tooltip } from "@/ikon/components/tooltip";
import { IconTextButton } from "@/ikon/components/buttons";
import { Save, ShieldAlert, Ticket } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/shadcn/ui/dialog";

import Tabs from "@/ikon/components/tabs";


import {  useState } from "react";

import CredComponent from "../credentials/CredComponent";


export default function ManageCredentails() {
   
    return (
        <>
            <Dialog>
                <Tooltip tooltipContent={"Manage Credentials"}>
                    <DialogTrigger asChild>

                        <IconTextButton>
                            <ShieldAlert />
                        </IconTextButton>

                    </DialogTrigger>
                </Tooltip>
                <DialogContent className="sm:max-w-[1000px]">
                    <DialogHeader>
                        <DialogTitle>Manage Credentials</DialogTitle>

                    </DialogHeader>
                    <Tabs 
                    tabArray={
                        [{ tabId: "windowscred", tabName: "Windows Credentials",default:true,tabContent:<CredComponent type="Windows"/> }, 
                        { tabId: "sshcred", tabName: "SSH Credential",default:false,tabContent:<CredComponent type="SSH"/> },
                        { tabId: "snmpcred", tabName: "SNMP Credential",default:false,tabContent: <CredComponent type="SNMP"/>},
                        { tabId: "apicred", tabName: "API Credential",default:false,tabContent: <CredComponent type="Parameter"/>}]
                    }
                    tabListClass="border rounded-md bg-[#bebbbf] opacity-50 p-2"
                    tabListInnerClass="justify-between"
                    tabListButtonClass="w-1/4 justify-center rounded-md"
                

                     />
                    <DialogFooter>
                        <IconTextButton><Ticket />Generate Token</IconTextButton>
                        <IconTextButton><Save />Save</IconTextButton>
                    </DialogFooter>
                </DialogContent>
            </Dialog>


        </>
    )
}