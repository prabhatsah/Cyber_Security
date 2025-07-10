import { AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/shadcn/ui/alert-dialog'
import React from 'react'

export default function AlertDialogFn({openAlertBox,setOpenAlertBox,message}:{
    openAlertBox: boolean,
    setOpenAlertBox: React.Dispatch<React.SetStateAction<boolean>>,
    message: string
}) {
    return (
        <>

            <AlertDialog open={openAlertBox} onOpenChange={setOpenAlertBox}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Validation Message</AlertDialogTitle>
                        <AlertDialogDescription>
                            {message}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={() => {
                            setOpenAlertBox(false)
                            message = ''
                        }}>
                            Cancel
                        </AlertDialogCancel>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

        </>
    )
}
