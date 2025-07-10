'use client'
import { toast } from "sonner"


export function SuccessToast(){
    return toast.success('Changes Saved Successfully');
}

export function FailureToast(){
    return toast.error('Faced Error While Saving Changes');
}