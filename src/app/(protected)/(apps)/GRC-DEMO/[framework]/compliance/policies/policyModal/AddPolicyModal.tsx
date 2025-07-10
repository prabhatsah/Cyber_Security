import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/shadcn/ui/dialog";
import { Button } from "@/shadcn/ui/button";
import FormInput from "@/ikon/components/form-fields/input";
import FormComboboxInput from "@/ikon/components/form-fields/combobox-input";
import FormTextarea from "@/ikon/components/form-fields/textarea";
import { getMyInstancesV2, invokeAction, mapProcessName, startProcessV2 } from "@/ikon/utils/api/processRuntimeService";
import { useRouter } from "next/navigation";
import { v4 } from "uuid";
import { useRef } from "react";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shadcn/ui/form';
import { GroupedCheckboxDropdown, OptionGroup } from '@/shadcn/ui/grouped-checkbox-dropdown';

export const PolicyFormSchema = z.object({
    POLICY_TITLE: z.string().min(1, "Policy title is required"),
    POLICY_OWNER: z.string().min(1, "Policy owner is required"),
    POLICY_STATEMENT: z.string().min(1, "Policy statement is required"),
    STATUS: z.string().min(1, "Status is required"),
    POLICY_CATEGORY: z.string().optional(),
    REL_FRAME: z.array(z.string().min(1, { message: "Each item must be non-empty" })).optional(),
    REL_RISK: z.string().optional(),
    PURPOSE: z.string().optional(),
    SCOPE: z.string().optional(),
});

export const statusType = [
    { value: "Draft", label: "Draft" },
    { value: "Under Review", label: "Under Review" },
    { value: "Approved", label: "Approved" },
    // { value: "Published", label: "Published" },
];

