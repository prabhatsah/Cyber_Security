// "use client";
// import FormComboboxInput from "@/ikon/components/form-fields/combobox-input";
// import FormDateInput from "@/ikon/components/form-fields/date-input";
// import FormInput from "@/ikon/components/form-fields/input";
// import FormTextarea from "@/ikon/components/form-fields/textarea";
// import { getMyInstancesV2, invokeAction, mapProcessName, startProcessV2 } from "@/ikon/utils/api/processRuntimeService";
// import { SAVE_DATE_FORMAT_GRC } from "@/ikon/utils/config/const";
// import { Button } from "@/shadcn/ui/button";
// import { CustomComboboxInput } from "@/shadcn/ui/custom-single-dropdown";
// import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/shadcn/ui/dialog";
// import { Form } from "@/shadcn/ui/form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { format } from "date-fns";
// import { useRouter } from "next/navigation";
// import { useEffect } from "react";
// import { useForm } from "react-hook-form";
// import { toast } from "sonner";
// import { v4 } from "uuid";
// import z from "zod";

// export const RegisterFormSchema = z.object({
//     RISK_NAME: z.string().min(2, { message: "Risk should be selected." }).trim(),
//     RISK_DESCRIPTION: z.string().min(2, { message: "Risk description should be at least 2 characters long." }).trim(),
//     THREAT_DESCRIPTION: z.string().optional(),
//     RISK_VULNERABILITY: z.string().optional(),
//     ASSET: z.string().optional(),
//     ASSET_FUNCTION: z.string().optional(),
//     RISK_CATEGORY: z.string().min(2, { message: "Category should be selected." }).trim(),
//     EXISTING_CONTROLS: z.string().optional(),
//     RISK_IMPACT: z.string().min(2, { message: "Risk Impact is mandatory" }).trim(),
//     RISK_LIKELIHOOD: z.string().min(1, { message: "Risk Likelihood is mandatory" }).trim(),
//     RISK_SCORE: z.number().optional(),
//     WEIGHTED_RISK: z.number().optional(),
//     RISK_TREATMENT: z.string().optional(),
//     TREATMENT_PLAN: z.string().optional(),
//     JUSTIFICATION_TREATMENT_PLAN: z.string().optional(),
//     RISK_OWNER: z.string().min(2, { message: "Risk owner should be selected." }).trim(),
//     RESIDUAL_IMPACT: z.string().optional(),
//     RESIDUAL_LIKELIHOOD: z.string().optional(),
//     RESIDUAL_SCORE: z.number().optional(),
//     WEIGHTED_RESIDUAL: z.number().optional(),
//     RISK_IMPLEMENTER: z.string().optional(),
//     ACTION_TRACKING: z.string().optional(),
//     DUE_DATE: z.date().optional(),
//     TREATMENT_STATUS: z.string().optional(),
//     TREATEMENT_PLAN: z.string().optional(),
//     ASSOCIATED_CONTROLS: z.string().optional(),
// });

// export const likelihoodType = [
//     { value: "1", label: "Rare" },
//     { value: "2", label: "Unlikely" },
//     { value: "3", label: "Possible" },
//     { value: "4", label: "Likely" },
//     { value: "5", label: "Almost Certain" },
// ];
// export const riskTreatmentType = [
//     { value: "Accept", label: "Accept" },
//     { value: "Mitigate", label: "Mitigate" },
//     { value: "Transfer", label: "Transfer" },
//     { value: "Avoid", label: "Avoid" },
// ];
// export const treatmentStatus = [
//     { value: "In Progress", label: "In Progress" },
//     { value: "Open", label: "Open" },
//     { value: "Resolved", label: "Resolved" },
//     { value: "Not Started", label: "Not Started" },
//     { value: "On Hold", label: "On Hold" },
// ];


// export default function RiskRegisterForm({ open, setOpen, userIdNameMap, profileData, riskLibraryData, riskRegisterData, riskCategoryData, riskImpactData, editRisk }: { open: boolean; setOpen: React.Dispatch<React.SetStateAction<boolean>>; userIdNameMap: { value: string; label: string }[]; profileData: Record<string, any>; riskLibraryData: any[]; riskRegisterData: any[]; riskCategoryData: any[]; riskImpactData: any[]; editRisk: Record<string, string> | null }) {
//     const router = useRouter();

//     const registeredRiskLibraryIds = new Set(riskRegisterData.map(item => item.riskLibraryId));
//     const riskLibNameOptions = riskLibraryData
//         .filter(item => !registeredRiskLibraryIds.has(item.riskId))
//         .map((item) => ({
//             value: item.riskId,
//             label: item.riskLibName,
//         }));

//     const categoryType = Object.values(riskCategoryData[0])
//         .filter((item: any) => item && item.riskCategoryId && item.riskCategory)
//         .map((item: any) => ({
//             value: item.riskCategoryId,
//             label: item.riskCategory,
//         }));

//     const impactType = Object.values(riskImpactData[0])
//         .filter((item: any) => item && item.riskImpactId && item.riskImpact)
//         .map((item: any) => ({
//             value: item.riskImpactId.toString(),
//             label: item.riskImpact,
//         }));

