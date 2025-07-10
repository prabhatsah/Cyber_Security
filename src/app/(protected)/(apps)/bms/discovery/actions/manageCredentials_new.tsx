'use client'
import Tabs from "@/ikon/components/tabs";
import CredComponent from "../credentials/CredComponent";
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/shadcn/ui/dialog";
import { Tooltip } from "@/ikon/components/tooltip";
import { IconTextButton, IconTextButtonWithTooltip } from "@/ikon/components/buttons";
import { Save, ShieldAlert, Ticket } from "lucide-react";
import { useRef, useState } from "react";

import Alert from "@/ikon/components/alert-dialog";
import { getMyInstancesV2, invokeAction } from "@/ikon/utils/api/processRuntimeService";
import { getProfileData } from "@/ikon/utils/actions/auth";

import { useToast } from "@/shadcn/hooks/use-toast";
import { Toaster } from "@/shadcn/ui/toaster";
import { GlobalCredProvider } from "./context/credContext";
import { Button } from "@/shadcn/ui/button";





export default function CredentialForm() {
    const refBtn = useRef(null)
    const closeModalRef = useRef(null)
    const [tokenGenerating, setTokengenerating] = useState<boolean>(false)
    const [saveCredential, setSaveCredential] = useState<boolean>(false)
    //const [token,setToken] = useState<string>('')
    const { toast } = useToast()

    return (
        <>
            <Toaster />
            {saveCredential && <Alert cancelText="No" confirmText="Yes" title={"Do you want to save the changes?"} onConfirm={
                ()=>{
                    if (refBtn.current){
                        refBtn.current.click(); //saving form
                        closeModalRef.current.click(); //closing modal
                    }
                        
                    setSaveCredential(false)
                }
            } onCancel={()=>{
                setSaveCredential(false)
            } }
            />} 
            {tokenGenerating && <Alert cancelText="No" confirmText="Yes" title={"Do you want to generate Token?"}
                onConfirm={async () => {
                    debugger
                    //function to generate token
                    const profiledata = await getProfileData()
                    const fetchData = await getMyInstancesV2({
                        processName: 'User Token',
                        predefinedFilters: { taskName: "Token Generated" },
                        processVariableFilters: { "id": profiledata.USER_ID },
                    })
                    debugger
                    if (fetchData.length > 0) {
                        debugger
                        setTokengenerating(false)
                        invokeAction({
                            taskId: fetchData[0].taskId,
                            transitionName: 'Regenerate Token',
                            data: { "id": profiledata.USER_ID },
                            processInstanceIdentifierField: "id"
                        })
                        toast({
                            title: "Token Generated Successfully",
                            description: "Check your Mail to Proceed",
                        })
                    }

                    //
                    //setToken('soumyadeep')

                }}
                onCancel={() => {
                    setTokengenerating(false)
                }}
            />}
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
                    <GlobalCredProvider>

                        <Tabs
                            tabArray={
                                [{ tabId: "windowscred", tabName: "Windows Credentials", default: true, tabContent: <CredComponent type="Windows" ref={refBtn} /> },
                                { tabId: "sshcred", tabName: "SSH Credential", default: false, tabContent: <CredComponent type="SSH" ref={refBtn} /> },
                                { tabId: "snmpcred", tabName: "SNMP Credential", default: false, tabContent: <CredComponent type="SNMP" ref={refBtn} /> },
                                { tabId: "apicred", tabName: "Parameter Credential", default: false, tabContent: <CredComponent type="Parameter" ref={refBtn} /> }]
                            }
                            tabListClass="border rounded-md bg-[#bebbbf] opacity-50 p-2"
                            tabListInnerClass="justify-between"
                            tabListButtonClass="w-1/4 justify-center rounded-md"



                        />
                    </GlobalCredProvider>
                    <div className="flex justify-end">

                        <IconTextButtonWithTooltip tooltipContent={'Generate Token'} className="me-2" onClick={() => {
                            setTokengenerating(true)
                        }} ><Ticket />Generate Token</IconTextButtonWithTooltip>
                        <IconTextButtonWithTooltip tooltipContent={'Save'} onClick={() => {

                            // if (refBtn.current)

                            //     refBtn.current.click();
                            setSaveCredential(true)

                        }}><Save />Save</IconTextButtonWithTooltip>
                    </div>


                    <DialogFooter className="sm:justify-start">
                        <DialogClose asChild>
                            <Button type="button" variant="secondary" className="hidden" ref={closeModalRef}>
                                Close
                            </Button>
                        </DialogClose>
                    </DialogFooter>

                </DialogContent>

            </Dialog>
        </>


    )



}