export default function PolicyModalForm({ open, setOpen, userIdNameMap, riskLibraryData, riskCategoryData, profileData, editPolicy, dropDownControl }: { open: boolean; setOpen: React.Dispatch<React.SetStateAction<boolean>>; userIdNameMap: { value: string; label: string }[]; riskLibraryData: Record<string, any>[]; riskCategoryData: Record<string, any>[]; profileData: Record<string, any>, editPolicy: Record<string, any> | null; dropDownControl: { id: string; label: string; options: { id: string; label: string; description: string }[] }[] }) {
    const router = useRouter();
    const form = useForm<z.infer<typeof PolicyFormSchema>>({
        resolver: zodResolver(PolicyFormSchema),
        defaultValues: {
            POLICY_TITLE: editPolicy ? editPolicy.policyTitle : "",
            POLICY_OWNER: editPolicy ? editPolicy.policyOwner : "",
            POLICY_STATEMENT: editPolicy ? editPolicy.policyStatement : "",
            STATUS: editPolicy ? editPolicy.status : "Draft",
            POLICY_CATEGORY: editPolicy ? editPolicy.policyCategory : "",
            REL_FRAME: editPolicy ? editPolicy.relatedFramework : [],
            REL_RISK: editPolicy ? editPolicy.relatedRisk : "",
            PURPOSE: editPolicy ? editPolicy.purpose : "",
            SCOPE: editPolicy ? editPolicy.scope : "",
        },
    });
    const submitTypeRef = useRef<"save" | "approval" | "approve" | "reject">("save");
    const isReadOnly = editPolicy?.status === "Under Review";

    const categoryType = Object.values(riskCategoryData[0])
        .filter((item: any) => item && item.riskCategoryId && item.riskCategory)
        .map((item: any) => ({
            value: item.riskCategoryId,
            label: item.riskCategory,
        }));

    // const riskType = riskLibraryData
    //     .map((item) => ({
    //         value: item.riskId,
    //         label: item.riskLibName,
    //     }));
    const riskType = riskLibraryData.map(item => ({
        value: item.riskId,
        label: item.riskLibName.length > 50
            ? item.riskLibName.slice(0, 50) + "..."
            : item.riskLibName,
    }));

    async function savePolicyInfo(data: z.infer<typeof PolicyFormSchema>) {
        const sentForApproval = submitTypeRef.current === "approve";
        const status = submitTypeRef.current;

        const policyData = {
            policyId: editPolicy?.policyId || v4(),
            policyTitle: data.POLICY_TITLE?.trim(),
            policyOwner: data.POLICY_OWNER || "",
            policyStatement: data.POLICY_STATEMENT || "",
            // status: approved ? "Approved" : sentForApproval ? "Under Review" : "Draft",
            status: status === "approve" ? "Approved" : status === "reject" ? "Draft" : status === "save" ? "Draft" : "Under Review",
            policyCategory: data.POLICY_CATEGORY,
            relatedFramework: data.REL_FRAME,
            relatedRisk: data.REL_RISK,
            purpose: data.PURPOSE,
            scope: data.SCOPE,
            sentForApproval: sentForApproval,
            createdBy: profileData.USER_ID,
            createdOn: new Date().toISOString(),
        };
        console.log("Policy Data:", policyData);

        try {
            if (editPolicy) {
                const policyInstances = await getMyInstancesV2({
                    processName: "Add Policy",
                    predefinedFilters: { taskName: "Edit Policy" },
                    mongoWhereClause: `this.Data.policyId == "${editPolicy.policyId}"`,
                });

                const taskId = policyInstances[0]?.taskId;
                await invokeAction({
                    taskId,
                    data: policyData,
                    transitionName: "Update Edit Policy",
                    processInstanceIdentifierField: "policyId",
                });
            } else {
                const policyProcessId = await mapProcessName({ processName: "Add Policy" });
                await startProcessV2({
                    processId: policyProcessId,
                    data: policyData,
                    processIdentifierFields: "policyId",
                });
            }

            setOpen(false);
            router.refresh();
        } catch (error) {
            console.error("Failed to process policy form:", error);
        }
    }

    async function saveAsDraftHandler() {
        submitTypeRef.current = "save";

        const values = form.getValues();
        if (!values.POLICY_TITLE?.trim()) {
            form.setError("POLICY_TITLE", { type: "manual", message: "Policy title is required" });
            return;
        }

        await savePolicyInfo(values);
    }


    async function handleApprove() {
        if (!editPolicy) return;
        submitTypeRef.current = "approve";
        await savePolicyInfo(form.getValues());
    }

    async function handleReject() {
        if (!editPolicy) return;
        submitTypeRef.current = "reject";
        await savePolicyInfo(form.getValues());
    }


    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="max-w-[60%] max-h-[90%] overflow-y-auto" onInteractOutside={(e) => e.preventDefault()}>
                <DialogHeader>
                    <DialogTitle>{editPolicy ? "Edit" : "Add "} Policy</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <Form {...form}>
                        <form>
                            <div className="grid grid-cols-2 gap-3 mb-3">
                                <FormInput formControl={form.control} name="POLICY_TITLE" placeholder="Enter policy title"
                                    label={<>Policy Title<span className="text-red-500 font-bold"> *</span></>}
                                    disabled={isReadOnly}
                                />
                                <FormComboboxInput items={userIdNameMap} formControl={form.control} name={"POLICY_OWNER"} placeholder="Select policy owner"
                                    label={<>Policy Owner<span className="text-red-500 font-bold"> *</span></>}
                                    disabled={isReadOnly}
                                />
                            </div>

                            <div className="grid grid-cols-1 gap-3 mb-3">
                                <FormTextarea formControl={form.control} name="POLICY_STATEMENT" className="resize-y max-h-[100px] w-full" formItemClass="w-full"
                                    label={<>Policy Statement<span className="text-red-500 font-bold"> *</span></>}
                                    disabled={isReadOnly}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-3 mb-3">
                                <FormComboboxInput items={statusType} formControl={form.control} name={"STATUS"} placeholder="Select status"
                                    label={<>Status<span className="text-red-500 font-bold"> *</span></>}
                                    disabled={isReadOnly}
                                />
                                <FormComboboxInput items={categoryType} formControl={form.control} name={"POLICY_CATEGORY"} placeholder="Select policy category" label="Policy Category" disabled={isReadOnly} />
                            </div>
                            <div className="grid grid-cols-2 gap-3 mb-3">
                                {/* <FormComboboxInput items={[]} formControl={form.control} name={"REL_FRAME"} placeholder="Select related framework" label="Related Standard/Framework" /> */}
                                <FormField
                                    control={form.control}
                                    name="REL_FRAME"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Related Standard/Framework</FormLabel>
                                            <FormControl>
                                                <GroupedCheckboxDropdown
                                                    groups={dropDownControl}
                                                    value={field.value}
                                                    onChange={field.onChange}
                                                    placeholder="Select related framework"
                                                    searchPlaceholder="Search ISO Control/Clause"
                                                    multiSelect={true}
                                                    disabled={isReadOnly}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormComboboxInput items={riskType} formControl={form.control} name={"REL_RISK"} placeholder="Select related risk" label="Related Risk" disabled={isReadOnly} />
                            </div>
                            <div className="grid grid-cols-2 gap-3 mb-3">
                                <FormTextarea formControl={form.control} name="PURPOSE" className="resize-y max-h-[100px] w-full" formItemClass="w-full" label="Purpose" disabled={isReadOnly} />
                                <FormTextarea formControl={form.control} name="SCOPE" className="resize-y max-h-[100px] w-full" formItemClass="w-full" label="Scope" disabled={isReadOnly} />
                            </div>
                        </form>
                    </Form>
                </div>
                <DialogFooter>
                    <DialogFooter>
                        {editPolicy && editPolicy.status === "Under Review" ? (
                            <>
                                <Button type="button" onClick={handleApprove}>
                                    Approve
                                </Button>
                                <Button type="button" onClick={handleReject}>
                                    Reject
                                </Button>
                            </>
                        ) : (
                            <>
                                <Button
                                    type="submit"
                                    onClick={() => {
                                        submitTypeRef.current = "approval";
                                        form.handleSubmit(savePolicyInfo)();
                                    }}
                                >
                                    Send for Approval
                                </Button>
                                <Button type="button" onClick={saveAsDraftHandler}>
                                    {editPolicy ? "Update" : "Save"}
                                </Button>
                            </>
                        )}

                    </DialogFooter>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}