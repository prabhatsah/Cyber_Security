"use client";
import FormComboboxInput from "@/ikon/components/form-fields/combobox-input";
import FormDateInput from "@/ikon/components/form-fields/date-input";
import FormInput from "@/ikon/components/form-fields/input";
import FormTextarea from "@/ikon/components/form-fields/textarea";
import { getMyInstancesV2, invokeAction, mapProcessName, startProcessV2 } from "@/ikon/utils/api/processRuntimeService";
import { SAVE_DATE_FORMAT_GRC } from "@/ikon/utils/config/const";
import { Button } from "@/shadcn/ui/button";
import { CustomComboboxInput } from "@/shadcn/ui/custom-single-dropdown";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/shadcn/ui/dialog";
import { Form } from "@/shadcn/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { v4 } from "uuid";
import z from "zod";

export const RegisterFormSchema = z.object({
    RISK_NAME: z.string().min(2, { message: "Risk should be selected." }).trim(),
    RISK_DESCRIPTION: z.string().min(2, { message: "Risk description should be at least 2 characters long." }).trim(),
    THREAT_DESCRIPTION: z.string().optional(),
    RISK_VULNERABILITY: z.string().optional(),
    ASSET: z.string().optional(),
    ASSET_FUNCTION: z.string().optional(),
    RISK_CATEGORY: z.string().min(2, { message: "Category should be selected." }).trim(),
    EXISTING_CONTROLS: z.string().optional(),
    RISK_IMPACT: z.string().min(2, { message: "Risk Impact is mandatory" }).trim(),
    RISK_LIKELIHOOD: z.string().min(1, { message: "Risk Likelihood is mandatory" }).trim(),
    RISK_SCORE: z.number().optional(),
    WEIGHTED_RISK: z.number().optional(),
    RISK_TREATMENT: z.string().optional(),
    TREATMENT_PLAN: z.string().optional(),
    JUSTIFICATION_TREATMENT_PLAN: z.string().optional(),
    RISK_OWNER: z.string().min(2, { message: "Risk owner should be selected." }).trim(),
    RESIDUAL_IMPACT: z.string().optional(),
    RESIDUAL_LIKELIHOOD: z.string().optional(),
    RESIDUAL_SCORE: z.number().optional(),
    WEIGHTED_RESIDUAL: z.number().optional(),
    RISK_IMPLEMENTER: z.string().optional(),
    ACTION_TRACKING: z.string().optional(),
    DUE_DATE: z.date().optional(),
    TREATMENT_STATUS: z.string().optional(),
    ASSOCIATED_CONTROLS: z.string().optional(),
});

export const likelihoodType = [
    { value: "1", label: "Rare" },
    { value: "2", label: "Unlikely" },
    { value: "3", label: "Possible" },
    { value: "4", label: "Likely" },
    { value: "5", label: "Almost Certain" },
];
export const riskTreatmentType = [
    { value: "Accept", label: "Accept" },
    { value: "Mitigate", label: "Mitigate" },
    { value: "Transfer", label: "Transfer" },
    { value: "Avoid", label: "Avoid" },
];
export const treatmentStatus = [
    { value: "In Progress", label: "In Progress" },
    { value: "Open", label: "Open" },
    { value: "Resolved", label: "Resolved" },
    { value: "Not Started", label: "Not Started" },
    { value: "On Hold", label: "On Hold" },
];