//     const form = useForm<z.infer<typeof RegisterFormSchema>>({
//         resolver: zodResolver(RegisterFormSchema),
//         defaultValues: {
//             RISK_NAME: editRisk ? editRisk.riskName : "",
//             RISK_DESCRIPTION: editRisk ? editRisk.riskDescription : "",
//             THREAT_DESCRIPTION: editRisk ? editRisk.threatDescription : "",
//             RISK_VULNERABILITY: editRisk ? editRisk.riskVulnerability : "",
//             ASSET: editRisk ? editRisk.asset : "",
//             ASSET_FUNCTION: editRisk ? editRisk.assetFunction : "",
//             RISK_CATEGORY: editRisk ? editRisk.riskCategory : "",
//             EXISTING_CONTROLS: editRisk ? editRisk.existingControls : "",
//             RISK_IMPACT: editRisk ? editRisk.riskImpact : "",
//             RISK_LIKELIHOOD: editRisk ? editRisk.riskLikelihood : "",
//             RISK_SCORE: 0,
//             WEIGHTED_RISK: 0,
//             RISK_TREATMENT: editRisk ? editRisk.riskTreatment : "",
//             TREATMENT_PLAN: editRisk ? editRisk.treatmentPlan : "",
//             JUSTIFICATION_TREATMENT_PLAN: editRisk ? editRisk.justificationTreatmentPlan : "",
//             RISK_OWNER: editRisk ? editRisk.riskOwner : "",
//             RESIDUAL_IMPACT: editRisk ? editRisk.residualImpact : "",
//             RESIDUAL_LIKELIHOOD: editRisk ? editRisk.residualLikelihood : "",
//             RESIDUAL_SCORE: 0,
//             WEIGHTED_RESIDUAL: 0,
//             RISK_IMPLEMENTER: editRisk ? editRisk.riskImplementer : "",
//             ACTION_TRACKING: editRisk ? editRisk.actionTracking : "",
//             DUE_DATE: (editRisk && editRisk.dueDate && new Date(editRisk.dueDate)) || undefined,
//             TREATMENT_STATUS: editRisk ? editRisk.treatmentStatus : "",
//             ASSOCIATED_CONTROLS: editRisk ? editRisk.associatedControls : "",
//         },
//     });
//     const selectedRiskId = form.watch("RISK_NAME");
//     useEffect(() => {
//         const matched = riskLibraryData.find((item) => item.riskId === selectedRiskId);
//         if (matched && !editRisk) {
//             form.setValue("RISK_DESCRIPTION", matched.description);
//             form.setValue("RISK_VULNERABILITY", matched.vulnerability);
//             form.setValue("RISK_CATEGORY", matched.category);
//         }
//     }, [selectedRiskId, riskLibraryData, form, editRisk]);

//     useEffect(() => {
//         const riskImpact = form.watch("RISK_IMPACT");
//         const riskLikelihood = form.watch("RISK_LIKELIHOOD");

//         if (riskImpact && riskLikelihood) {
//             // Find the selected impact in riskImpactData
//             const impactEntry = Object.values(riskImpactData[0]).find(
//                 (item: any) => item.riskImpactId.toString() === riskImpact
//             );

//             if (impactEntry) {
//                 const impactValue = (impactEntry as any).riskValue;
//                 const impactWeightage = (impactEntry as any).riskImpactWeightage;
//                 const likelihoodValue = parseInt(riskLikelihood);

//                 // Calculate RISK_SCORE (impactValue * likelihoodValue)
//                 const riskScore = impactValue * likelihoodValue;
//                 form.setValue("RISK_SCORE", riskScore);

//                 // Calculate WEIGHTED_RISK (impactValue * impactWeightage * likelihoodValue)
//                 const weightedRisk = impactValue * impactWeightage * likelihoodValue;
//                 form.setValue("WEIGHTED_RISK", weightedRisk);
//             }
//         }
//     }, [form.watch("RISK_IMPACT"), form.watch("RISK_LIKELIHOOD")]);

//     // Calculate residual scores when impact or likelihood changes
//     useEffect(() => {
//         const residualImpact = form.watch("RESIDUAL_IMPACT");
//         const residualLikelihood = form.watch("RESIDUAL_LIKELIHOOD");

//         if (residualImpact && residualLikelihood) {
//             // Find the selected impact in riskImpactData
//             const impactEntry = Object.values(riskImpactData[0]).find(
//                 (item: any) => item.riskImpactId.toString() === residualImpact
//             );

//             if (impactEntry) {
//                 const impactValue = (impactEntry as any).riskValue;
//                 const impactWeightage = (impactEntry as any).riskImpactWeightage;
//                 const likelihoodValue = parseInt(residualLikelihood);

//                 // Calculate RESIDUAL_SCORE
//                 const residualScore = impactValue * likelihoodValue;
//                 form.setValue("RESIDUAL_SCORE", residualScore);

//                 // Calculate WEIGHTED_RESIDUAL
//                 const weightedResidual = impactValue * impactWeightage * likelihoodValue;
//                 form.setValue("WEIGHTED_RESIDUAL", weightedResidual);
//             }
//         }
//     }, [form.watch("RESIDUAL_IMPACT"), form.watch("RESIDUAL_LIKELIHOOD")]);


