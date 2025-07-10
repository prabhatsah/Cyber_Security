// // EditFindingForm.tsx
// "use client";
// import React, { useEffect, useState } from "react";
// import { useForm, useFieldArray } from "react-hook-form";
// import { z } from "zod";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { v4 } from "uuid";
// import { useRouter } from "next/navigation";
// import { Button } from "@/shadcn/ui/button";
// import {
//     Dialog,
//     DialogContent,
//     DialogFooter,
//     DialogHeader,
//     DialogTitle,
// } from "@/shadcn/ui/dialog";
// import { Card, CardContent } from "@/shadcn/ui/card";
// import {
//     Accordion,
//     AccordionItem,
//     AccordionTrigger,
//     AccordionContent,
// } from "@/shadcn/ui/accordion";
// import { ScrollArea } from "@/shadcn/ui/scroll-area";
// import { Form } from "@/shadcn/ui/form";
// import FormComboboxInput from "@/ikon/components/form-fields/combobox-input";
// import FormTextarea from "@/ikon/components/form-fields/textarea";
// import {
//     getMyInstancesV2,
//     invokeAction,
//     mapProcessName,
//     startProcessV2,
// } from "@/ikon/utils/api/processRuntimeService";
// import { format } from "date-fns";
// import { SAVE_DATE_FORMAT_GRC } from "@/ikon/utils/config/const";
// // Removed UploadComponent as it's not needed for single finding edit
// // import UploadComponent from "./uploadComponentForFindings";
// import { Label } from "@/shadcn/ui/label";
// // Removed ToggleGroup as input method is fixed to manual (editing)
// // import { ToggleGroup, ToggleGroupItem } from "@/shadcn/ui/toggle-group";
// import { getLoggedInUserProfile } from "@/ikon/utils/api/loginService";
// // Removed fetchFindingsMatchedInstance as we are passed the finding directly
// // import { fetchFindingsMatchedInstance } from "./(backend-calls)";
// import { toast } from "sonner";
// import {
//     Check,
//     Copyright,
//     ListChecks,
//     Loader2Icon,
//     Save,
//     Tags,
// } from "lucide-react";
// // Removed unused import
// // import { truncate } from "fs";
// import ExcelGenerator from "./dummy"; // Assuming this path and component are correct
// import { Finding, ObservationDetail } from "../../../../(common-types)/types"; // Assuming this path and types are correct

// // Zod schema remains the same as the form structure is the same
// const EditFindingFormSchema = z.object({
//     // Removed CONTROL_NAME and CONTROL_OBJ as they are not selected in this form
//     // CONTROL_NAME: z.string().optional(),
//     // CONTROL_OBJ: z.string().optional(),
//     findings: z
//         .array(
//             z.object({
//                 findingId: z.string().min(1, "Finding ID is required"),
//                 controlName: z.string().min(1, "Control name is required"),
//                 controlObjective: z.string().min(1, "Control objective is required"),
//                 controlObjId: z
//                     .union([z.string(), z.number()])
//                     .refine((val) => val !== "" && val !== null && val !== undefined, {
//                         message: "Control objective ID is required",
//                     }),
//                 controlId: z
//                     .union([z.string(), z.number()])
//                     .refine((val) => val !== "" && val !== null && val !== undefined, {
//                         message: "Control ID is required",
//                     }),

//                 observationDetails: z
//                     .array(
//                         z.object({
//                             observation: z
//                                 .string()
//                                 .min(1, "Observation is required")
//                                 .max(500, "Observation must be less than 500 characters"),
//                             recommendation: z
//                                 .string()
//                                 .min(1, "Recommendation is required")
//                                 .max(500, "Recommendation must be less than 500 characters"),
//                             owner: z.string().min(1, "Owner is required"),
//                             observationId: z.any().optional(), // Allow any or missing for new ones
//                             conformity: z
//                                 .union([
//                                     z.enum([
//                                         "Major Nonconformity",
//                                         "Minor Nonconformity",
//                                         "Conforms",
//                                         "Recommendation",
//                                     ]),
//                                     z.literal(""),
//                                 ])
//                                 .refine((val) => val !== "", {
//                                     message: "Conformity cannot be empty",
//                                 }),
//                             updatedBy: z.string().min(1, "Updated by is required"),
//                             lastUpdatedOn: z.string().datetime("Invalid date format"),
//                         })
//                     )
//                     .min(1, "At least one observation is required"),

//                 status: z
//                     .enum(["Pass", "Failed", "On-hold"], {
//                         errorMap: () => ({ message: "Invalid status" }),
//                     })
//                     .optional(),

//                 updatedByOverAll: z.any().optional(),
//                 lastUpdatedOnOverAll: z.any().optional(),
//             })
//         )
//         .min(1, "At least one finding is required"), // Ensure there's at least one finding (the one being edited)
// });
// type EditFormSchemaType = z.infer<typeof EditFindingFormSchema>;

// export const conformityData = [
//     { value: "Major Nonconformity", label: "Major Nonconformity" },
//     { value: "Minor Nonconformity", label: "Minor Nonconformity" },
//     { value: "Conforms", label: "Conforms" },
//     { value: "Recommendation", label: "Recommendation" },
// ];

// export const statusData = [
//     { value: "Pass", label: "Pass" },
//     { value: "Failed", label: "Failed" },
//     { value: "On-hold", label: "On-hold" },
// ];

