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
    DESCRIPTION: z.string().min(5, { message: "Description must be at least 5 characters long." }).trim(),
    VULNERABILITY: z.string().trim().optional(),
    CATEGORY: z.string().min(2, { message: "Category must be at least 2 characters long." }).trim(),
});


// export const categoryType = [
//     { value: "Physical Security", label: "Physical Security" },
//     { value: "Data Security", label: "Data Security" },
//     { value: "Compliance", label: "Compliance" },
//     { value: "Access Control", label: "Access Control" },
//     { value: "Network Security", label: "Network Security" },
//     { value: "Operational Resilience", label: "Operational Resilience" },
//     { value: "Third Party/Vendor Risk", label: "Third Party/Vendor Risk" },
//     { value: "Human Error", label: "Human Error" },
//     { value: "Business Continuity", label: "Business Continuity" },
//     { value: "Cyber Threats", label: "Cyber Threats" },
//     { value: "Legal and Regulatory", label: "Legal and Regulatory" },
//     { value: "Reputation Risks", label: "Reputation Risks" },
//     { value: "Operational Risk", label: "Operational Risk" },
// ]



export default function RiskScenarioForm({
    open,
    setOpen,
    editRiskData,
    riskCategoryData,
    riskRegisterData
}: {
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
    editRiskData: Record<string, string> | null;
    riskCategoryData: Record<string, string>[];
    riskRegisterData: Record<string, string>[];
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

    console.log("risk registered data", riskRegisterData)


    const categoryType = Object.values(riskCategoryData[0])
        .filter((item: any) => item && item.riskCategoryId && item.riskCategory) // filter out empty or invalid entries
        .map((item: any) => ({
            value: item.riskCategoryId,
            label: item.riskCategory,
        }));

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

        const riskLibraryData = {
            riskId: editRiskData ? editRiskData.riskId : v4(),
            riskLibName: data.RISK_SCENARIO,
            description: data.DESCRIPTION,
            vulnerability: data.VULNERABILITY,
            category: data.CATEGORY
        };

        // If editRiskData is provided, it means we are editing an existing risk scenario
        // Otherwise, we are creating a new one

        if (editRiskData) {
            const riskId = riskLibraryData.riskId;
            const riskLibInstances = await getMyInstancesV2({
                processName: "Risk Library",
                predefinedFilters: { taskName: "Edit Library" },
                mongoWhereClause: `this.Data.riskId == "${riskId}"`,
            })
            console.log(riskLibInstances);
            const taskId = riskLibInstances[0]?.taskId;
            console.log(taskId);

            await invokeAction({
                taskId: taskId,
                data: riskLibraryData,
                transitionName: 'Update Edit Library',
                processInstanceIdentifierField: 'riskId'
            })

            // const isAlreadyRegistered = riskRegisterData.some((entry) => entry.riskLibraryId === riskId);
            const matchedEntry = riskRegisterData.find((entry) => entry.riskLibraryId === riskId);
            console.log(matchedEntry);

            if (matchedEntry) {
                const {
                    riskLibName,
                    vulnerability,
                    description,
                    category,
                } = riskLibraryData;

                const hasChanged =
                    matchedEntry.riskName !== riskLibName ||
                    matchedEntry.riskVulnerability !== vulnerability ||
                    matchedEntry.riskDescription !== description ||
                    matchedEntry.riskCategory !== category;

                console.log('has changed value',hasChanged)

                if (hasChanged) {
                    // Update the fields
                    matchedEntry.riskName = riskLibName;
                    matchedEntry.riskVulnerability = vulnerability || "";
                    matchedEntry.riskDescription = description;
                    matchedEntry.riskCategory = category;

                    try {
                        const riskRegisterID = matchedEntry?.riskRegisterID;
                        const riskRegInstances = await getMyInstancesV2({
                            processName: "Risk Register",
                            predefinedFilters: { taskName: "Edit Register" },
                            mongoWhereClause: `this.Data.riskRegisterID == "${riskRegisterID}"`,
                        });

                        const taskId = riskRegInstances[0]?.taskId;
                        await invokeAction({
                            taskId: taskId,
                            data: matchedEntry,
                            transitionName: 'Update Edit Register',
                            processInstanceIdentifierField: 'riskRegisterID',
                        });
                    } catch (error) {
                        console.error("Failed to update risk register:", error);
                    }
                } else {
                    console.log("No changes detected in risk fields. No update required.");
                }
            }

        }
        else {
            try {
                const riskLibraryProcessId = await mapProcessName({ processName: "Risk Library" });
                console.log(riskLibraryProcessId);
                await startProcessV2({
                    processId: riskLibraryProcessId,
                    data: riskLibraryData,
                    processIdentifierFields: "riskId"
                })

                toast.success("Risk Library Started Successfully!!!", { duration: 3000 });
            } catch (error) {
                console.error("Error starting Risk Library process:", error);
                toast.error("Failed to start Risk Library process. Please try again.", { duration: 3000 });
            }

        }

        form.reset(); // Clears form fields after save/update
        router.refresh();
        setOpen(false);
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