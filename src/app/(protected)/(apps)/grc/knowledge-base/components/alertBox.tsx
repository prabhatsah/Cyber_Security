import React from 'react'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/shadcn/ui/alert-dialog';

export default function AlertBox({ openAlertBox, setOpenAlertBox, message, distributeObjectiveWeights, index }: any) {
    return (
        <AlertDialog open={openAlertBox} onOpenChange={setOpenAlertBox}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Auto Calculation of Weightage</AlertDialogTitle>
                    <AlertDialogDescription>
                        <span className='flex flex-col gap-3'>
                            {message.map((messageText: string, index: number) => {
                                return (
                                    <span key={index}>
                                        {messageText}
                                    </span>
                                )
                            })}
                        </span>
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel onClick={() => setOpenAlertBox(false)}>
                        Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction onClick={() => { setOpenAlertBox(false), distributeObjectiveWeights(index) }}>
                        Continue
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>

    )
}

export function SaveAlertBox({ openAlertBox, setOpenAlertBox, message }: any) {
    return (
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
    )
}

export function DeletePoliciesObj({ openAlertBox, setOpenAlertBox, message, indexName, deleteFn }: any) {
    return (
        <AlertDialog open={openAlertBox} onOpenChange={setOpenAlertBox}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Delete Message</AlertDialogTitle>
                    <AlertDialogDescription>
                        {message}
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel onClick={() => setOpenAlertBox(false)}>
                        Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction onClick={() => {
                        deleteFn(indexName)
                        setOpenAlertBox(false)
                    }}>
                        Continue
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}

export function DeleteObjCtrl({ openAlertBox, setOpenAlertBox, message, indexName, objIndexName, deleteFn }: any) {
    return (
        <AlertDialog open={openAlertBox} onOpenChange={setOpenAlertBox}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Delete Message</AlertDialogTitle>
                    <AlertDialogDescription>
                        {message}
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel onClick={() => setOpenAlertBox(false)}>
                        Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction onClick={() => {
                        deleteFn(indexName,objIndexName)
                        setOpenAlertBox(false)
                    }}>
                        Continue
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