//     async function saveIncidentInfo(data: z.infer<typeof RegisterFormSchema>) {
//         const selectedLibraryEntry = riskLibraryData.find(libItem => libItem.riskId === data.RISK_NAME);
//         const selecteLikelihood = likelihoodType.find(likeItem => likeItem.value === data.RISK_LIKELIHOOD)
//         const selectedResidualLiklihood = likelihoodType.find(likeItem => likeItem.value === data.RESIDUAL_LIKELIHOOD)

//         const riskRegisterPayload = {
//             riskLibraryId: selectedLibraryEntry ? selectedLibraryEntry.riskId : (editRisk ? editRisk.riskLibraryId : ""),
//             riskRegisterID: editRisk ? editRisk.riskRegisterID : v4(),
//             riskName: data.RISK_NAME,
//             riskDescription: data.RISK_DESCRIPTION,
//             threatDescription: data.THREAT_DESCRIPTION,
//             riskVulnerability: data.RISK_VULNERABILITY,
//             asset: data.ASSET,
//             assetFunction: data.ASSET_FUNCTION,
//             riskCategory: data.RISK_CATEGORY,
//             existingControls: data.EXISTING_CONTROLS,
//             riskImpact: data.RISK_IMPACT,
//             riskLikelihood: selecteLikelihood ? selecteLikelihood.label : (editRisk ? editRisk.riskLikelihood : ""),
//             riskLikelihoodValue: data.RISK_LIKELIHOOD,
//             riskTreatment: data.RISK_TREATMENT,
//             treatmentPlan: data.TREATMENT_PLAN,
//             justificationTreatmentPlan: data.JUSTIFICATION_TREATMENT_PLAN,
//             riskOwner: data.RISK_OWNER,
//             residualImpact: data.RESIDUAL_IMPACT,
//             residualLikelihood: selectedResidualLiklihood ? selectedResidualLiklihood.label : (editRisk ? editRisk.residualLikelihood : ""),
//             residualLikelihoodValue: data.RESIDUAL_LIKELIHOOD,
//             riskImplementer: data.RISK_IMPLEMENTER,
//             actionTracking: data.ACTION_TRACKING,
//             dueDate: data.DUE_DATE ? format(data.DUE_DATE, SAVE_DATE_FORMAT_GRC) : undefined,
//             treatmentStatus: data.TREATMENT_STATUS,
//             associatedControls: data.ASSOCIATED_CONTROLS,
//             createdBy: profileData.USER_ID,
//             createdOn: new Date().toISOString(),
//         };
//         console.log("riskRegisterPayload to save", riskRegisterPayload);

//         try {
//             if (editRisk) {
//                 const riskRegisterID = editRisk.riskRegisterID;
//                 const riskRegInstances = await getMyInstancesV2({
//                     processName: "Risk Register",
//                     predefinedFilters: { taskName: "Edit Register" },
//                     mongoWhereClause: `this.Data.riskRegisterID == "${riskRegisterID}"`,
//                 })

//                 const taskId = riskRegInstances[0]?.taskId;
//                 await invokeAction({
//                     taskId: taskId,
//                     data: riskRegisterPayload,
//                     transitionName: 'Update Edit Register',
//                     processInstanceIdentifierField: 'riskRegisterID'
//                 })

//                 toast.success("Risk Registerd Update Successfully!", { duration: 2000 });
//             } else {
//                 const riskRegisterProcessId = await mapProcessName({ processName: "Risk Register", });
//                 await startProcessV2({
//                     processId: riskRegisterProcessId,
//                     data: riskRegisterPayload, 
//                     processIdentifierFields: "riskRegisterID",
//                 });
//                 toast.success("Risk Registerd Add Successfully!", { duration: 2000 });
//             }

//         } catch (error) {
//             console.error("Failed to start risk register process:", error);
//             toast.error("Error in Starting Risk Registered", { duration: 2000 });
//         }

//         setOpen(false);
//         router.refresh();
//     }

//     return (
//         <Dialog open={open} onOpenChange={setOpen}>
//             <DialogContent className="!max-w-none !w-screen !h-screen overflow-y-auto" onInteractOutside={(e) => e.preventDefault()}>
//                 <DialogHeader>
//                     <DialogTitle>Add/Edit Risk</DialogTitle>
//                 </DialogHeader>
//                 <div className="grid gap-4 py-4 overflow-y-auto">
//                     <Form {...form}>
//                         <form>
//                             <div className="grid grid-cols-1 gap-3 mb-3">
//                                 {/* <FormComboboxInput items={riskLibNameOptions} formControl={form.control} name={"RISK_NAME"} placeholder={"Select risk name"} label={<>Risk<span className="text-red-500 font-bold"> *</span></>} /> */}
//                                 <CustomComboboxInput options={riskLibNameOptions} formControl={form.control} name="RISK_NAME" placeholder="Select risk name"
//                                     label={<>Risk<span className="text-red-500 font-bold"> *</span></>}
//                                 />
//                             </div>