export default function RiskRegisterForm({ open, setOpen, userIdNameMap, profileData, riskLibraryData, riskRegisterData, riskCategoryData, riskImpactData, editRisk }: { open: boolean; setOpen: React.Dispatch<React.SetStateAction<boolean>>; userIdNameMap: { value: string; label: string }[]; profileData: Record<string, any>; riskLibraryData: any[]; riskRegisterData: any[]; riskCategoryData: any[]; riskImpactData: any[]; editRisk: Record<string, string> | null }) {
    const router = useRouter();

    const registeredRiskLibraryIds = new Set(riskRegisterData.map(item => item.riskLibraryId));
    const riskLibNameOptions = riskLibraryData
        .filter(item => !registeredRiskLibraryIds.has(item.riskId))
        .map((item) => ({
            value: item.riskId,
            label: item.riskLibName,
        }));

    const categoryType = Object.values(riskCategoryData[0])
        .filter((item: any) => item && item.riskCategoryId && item.riskCategory)
        .map((item: any) => ({
            value: item.riskCategoryId,
            label: item.riskCategory,
        }));

    const impactType = Object.values(riskImpactData[0])
        .filter((item: any) => item && item.riskImpactId && item.riskImpact)
        .map((item: any) => ({
            value: item.riskImpactId.toString(),
            label: item.riskImpact,
        }));

    const form = useForm<z.infer<typeof RegisterFormSchema>>({
        resolver: zodResolver(RegisterFormSchema),
        defaultValues: {
            RISK_NAME: editRisk?.riskName || "",
            RISK_DESCRIPTION: editRisk?.riskDescription || "",
            THREAT_DESCRIPTION: editRisk?.threatDescription || "",
            RISK_VULNERABILITY: editRisk?.riskVulnerability || "",
            ASSET: editRisk?.asset || "",
            ASSET_FUNCTION: editRisk?.assetFunction || "",
            RISK_CATEGORY: editRisk?.riskCategory || "",
            EXISTING_CONTROLS: editRisk?.existingControls || "",
            RISK_IMPACT: editRisk?.riskImpact || "",
            RISK_LIKELIHOOD: editRisk?.riskLikelihood || "",
            RISK_SCORE: 0,
            WEIGHTED_RISK: 0,
            RISK_TREATMENT: editRisk?.riskTreatment || "",
            TREATMENT_PLAN: editRisk?.treatmentPlan || "",
            JUSTIFICATION_TREATMENT_PLAN: editRisk?.justificationTreatmentPlan || "",
            RISK_OWNER: editRisk?.riskOwner || "",
            RESIDUAL_IMPACT: editRisk?.residualImpact || "",
            RESIDUAL_LIKELIHOOD: editRisk?.residualLikelihood || "",
            RESIDUAL_SCORE: 0,
            WEIGHTED_RESIDUAL: 0,
            RISK_IMPLEMENTER: editRisk?.riskImplementer || "",
            ACTION_TRACKING: editRisk?.actionTracking || "",
            DUE_DATE: (editRisk?.dueDate && new Date(editRisk.dueDate)) || undefined,
            TREATMENT_STATUS: editRisk?.treatmentStatus || "",
            ASSOCIATED_CONTROLS: editRisk?.associatedControls || "",
        },
    });

    // Calculate risk scores when impact or likelihood changes
    useEffect(() => {
        const riskImpact = form.watch("RISK_IMPACT");
        const riskLikelihood = form.watch("RISK_LIKELIHOOD");

        if (riskImpact && riskLikelihood) {
            // Find the selected impact in riskImpactData
            const impactEntry = Object.values(riskImpactData[0]).find(
                (item: any) => item.riskImpactId.toString() === riskImpact
            );

            if (impactEntry) {
                const impactValue = (impactEntry as any).riskValue;
                const impactWeightage = (impactEntry as any).riskImpactWeightage;
                const likelihoodValue = parseInt(riskLikelihood);

                // Calculate RISK_SCORE (impactValue * likelihoodValue)
                const riskScore = impactValue * likelihoodValue;
                form.setValue("RISK_SCORE", riskScore);

                // Calculate WEIGHTED_RISK (impactValue * impactWeightage * likelihoodValue)
                const weightedRisk = impactValue * impactWeightage * likelihoodValue;
                form.setValue("WEIGHTED_RISK", weightedRisk);
            }
        }
    }, [form.watch("RISK_IMPACT"), form.watch("RISK_LIKELIHOOD")]);

    // Calculate residual scores when impact or likelihood changes
    useEffect(() => {
        const residualImpact = form.watch("RESIDUAL_IMPACT");
        const residualLikelihood = form.watch("RESIDUAL_LIKELIHOOD");

        if (residualImpact && residualLikelihood) {
            // Find the selected impact in riskImpactData
            const impactEntry = Object.values(riskImpactData[0]).find(
                (item: any) => item.riskImpactId.toString() === residualImpact
            );

            if (impactEntry) {
                const impactValue = (impactEntry as any).riskValue;
                const impactWeightage = (impactEntry as any).riskImpactWeightage;
                const likelihoodValue = parseInt(residualLikelihood);

                // Calculate RESIDUAL_SCORE
                const residualScore = impactValue * likelihoodValue;
                form.setValue("RESIDUAL_SCORE", residualScore);

                // Calculate WEIGHTED_RESIDUAL
                const weightedResidual = impactValue * impactWeightage * likelihoodValue;
                form.setValue("WEIGHTED_RESIDUAL", weightedResidual);
            }
        }
    }, [form.watch("RESIDUAL_IMPACT"), form.watch("RESIDUAL_LIKELIHOOD")]);

    const selectedRiskId = form.watch("RISK_NAME");
    useEffect(() => {
        const matched = riskLibraryData.find((item) => item.riskId === selectedRiskId);
        if (matched && !editRisk) {
            form.setValue("RISK_DESCRIPTION", matched.description);
            form.setValue("RISK_VULNERABILITY", matched.vulnerability);
            form.setValue("RISK_CATEGORY", matched.category);
        }
    }, [selectedRiskId, riskLibraryData, form, editRisk]);

    async function saveIncidentInfo(data: z.infer<typeof RegisterFormSchema>) {
        const selectedLibraryEntry = riskLibraryData.find(libItem => libItem.riskId === data.RISK_NAME);
        const selectedLikelihood = likelihoodType.find(likeItem => likeItem.value === data.RISK_LIKELIHOOD);
        const selectedResidualLikelihood = likelihoodType.find(likeItem => likeItem.value === data.RESIDUAL_LIKELIHOOD);
        const selectedImpact = impactType.find(impItem => impItem.value === data.RISK_IMPACT);
        const selectedResidualImpact = impactType.find(impItem => impItem.value === data.RESIDUAL_IMPACT);

        const riskRegisterPayload = {
            riskLibraryId: selectedLibraryEntry ? selectedLibraryEntry.riskId : (editRisk ? editRisk.riskLibraryId : ""),
            riskRegisterID: editRisk ? editRisk.riskRegisterID : v4(),
            riskName: data.RISK_NAME,
            riskDescription: data.RISK_DESCRIPTION,
            threatDescription: data.THREAT_DESCRIPTION,
            riskVulnerability: data.RISK_VULNERABILITY,
            asset: data.ASSET,
            assetFunction: data.ASSET_FUNCTION,
            riskCategory: data.RISK_CATEGORY,
            existingControls: data.EXISTING_CONTROLS,
            riskImpact: selectedImpact ? selectedImpact.label : (editRisk ? editRisk.riskImpact : ""),
            riskLikelihood: selectedLikelihood ? selectedLikelihood.label : (editRisk ? editRisk.riskLikelihood : ""),
            riskScore: data.RISK_SCORE,
            weightedRisk: data.WEIGHTED_RISK,
            riskTreatment: data.RISK_TREATMENT,
            treatmentPlan: data.TREATMENT_PLAN,
            justificationTreatmentPlan: data.JUSTIFICATION_TREATMENT_PLAN,
            riskOwner: data.RISK_OWNER,
            residualImpact: selectedResidualImpact ? selectedResidualImpact.label : (editRisk ? editRisk.residualImpact : ""),
            residualLikelihood: selectedResidualLikelihood ? selectedResidualLikelihood.label : (editRisk ? editRisk.residualLikelihood : ""),
            residualScore: data.RESIDUAL_SCORE,
            weightedResidual: data.WEIGHTED_RESIDUAL,
            riskImplementer: data.RISK_IMPLEMENTER,
            actionTracking: data.ACTION_TRACKING,
            dueDate: data.DUE_DATE ? format(data.DUE_DATE, SAVE_DATE_FORMAT_GRC) : undefined,
            treatmentStatus: data.TREATMENT_STATUS,
            associatedControls: data.ASSOCIATED_CONTROLS,
            createdBy: profileData.USER_ID,
            createdOn: new Date().toISOString(),
        };

        console.log("riskRegisterPayload to save", riskRegisterPayload);

        try {
            if (editRisk) {
                const riskRegisterID = editRisk.riskRegisterID;
                const riskRegInstances = await getMyInstancesV2({
                    processName: "Risk Register",
                    predefinedFilters: { taskName: "Edit Register" },
                    mongoWhereClause: `this.Data.riskRegisterID == "${riskRegisterID}"`,
                });

                const taskId = riskRegInstances[0]?.taskId;
                if (taskId) {
                    await invokeAction({
                        taskId: taskId,
                        data: riskRegisterPayload,
                        transitionName: 'Update Edit Register',
                        processInstanceIdentifierField: 'riskRegisterID'
                    });
                    toast.success("Risk Register Updated Successfully!", { duration: 2000 });
                }
            } else {
                const riskRegisterProcessId = await mapProcessName({ processName: "Risk Register" });
                await startProcessV2({
                    processId: riskRegisterProcessId,
                    data: riskRegisterPayload, 
                    processIdentifierFields: "riskRegisterID",
                });
                toast.success("Risk Registered Successfully!", { duration: 2000 });
            }
        } catch (error) {
            console.error("Failed to start risk register process:", error);
            toast.error("Error in Risk Registration", { duration: 2000 });
        }

        setOpen(false);
        router.refresh();
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="!max-w-none !w-screen !h-screen overflow-y-auto" onInteractOutside={(e) => e.preventDefault()}>
                <DialogHeader>
                    <DialogTitle>{editRisk ? "Edit Risk" : "Add Risk"}</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4 overflow-y-auto">
                    <Form {...form}>
                        <form>
                            <div className="grid grid-cols-1 gap-3 mb-3">
                                <CustomComboboxInput 
                                    options={riskLibNameOptions} 
                                    formControl={form.control} 
                                    name="RISK_NAME" 
                                    placeholder="Select risk name"
                                    label={<>Risk<span className="text-red-500 font-bold"> *</span></>}
                                />
                            </div>

                            <div className="grid grid-cols-3 gap-3 mb-3">
                                <FormTextarea formControl={form.control} name="RISK_DESCRIPTION" className="resize-y min-h-[150px] max-h-[400px] w-full" formItemClass="w-full" placeholder="Write risk description" label={<>Risk Description<span className="text-red-500 font-bold"> *</span></>} />
                                <FormTextarea formControl={form.control} name="THREAT_DESCRIPTION" className="resize-y min-h-[150px] max-h-[400px] w-full" formItemClass="w-full" placeholder="Write threat description" label="Threat Description" />
                                <FormTextarea formControl={form.control} name="RISK_VULNERABILITY" className="resize-y min-h-[150px] max-h-[400px] w-full" formItemClass="w-full" placeholder="Write risk vulnerability" label="Vulnerability" />
                            </div>

                            <div className="grid grid-cols-2 gap-3 mb-3">
                                <FormComboboxInput items={categoryType} formControl={form.control} name={"RISK_CATEGORY"} placeholder={"Select category"} label={<>Category<span className="text-red-500 font-bold"> *</span></>} />
                                <FormComboboxInput items={[]} formControl={form.control} name={"EXISTING_CONTROLS"} placeholder={"Select existing controls"} label={"Existing Controls(if applicable)"} />
                            </div>

                            <div className="grid grid-cols-4 gap-3 mb-3">
                                <FormComboboxInput items={impactType} formControl={form.control} name={"RISK_IMPACT"} placeholder={"Select impact"} label={<>Impact<span className="text-red-500 font-bold"> *</span></>} />
                                <FormComboboxInput items={likelihoodType} formControl={form.control} name={"RISK_LIKELIHOOD"} placeholder={"Select likelihood"} label={<>Likelihood<span className="text-red-500 font-bold"> *</span></>} />
                                <FormInput formControl={form.control} type="number" name={"RISK_SCORE"} placeholder="Calculate risk score" label="Risk Score" readOnly />
                                <FormInput formControl={form.control} type="number" name={"WEIGHTED_RISK"} placeholder="Calculate weighted risk score" label="Weighted Risk Score" readOnly />
                            </div>

                            <div className="grid grid-cols-2 gap-3 mb-3">
                                <FormComboboxInput items={riskTreatmentType} formControl={form.control} name={"RISK_TREATMENT"} placeholder={"Select risk treatment"} label={"Risk Treatment"} />
                                <FormComboboxInput items={userIdNameMap} formControl={form.control} name={"RISK_OWNER"} placeholder="Select Owner" label={<>Owner<span className="text-red-500 font-bold"> *</span></>} />
                            </div>

                            <div className="grid grid-cols-2 gap-3 mb-3">
                                <FormTextarea formControl={form.control} name="TREATMENT_PLAN" className="resize-y min-h-[150px] max-h-[400px] w-full" formItemClass="w-full" placeholder="Write treatment plan" label="Risk Treatment Plan" />
                                <FormTextarea formControl={form.control} name="JUSTIFICATION_TREATMENT_PLAN" className="resize-y min-h-[150px] max-h-[400px] w-full" formItemClass="w-full" placeholder="Write justification of treatment plan" label="Justification for Risk Treatment Plan" />
                            </div>

                            <div className="grid grid-cols-4 gap-3 mb-3">
                                <FormComboboxInput items={impactType} formControl={form.control} name={"RESIDUAL_IMPACT"} placeholder={"Select residual impact"} label={"Residual Impact"} />
                                <FormComboboxInput items={likelihoodType} formControl={form.control} name={"RESIDUAL_LIKELIHOOD"} placeholder={"Select residual likelihood"} label={"Residual Likelihood"} />
                                <FormInput formControl={form.control} type="number" name="RESIDUAL_SCORE" placeholder="Calculate residual risk score" label="Residual Risk Score" readOnly />
                                <FormInput formControl={form.control} type="number" name={"WEIGHTED_RESIDUAL"} placeholder="Calculate weighted residual risk score" label={"Weighted Residual Score"} readOnly />
                            </div>

                            <div className="grid grid-cols-2 gap-3 mb-3">
                                <FormInput formControl={form.control} name={"ASSET"} placeholder="Enter asset" label={"Asset"} />
                                <FormInput formControl={form.control} name={"ASSET_FUNCTION"} placeholder="Enter asset fuction" label={"Asset Function"} />
                            </div>

                            <div className="grid grid-cols-3 gap-3 mb-3">
                                <FormComboboxInput items={userIdNameMap} formControl={form.control} name={"RISK_IMPLEMENTER"} placeholder={"Select implementer"} label={"Implementer"} />
                                <FormComboboxInput items={treatmentStatus} formControl={form.control} name={"ACTION_TRACKING"} placeholder={"Select action tracking"} label={"Action Tracking"} />
                                <FormDateInput formControl={form.control} name={"DUE_DATE"} label={"Action Due Date"} placeholder={"Select due date"} />
                            </div>
                            <div className="grid grid-cols-2 gap-3 mb-3">
                                <FormComboboxInput items={treatmentStatus} formControl={form.control} name={"TREATMENT_STATUS"} placeholder={"Select risk treatment status"} label={"Risk Treatment Status"} />
                                <FormInput formControl={form.control} name={"ASSOCIATED_CONTROLS"} placeholder={"Enter control IDs(comma separated)"} label={"Associated Controls"} />
                            </div>
                        </form>
                    </Form>
                </div>
                <DialogFooter>
                    <Button type="submit" onClick={form.handleSubmit(saveIncidentInfo)}>
                        {editRisk ? "Update" : "Save"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}