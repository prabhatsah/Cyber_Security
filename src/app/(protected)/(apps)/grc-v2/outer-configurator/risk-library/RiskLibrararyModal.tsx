import React, { useEffect } from "react";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/shadcn/ui/dialog";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/shadcn/ui/form";
import FormInput from "@/ikon/components/form-fields/input";
import FormTextarea from "@/ikon/components/form-fields/textarea";
import { Button } from "@/shadcn/ui/button";
import { v4 } from 'uuid';
import { getMyInstancesV2, invokeAction, mapProcessName, startProcessV2 } from "@/ikon/utils/api/processRuntimeService";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import FormComboboxInput from "@/ikon/components/form-fields/combobox-input";
import { match } from "node:assert";

export const RiskScenarioFormSchema = z.object({

    RISK_SCENARIO: z.string().min(2, { message: "Risk Name must be at least 2 characters long." }).trim(),
    DESCRIPTION: z.string().min(1, { message: "Description must be at least 1 characters long." }).trim(),
    VULNERABILITY: z.string().trim().optional(),
    CATEGORY: z.string().min(2, { message: "Category must be at least 2 characters long." }).trim(),
});


export default function RiskScenarioForm({
    open,
    setOpen,
    editRiskData,
    riskCategoryData,
    profileData
}: {
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
    editRiskData: Record<string, string> | null;
    riskCategoryData: Record<string, string>[];
    profileData: string;

}) {
    const form = useForm<z.infer<typeof RiskScenarioFormSchema>>({
        resolver: zodResolver(RiskScenarioFormSchema),
        defaultValues: {
            //  RISK_ID: editRiskData ? editRiskData?.id : uuidv4,
            RISK_SCENARIO: editRiskData ? editRiskData.riskLibName : "",
            DESCRIPTION: editRiskData ? editRiskData.description : "",
            VULNERABILITY: editRiskData ? editRiskData.vulnerability : "",
            CATEGORY: editRiskData ? editRiskData.category : "",
        },
    });

    const categoryType = riskCategoryData.length > 0 && riskCategoryData[0].riskCategory
        ? Object.values(riskCategoryData[0].riskCategory)
            .filter((item: any) => item && item.riskCategoryId && item.riskCategory)
            .map((item: any) => ({
                value: item.riskCategoryId,
                label: item.riskCategory,
            }))
        : {};

    console.log("categoryType", categoryType);

    useEffect(() => {
        form.reset({
            RISK_SCENARIO: editRiskData ? editRiskData.riskLibName : "",
            DESCRIPTION: editRiskData ? editRiskData.description : "",
            VULNERABILITY: editRiskData ? editRiskData.vulnerability : "",
            CATEGORY: editRiskData ? editRiskData.category : "",
        });
    }, [editRiskData, form]);

    const router = useRouter();

    async function handleRiskSubmission(data: z.infer<typeof RiskScenarioFormSchema>) {
        console.log("Submit API here", data); // Add API logic here
        const riskId = editRiskData ? editRiskData.riskId : v4();
        const riskLibraryData = {
            riskId: riskId,
            riskLibName: data.RISK_SCENARIO,
            description: data.DESCRIPTION,
            vulnerability: data.VULNERABILITY,
            category: data.CATEGORY,
            addedOn: new Date().toISOString(),
            clientId: "global"
        };

        if (editRiskData) {
            const riskId = riskLibraryData.riskId;
            const riskLibInstances = await getMyInstancesV2({
                processName: "Global Risk Library",
                predefinedFilters: { taskName: "Edit Global Risk Library" },
                // mongoWhereClause: `this.Data.riskId == "${riskId}"`,
                processVariableFilters: {
                    'riskId': riskId,
                }
            })

            console.log(riskLibInstances);
            const taskId = riskLibInstances[0]?.taskId;
            console.log(taskId);

            await invokeAction({
                taskId: taskId,
                data: riskLibraryData,
                transitionName: 'update edit global risk library',
                processInstanceIdentifierField: 'riskId'
            })
        }
        else {
            try {
                const riskLibraryProcessId = await mapProcessName({ processName: "Global Risk Library" });
                console.log(riskLibraryProcessId);
                await startProcessV2({
                    processId: riskLibraryProcessId,
                    data: riskLibraryData,
                    processIdentifierFields: "riskId"
                })

                toast.success("Risk Library Added Successfully!!!", { duration: 3000 });
            } catch (error) {
                console.error("Error starting Risk Library process:", error);
                toast.error("Failed to start Risk Library process. Please try again.", { duration: 3000 });
            }

        }

        form.reset(); // Clears form fields after save/update
        router.refresh();
        setOpen(false);


        const ActivityLogInstance = await getMyInstancesV2({
            processName: "Global Risk Library Activity Log",
            predefinedFilters: { taskName: "Edit Activity" }
        });

        if (ActivityLogInstance.length === 0) {
            const activityLogProcessId = await mapProcessName({ processName: "Global Risk Library Activity Log" });
            const activityLogPayload = {
                lastAddedBy: profileData,
                lastAddedOn: new Date().toISOString(),
                riskAddedId: riskId,
                type: "risk_addition_global",
                activity: [
                    {
                        lastAddedBy: profileData,
                        lastAddedOn: new Date().toISOString(),
                        riskAddedId: riskId
                    }
                ]
            };
            await startProcessV2({
                processId: activityLogProcessId,
                data: activityLogPayload,
                processIdentifierFields: "lastAddedBy",
            });
        } else {
            const taskId = ActivityLogInstance[0]?.taskId;
            const updatedActivityData = ActivityLogInstance[0]?.data as Record<string, any>;

            updatedActivityData.lastAddedBy = profileData;
            updatedActivityData.lastAddedOn = new Date().toISOString();
            updatedActivityData.riskAddedId = riskId;
            updatedActivityData.activity.push({
                lastAddedBy: profileData,
                lastAddedOn: new Date().toISOString(),
                riskAddedId: riskId
            });

            await invokeAction({
                taskId: taskId,
                data: updatedActivityData,
                transitionName: 'update edit activity',
                processInstanceIdentifierField: 'lastAddedBy'
            });
        }


    }

    return (
        <Dialog open={open} onOpenChange={(isOpen) => {
            if (!isOpen) form.reset(); // Clears fields when closing
            setOpen(isOpen);
        }}>

            <DialogContent className="max-w-[50%]">
                <DialogHeader>
                    <DialogTitle>{editRiskData ? "Edit Risk Scenario" : "Add Risk Scenario"}</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <Form {...form}>
                        <form>
                            <div className="grid grid-cols-1 gap-3">
                                <FormInput formControl={form.control} name="RISK_SCENARIO" label={<>Risk Scenario<span className="text-red-500 font-bold"> *</span></>} placeholder="Enter Risk Scenario" />
                                <FormTextarea formControl={form.control} name="DESCRIPTION" label={<>Description<span className="text-red-500 font-bold"> *</span></>} placeholder="Enter Description" />
                                <FormTextarea formControl={form.control} name="VULNERABILITY" label="Vulnerability" placeholder="Enter Vulnerability" />
                                {/* <FormInput formControl={form.control} name="CATEGORY" label="Category" placeholder="Enter Category" /> */}
                                <FormComboboxInput items={categoryType} formControl={form.control} name={"CATEGORY"} placeholder={"Select Category"} label={<>Category<span className="text-red-500 font-bold"> *</span></>} />
                            </div>
                        </form>
                    </Form>
                </div>
                <DialogFooter>
                    <Button type="submit" onClick={form.handleSubmit(handleRiskSubmission)} className="mt-3">
                        {editRiskData ? "Update" : "Save"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}