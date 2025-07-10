'use client';
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/shadcn/ui/dialog";
import { ConditionForm } from "../create-notification/forms/condition-form";
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Form } from "@/shadcn/ui/form";
import { useAlarms } from "../../context/alarmsContext"
import { v4 } from "uuid";
import { useEffect } from "react";

interface LogoutDialogProps {
    open: boolean;
    onClose: () => void;
}

const formSchema = z.object({
    id: z.string().optional(),
    conditionName: z.string().min(2, {
        message: "Username must be at least 2 characters.",
    }),
    conditionOperand1: z.string(),
    thresholdCountAlertOperand1: z.string(),
    conditionOperator: z.string(),
    conditionOperand2: z.string(),
    thresholdCountAlertOperand2: z.string(),
})


export const CreateConditionModal: React.FC<LogoutDialogProps> = ({ open, onClose }) => {
    const { conditionInfo, setConditionInfo, editConditionData } = useAlarms()
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: editConditionData || {
            conditionName: "",
            thresholdCountAlertOperand1: "",
            thresholdCountAlertOperand2: "",
        },
    });
    const onSubmit = form.handleSubmit((data) => {
        if (editConditionData?.id) {
            // Editing mode
            const updatedInfo = conditionInfo.map(item =>
                item.id === editConditionData.id ? { ...data, id: editConditionData.id } : item
            );
            setConditionInfo(updatedInfo);
        } else {
            // Creating mode
            const id = v4();
            const newData = { ...data, id };
            setConditionInfo([...conditionInfo, newData]);
        }
        handleClose();
    });
    const handleClose = () => {
        form.reset();
        onClose();
    }
    useEffect(() => {
        if (open && editConditionData) {
            form.reset(editConditionData);
        } else if (!editConditionData) {
            form.reset({
                conditionName: "",
                thresholdCountAlertOperand1: "",
                thresholdCountAlertOperand2: "",
            });
        }
    }, [open, editConditionData]);
    return (
        <>
            < Dialog open={open} onOpenChange={handleClose} >
                <DialogContent className="w-3/5 max-h-[80vh] flex flex-col rounded-lg shadow-lg p-5">
                    <DialogHeader>
                        <DialogTitle className="text-lg font-semibold ml-3">Conditon</DialogTitle>
                    </DialogHeader>

                    {/* Separator */}
                    <div className="border-t"></div>

                    {/* Body Section */}
                    <div className="flex-1 overflow-y-auto">
                        <Form {...form}>
                            <ConditionForm form={form} onClose={handleClose} />
                        </Form>
                    </div>
                    {/* Footer Section */}
                    <DialogFooter>
                        <div className="flex justify-end">
                            <button
                                type="submit"
                                className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded shadow"
                                // className="bg-blue-500 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded shadow ml-2"
                                onClick={onSubmit}
                            >
                                Save
                            </button>
                        </div>
                    </DialogFooter>
                </DialogContent>
            </Dialog >
        </>
    )
}