// interface EditFindingFormProps {
//     open: boolean;
//     setOpen: React.Dispatch<React.SetStateAction<boolean>>;
//     userIdNameMap: { value: string; label: string }[];
//     // This prop now specifically expects the single finding data structure
//     findingData: Record<string, any>; // Assuming meetingId and auditId are also passed
//     // auditData is not directly used for display in this component, but might be needed for ExcelGenerator
//     auditData?: any;
// }

// export default function EditFindingForm({
//     open,
//     setOpen,
//     userIdNameMap,
//     findingData, // Renamed from selectedMeetData
//     auditData,
// }: EditFindingFormProps) {
//     const router = useRouter();

//     // Default values are now based on the single finding data
//     // This is used only on the very first render before the useEffect runs
//     const defaultValues: EditFormSchemaType = {
//         findings: findingData ? [{
//             ...findingData,
//             // Ensure observationDetails is an array and format dates/updatedBy if necessary
//             observationDetails: Array.isArray(findingData.observationDetails) ? findingData.observationDetails.map(obs => ({
//                 ...obs,
//                 lastUpdatedOn: obs.lastUpdatedOn || new Date().toISOString(), // Ensure date format
//                 // updatedBy will be set from current user on save if not present? Or should come from findingData?
//                 // For editing, existing updatedBy should probably be kept unless a change is made?
//             })) : [],
//             lastUpdatedOnOverAll: findingData.lastUpdatedOnOverAll || new Date().toISOString(),
//             // updatedByOverAll will be set from current user on save if not present? Or should come from findingData?
//         }] : [],
//     };

//     const form = useForm<EditFormSchemaType>({
//         resolver: zodResolver(EditFindingFormSchema),
//         defaultValues, // Use defaultValues for initial population
//         mode: "onChange", // Added for better validation feedback
//     });

//     const { control, watch, handleSubmit, reset, setValue } = form;
//     const { fields, append, update } = useFieldArray({
//         control,
//         name: "findings",
//     });

//     // Removed inputMethod state as it's always 'manual' (editing)
//     // const [inputMethod, setInputMethod] = useState<"manual" | "upload">("manual");
//     // Removed uploadedFindingsData state
//     // const [uploadedFindingsData, setUploadedFindingsData] = useState<any>(null);
//     const [currentUserId, setCurrentUserId] = useState<string | undefined>(undefined);
//     const [loadingOnSave, setLoadingOnSave] = useState(false);
//     // fieldsForExcel can directly use the 'fields' from useFieldArray
//     // const [fieldsForExcel, setFieldsForExcel] = useState<Finding[]>();

//     const [loading, setLoading] = useState(true); // Still need loading for initial user fetch

//     // Removed controlData, controlNames, etc. as they are not needed for editing a single finding

//     // Reset form and populate when dialog opens/closes or findingData changes
//     useEffect(() => {
//         // Only run if dialog is open and findingData is provided
//         if (open && findingData) {
//             setLoading(true); // Start loading
//             console.log("Populating form with single finding:", findingData);

//             // Prepare the single finding data for the form state
//             const initialFindings = [{
//                 ...findingData,
//                 // Ensure observationDetails is an array and format dates/updatedBy if necessary
//                 observationDetails: Array.isArray(findingData.observationDetails) ? findingData.observationDetails.map(obs => ({
//                     ...obs,
//                     lastUpdatedOn: obs.lastUpdatedOn || new Date().toISOString(), // Ensure date format
//                 })) : [],
//                 lastUpdatedOnOverAll: findingData.lastUpdatedOnOverAll || new Date().toISOString(),
//             }];

//             // Reset the form and set the findings
//             reset({ findings: initialFindings });
//             setLoading(false); // Stop loading
//         } else if (!open) {
//             // Reset form when closing
//             reset({ findings: [] });
//         }
//     }, [open, reset, findingData]); // Dependency on open, reset, and findingData


//     // Removed useEffect for manual input selects

//     // Function to add a new observation detail to the single finding in the form
//     const addObservationToFinding = (findingId: string) => {
//         // In this component, there should only ever be one finding in the 'fields' array
//         // We can directly use index 0, but findingId lookup is safer if structure changes
//         const findingIndex = fields.findIndex((f) => f.findingId === findingId);
//         if (findingIndex === -1) {
//             console.error("Finding not found with ID:", findingId);
//             return;
//         }
//         const finding = fields[findingIndex];

//         const currentObservationDetails = Array.isArray(finding.observationDetails)
//             ? finding.observationDetails
//             : [];

//         update(findingIndex, {
//             ...finding,
//             observationDetails: [
//                 ...currentObservationDetails,
//                 {
//                     observation: "",
//                     observationId: v4(), // Generate new ID for new observation
//                     recommendation: "",
//                     owner: "", // Default empty owner
//                     conformity: "", // Default empty conformity
//                     lastUpdatedOn: new Date().toISOString(),
//                     updatedBy: currentUserId, // Set updatedBy to current user for new observation
//                 },
//             ],
//         });
//     };

//     // Removed importedUploadData function

//     // Fetch current logged-in user ID
//     useEffect(() => {
//         const fetchProfile = async () => {
//             const profile = await getLoggedInUserProfile();
//             setCurrentUserId(profile.USER_ID);
//         };

//         fetchProfile();
//     }, []); 
//     const saveFinding = async (data: EditFormSchemaType) => {
//         setLoadingOnSave(true);

//         // We expect only one finding in the array for this component
//         const findingToSave = data.findings?.[0];

//         if (!findingToSave) {
//             console.error("No finding data to save.");
//             toast.error("No finding data to save!", { duration: 4000 });
//             setLoadingOnSave(false);
//             return;
//         }

