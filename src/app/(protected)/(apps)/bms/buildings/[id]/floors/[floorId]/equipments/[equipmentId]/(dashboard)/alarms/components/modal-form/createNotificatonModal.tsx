'use client';
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/shadcn/ui/dialog";
import { CreateNotification } from "../create-notification";
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { notificationInstanceSubmit, editNotificationInstanceSubmit } from "../../action"
import { z } from "zod"
import { useAlarms } from "../../context/alarmsContext"
import { useEffect } from "react";
import { v4 } from "uuid";

interface LogoutDialogProps {
    open: boolean;
    onClose: () => void;
}

const formSchema = z.object({
    notification_name: z.string().min(2, {
        message: "Username must be at least 2 characters.",
    }),
    threshold_breach_count: z
        .number({ invalid_type_error: "ThresholdBreachCount is required and must be a number" })
        .min(1, { message: "ThresholdBreachCount must be at least 1" }),
    frequency_of_occurence: z
        .number({ invalid_type_error: "ThresholdBreachCount is required and must be a number" })
        .min(1, { message: "ThresholdBreachCount must be at least 1" }),
    notification_evaluation_interval: z
        .number({ invalid_type_error: "ThresholdBreachCount is required and must be a number" })
        .min(1, { message: "ThresholdBreachCount must be at least 1" }),
    description: z.string().min(2, {
        message: "Username must be at least 2 characters.",
    }),
    alertActionType: z.string(),
    commandActionType: z.string(),
    associatedCommandId: z.string().optional(),
    apiId: z.string().optional(),
    alertSubject: z.string().min(2, {
        message: "Username must be at least 2 characters.",
    }),
    alertAddress: z.string().min(2, {
        message: "Username must be at least 2 characters.",
    }),
    alertEmailBody: z.string().min(2, {
        message: "Username must be at least 2 characters.",
    }),
    userSelected: z.array(z.string()),
    recipientGroup: z.array(z.string()),
});

export const CreateNotificationModal: React.FC<LogoutDialogProps> = ({ open, onClose }) => {
    const { conditionInfo, expressionInfo, editAlertData, viewMode } = useAlarms();
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: editAlertData || {
            notification_name: "",
            threshold_breach_count: 1,
            frequency_of_occurence: 3,
            notification_evaluation_interval: 2,
            description: "",
            alertActionType: "radioEmail",
            commandActionType: "commandActionNo",
            alertSubject: "",
            alertAddress: "",
            alertEmailBody: "",
        },
    });
    const onSubmit = form.handleSubmit(async (data: z.infer<typeof formSchema>) => {
        console.log("Form submitted:", data);
        if (editAlertData?.id) {
            // Editing mode
            const id = editAlertData.id;
            const newData = { ...data, id };
            await editNotificationInstanceSubmit(newData, expressionInfo, conditionInfo);
        } else {
            const id = v4();
            const newData = { ...data, id };
            await notificationInstanceSubmit(newData, expressionInfo, conditionInfo);
        }
        form.reset();
        onClose();
    });
    function handleClose() {
        form.reset(); // ✅ reset form on close
        onClose();
    }
    useEffect(() => {
        if (open && editAlertData) {
          form.reset(editAlertData); // Populate form with edit data when modal opens
        } else if (!editAlertData) {
          form.reset({
            notification_name: "",
            threshold_breach_count: 1,
            frequency_of_occurence: 3,
            notification_evaluation_interval: 2,
            description: "",
            alertActionType: "radioEmail",
            commandActionType: "commandActionNo",
            alertSubject: "",
            alertAddress: "",
            alertEmailBody: "",
          });
        }
      }, [open, editAlertData]);
      
    return (
        <Dialog open={open} onOpenChange={(isOpen) => {
            if (!isOpen) {
                onClose();     // Close the modal
                setTimeout(() => {
                    form.reset(); // now editAlertData is null and form clears correctly
                }, 300); // Adjust the timeout as needed
            }
        }}>
            <DialogContent className="w-4/5 sm:max-w-[425px] md:max-w-[1024px] lg:max-w-[1024px] max-h-[80vh] flex flex-col rounded-lg shadow-lg p-5">
                <DialogHeader>
                    <DialogTitle className="text-lg font-semibold ml-3">Create Alert</DialogTitle>
                </DialogHeader>

                {/* Separator */}
                <div className="border-t"></div>

                {/* Body Section */}
                <div className="flex-1 overflow-y-auto">
                    <CreateNotification onClose={onClose} form={form} />
                </div>
                {/* Footer Section */}
                <DialogFooter>
                    {!viewMode && (<div className="flex justify-end">
                        <button
                            type="button"
                            className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded shadow mr-2"
                            onClick={handleClose}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded shadow"
                            // className="bg-blue-500 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded shadow ml-2"
                            onClick={onSubmit}
                        >
                            {!editAlertData ? <span>Create Notification</span> : <span>Update Notification</span>}
                        </button>
                    </div>)}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