//                             <div className="grid grid-cols-3 gap-3 mb-3">
//                                 <FormTextarea formControl={form.control} name="RISK_DESCRIPTION" className="resize-y min-h-[150px] max-h-[400px] w-full" formItemClass="w-full" placeholder="Write risk description" label={<>Risk Description<span className="text-red-500 font-bold"> *</span></>} />
//                                 <FormTextarea formControl={form.control} name="THREAT_DESCRIPTION" className="resize-y min-h-[150px] max-h-[400px] w-full" formItemClass="w-full" placeholder="Write threat description" label="Threat Description" />
//                                 <FormTextarea formControl={form.control} name="RISK_VULNERABILITY" className="resize-y min-h-[150px] max-h-[400px] w-full" formItemClass="w-full" placeholder="Write risk vulnerability" label="Vulnerability" />
//                             </div>

//                             <div className="grid grid-cols-2 gap-3 mb-3">
//                                 <FormComboboxInput items={categoryType} formControl={form.control} name={"RISK_CATEGORY"} placeholder={"Select category"} label={<>Category<span className="text-red-500 font-bold"> *</span></>} />
//                                 <FormComboboxInput items={[]} formControl={form.control} name={"EXISTING_CONTROLS"} placeholder={"Select existing controls"} label={"Existing Controls(if applicable)"} />
//                             </div>

//                             <div className="grid grid-cols-4 gap-3 mb-3">
//                                 <FormComboboxInput items={impactType} formControl={form.control} name={"RISK_IMPACT"} placeholder={"Select impact"} label={<>Impact<span className="text-red-500 font-bold"> *</span></>} />
//                                 <FormComboboxInput items={likelihoodType} formControl={form.control} name={"RISK_LIKELIHOOD"} placeholder={"Select likelihood"} label={<>Likelihood<span className="text-red-500 font-bold"> *</span></>} />
//                                 <FormInput formControl={form.control} type="number" name={"RISK_SCORE"} placeholder="Calculate risk score" label="Risk Score" disabled />
//                                 <FormInput formControl={form.control} type="number" name={"WEIGHTED_RISK"} placeholder="Calculate weighted risk score" label="Weighted Risk Score" disabled />
//                             </div>

//                             <div className="grid grid-cols-2 gap-3 mb-3">
//                                 <FormComboboxInput items={riskTreatmentType} formControl={form.control} name={"RISK_TREATMENT"} placeholder={"Select risk treatment"} label={"Risk Treatment"} />
//                                 <FormComboboxInput items={userIdNameMap} formControl={form.control} name={"RISK_OWNER"} placeholder="Select Owner" label={<>Owner<span className="text-red-500 font-bold"> *</span></>} />
//                             </div>

//                             <div className="grid grid-cols-2 gap-3 mb-3">
//                                 <FormTextarea formControl={form.control} name="TREATMENT_PLAN" className="resize-y min-h-[150px] max-h-[400px] w-full" formItemClass="w-full" placeholder="Write treatment plan" label="Risk Treatment Plan" />
//                                 <FormTextarea formControl={form.control} name="JUSTIFICATION_TREATMENT_PLAN" className="resize-y min-h-[150px] max-h-[400px] w-full" formItemClass="w-full" placeholder="Write justification of treatment plan" label="Justification for Risk Treatment Plan" />
//                             </div>

//                             <div className="grid grid-cols-4 gap-3 mb-3">
//                                 <FormComboboxInput items={impactType} formControl={form.control} name={"RESIDUAL_IMPACT"} placeholder={"Select residual impact"} label={"Residual Impact"} />
//                                 <FormComboboxInput items={likelihoodType} formControl={form.control} name={"RESIDUAL_LIKELIHOOD"} placeholder={"Select residual likelihood"} label={"Residual Likelihood"} />
//                                 <FormInput formControl={form.control} type="number" name="RESIDUAL_SCORE" placeholder="Calculate residual risk score" label="Residual Risk Score" disabled />
//                                 <FormInput formControl={form.control} type="number" name={"WEIGHTED_RESIDUAL"} placeholder="Calculate weighted residual risk score" label={"Weighted Residual Score"} disabled />
//                             </div>

//                             <div className="grid grid-cols-2 gap-3 mb-3">
//                                 <FormInput formControl={form.control} name={"ASSET"} placeholder="Enter asset" label={"Asset"} />
//                                 <FormInput formControl={form.control} name={"ASSET_FUNCTION"} placeholder="Enter asset fuction" label={"Asset Function"} />
//                             </div>

//                             <div className="grid grid-cols-3 gap-3 mb-3">
//                                 <FormComboboxInput items={userIdNameMap} formControl={form.control} name={"RISK_IMPLEMENTER"} placeholder={"Select implementer"} label={"Implementer"} />
//                                 <FormComboboxInput items={treatmentStatus} formControl={form.control} name={"ACTION_TRACKING"} placeholder={"Select action tracking"} label={"Action Tracking"} />
//                                 <FormDateInput formControl={form.control} name={"DUE_DATE"} label={"Action Due Date"} placeholder={"Select due date"} />
//                             </div>
//                             <div className="grid grid-cols-2 gap-3 mb-3">
//                                 <FormComboboxInput items={treatmentStatus} formControl={form.control} name={"TREATMENT_STATUS"} placeholder={"Select risk treatment status"} label={"Risk Treatment Status"} />
//                                 <FormInput formControl={form.control} name={"ASSOCIATED_CONTROLS"} placeholder={"Enter control IDs(comma separated)"} label={"Associated Controls"} />
//                             </div>
//                         </form>
//                     </Form>
//                 </div>
//                 <DialogFooter>
//                     <Button type="submit" onClick={form.handleSubmit(saveIncidentInfo)}>
//                         {editRisk ? "Update" : "Save"}
//                     </Button>
//                 </DialogFooter>
//             </DialogContent>
//         </Dialog>
//     );
// }


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
    TREATMENT_PLAN: z.string().optional(), // Corrected typo from TREATEMENT_PLAN
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