//         // Ensure observationIds are present and set updatedBy/lastUpdatedOn for any changes
//         const formattedObservationDetails = (Array.isArray(findingToSave.observationDetails) ? findingToSave.observationDetails : []).map(obs => ({
//             ...obs,
//             observationId: obs.observationId || v4(),
//             lastUpdatedOn: obs.lastUpdatedOn || new Date().toISOString(),
//             updatedBy: obs.updatedBy || currentUserId, // Fallback to current user if missing
//         }));

//         const finalFindingData = {
//             // Include meetingId and auditId from the initial findingData prop
//             meetingId: findingData.meetingId,
//             auditId: findingData.auditId,
//             // Use data from the form state for the finding details
//             findingId: findingToSave.findingId,
//             controlId: findingToSave.controlId?.toString(),
//             controlName: findingToSave.controlName,
//             controlObjId: findingToSave.controlObjId?.toString(),
//             controlObjective: findingToSave.controlObjective,
//             status: findingToSave.status || "",
//             observationDetails: formattedObservationDetails,
//             lastUpdatedOnOverAll: new Date().toISOString(), // Update overall timestamp on save
//             updatedByOverAll: currentUserId, // Set overall updatedBy to current user
//         };

//         console.log(
//             "DATA FOR SAVING (Edit Finding):",
//             JSON.parse(JSON.stringify(finalFindingData))
//         );

//         try {

//             let existingInstances;
//             const findingIdClause = `this.Data.findingId == '${finalFindingData.findingId}'`;

//             try {
//                 // Attempt to find by findingId (more precise for editing)
//                 existingInstances = await getMyInstancesV2({
//                     processName: "Meeting Findings",
//                     predefinedFilters: { taskName: "Edit Find" },
//                     mongoWhereClause: findingIdClause,
//                 });
//                 console.log("Found instances by findingId:", existingInstances);

//                 if (!existingInstances || existingInstances.length === 0) {
//                     // If not found by findingId, fallback to finding by control/obj pair (original logic)
//                     const controlObjClause = `this.Data.controlObjId == '${finalFindingData.controlObjId}' && this.Data.controlId == '${finalFindingData.controlId}'`;
//                     console.log("Finding by findingId failed, falling back to control/obj pair:", controlObjClause);
//                     existingInstances = await getMyInstancesV2({
//                         processName: "Meeting Findings",
//                         predefinedFilters: { taskName: "Edit Find" },
//                         mongoWhereClause: controlObjClause,
//                     });
//                     console.log("Found instances by control/obj pair:", existingInstances);
//                 }

//             } catch (fetchError) {
//                 console.error("Error fetching existing instances:", fetchError);
//                 // Fallback to control/obj clause if findingId query fails
//                 const controlObjClause = `this.Data.controlObjId == '${finalFindingData.controlObjId}' && this.Data.controlId == '${finalFindingData.controlId}'`;
//                 console.log("Fetching by findingId failed, falling back to control/obj pair:", controlObjClause);
//                 existingInstances = await getMyInstancesV2({
//                     processName: "Meeting Findings",
//                     predefinedFilters: { taskName: "Edit Find" },
//                     mongoWhereClause: controlObjClause,
//                 });
//                 console.log("Found instances by control/obj pair:", existingInstances);
//             }


//             if (existingInstances && existingInstances.length > 0) {
//                 // Update existing instance (assuming the first match is the correct one)
//                 const taskId = existingInstances[0].taskId;
//                 console.log(`Updating existing instance with taskId:`, taskId);

//                 await invokeAction({
//                     taskId,
//                     transitionName: "Update Edit", // Ensure this transition name is correct
//                     data: finalFindingData, // Pass the prepared data
//                     processInstanceIdentifierField: "", // May need adjustment
//                 });
//             } else {
//                 // This case should ideally not happen if we are editing an existing finding,
//                 // but as a fallback, we can create a new one.
//                 console.warn("No existing instance found for update. Creating a new process instance.");
//                 const findingProcessId = await mapProcessName({
//                     processName: "Meeting Findings",
//                 });

//                 await startProcessV2({
//                     processId: findingProcessId,
//                     data: finalFindingData, // Pass the prepared data
//                     processIdentifierFields: "", // May need adjustment
//                 });
//             }

//             setOpen(false);
//             router.refresh(); // Refresh after saving
//             setLoadingOnSave(false);
//             toast.success("Finding Saved Successfully", {
//                 duration: 4000,
//             });
//         } catch (error) {
//             console.error("Error saving finding:", error);
//             toast.error("Error saving finding!", {
//                 duration: 4000,
//             });
//             setLoadingOnSave(false);
//         }
//     };


//     const meetingDate = findingData?.lastUpdatedOnOverAll ? format(new Date(findingData.lastUpdatedOnOverAll), SAVE_DATE_FORMAT_GRC) : "N/A";

