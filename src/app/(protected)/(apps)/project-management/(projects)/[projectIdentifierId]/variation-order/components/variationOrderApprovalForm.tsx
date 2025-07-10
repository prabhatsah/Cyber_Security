import { IconTextButtonWithTooltip } from '@/ikon/components/buttons';
import { Send } from 'lucide-react';
import React, { useState } from 'react'
import ApprovalFormSchema from './approvalFormSchema';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/shadcn/ui/alert-dialog';

export default function VariationOrderApprovalForm({ checkedRows }: { checkedRows: Record<string, any>[] }) {

    const [openVariationApprovalForm, setOpenVariationApprovalForm] = useState<boolean>(false);

    const [openAlertBox, setOpenAlertBox] = useState<boolean>(false);

    const openForm = () => {
        console.log('Creating New Variation Order Form......');
        if(checkedRows.length===0){
            setOpenAlertBox(true);
        }else{
            setOpenVariationApprovalForm(true);
        }

    }
    return (
        <>
            {
                openVariationApprovalForm &&
                <ApprovalFormSchema open={openVariationApprovalForm} setOpen={setOpenVariationApprovalForm} checkedRows={checkedRows} />
            }
            <IconTextButtonWithTooltip tooltipContent={"Variation Order Approval Form"} onClick={openForm}>
                <Send />
            </IconTextButtonWithTooltip>
            <AlertDialog open={openAlertBox} onOpenChange={setOpenAlertBox}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>No Notification Selected</AlertDialogTitle>
                        <AlertDialogDescription>
                            Please Select a Notification
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    )
}
