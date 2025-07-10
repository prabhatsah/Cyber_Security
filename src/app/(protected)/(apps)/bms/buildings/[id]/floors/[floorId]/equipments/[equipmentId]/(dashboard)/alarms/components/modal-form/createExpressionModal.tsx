'use client';
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/shadcn/ui/dialog";
import { ExpressionForm } from "../create-notification/forms/expression-form";
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
    defaultValues?: Partial<z.infer<typeof formSchema>>;
}

const formSchema = z.object({
    id: z.string().optional(),
    expName: z.string().min(2, {
        message: "Username must be at least 2 characters.",
    }),
    expType: z.string(),
    device: z.string(),
    service: z.string(),
    subService: z.string().optional(),
    operand: z.string(),
    serviceProperty: z.string().optional(),
    value: z
        .number({ invalid_type_error: "ThresholdBreachCount is required and must be a number" })
        .min(1, { message: "ThresholdBreachCount must be at least 1" }),
}).refine((data) => {
    if (data.expType === "probeDevice") {
        return data.value !== undefined && data.value !== null;
    } else {
        return data.serviceProperty !== undefined && data.serviceProperty !== "";
    }
}, {
    message: "Either serviceValue or serviceStatus must be provided based on conditionType",
    // path: ["conditionTypeSelect"], // optional: show error related to this field
});


export const CreateExpressionModal: React.FC<LogoutDialogProps> = ({ open, onClose, defaultValues }) => {
    const { expressionInfo, setExpressionInfo } = useAlarms()
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: defaultValues || {
            expName: "",
            expType: "targetDevice",
            value: 0,
        },
    });
    const onSubmit = form.handleSubmit((data) => {
        if (defaultValues?.id) {
            // Editing mode
            const updatedInfo = expressionInfo.map(expr =>
                expr.id === defaultValues.id ? { ...data, id: defaultValues.id } : expr
            );
            setExpressionInfo(updatedInfo);
        } else {
            // Creating mode
            const id = v4();
            const newData = { ...data, id };
            setExpressionInfo([...expressionInfo, newData]);
        }
        handleClose();
    });
    const handleClose = () => {
        form.reset(); // ✅ reset form on close
        onClose();
    }
    useEffect(() => {
        if (open && defaultValues) {
            form.reset(defaultValues);
        }else if (!defaultValues) {
            form.reset({
                expName: "",
                expType: "targetDevice",
                value: 0,
            },);
          }
    }, [open, defaultValues]);
    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent className="w-3/5 max-h-[80vh] flex flex-col rounded-lg shadow-lg p-5">
                <DialogHeader>
                    <DialogTitle className="text-lg font-semibold ml-3">Expression Name</DialogTitle>
                </DialogHeader>

                {/* Separator */}
                <div className="border-t"></div>

                {/* Body Section */}
                <div className="flex-1 overflow-y-auto">
                    <Form {...form}>
                        <ExpressionForm form={form} onClose={handleClose} />
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
        </Dialog>
    )
}