//     return (
//         <Dialog open={open} onOpenChange={setOpen}>
//             <DialogContent className="max-w-[80%] max-h-[90vh] overflow-hidden">
//                 <DialogHeader>
//                     <DialogTitle>Edit Finding</DialogTitle>
//                 </DialogHeader>
//                 <Card>
//                     <CardContent className="p-4">
//                         <div className="flex flex-wrap text-md">
//                             <div className="min-w-[380px]">
//                                 <span className="font-semibold">Control Policy:</span>
//                                 {findingData?.controlName ?? "N/A"}
//                             </div>
//                             <div className="min-w-[350px]">
//                                 <span className="font-semibold">Control Objective:</span>
//                                 {findingData?.controlObjective ?? "N/A"}
//                             </div>
//                             <div className="min-w-[350px]">
//                                 <span className="font-semibold">Finding Status:</span>
//                                 {findingData?.status ?? "N/A"}
//                             </div>
//                             <div className="min-w-[350px]">
//                                 <span className="font-semibold">Last Updated:</span>
//                                 {meetingDate}
//                             </div>
//                         </div>
//                     </CardContent>
//                 </Card>
//                 <Form {...form}>
//                     <form className="space-y-2" onSubmit={handleSubmit(saveFinding)}>
//                         {loading ? (
//                             <div className="flex justify-center items-center h-[300px]">
//                                 <Loader2Icon className="animate-spin h-8 w-8 text-primary" />
//                             </div>
//                         ) : (
//                             fields.length > 0 ? (
//                                 <ScrollArea className="max-h-[500px] pr-2 overflow-y-auto">
//                                     <Accordion type="multiple" defaultValue={[fields[0].findingId]} className="pr-2 pt-2">
//                                         {fields.map((finding, index) => (
//                                             <AccordionItem
//                                                 value={finding.findingId}
//                                                 key={finding.findingId}
//                                                 className="shadow-sm border rounded-xl border-l-4 border-primary p-3 m-2"
//                                             >
//                                                 <AccordionTrigger className="flex flex-wrap items-center gap-4 py-2 w-full text-white hover:no-underline">
//                                                     <div className="flex gap-4 items-center flex-wrap">
//                                                         <div className="flex items-center gap-1">
//                                                             <ListChecks className="h-4 w-4" />
//                                                             <span className="font-bold">Policy :</span>
//                                                             <span className="text-blue-400">{finding.controlName}</span>
//                                                         </div>
//                                                         <div className="flex items-center gap-1">
//                                                             <Tags className="h-4 w-4" />
//                                                             <span className="font-bold">Objective :</span>
//                                                             <span className="text-blue-400">{finding.controlObjective}</span>
//                                                         </div>
//                                                     </div>
//                                                 </AccordionTrigger>
//                                                 <AccordionContent className="space-y-4">

//                                                     {(() => {
//                                                         const obsDetails = Array.isArray(finding.observationDetails)
//                                                             ? finding.observationDetails.filter(
//                                                                 (obs) => obs.observationId === findingData.observationId
//                                                             )
//                                                             : [];
//                                                         return obsDetails.map((obsDetail) => {
//                                                             // Find the actual index in the full observationDetails array
//                                                             const realObsIndex = finding.observationDetails.findIndex(
//                                                                 (o) => o.observationId === obsDetail.observationId
//                                                             );
//                                                             return (
//                                                                 <div
//                                                                     key={obsDetail.observationId || realObsIndex}
//                                                                     className="space-y-4 p-4 border rounded-lg"
//                                                                 >
//                                                                     <FormTextarea
//                                                                         formControl={control}
//                                                                         name={`findings.${index}.observationDetails.${realObsIndex}.observation`}
//                                                                         placeholder="Observation"
//                                                                         label="Observation"
//                                                                     />
//                                                                     <FormTextarea
//                                                                         formControl={control}
//                                                                         name={`findings.${index}.observationDetails.${realObsIndex}.recommendation`}
//                                                                         placeholder="Recommendation"
//                                                                         label="Recommendation"
//                                                                     />
//                                                                     <div className="grid grid-cols-2 gap-3">
//                                                                         <FormComboboxInput
//                                                                             items={userIdNameMap}
//                                                                             formControl={control}
//                                                                             name={`findings.${index}.observationDetails.${realObsIndex}.owner`}
//                                                                             placeholder="Select Owner"
//                                                                             label="Owner"
//                                                                         />
//                                                                         <FormComboboxInput
//                                                                             items={conformityData}
//                                                                             formControl={control}
//                                                                             name={`findings.${index}.observationDetails.${realObsIndex}.conformity`}
//                                                                             placeholder="Select Conformity Type"
//                                                                             label="Conformity Type"
//                                                                         />
//                                                                     </div>
//                                                                 </div>
//                                                             );
//                                                         });
//                                                     })()}
//                                                     <Button
//                                                         type="button"
//                                                         className="mt-2"
//                                                         onClick={() => addObservationToFinding(finding.findingId)}
//                                                     >
//                                                         + Add Observation
//                                                     </Button>
//                                                     <div className="mt-4">
//                                                         <FormComboboxInput
//                                                             items={statusData}
//                                                             formControl={control}
//                                                             name={`findings.${index}.status`}
//                                                             placeholder="Select Status"
//                                                             label="Status"
//                                                         />
//                                                     </div>
//                                                 </AccordionContent>
//                                             </AccordionItem>
//                                         ))}
//                                     </Accordion>
//                                 </ScrollArea>
//                             ) : (
//                                 <div className="text-center text-muted-foreground py-8">Finding data not loaded.</div>
//                             )
//                         )}
//                         <DialogFooter>
//                             <ExcelGenerator
//                                 allFindings={fields || []}
//                                 loading={loading}
//                                 frameworkName={auditData && auditData.length > 0 ? auditData[0].policyName : "Audit Findings"}
//                             />
//                             <Button type="submit" disabled={loadingOnSave || loading || fields.length === 0}>
//                                 {loadingOnSave ? (
//                                     <Loader2Icon className="animate-spin mr-2" />
//                                 ) : (
//                                     <Save className="mr-2" />
//                                 )}
//                                 Edit
//                             </Button>
//                         </DialogFooter>
//                     </form>
//                 </Form>
//             </DialogContent>
//         </Dialog>
//     );
// }