export default function RiskRegisterForm({ open, setOpen, userIdNameMap, profileData, riskLibraryData, riskRegisterData, riskCategoryData, riskImpactData, editRisk }: { open: boolean; setOpen: React.Dispatch<React.SetStateAction<boolean>>; userIdNameMap: { value: string; label: string }[]; profileData: Record<string, any>; riskLibraryData: any[]; riskRegisterData: any[]; riskCategoryData: any[]; riskImpactData: any[]; editRisk: Record<string, any> | null }) { // editRisk type changed to Record<string, any> for flexibility
    const router = useRouter();

    const registeredRiskLibraryIds = new Set(riskRegisterData.map(item => item.riskLibraryId));
    const riskLibNameOptions = riskLibraryData
        .filter(item => !editRisk && !registeredRiskLibraryIds.has(item.riskId) || (editRisk && (item.riskId === editRisk.riskLibraryId || !registeredRiskLibraryIds.has(item.riskId)))) // Allow current risk in edit mode
        .map((item) => ({
            value: item.riskId,
            label: item.riskLibName,
        }));

    const categoryType = riskCategoryData?.[0] ? Object.values(riskCategoryData[0])
        .filter((item: any) => item && item.riskCategoryId && item.riskCategory)
        .map((item: any) => ({
            value: item.riskCategoryId,
            label: item.riskCategory,
        })) : [];

    const impactType = riskImpactData?.[0] ? Object.values(riskImpactData[0])
        .filter((item: any) => item && item.riskImpactId && item.riskImpact)
        .map((item: any) => ({
            value: item.riskImpactId.toString(),
            label: item.riskImpact,
        })) : [];

    const form = useForm<z.infer<typeof RegisterFormSchema>>({
        resolver: zodResolver(RegisterFormSchema),
        defaultValues: {
            RISK_NAME: editRisk?.riskLibraryId || "", // Assuming riskName in editRisk is the ID/value
            RISK_DESCRIPTION: editRisk?.riskDescription || "",
            THREAT_DESCRIPTION: editRisk?.threatDescription || "",
            RISK_VULNERABILITY: editRisk?.riskVulnerability || "",
            ASSET: editRisk?.asset || "",
            ASSET_FUNCTION: editRisk?.assetFunction || "",
            RISK_CATEGORY: editRisk?.riskCategory || "", // Expects value
            EXISTING_CONTROLS: editRisk?.existingControls || "",
            RISK_IMPACT: editRisk?.riskImpact || "", // Expects value (ID)
            RISK_LIKELIHOOD: editRisk?.riskLikelihoodValue || "", // Expects value ("1"-"5")
            RISK_SCORE: undefined,
            WEIGHTED_RISK: undefined,
            RISK_TREATMENT: editRisk?.riskTreatment || "",
            TREATMENT_PLAN: editRisk?.treatmentPlan || "",
            JUSTIFICATION_TREATMENT_PLAN: editRisk?.justificationTreatmentPlan || "",
            RISK_OWNER: editRisk?.riskOwner || "", // Expects value
            RESIDUAL_IMPACT: editRisk?.residualImpact || "", // Expects value (ID)
            RESIDUAL_LIKELIHOOD: editRisk?.residualLikelihoodValue || "", // Expects value ("1"-"5")
            RESIDUAL_SCORE: undefined,
            WEIGHTED_RESIDUAL: undefined,
            RISK_IMPLEMENTER: editRisk?.riskImplementer || "", // Expects value
            ACTION_TRACKING: editRisk?.actionTracking || "",
            DUE_DATE: (editRisk?.dueDate && !isNaN(new Date(editRisk.dueDate).getTime())) ? new Date(editRisk.dueDate) : undefined,
            TREATMENT_STATUS: editRisk?.treatmentStatus || "",
            ASSOCIATED_CONTROLS: editRisk?.associatedControls || "",
        },
    });

    const selectedRiskId = form.watch("RISK_NAME");
    useEffect(() => {
        const matched = riskLibraryData.find((item) => item.riskId === selectedRiskId);
        if (matched && !editRisk) { // Only populate for new risks, not when editing
            form.setValue("RISK_DESCRIPTION", matched.description);
            form.setValue("RISK_VULNERABILITY", matched.vulnerability);
            form.setValue("RISK_CATEGORY", matched.category); // Ensure matched.category is the value/ID
        }
        else { // Only populate for new risks, not when editing
            if(!matched && editRisk) {
                form.setValue("RISK_NAME", editRisk.riskName || "");
            }    
            form.setValue("RISK_DESCRIPTION", matched?.description ? matched.description : editRisk?.riskDescription || "");
            form.setValue("RISK_VULNERABILITY", matched?.vulnerability ? matched.vulnerability : editRisk?.riskVulnerability || "");
            form.setValue("RISK_CATEGORY", matched?.category ? matched.category : editRisk?.riskCategory || ""); // Ensure matched.category is the value/ID
        }
    }, [selectedRiskId, riskLibraryData, form, editRisk]);


    // --- Initial Score Calculation on Edit Mode ---
    useEffect(() => {
        if (editRisk && riskImpactData?.[0] && form.reset) { // form.reset is a stable function, indicates form is ready
            const savedImpactId = editRisk.riskImpact;
            const savedLikelihoodValueStr = editRisk.riskLikelihoodValue;

            if (savedImpactId && savedLikelihoodValueStr) {
                const impactEntry = Object.values(riskImpactData[0]).find(
                    (item: any) => item && item.riskImpactId?.toString() === savedImpactId
                );
                if (impactEntry) {
                    const impactVal = parseFloat(impactEntry.riskValue);
                    const impactWeight = parseFloat(impactEntry.riskImpactWeightage);
                    const likelihoodVal = parseInt(savedLikelihoodValueStr, 10);

                    if (!isNaN(impactVal) && !isNaN(impactWeight) && !isNaN(likelihoodVal)) {
                        form.setValue("RISK_SCORE", impactVal * likelihoodVal, { shouldValidate: false });
                        form.setValue("WEIGHTED_RISK", impactVal * impactWeight * likelihoodVal, { shouldValidate: false });
                    } else {
                        form.setValue("RISK_SCORE", undefined, { shouldValidate: false });
                        form.setValue("WEIGHTED_RISK", undefined, { shouldValidate: false });
                    }
                } else {
                     form.setValue("RISK_SCORE", undefined, { shouldValidate: false });
                     form.setValue("WEIGHTED_RISK", undefined, { shouldValidate: false });
                }
            } else { // If no saved impact/likelihood in editRisk, ensure scores are undefined
                form.setValue("RISK_SCORE", undefined, { shouldValidate: false });
                form.setValue("WEIGHTED_RISK", undefined, { shouldValidate: false });
            }
        }
    }, [editRisk, riskImpactData, form]);

    useEffect(() => {
        if (editRisk && riskImpactData?.[0] && form.reset) {
            const savedResidualImpactId = editRisk.residualImpact;
            const savedResidualLikelihoodValueStr = editRisk.residualLikelihoodValue;

            if (savedResidualImpactId && savedResidualLikelihoodValueStr) {
                const impactEntry = Object.values(riskImpactData[0]).find(
                    (item: any) => item && item.riskImpactId?.toString() === savedResidualImpactId
                );
                if (impactEntry) {
                    const impactVal = parseFloat(impactEntry.riskValue);
                    const impactWeight = parseFloat(impactEntry.riskImpactWeightage);
                    const likelihoodVal = parseInt(savedResidualLikelihoodValueStr, 10);

                    if (!isNaN(impactVal) && !isNaN(impactWeight) && !isNaN(likelihoodVal)) {
                        form.setValue("RESIDUAL_SCORE", impactVal * likelihoodVal, { shouldValidate: false });
                        form.setValue("WEIGHTED_RESIDUAL", impactVal * impactWeight * likelihoodVal, { shouldValidate: false });
                    } else {
                        form.setValue("RESIDUAL_SCORE", undefined, { shouldValidate: false });
                        form.setValue("WEIGHTED_RESIDUAL", undefined, { shouldValidate: false });
                    }
                } else {
                    form.setValue("RESIDUAL_SCORE", undefined, { shouldValidate: false });
                    form.setValue("WEIGHTED_RESIDUAL", undefined, { shouldValidate: false });
                }
            } else { // If no saved residual impact/likelihood in editRisk, ensure scores are undefined
                form.setValue("RESIDUAL_SCORE", undefined, { shouldValidate: false });
                form.setValue("WEIGHTED_RESIDUAL", undefined, { shouldValidate: false });
            }
        }
    }, [editRisk, riskImpactData, form]);

    // --- Dynamic Score Calculation on Form Field Change ---
    const watchedRiskImpact = form.watch("RISK_IMPACT");
    const watchedRiskLikelihood = form.watch("RISK_LIKELIHOOD");

    useEffect(() => {
        if (watchedRiskImpact && watchedRiskLikelihood && riskImpactData?.[0]) {
            const impactEntry = Object.values(riskImpactData[0]).find(
                (item: any) => item && item.riskImpactId?.toString() === watchedRiskImpact
            );
            if (
                impactEntry &&
                typeof impactEntry === "object" &&
                "riskValue" in impactEntry &&
                "riskImpactWeightage" in impactEntry
            ) {
                const impactVal = parseFloat((impactEntry as any).riskValue);
                const impactWeight = parseFloat((impactEntry as any).riskImpactWeightage);
                const likelihoodVal = parseInt(watchedRiskLikelihood, 10);

                if (!isNaN(impactVal) && !isNaN(impactWeight) && !isNaN(likelihoodVal)) {
                    form.setValue("RISK_SCORE", impactVal * likelihoodVal);
                    form.setValue("WEIGHTED_RISK", impactVal * impactWeight * likelihoodVal);
                } else {
                    form.setValue("RISK_SCORE", undefined);
                    form.setValue("WEIGHTED_RISK", undefined);
                }
            } else {
                form.setValue("RISK_SCORE", undefined);
                form.setValue("WEIGHTED_RISK", undefined);
            }
        } else if (!watchedRiskImpact || !watchedRiskLikelihood) {
            form.setValue("RISK_SCORE", undefined);
            form.setValue("WEIGHTED_RISK", undefined);
        }
    }, [watchedRiskImpact, watchedRiskLikelihood, riskImpactData, form]);

    const watchedResidualImpact = form.watch("RESIDUAL_IMPACT");
    const watchedResidualLikelihood = form.watch("RESIDUAL_LIKELIHOOD");

    useEffect(() => {
        if (watchedResidualImpact && watchedResidualLikelihood && riskImpactData?.[0]) {
            const impactEntry = Object.values(riskImpactData[0]).find(
                (item: any) => item && item.riskImpactId?.toString() === watchedResidualImpact
            );
            if (impactEntry) {
                const impactVal = parseFloat(impactEntry.riskValue);
                const impactWeight = parseFloat(impactEntry.riskImpactWeightage);
                const likelihoodVal = parseInt(watchedResidualLikelihood, 10);

                if (!isNaN(impactVal) && !isNaN(impactWeight) && !isNaN(likelihoodVal)) {
                    form.setValue("RESIDUAL_SCORE", impactVal * likelihoodVal);
                    form.setValue("WEIGHTED_RESIDUAL", impactVal * impactWeight * likelihoodVal);
                } else {
                    form.setValue("RESIDUAL_SCORE", undefined);
                    form.setValue("WEIGHTED_RESIDUAL", undefined);
                }
            } else {
                form.setValue("RESIDUAL_SCORE", undefined);
                form.setValue("WEIGHTED_RESIDUAL", undefined);
            }
        } else if (!watchedResidualImpact || !watchedResidualLikelihood) {
            form.setValue("RESIDUAL_SCORE", undefined);
            form.setValue("WEIGHTED_RESIDUAL", undefined);
        }
    }, [watchedResidualImpact, watchedResidualLikelihood, riskImpactData, form]);


    async function saveIncidentInfo(data: z.infer<typeof RegisterFormSchema>) {
        // Ensure riskLibraryId is correctly sourced, especially for new vs. edit
        // let riskLibraryIdToSave = "";
        // if (data.RISK_NAME) { // RISK_NAME field holds the riskId from riskLibNameOptions
        //    const selectedLibraryEntry = riskLibraryData.find(libItem => libItem.riskId === data.RISK_NAME);
        //    if (selectedLibraryEntry) {
        //        riskLibraryIdToSave = selectedLibraryEntry.riskId;
        //    } else if (editRisk && data.RISK_NAME === editRisk.riskName) { // If risk name wasn't changed and it was an ID
        //        riskLibraryIdToSave = editRisk.riskLibraryId || data.RISK_NAME; // Fallback if riskName itself was the ID
        //    } else {
        //        riskLibraryIdToSave = data.RISK_NAME; // If it's a new risk or RISK_NAME is the direct ID
        //    }
        // } else if (editRisk) {
        //     riskLibraryIdToSave = editRisk.riskLibraryId;
        // }

        const selectedLibraryEntry = riskLibraryData.find(libItem => libItem.riskId === data.RISK_NAME);
        const selectedLikelihood = likelihoodType.find(likeItem => likeItem.value === data.RISK_LIKELIHOOD);
        const selectedResidualLikelihood = likelihoodType.find(likeItem => likeItem.value === data.RESIDUAL_LIKELIHOOD);

        const riskRegisterPayload = {
            // riskLibraryId: riskLibraryIdToSave,
            riskLibraryId: selectedLibraryEntry ? selectedLibraryEntry.riskId : (editRisk ? editRisk.riskLibraryId : ""),
            riskRegisterID: editRisk ? editRisk.riskRegisterID : v4(),
            // riskName: data.RISK_NAME, // This should be the ID of the risk from library
            riskName: selectedLibraryEntry ? selectedLibraryEntry.riskLibName : (editRisk ? editRisk.riskName : data.RISK_NAME),
            riskDescription: data.RISK_DESCRIPTION,
            threatDescription: data.THREAT_DESCRIPTION,
            riskVulnerability: data.RISK_VULNERABILITY,
            asset: data.ASSET,
            assetFunction: data.ASSET_FUNCTION,
            riskCategory: data.RISK_CATEGORY, // Expects value/ID
            existingControls: data.EXISTING_CONTROLS,
            riskImpact: data.RISK_IMPACT, // Expects value/ID
            riskLikelihood: selectedLikelihood ? selectedLikelihood.label : (editRisk?.riskLikelihood || ""),
            riskLikelihoodValue: data.RISK_LIKELIHOOD, // This is the value "1"-"5"
            riskTreatment: data.RISK_TREATMENT,
            treatmentPlan: data.TREATMENT_PLAN,
            justificationTreatmentPlan: data.JUSTIFICATION_TREATMENT_PLAN,
            riskOwner: data.RISK_OWNER, // Expects value/ID
            residualImpact: data.RESIDUAL_IMPACT, // Expects value/ID
            residualLikelihood: selectedResidualLikelihood ? selectedResidualLikelihood.label : (editRisk?.residualLikelihood || ""),
            residualLikelihoodValue: data.RESIDUAL_LIKELIHOOD, // This is the value "1"-"5"
            riskImplementer: data.RISK_IMPLEMENTER, // Expects value/ID
            actionTracking: data.ACTION_TRACKING,
            dueDate: data.DUE_DATE ? format(data.DUE_DATE, SAVE_DATE_FORMAT_GRC) : undefined,
            treatmentStatus: data.TREATMENT_STATUS,
            associatedControls: data.ASSOCIATED_CONTROLS,
            createdBy: profileData.USER_ID,
            createdOn: editRisk?.createdOn || new Date().toISOString(), // Preserve original createdOn if editing
        };
        console.log("riskRegisterPayload to save", riskRegisterPayload);

        try {
            if (editRisk) {
                const riskRegisterID = editRisk.riskRegisterID;
                // Ensure this logic correctly finds the task based on your workflow
                const riskRegInstances = await getMyInstancesV2({
                    processName: "Risk Register",
                    predefinedFilters: { taskName: "Edit Register" }, // Adjust if task name differs
                    mongoWhereClause: `this.Data.riskRegisterID == "${riskRegisterID}"`,
                });

                if (!riskRegInstances || riskRegInstances.length === 0 || !riskRegInstances[0]?.taskId) {
                    toast.error("Could not find the task to update the risk.", { duration: 3000 });
                    console.error("No task found for riskRegisterID:", riskRegisterID, "Instances:", riskRegInstances);
                    return; // Prevent further action if task isn't found
                }
                const taskId = riskRegInstances[0].taskId;

                await invokeAction({
                    taskId: taskId,
                    data: riskRegisterPayload,
                    transitionName: 'Update Edit Register', // Verify transition name
                    processInstanceIdentifierField: 'riskRegisterID'
                });
                toast.success("Risk Register Updated Successfully!", { duration: 2000 });
            } else {
                const riskRegisterProcessId = await mapProcessName({ processName: "Risk Register" });
                await startProcessV2({
                    processId: riskRegisterProcessId,
                    data: riskRegisterPayload,
                    processIdentifierFields: "riskRegisterID",
                });
                toast.success("Risk Register Added Successfully!", { duration: 2000 });
            }
            setOpen(false);
            router.refresh();
        } catch (error) {
            console.error("Failed to save risk register:", error);
            toast.error(editRisk ? "Error Updating Risk Register" : "Error Adding Risk Register", { duration: 2000 });
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="!max-w-none !w-screen !h-screen overflow-y-auto" onInteractOutside={(e) => e.preventDefault()}>
                <DialogHeader>
                    <DialogTitle>{editRisk ? "Edit Risk" : "Add Risk"}</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4 overflow-y-auto">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(saveIncidentInfo)}> {/* Use onSubmit on form element */}
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
                                <FormInput formControl={form.control} type="number" name={"RISK_SCORE"} placeholder="Calculated score" label="Risk Score" disabled />
                                <FormInput formControl={form.control} type="number" name={"WEIGHTED_RISK"} placeholder="Calculated weighted score" label="Weighted Risk Score" disabled />
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
                                <FormInput formControl={form.control} type="number" name="RESIDUAL_SCORE" placeholder="Calculated residual score" label="Residual Risk Score" disabled />
                                <FormInput formControl={form.control} type="number" name={"WEIGHTED_RESIDUAL"} placeholder="Calculated weighted residual score" label={"Weighted Residual Score"} disabled />
                            </div>

                            <div className="grid grid-cols-2 gap-3 mb-3">
                                <FormInput formControl={form.control} name={"ASSET"} placeholder="Enter asset" label={"Asset"} />
                                <FormInput formControl={form.control} name={"ASSET_FUNCTION"} placeholder="Enter asset fuction" label={"Asset Function"} />
                            </div>

                            <div className="grid grid-cols-3 gap-3 mb-3">
                                <FormComboboxInput items={userIdNameMap} formControl={form.control} name={"RISK_IMPLEMENTER"} placeholder={"Select implementer"} label={"Implementer"} />
                                <FormComboboxInput items={treatmentStatus} formControl={form.control} name={"ACTION_TRACKING"} placeholder={"Select action tracking"} label={"Action Tracking"} /> {/* Consider if this should be TREATMENT_STATUS */}
                                <FormDateInput formControl={form.control} name={"DUE_DATE"} label={"Action Due Date"} placeholder={"Select due date"} />
                            </div>
                            <div className="grid grid-cols-2 gap-3 mb-3">
                                <FormComboboxInput items={treatmentStatus} formControl={form.control} name={"TREATMENT_STATUS"} placeholder={"Select risk treatment status"} label={"Risk Treatment Status"} />
                                <FormInput formControl={form.control} name={"ASSOCIATED_CONTROLS"} placeholder={"Enter control IDs(comma separated)"} label={"Associated Controls"} />
                            </div>
                             {/* DialogFooter is outside the <form> tag which is not ideal for native form submission,
                                 but react-hook-form's handleSubmit works with button's onClick.
                                 For robustness, the button type="submit" should ideally be inside the <form> or
                                 the form should have an id and button should have form="form-id".
                                 However, current setup works with RHF.
                             */}
                        </form>
                    </Form>
                </div>
                <DialogFooter>
                    <Button type="button" onClick={form.handleSubmit(saveIncidentInfo)}> {/* Changed to type="button" as onSubmit is on form element */}
                        {editRisk ? "Update" : "Save"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}