// ----------------------------------------------------------- NEW CODE -----------------------------------------------------------

// EditFindingForm.tsx

"use client";
import React, { useEffect, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { v4 } from "uuid";
import { useRouter } from "next/navigation";
import { Button } from "@/shadcn/ui/button";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/shadcn/ui/dialog";
import { Card, CardContent } from "@/shadcn/ui/card";
import { ScrollArea } from "@/shadcn/ui/scroll-area";
import { Form } from "@/shadcn/ui/form";
import FormComboboxInput from "@/ikon/components/form-fields/combobox-input";
import FormTextarea from "@/ikon/components/form-fields/textarea";
import {
    getMyInstancesV2,
    invokeAction,
    mapProcessName,
    startProcessV2,
} from "@/ikon/utils/api/processRuntimeService";
import { format } from "date-fns";
import { SAVE_DATE_FORMAT_GRC } from "@/ikon/utils/config/const";
import { Label } from "@/shadcn/ui/label";
import { getLoggedInUserProfile } from "@/ikon/utils/api/loginService";
import { toast } from "sonner";
import {
    Loader2Icon,
    Save,
    PlusCircle,
} from "lucide-react";
import ExcelGenerator from "./excelGenerator";
import { Finding, ObservationDetail } from "../../../../(common-types)/types";

const EditFindingFormSchema = z.object({
    findings: z
        .array(
            z.object({
                findingId: z.string().min(1, "Finding ID is required"),
                controlName: z.string().min(1, "Control name is required"),
                controlObjective: z.string().min(1, "Control objective is required"),
                controlObjId: z
                    .union([z.string(), z.number()])
                    .refine((val) => val !== "" && val !== null && val !== undefined, {
                        message: "Control objective ID is required",
                    }),
                controlId: z
                    .union([z.string(), z.number()])
                    .refine((val) => val !== "" && val !== null && val !== undefined, {
                        message: "Control ID is required",
                    }),
                observationDetails: z
                    .array(
                        z.object({
                            observation: z
                                .string()
                                .min(1, "Observation is required")
                                .max(500, "Observation must be less than 500 characters"),
                            recommendation: z
                                .string()
                                .min(1, "Recommendation is required")
                                .max(500, "Recommendation must be less than 500 characters"),
                            owner: z.string().min(1, "Owner is required"),
                            observationId: z.any().optional(),
                            conformity: z
                                .union([
                                    z.enum([
                                        "Major Nonconformity",
                                        "Minor Nonconformity",
                                        "Conforms",
                                        "Recommendation",
                                    ]),
                                    z.literal(""),
                                ])
                                .refine((val) => val !== "", {
                                    message: "Conformity cannot be empty",
                                }),
                            updatedBy: z.string().min(1, "Updated by is required"),
                            lastUpdatedOn: z.string().datetime("Invalid date format"),
                        })
                    )
                    .min(1, "At least one observation is required"),
                status: z
                    .enum(["Pass", "Failed", "On-hold"], {
                        errorMap: () => ({ message: "Invalid status" }),
                    })
                    .optional(),
                updatedByOverAll: z.any().optional(),
                lastUpdatedOnOverAll: z.any().optional(),
            })
        )
        .min(1, "At least one finding is required"),
});
type EditFormSchemaType = z.infer<typeof EditFindingFormSchema>;

export const conformityData = [
    { value: "Major Nonconformity", label: "Major Nonconformity" },
    { value: "Minor Nonconformity", label: "Minor Nonconformity" },
    { value: "Conforms", label: "Conforms" },
    { value: "Recommendation", label: "Recommendation" },
];

export const statusData = [
    { value: "Pass", label: "Pass" },
    { value: "Failed", label: "Failed" },
    { value: "On-hold", label: "On-hold" },
];

interface EditFindingFormProps {
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
    userIdNameMap: { value: string; label: string }[];
    findingData: Record<string, any>;
    auditData?: any;
}

export default function EditFindingForm({
    open,
    setOpen,
    userIdNameMap,
    findingData,
    auditData,
}: EditFindingFormProps) {
    const router = useRouter();

    const defaultValues: EditFormSchemaType = {
        findings: findingData
            ? [
                {
                    ...findingData,
                    observationDetails: Array.isArray(findingData.observationDetails)
                        ? findingData.observationDetails.map((obs) => ({
                            ...obs,
                            lastUpdatedOn: obs.lastUpdatedOn || new Date().toISOString(),
                        }))
                        : [],
                    lastUpdatedOnOverAll:
                        findingData.lastUpdatedOnOverAll || new Date().toISOString(),
                },
            ]
            : [],
    };

    const form = useForm<EditFormSchemaType>({
        resolver: zodResolver(EditFindingFormSchema),
        defaultValues,
        mode: "onChange",
    });


    const { control, handleSubmit, reset, getValues } = form;
    const { fields, update } = useFieldArray({
        control,
        name: "findings",
    });

    const [showNewObservation, setShowNewObservation] = useState(false);
    const [currentUserId, setCurrentUserId] = useState<string | undefined>(
        undefined
    );
    const [loadingOnSave, setLoadingOnSave] = useState(false);
    const [loading, setLoading] = useState(true);



    useEffect(() => {
        if (open && findingData) {
            setLoading(true);
            const initialFindings = [
                {
                    ...findingData,
                    observationDetails: Array.isArray(findingData.observationDetails)
                        ? findingData.observationDetails.map((obs) => ({
                            ...obs,
                            lastUpdatedOn: obs.lastUpdatedOn || new Date().toISOString(),
                        }))
                        : [],
                    lastUpdatedOnOverAll:
                        findingData.lastUpdatedOnOverAll || new Date().toISOString(),
                },
            ];
            reset({ findings: initialFindings });
            setLoading(false);
        } else if (!open) {
            reset({ findings: [] });
        }
    }, [open, reset, findingData]);

    useEffect(() => {
        const fetchProfile = async () => {
            const profile = await getLoggedInUserProfile();
            setCurrentUserId(profile.USER_ID);
        };
        fetchProfile();
    }, []);

    //   const addObservationToFinding = () => {
    //     if (fields.length === 0) return;
    //     const findingIndex = 0;
    //     const finding = fields[findingIndex];
    //     const currentObservationDetails = Array.isArray(finding.observationDetails)
    //       ? finding.observationDetails
    //       : [];
    //     update(findingIndex, {
    //       ...finding,
    //       observationDetails: [
    //         ...currentObservationDetails,
    //         {
    //           observation: "",
    //           observationId: v4(),
    //           recommendation: "",
    //           owner: "",
    //           conformity: "",
    //           lastUpdatedOn: new Date().toISOString(),
    //           updatedBy: currentUserId,
    //         },
    //       ],
    //     });
    //   };

    // const addObservationToFinding = () => {
    //     if (fields.length === 0) return;
    //     const findingIndex = 0;
    //     const finding = fields[findingIndex];
    //     const currentObservationDetails = Array.isArray(finding.observationDetails)
    //         ? finding.observationDetails
    //         : [];
    //     // Only set the new observation's ID to findingData.observationId if there is no match yet
    //     const alreadyExists = currentObservationDetails.some(
    //         (obs) => obs.observationId === findingData.observationId
    //     );
    //     update(findingIndex, {
    //         ...finding,
    //         observationDetails: [
    //             ...currentObservationDetails,
    //             {
    //                 observation: "",
    //                 observationId: alreadyExists ? v4() : findingData.observationId,
    //                 recommendation: "",
    //                 owner: "",
    //                 conformity: "",
    //                 lastUpdatedOn: new Date().toISOString(),
    //                 updatedBy: currentUserId,
    //             },
    //         ],
    //     });
    // };

    const addObservationToFinding = () => {
        if (fields.length === 0) return;
        const findingIndex = 0;
        // const finding = fields[findingIndex];
        const finding = getValues(`findings.${findingIndex}`);
        const currentObservationDetails = Array.isArray(finding.observationDetails)
            ? finding.observationDetails
            : [];


        update(findingIndex, {
            ...finding,
            observationDetails: [
                ...currentObservationDetails,
                {
                    observation: "",
                    observationId: v4(), // New random ID
                    recommendation: "",
                    owner: "",
                    conformity: "",
                    lastUpdatedOn: new Date().toISOString(),
                    updatedBy: currentUserId,
                },
            ],
        });
        setShowNewObservation(true); // Set flag to show the new observation
    };

    const removeObservationFromFinding = (obsIndexToRemove: number) => {
        if (fields.length === 0) return;
        const findingIndex = 0;
        // const finding = fields[findingIndex];
        const finding = getValues(`findings.${findingIndex}`);
        const currentObservationDetails = Array.isArray(finding.observationDetails)
            ? finding.observationDetails
            : [];
        if (currentObservationDetails.length <= 1) {
            toast.warning("A finding must have at least one observation.", { duration: 4000 });
            return;
        }
        const updatedObservationDetails = currentObservationDetails.filter(
            (_, index) => index !== obsIndexToRemove
        );
        update(findingIndex, {
            ...finding,
            observationDetails: updatedObservationDetails,
        });
    };

    const saveFinding = async (data: EditFormSchemaType) => {
        // debugger;
        setLoadingOnSave(true);
        const findingToSave = data.findings?.[0];
        if (!findingToSave) {
            toast.error("No finding data to save!", { duration: 4000 });
            setLoadingOnSave(false);
            return;
        }
        const formattedObservationDetails = (
            Array.isArray(findingToSave.observationDetails)
                ? findingToSave.observationDetails
                : []
        ).map((obs) => ({
            ...obs,
            observationId: obs.observationId || v4(),
            lastUpdatedOn: obs.lastUpdatedOn || new Date().toISOString(),
            updatedBy: obs.updatedBy || currentUserId,
        }));

        const finalFindingData = {
            meetingId: findingData.meetingId,
            auditId: findingData.auditId,
            findingId: findingToSave.findingId,
            controlId: findingToSave.controlId?.toString(),
            controlName: findingToSave.controlName,
            controlObjId: findingToSave.controlObjId?.toString(),
            controlObjective: findingToSave.controlObjective,
            status: findingToSave.status || "",
            observationDetails: formattedObservationDetails,
            lastUpdatedOnOverAll: new Date().toISOString(),
            updatedByOverAll: currentUserId,
        };

        try {
            let existingInstances;
            const findingIdClause = `this.Data.findingId == '${finalFindingData.findingId}'`;
            try {
                existingInstances = await getMyInstancesV2({
                    processName: "Meeting Findings",
                    predefinedFilters: { taskName: "Edit Find" },
                    mongoWhereClause: findingIdClause,
                });
                if (!existingInstances || existingInstances.length === 0) {
                    const controlObjClause = `this.Data.controlObjId == '${finalFindingData.controlObjId}' && this.Data.controlId == '${finalFindingData.controlId}'`;
                    existingInstances = await getMyInstancesV2({
                        processName: "Meeting Findings",
                        predefinedFilters: { taskName: "Edit Find" },
                        mongoWhereClause: controlObjClause,
                    });
                }
            } catch {
                const controlObjClause = `this.Data.controlObjId == '${finalFindingData.controlObjId}' && this.Data.controlId == '${finalFindingData.controlId}'`;
                existingInstances = await getMyInstancesV2({
                    processName: "Meeting Findings",
                    predefinedFilters: { taskName: "Edit Find" },
                    mongoWhereClause: controlObjClause,
                });
            }

            if (existingInstances && existingInstances.length > 0) {
                const taskId = existingInstances[0].taskId;
                await invokeAction({
                    taskId,
                    transitionName: "Update Edit",
                    data: finalFindingData,
                    processInstanceIdentifierField: "",
                });
            } else {
                const findingProcessId = await mapProcessName({
                    processName: "Meeting Findings",
                });
                await startProcessV2({
                    processId: findingProcessId,
                    data: finalFindingData,
                    processIdentifierFields: "",
                });
            }

            setOpen(false);
            router.refresh();
            setLoadingOnSave(false);
            toast.success("Finding Saved Successfully", {
                duration: 4000,
            });
        } catch (error) {
            console.error("Error saving finding:", error);
            toast.error("Error saving finding!", {
                duration: 4000,
            });
            setLoadingOnSave(false);
        }
    };

    const meetingDate = findingData?.lastUpdatedOnOverAll
        ? format(new Date(findingData.lastUpdatedOnOverAll), SAVE_DATE_FORMAT_GRC)
        : "N/A";

   
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="max-w-[80%] max-h-[90vh] overflow-hidden">
                <DialogHeader>
                    <DialogTitle>Edit Finding</DialogTitle>
                </DialogHeader>
                <Card className="mb-4">
                    <CardContent className="p-4 space-y-2">
                        <div className="flex flex-wrap text-md gap-4">
                            <div className="min-w-[300px]">
                                <span className="font-semibold">Control Policy:</span>{" "}
                                {findingData?.controlName ?? "N/A"}
                            </div>
                            <div className="min-w-[300px]">
                                <span className="font-semibold">Control Objective:</span>{" "}
                                {findingData?.controlObjective ?? "N/A"}
                            </div>
                            <div className="min-w-[200px]">
                                <span className="font-semibold">Finding Status:</span>{" "}
                                {findingData?.status ?? "N/A"}
                            </div>
                            <div className="min-w-[200px]">
                                <span className="font-semibold">Last Updated:</span>{" "}
                                {meetingDate}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold"></h3>
                    <Button
                        type="button"
                        onClick={addObservationToFinding}
                        disabled={loading}
                    >
                        <PlusCircle className="mr-2 h-4 w-4" /> Add Observation
                    </Button>
                </div>

                <Form {...form}>
                    <form className="space-y-4" onSubmit={handleSubmit(saveFinding)}>
                        {loading ? (
                            <div className="flex justify-center items-center h-[300px]">
                                <Loader2Icon className="animate-spin h-8 w-8 text-primary" />
                            </div>
                        ) : fields.length > 0 ? (

                            // <ScrollArea className="max-h-[400px] pr-2 overflow-y-auto space-y-4">
                            //     {(() => {
                            //         const allObs = Array.isArray(fields[0].observationDetails)
                            //             ? fields[0].observationDetails
                            //             : [];
                            //         // Find the matching observation
                            //         let obsDetails = allObs.filter(
                            //             (obs) => obs.observationId === findingData.observationId
                            //         );
                            //         // If not found and showNewObservation is true, show the last one (just added)
                            //         if (obsDetails.length === 0 && allObs.length > 0 && showNewObservation) {
                            //             obsDetails = [allObs[allObs.length - 1]];
                            //         }
                            //         return obsDetails.map((obsDetail) => {
                            //             const realObsIndex = allObs.findIndex(
                            //                 (o) => o.observationId === obsDetail.observationId
                            //             );
                            //             if (realObsIndex === -1) return null;
                            //             return (
                            //                 <div
                            //                     key={obsDetail.observationId || realObsIndex}
                            //                     className="space-y-4 p-4 border rounded-lg"
                            //                 >
                            //                     <Label className="text-lg font-semibold">Observation</Label>
                            //                     <FormTextarea
                            //                         formControl={control}
                            //                         name={`findings.0.observationDetails.${realObsIndex}.observation`}
                            //                         placeholder="Observation"
                            //                         label="Observation"
                            //                     />
                            //                     <FormTextarea
                            //                         formControl={control}
                            //                         name={`findings.0.observationDetails.${realObsIndex}.recommendation`}
                            //                         placeholder="Recommendation"
                            //                         label="Recommendation"
                            //                     />
                            //                     <div className="grid grid-cols-2 gap-3">
                            //                         <FormComboboxInput
                            //                             items={userIdNameMap}
                            //                             formControl={control}
                            //                             name={`findings.0.observationDetails.${realObsIndex}.owner`}
                            //                             placeholder="Select Owner"
                            //                             label="Owner"
                            //                         />
                            //                         <FormComboboxInput
                            //                             items={conformityData}
                            //                             formControl={control}
                            //                             name={`findings.0.observationDetails.${realObsIndex}.conformity`}
                            //                             placeholder="Select Conformity Type"
                            //                             label="Conformity Type"
                            //                         />
                            //                     </div>
                            //                     {allObs.length > 1 && (
                            //                         <Button
                            //                             type="button"
                            //                             variant="outline"
                            //                             size="sm"
                            //                             onClick={() => removeObservationFromFinding(realObsIndex)}
                            //                             className="text-red-500 border-red-500 hover:bg-red-50 hover:text-red-600"
                            //                         >
                            //                             Remove Observation
                            //                         </Button>
                            //                     )}
                            //                 </div>
                            //             );
                            //         });
                            //     })()}
                            // </ScrollArea>

                            // this was a previous code block that was commented out
                            // new code added 

                            <ScrollArea className="max-h-[400px] pr-2 overflow-y-auto space-y-4">
                                {(() => {
                                    const allObs = Array.isArray(fields[0]?.observationDetails)
                                        ? fields[0].observationDetails
                                        : [];
                                    // Get original observation IDs from findingData
                                    const originalObservationIds = Array.isArray(findingData?.observationDetails)
                                        ? findingData.observationDetails.map((obs) => obs.observationId)
                                        : [];
                                    // Find the original (matching) observation
                                    const matchingIndex = allObs.findIndex(
                                        (obs) => obs.observationId === findingData.observationId
                                    );
                                    const cards = [];

                                    // Show the original observation (cannot be removed)
                                    if (matchingIndex !== -1) {
                                        cards.push(
                                            <div
                                                key={allObs[matchingIndex].observationId || matchingIndex}
                                                className="space-y-4 p-4 border rounded-lg"
                                            >
                                                <Label className="text-lg font-semibold">Observation</Label>
                                                <FormTextarea
                                                    formControl={control}
                                                    name={`findings.0.observationDetails.${matchingIndex}.observation`}
                                                    placeholder="Observation"
                                                    label="Observation"
                                                />
                                                <FormTextarea
                                                    formControl={control}
                                                    name={`findings.0.observationDetails.${matchingIndex}.recommendation`}
                                                    placeholder="Recommendation"
                                                    label="Recommendation"
                                                />
                                                <div className="grid grid-cols-2 gap-3">
                                                    <FormComboboxInput
                                                        items={userIdNameMap}
                                                        formControl={control}
                                                        name={`findings.0.observationDetails.${matchingIndex}.owner`}
                                                        placeholder="Select Owner"
                                                        label="Owner"
                                                        disabled
                                                    />
                                                    <FormComboboxInput
                                                        items={conformityData}
                                                        formControl={control}
                                                        name={`findings.0.observationDetails.${matchingIndex}.conformity`}
                                                        placeholder="Select Conformity Type"
                                                        label="Conformity Type"
                                                    />
                                                </div>
                                                {/* No remove button for the original observation */}
                                            </div>
                                        );
                                    }

                                    // Show all new observations (can be removed)
                                    allObs.forEach((obsDetail, obsIndex) => {
                                        // Only show as "New Observation" if NOT in the original data
                                        if (!originalObservationIds.includes(obsDetail.observationId)) {
                                            cards.push(
                                                <div
                                                    key={obsDetail.observationId || obsIndex}
                                                    className="space-y-4 p-4 border rounded-lg"
                                                >
                                                    <Label className="text-lg font-semibold">New Observation</Label>
                                                    <FormTextarea
                                                        formControl={control}
                                                        name={`findings.0.observationDetails.${obsIndex}.observation`}
                                                        placeholder="Observation"
                                                        label="Observation"
                                                    />
                                                    <FormTextarea
                                                        formControl={control}
                                                        name={`findings.0.observationDetails.${obsIndex}.recommendation`}
                                                        placeholder="Recommendation"
                                                        label="Recommendation"
                                                    />
                                                    <div className="grid grid-cols-2 gap-3">
                                                        <FormComboboxInput
                                                            items={userIdNameMap}
                                                            formControl={control}
                                                            name={`findings.0.observationDetails.${obsIndex}.owner`}
                                                            placeholder="Select Owner"
                                                            label="Owner"
                                                        />
                                                        <FormComboboxInput
                                                            items={conformityData}
                                                            formControl={control}
                                                            name={`findings.0.observationDetails.${obsIndex}.conformity`}
                                                            placeholder="Select Conformity Type"
                                                            label="Conformity Type"
                                                        />
                                                    </div>
                                                    <Button
                                                        type="button"
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => removeObservationFromFinding(obsIndex)}
                                                        className="text-red-500 border-red-500 hover:bg-red-50 hover:text-red-600"
                                                    >
                                                        Remove Observation
                                                    </Button>
                                                </div>
                                            );
                                        }
                                    });

                                    if (cards.length === 0) {
                                        return (
                                            <div className="text-center text-muted-foreground py-8">
                                                No observation found.
                                            </div>
                                        );
                                    }
                                    return cards;
                                })()}
                            </ScrollArea>
                        ) : (
                            <div className="text-center text-muted-foreground py-8">
                                Finding data not loaded.
                            </div>
                        )}

                     
                        {/* <div className="mt-4">
                            <FormComboboxInput
                                items={statusData}
                                formControl={control}
                                name={`findings.0.status`}
                                placeholder="Select Status"
                                label="Status"
                            />
                        </div> */}

                        <DialogFooter className="mt-6">
                            {/* <ExcelGenerator
                                allFindings={fields || []}
                                loading={loading}
                                frameworkName={
                                    auditData && auditData.length > 0
                                        ? auditData[0].policyName
                                        : "Audit Findings"
                                }
                            /> */}
                            <Button
                                type="submit"
                                disabled={loadingOnSave || loading || fields.length === 0 }
                            >
                                {loadingOnSave ? (
                                    <Loader2Icon className="animate-spin mr-2" />
                                ) : (
                                    <Save className="mr-2" />
                                )}
                                Edit
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}