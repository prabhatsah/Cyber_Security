'use client'
import FormComboboxInput from '@/ikon/components/form-fields/combobox-input';
import FormInput from '@/ikon/components/form-fields/input';
import { Button } from '@/shadcn/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/shadcn/ui/dialog';
import { Form } from '@/shadcn/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import React, { useEffect, useRef, useState } from 'react'
import { useForm, useWatch } from 'react-hook-form';
import { v4 } from 'uuid';
import { z } from 'zod';
import { useRouter } from "next/navigation";
import FormMultiComboboxInput from '@/ikon/components/form-fields/multi-combobox-input';
import FormDateInput from '@/ikon/components/form-fields/date-input';
import { SAVE_DATE_FORMAT_GRC } from '@/ikon/utils/config/const';
import PlanningModalTable from './planningModalTable';
import { Label } from '@/shadcn/ui/label';
import { Textarea } from '@/shadcn/ui/textarea';
import { toast } from "sonner";
import { v4 as uuidv4 } from 'uuid';
import { getMyInstancesV2, invokeAction, mapProcessName, startProcessV2 } from '@/ikon/utils/api/processRuntimeService';
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from "@/shadcn/ui/alert-dialog";
import { actions } from '@progress/kendo-react-common';
import { progress } from 'framer-motion';
import { cn } from '@/shadcn/lib/utils';
import { Alert, AlertDescription, AlertTitle } from '@/shadcn/ui/alert';
import { controls } from '../../../compliance/frameworks/data';

export const PlanningFormSchema = z.object({
    AUDIT_NAME: z
        .string()
        .min(1, { message: 'Please enter audit name.' })
        .trim(),
    AUDITEE_NAME: z
        .array(z.string())
        .min(1, { message: 'Please select auditee name.' }),
    AUDITOR_NAME: z
        .array(z.string())
        .min(1, { message: 'Please select auditor name.' }),
    START_DATE: z.date({ required_error: 'Please enter a valid start date.' }),
    END_DATE: z.date({ required_error: 'Please enter a valid end date.' }),
    SOP_TYPE: z
        .string()
        .min(2, { message: 'Please select Framework.' })
        .trim(),
    FRAMEWORK_TYPE: z
        .string()
        .min(2, { message: 'Please select Framework Type.' })
        .trim(),
    AUDIT_CYCLE: z
        .string()
        .min(2, { message: 'Please select Audit cycle.' })
        .trim(),
    DESCRIPTION: z
        .string().optional()
    // .min(1, { message: 'Please enter a description with at least 1 characters.' })
    // .trim(),
})

export const AuditCycle = [
    { value: "Once only", label: "Once only" },
    { value: "Monthly", label: "Monthly" },
    { value: "Quarterly", label: "Quarterly" },
    { value: "Yearly", label: "Yearly" },
]

export const frameworkTypes = [
    { value: "standard", label: "Standard" },
    { value: "bestPractice", label: "Best Practices" },
    { value: "rulesAndRegulation", label: "Rules and Regulations" }
]

// export const fetchControlsData = async () => {
//     try {
//         const controlsData = await getMyInstancesV2({
//             processName: "Control Objectives",
//             predefinedFilters: { taskName: "edit control objective" },
//         });
//         console.log("controlData-----", controlsData);
//         const controlsDataDynamic = Array.isArray(controlsData)
//             ? controlsData.map((e: any) => e.data)
//             : [];
//         console.log("controlsDataDynamic-----", controlsDataDynamic);
//         return controlsDataDynamic;
//     } catch (error) {
//         console.error("Failed to fetch the process:", error);
//         throw error;
//     }
// };


export const fetchControlsDataAuditManager = async () => {
    try {
        const controlsData = await getMyInstancesV2({
            processName: "Control Objectives",
            predefinedFilters: { taskName: "view control objecitve" },
        });
        console.log("controlData-----", controlsData);
        const controlsDataDynamic = Array.isArray(controlsData)
            ? controlsData.map((e: any) => e.data)
            : [];
        console.log("controlsDataDynamic-----", controlsDataDynamic);
        return controlsDataDynamic;
    } catch (error) {
        console.error("Failed to fetch the process:", error);
        throw error;
    }
};

export async function fetchAuditsData(auditId: string) {
    try {
        const auditsData = await getMyInstancesV2<any>({
            processName: "Audit",
            predefinedFilters: { taskName: "Edit Audit" },
            mongoWhereClause: `this.Data.auditId == "${auditId}"`,
        });
        const auditsDataDynamic = Array.isArray(auditsData)
            ? auditsData.map((e: any) => e.data)
            : [];
        return auditsDataDynamic;
    } catch (error) {
        console.error("Failed to fetch the process:", error);
        throw error;
    }
};



export default function PlanningForm({ open, setOpen, userIdNameMap, editPlanning }:
    { open: boolean, setOpen: React.Dispatch<React.SetStateAction<boolean>>, userIdNameMap: { value: string, label: string }[], editPlanning: Record<string, string> | null }) {

    const [controlsData, setControlsData] = useState<any[]>([]); // State to store controls data
    const [SOPType, setSOPType] = useState<{ value: string; label: string }[]>([]); // State for SOPType

    useEffect(() => {
        // Fetch controls data when the component mounts
        const fetchData = async () => {
            try {
                const data = await fetchControlsDataAuditManager();
                setControlsData(data); // Store the fetched data in state
                console.log("data fetched from API:");
                console.log(data);
            } catch (error) {
                console.error("Error fetching controls data:", error);
            }
        };
        fetchData();
    }, []);





    const router = useRouter();

    const form = useForm<z.infer<typeof PlanningFormSchema>>({
        resolver: zodResolver(PlanningFormSchema),
        defaultValues: {
            AUDIT_NAME: editPlanning ? editPlanning.auditName : '',
            AUDITEE_NAME: Array.isArray(editPlanning?.auditeeTeam) ? editPlanning.auditeeTeam : [], // Use `auditeeTeam` directly
            AUDITOR_NAME: Array.isArray(editPlanning?.auditorTeam) ? editPlanning.auditorTeam : [], // Use `auditorTeam` directly
            START_DATE: editPlanning ? new Date(editPlanning.auditStart) : undefined,
            END_DATE: editPlanning ? new Date(editPlanning.auditEnd) : undefined,
            SOP_TYPE: editPlanning ? editPlanning.policyName : '', // Map `policyName` to `SOP_TYPE`
            FRAMEWORK_TYPE: editPlanning ? editPlanning.framework : '', // Map `framework` to `FRAMEWORK_TYPE`
            AUDIT_CYCLE: editPlanning ? editPlanning.auditCycle : '',
            DESCRIPTION: editPlanning ? editPlanning.description : '', // Map `description` directly
            //STATUS: editPlanning ? editPlanning.status : '', // Map `status` directly
        },
    });

    const selectedSOP = useWatch({ control: form.control, name: "SOP_TYPE" });
    const selectedAuditees = useWatch({ control: form.control, name: "AUDITEE_NAME" });
    // Watch for changes in the selected framework type
    const selectedFrameworkType = useWatch({ control: form.control, name: "FRAMEWORK_TYPE" });

    useEffect(() => {
        if (selectedFrameworkType) {
            // Dynamically populate SOPType based on the selected framework type
            const filteredSOPType = controlsData
                .filter((policy: any) => policy.framework === selectedFrameworkType)
                .map((policy: any) => ({
                    value: policy.policyName,
                    label: policy.policyName,
                }));
            setSOPType(filteredSOPType);
        } else {
            setSOPType([]); // Clear SOPType if no framework type is selected
        }
    }, [selectedFrameworkType, controlsData]);


    let sopData: any = [];

    let draftSopData: any = [];

    if (editPlanning) {
        sopData = editPlanning.controls.flatMap((control: any) =>
            control.controlObjectives.map((objective: any) => ({
                controlName: control.controlName,
                controlObj: objective.name,
                frameworkType: editPlanning.framework || "Unknown Framework",
                frameworkName: editPlanning.policyName,
                category: objective.controlObjType,
                controlObjweightage: objective.controlObjweight,
                controlweightage: control.controlWeight,
                objectiveUpdatedByUser: objective.objectiveUpdatedByUser ? true : false,
                controlUpdatedByUser: control.controlUpdatedByUser ? true : false,
            }))
        ) || [];


    } else {
        sopData = controlsData
            .find((policy: any) => policy.policyName === selectedSOP)
            ?.controls.flatMap((control: any) =>
                control.controlObjectives.map((objective: any) => ({
                    controlName: control.controlName,
                    controlObj: objective.name,
                    frameworkType: controlsData.find((policy: any) => policy.policyName === selectedSOP)?.framework || "Unknown Framework",
                    frameworkName: selectedSOP,
                    category: objective.controlObjType,
                    controlObjweightage: objective.controlObjweight,
                    controlweightage: control.controlWeight,
                    practiceAreas: objective.practiceAreas
                }))
            ) || [];
    }



    console.log("sopData: ^^^^^^^^ ++++++++ ^^^^^^^ ", sopData);

    type SavePlanningInfoData = z.infer<typeof PlanningFormSchema> & {
        updatedSOPData: any[]; // Add updatedSOPData to the type
    };

    async function savePlanningInfo(data: SavePlanningInfoData) {
        try {

            console.log("Final Data:", data);

            if (editPlanning) {
                const auditCreateInstances = await getMyInstancesV2({
                    processName: "Audit",
                    predefinedFilters: { taskName: "Edit Audit" },
                    mongoWhereClause: `this.Data.auditId == "${editPlanning.auditId}"`,
                });
                const taskId = auditCreateInstances[0].taskId;
                await invokeAction({
                    taskId: taskId,
                    data: data,
                    transitionName: 'Update Edit',
                    processInstanceIdentifierField: 'auditId',
                });
            } else {
                const aduditProcessId = await mapProcessName({ processName: "Audit" });
                console.log(aduditProcessId);
                await startProcessV2({
                    processId: aduditProcessId,
                    data: data,
                    processIdentifierFields: "frameworkId",
                })

            }


            setOpen(false);
            router.refresh();
        } catch (error) {
            console.error("Error saving planning info:", error);
            toast.error("An error occurred while saving the planning information.",{duration: 4000});
        }
    }

    const planningModalTableRef = useRef<any>(null);

    const creationOfAuditData = async (data: z.infer<typeof PlanningFormSchema>, buttonSelected: string) => {


        console.log("Button selected:", buttonSelected);
        //    console.log("Edit planning data:", editPlanning);
        console.log("Handle submit function:", data);

        if (buttonSelected == "NewAuditSaveAsDraft" || buttonSelected == "EditAuditSaveAsDraft") {
            if (planningModalTableRef.current) {
                const frameworkMap = planningModalTableRef.current.getFrameworkTypeControlAssigneeMap();
                const controlObjectiveMap = planningModalTableRef.current.getControlObjectiveNameControlObjAssigneeMap();
                const controlsNewWeight = planningModalTableRef.current.getControlNameSelectedAndAssociatedWeight();
                const controlObjNewWeight = planningModalTableRef.current.getControlObjectivesSelectedAndAssociatedWeight();

                console.log("Control Name Selected and Associated Weight:", controlsNewWeight);
                console.log("Control Objectives Selected and Associated Weight:", controlObjNewWeight);

                console.log("Framework Type Control Assignee Map:", frameworkMap);
                console.log("Control Objective Name Control Obj Assignee Map:", controlObjectiveMap);

               

                // Extract the exact controls using the frameworkId
                const selectedFramework = controlsData.find(
                    (control) => control.policyName === data.SOP_TYPE
                );

                if (Object.keys(controlsNewWeight).length === 0 && !editPlanning) {
                    const errorMessage = "Select at least one control.";
                    console.error(errorMessage);
                    toast.error(errorMessage,{duration: 4000});
                    return; // Stop further execution
                }

                if (!selectedFramework) {
                    console.error("Selected framework data not found.");
                    toast.error("Selected framework data not found.",{duration: 4000});
                    return;
                }

                // Map over the controls and add only the selected controls and their respective control objectives
                const updatedControls = selectedFramework.controls
                    .filter((control: any) => controlsNewWeight.hasOwnProperty(control.controlName)) // Filter controls based on controlsNewWeight
                    .map((control: any) => {
                        const controlName = control.controlName;

                        // Get the controlAssignee for the control
                        const controlAssignee = frameworkMap.get(controlName) || null;

                        const controlUpdatedByUser = true;
                        // Get the control weight from controlsNewWeight
                        const controlWeight = Number(controlsNewWeight[controlName] || control.controlWeight); // Convert to number if it's a string

                        // Filter and map over the control objectives to include only the selected ones
                        const updatedControlObjectives = control.controlObjectives
                            .filter((objective: any) => controlObjNewWeight[controlName]?.hasOwnProperty(objective.name)) // Filter control objectives based on controlObjNewWeight
                            .map((objective: any) => {
                                const controlObjName = objective.name;

                                const controlObjAssignee =
                                    controlObjectiveMap.get(controlName)?.get(controlObjName) || null;

                                // Get the weight for the control objective from controlObjNewWeight
                                const controlObjWeight = Number(controlObjNewWeight[controlName][controlObjName]);

                                return {
                                    ...objective, // Retain all existing keys of the control objective
                                    controlObjAssignee, // Add or update the control objective assignee
                                    controlObjweight: controlObjWeight, // Update the weight of the control objective
                                    ObjProgress: 0, // Initialize progress to 0
                                    ObjStatus: "Incomplete", // Initialize status to "incomplete"
                                    objectiveUpdatedByUser: true
                                };
                            });

                        return {
                            ...control, // Retain all existing keys of the control
                            controlAssignee, // Add or update the control assignee
                            controlWeight, // Update the weight of the control
                            controlObjectives: updatedControlObjectives, // Include only the selected control objectives
                            controlProgress: 0, // Initialize progress to 0
                            controlStatus: "Incomplete", // Initialize status to "incomplete",
                            controlUpdatedByUser

                        };
                    });

                console.log("Updated Controls:", updatedControls);


                // controlsData.forEach((control) => {
                //     if (control.policyName === data.SOP_TYPE) {
                //         let originalControlObjectives = control.controls;
                //         originalControlObjectives.forEach((obj: any) => {
                //             updatedControls.forEach((updatedObj: any) => {
                //                 if (obj.controlName === updatedObj.controlName) {
                //                     obj.controlObjectives = Array.from(
                //                         new Set([...updatedObj.controlObjectives, ...obj.controlObjectives])
                //                     );
                //                 }
                //             });
                //         });
                //     }
                // });

                controlsData.forEach((control) => {
                    if (control.policyName === data.SOP_TYPE) {

                        let originalControlObjectives = control.controls;
                        originalControlObjectives.forEach((obj: any) => {
                            updatedControls.forEach((updatedObj: any) => {

                                if (obj.controlName === updatedObj.controlName) {
                                    obj.controlUpdatedByUser = updatedObj.controlUpdatedByUser
                                    obj.controlWeight= updatedObj.controlWeight
                                    obj.controlProgress = updatedObj.controlProgress
                                    obj.controlStatus = updatedObj.controlStatus
                                    // Replace old controlObjectives by removing those with matching controlObjId from updatedObj
                                    obj.controlObjectives = [
                                        ...updatedObj.controlObjectives,
                                        ...obj.controlObjectives.filter(
                                            (oldObj: any) =>
                                                !updatedObj.controlObjectives.some(
                                                    (newObj: any) => newObj.controlObjId === oldObj.controlObjId
                                                )
                                        )
                                    ];
                                }
                            });
                        });
                    }
                });

                const newUpdatedControls = controlsData
                    .filter((control) => control.policyName === data.SOP_TYPE)
                    .flatMap((control) => control.controls); // merges arrays of controls into one

               


                console.log("New Updated Controls:", newUpdatedControls);




                // Prepare the final savedData object
                const savedData = {
                    auditId: editPlanning ? editPlanning.auditId : uuidv4(),
                    auditName: data.AUDIT_NAME,
                    auditeeTeam: data.AUDITEE_NAME,
                    auditorTeam: data.AUDITOR_NAME,
                    auditStart: data.START_DATE.toLocaleDateString('en-GB', { year: 'numeric', month: 'short', day: '2-digit' }),
                    auditEnd: data.END_DATE.toLocaleDateString('en-GB', { year: 'numeric', month: 'short', day: '2-digit' }),
                    auditCycle: data.AUDIT_CYCLE,
                    policyName: selectedFramework.policyName,
                    framework: selectedFramework.framework,
                    frameworkId: selectedFramework.frameworkId,
                    //controls: updatedControls, // Use the updated controls,
                    controls: newUpdatedControls, // Use the updated controls,
                    description: data.DESCRIPTION, // Add the description field
                    auditProgress: 0,
                    auditStatus: 'Pending'
                };



                console.log("Saved Data: =================>>>>>", savedData);

                savePlanningInfo(savedData);

            }

        } else if (buttonSelected == "NewAuditPublished" || buttonSelected == "EditAuditPublished") {
            if (planningModalTableRef.current) {
                debugger;
                const frameworkMap = planningModalTableRef.current.getFrameworkTypeControlAssigneeMap();
                const controlObjectiveMap = planningModalTableRef.current.getControlObjectiveNameControlObjAssigneeMap();
                const controlsNewWeight = planningModalTableRef.current.getControlNameSelectedAndAssociatedWeight();
                const controlObjNewWeight = planningModalTableRef.current.getControlObjectivesSelectedAndAssociatedWeight();

                console.log("Control Name Selected and Associated Weight:", controlsNewWeight);
                console.log("Control Objectives Selected and Associated Weight:", controlObjNewWeight);

                console.log("Framework Type Control Assignee Map:", frameworkMap);
                console.log("Control Objective Name Control Obj Assignee Map:", controlObjectiveMap);

                Object.keys(controlsNewWeight).forEach(k => controlsNewWeight[k] === "0.00" && delete controlsNewWeight[k]);

                console.log("Control Name Selected and Associated Weight after removing 0.0:", controlsNewWeight);

                // Extract the exact controls using the frameworkId
                const selectedFramework = controlsData.find(
                    (control) => control.policyName === data.SOP_TYPE
                );

                if (Object.keys(controlsNewWeight).length === 0) {
                    const errorMessage = "Select at least one control.";
                    console.error(errorMessage);
                    toast.error(errorMessage,{duration: 4000});
                    return; // Stop further execution
                }

                if (!selectedFramework) {
                    console.error("Selected framework data not found.");
                    toast.error("Selected framework data not found.",{duration: 4000});
                    return;
                }

                // Calculate the sum of the weights in controlsNewWeight
                const totalWeight = Object.values(controlsNewWeight).reduce((sum, weight) => sum + Number(weight), 0);

                if (Number(totalWeight.toFixed(2)) !== 100) {
                    console.error("Selected Control Sum is not equal to 100.");
                    toast.error("Selected Control Sum is not equal to 100.",{duration: 4000});
                    return;
                }

                for (const control in controlObjNewWeight) {
                    let totalWeight = 0;
                    const objectives = controlObjNewWeight[control];

                    for (const obj in objectives) {
                        totalWeight += parseFloat(objectives[obj]);
                    }

                    if (Number(totalWeight.toFixed(2)) !== 100) {
                        const errorMessage = `The selected control objectives of control ${control} is not equal to 100.`;
                        console.error(errorMessage);
                        toast.error(errorMessage,{duration: 4000});
                        return; // Stop checking further
                    }
                }



                // Map over the controls and add only the selected controls and their respective control objectives
                const updatedControls = selectedFramework.controls
                    .filter((control: any) => controlsNewWeight.hasOwnProperty(control.controlName)) // Filter controls based on controlsNewWeight
                    .map((control: any) => {
                        const controlName = control.controlName;

                        // Get the controlAssignee for the control
                        const controlAssignee = frameworkMap.get(controlName) || null;
                        const controlUpdatedByUser = true;

                        // Get the control weight from controlsNewWeight
                        const controlWeight = Number(controlsNewWeight[controlName] || control.controlWeight); // Convert to number if it's a string

                        // Filter and map over the control objectives to include only the selected ones
                        const updatedControlObjectives = control.controlObjectives
                            .filter((objective: any) => controlObjNewWeight[controlName]?.hasOwnProperty(objective.name)) // Filter control objectives based on controlObjNewWeight
                            .map((objective: any) => {
                                const controlObjName = objective.name;

                                const controlObjAssignee =
                                    controlObjectiveMap.get(controlName)?.get(controlObjName) || null;

                                // Get the weight for the control objective from controlObjNewWeight
                                const controlObjWeight = Number(controlObjNewWeight[controlName][controlObjName]);

                                return {
                                    ...objective, // Retain all existing keys of the control objective
                                    controlObjAssignee, // Add or update the control objective assignee
                                    controlObjweight: controlObjWeight, // Update the weight of the control objective
                                    ObjProgress: 0, // Initialize progress to 0
                                    ObjStatus: "Incomplete", // Initialize status to "incomplete"
                                    objectiveUpdatedByUser: true
                                };
                            });

                        return {
                            ...control, // Retain all existing keys of the control
                            controlAssignee, // Add or update the control assignee
                            controlWeight, // Update the weight of the control
                            controlObjectives: updatedControlObjectives, // Include only the selected control objectives
                            controlProgress: 0, // Initialize progress to 0
                            controlStatus: "Incomplete", // Initialize status to "incomplete"
                            controlUpdatedByUser

                        };
                    });

                console.log("Updated Controls:", updatedControls);

                // Prepare the final savedData object
                const savedData = {
                    auditId: editPlanning ? editPlanning.auditId : uuidv4(),
                    auditName: data.AUDIT_NAME,
                    auditeeTeam: data.AUDITEE_NAME,
                    auditorTeam: data.AUDITOR_NAME,
                    auditStart: data.START_DATE.toLocaleDateString('en-GB', { year: 'numeric', month: 'short', day: '2-digit' }),
                    auditEnd: data.END_DATE.toLocaleDateString('en-GB', { year: 'numeric', month: 'short', day: '2-digit' }),
                    auditCycle: data.AUDIT_CYCLE,
                    policyName: selectedFramework.policyName,
                    framework: selectedFramework.framework,
                    frameworkId: selectedFramework.frameworkId,
                    controls: updatedControls, // Use the updated controls,
                    description: data.DESCRIPTION, // Add the description field
                    auditProgress: 0,
                    auditStatus: 'Planned'
                };

                console.log("Saved Data: =================>>>>>", savedData);

                savePlanningInfo(savedData);
            }
        }

    };


    const handleSubmit = (data: z.infer<typeof PlanningFormSchema>) => {
        if (planningModalTableRef.current) {
            const frameworkMap = planningModalTableRef.current.getFrameworkTypeControlAssigneeMap();
            const controlObjectiveMap = planningModalTableRef.current.getControlObjectiveNameControlObjAssigneeMap();
            const controlsNewWeight = planningModalTableRef.current.getControlNameSelectedAndAssociatedWeight();
            const controlObjNewWeight = planningModalTableRef.current.getControlObjectivesSelectedAndAssociatedWeight();

            console.log("Control Name Selected and Associated Weight:", controlsNewWeight);
            console.log("Control Objectives Selected and Associated Weight:", controlObjNewWeight);

            console.log("Framework Type Control Assignee Map:", frameworkMap);
            console.log("Control Objective Name Control Obj Assignee Map:", controlObjectiveMap);

            // Extract the exact controls using the frameworkId
            const selectedFramework = controlsData.find(
                (control) => control.policyName === data.SOP_TYPE
            );

            if (Object.keys(controlsNewWeight).length === 0 && !editPlanning) {
                const errorMessage = "Select at least one control.";
                console.error(errorMessage);
                toast.error(errorMessage,{duration: 4000});
                return; // Stop further execution
            }

            if (!selectedFramework) {
                console.error("Selected framework data not found.");
                toast.error("Selected framework data not found.",{duration: 4000});
                return;
            }

            // Calculate the sum of the weights in controlsNewWeight
            const totalWeight = Object.values(controlsNewWeight).reduce((sum, weight) => sum + Number(weight), 0);

            // Check if the total weight equals 100
            // if (totalWeight !== 100 && !editPlanning) {
            //     console.error("Selected Control Sum is not equal to 100.");
            //     toast.error("Selected Control Sum is not equal to 100.");
            //     return;
            // }

            // if (!editPlanning) {
            //     for (const control in controlObjNewWeight) {
            //         let totalWeight = 0;
            //         const objectives = controlObjNewWeight[control];

            //         for (const obj in objectives) {
            //             totalWeight += parseFloat(objectives[obj]);
            //         }

            //         if (totalWeight !== 100) {
            //             const errorMessage = `The selected control objectives of control ${control} is not equal to 100.`;
            //             console.error(errorMessage);
            //             toast.error(errorMessage);
            //             return; // Stop checking further
            //         }
            //     }
            // }

            if (Number(totalWeight.toFixed(2)) !== 100) {
                console.error("Selected Control Sum is not equal to 100.");
                toast.error("Selected Control Sum is not equal to 100.",{duration: 4000});
                return;
            }

            for (const control in controlObjNewWeight) {
                let totalWeight = 0;
                const objectives = controlObjNewWeight[control];

                for (const obj in objectives) {
                    totalWeight += parseFloat(objectives[obj]);
                }

                if (Number(totalWeight.toFixed(2)) !== 100) {
                    const errorMessage = `The selected control objectives of control ${control} is not equal to 100.`;
                    console.error(errorMessage);
                    toast.error(errorMessage,{duration: 4000});
                    return; // Stop checking further
                }
            }



            // Map over the controls and add only the selected controls and their respective control objectives
            const updatedControls = selectedFramework.controls
                .filter((control: any) => controlsNewWeight.hasOwnProperty(control.controlName)) // Filter controls based on controlsNewWeight
                .map((control: any) => {
                    const controlName = control.controlName;

                    // Get the controlAssignee for the control
                    const controlAssignee = frameworkMap.get(controlName) || null;

                    // Get the control weight from controlsNewWeight
                    const controlWeight = Number(controlsNewWeight[controlName] || control.controlWeight); // Convert to number if it's a string

                    // Filter and map over the control objectives to include only the selected ones
                    const updatedControlObjectives = control.controlObjectives
                        .filter((objective: any) => controlObjNewWeight[controlName]?.hasOwnProperty(objective.name)) // Filter control objectives based on controlObjNewWeight
                        .map((objective: any) => {
                            const controlObjName = objective.name;

                            const controlObjAssignee =
                                controlObjectiveMap.get(controlName)?.get(controlObjName) || null;

                            // Get the weight for the control objective from controlObjNewWeight
                            const controlObjWeight = Number(controlObjNewWeight[controlName][controlObjName]);

                            return {
                                ...objective, // Retain all existing keys of the control objective
                                controlObjAssignee, // Add or update the control objective assignee
                                controlObjweight: controlObjWeight, // Update the weight of the control objective
                                ObjProgress: 0, // Initialize progress to 0
                                ObjStatus: "Incomplete", // Initialize status to "incomplete"
                            };
                        });

                    return {
                        ...control, // Retain all existing keys of the control
                        controlAssignee, // Add or update the control assignee
                        controlWeight, // Update the weight of the control
                        controlObjectives: updatedControlObjectives, // Include only the selected control objectives
                        controlProgress: 0, // Initialize progress to 0
                        controlStatus: "Incomplete", // Initialize status to "incomplete"

                    };
                });

            console.log("Updated Controls:", updatedControls);

            // Prepare the final savedData object
            const savedData = {
                auditId: uuidv4(),
                auditName: data.AUDIT_NAME,
                auditeeTeam: data.AUDITEE_NAME,
                auditorTeam: data.AUDITOR_NAME,
                auditStart: data.START_DATE.toLocaleDateString('en-GB', { year: 'numeric', month: 'short', day: '2-digit' }),
                auditEnd: data.END_DATE.toLocaleDateString('en-GB', { year: 'numeric', month: 'short', day: '2-digit' }),
                auditCycle: data.AUDIT_CYCLE,
                policyName: selectedFramework.policyName,
                framework: selectedFramework.framework,
                frameworkId: selectedFramework.frameworkId,
                controls: updatedControls, // Use the updated controls,
                description: data.DESCRIPTION, // Add the description field
                auditProgress: 0,
                auditStatus: 'Pending'
            };



            console.log("Saved Data: =================>>>>>", savedData);

            // Pass the savedData to savePlanningInfo
            savePlanningInfo(savedData);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="!max-w-none !w-screen !h-screen p-6 flex flex-col">
                <DialogHeader>
                    <DialogTitle>Audit Scheduling</DialogTitle>
                </DialogHeader>
                <div className="grid grid-cols-[5fr_7fr] gap-4 overflow-auto h-full">
                    <div className="overflow-y-auto pr-4 h-full  border-muted bg-card-new p-4">
                        <Form {...form}>
                            <form>
                                <div className="grid grid-cols-1 gap-3 mb-3">
                                    <FormInput formControl={form.control} name={"AUDIT_NAME"} placeholder="Enter Audit Name" label="Audit Name*" />
                                </div>
                                <div className="grid grid-cols-1 gap-3 mb-3">
                                    <FormMultiComboboxInput formControl={form.control} name="AUDITEE_NAME" label="Auditee Team Member(s)*" placeholder="Select Auditee's" items={userIdNameMap} defaultValue={form.getValues("AUDITEE_NAME")} defaultOptions={3}/>
                                </div>
                                <div className="grid grid-cols-1 gap-3 mb-3">
                                    <FormMultiComboboxInput formControl={form.control} name="AUDITOR_NAME" label="Auditor Team Member(s)*" placeholder="Select Auditor's" items={userIdNameMap} defaultValue={form.getValues("AUDITOR_NAME")} defaultOptions={3}/>
                                </div>
                                <div className="grid grid-cols-2 gap-3 mb-3">
                                    <FormDateInput formControl={form.control} name={"START_DATE"} label={"Start Date*"} placeholder={"Enter Start Date"} dateFormat={SAVE_DATE_FORMAT_GRC} calendarDateDisabled={false} />
                                    <FormDateInput formControl={form.control} name={"END_DATE"} label={"End Date*"} placeholder={"Enter End Date"} dateFormat={SAVE_DATE_FORMAT_GRC} calendarDateDisabled={false} />
                                </div>
                                <div className="grid grid-cols-3 gap-3 mb-3">
                                    <FormComboboxInput items={frameworkTypes} formControl={form.control} name={"FRAMEWORK_TYPE"} placeholder={"Select Framework Type"} label={"Framework Type*"} disabled={!!editPlanning} />
                                    <FormComboboxInput items={SOPType} formControl={form.control} name={"SOP_TYPE"} placeholder={"Select Framework Name"} label={"Framework Name*"} disabled={!selectedFrameworkType || !!editPlanning} />
                                    <FormComboboxInput items={AuditCycle} formControl={form.control} name={"AUDIT_CYCLE"} placeholder={"Select Audit Cycle"} label={"Audit Cycle*"} />
                                </div>
                                <div className="grid gap-cols-2 gap-3">
                                    <Label htmlFor="description">Description</Label>
                                    <Textarea
                                        id="description"
                                        placeholder="Enter description"
                                        {...form.register("DESCRIPTION")}
                                    />
                                </div>
                            </form>
                        </Form>
                    </div>

                    <div className="overflow-y-auto pl-4 border-1 border-muted h-full border-l border-white">
                        {/* <PlanningModalTable selectedSOPData={sopData} auditorsList={Array.isArray(selectedAuditees) ? selectedAuditees : []} userIdNameMap={userIdNameMap || []}/> */}
                        {selectedSOP ? (
                            <PlanningModalTable
                                ref={planningModalTableRef}
                                selectedSOPData={sopData}
                                auditorsList={Array.isArray(selectedAuditees) ? selectedAuditees : []}
                                userIdNameMap={userIdNameMap || []}
                                editPlanning={editPlanning}

                            />
                        ) : (
                            <>
                                {/* <div className="text-sm text-muted-foreground mb-4">
                                    Select a <strong>Framework</strong> to configure the audit.
                                </div> */}

                                <div className="h-full flex items-center justify-center">
                                    <Alert
                                        variant="success"
                                        className="w-1/2 border-l-4 border-green-500 bg-green-500/10 text-green-400 dark:bg-green-900/50 dark:text-green-300 p-4 rounded-md shadow-md text-center"
                                    >
                                        <AlertDescription className="text-center text-xl">
                                            Please select a framework that will allow you to assign appropriate weightage to both control policies and control objectives, which is essential for completing the audit configuration process effectively.
                                        </AlertDescription>
                                    </Alert>
                                </div>
                            </>
                        )}
                    </div>
                </div>
                <DialogFooter>
                    {/* <Button type="submit" onClick={form.handleSubmit(savePlanningInfo)}>
                        {editPlanning ? "Update" : "Save"}
                    </Button> */}
                    {/* {editPlanning == null && (
                        <Button type="submit" onClick={() => {
                            // Trigger form submission and pass the data to invokeTheAuditData
                            form.handleSubmit((data) => {
                                creationOfAuditData(data, 'NewAuditSaveAsDraft');
                            })();
                        }}>
                            SAVE AS DRAFT
                        </Button>
                        <Button type="submit" onClick={() => {
                            // Trigger form submission and pass the data to invokeTheAuditData
                            form.handleSubmit((data) => {
                                creationOfAuditData(data, 'NewAuditPublished');
                            })();
                        }}>
                            PUBLISH
                        </Button>
                    )} */}

                    {editPlanning == null && (
                        <>
                            <Button
                                onClick={() => {
                                    form.handleSubmit((data) => {
                                        creationOfAuditData(data, 'NewAuditSaveAsDraft');
                                    })();
                                }}
                            >
                                SAVE AS DRAFT
                            </Button>
                            {/* <Button
                                onClick={() => {
                                    form.handleSubmit((data) => {
                                        creationOfAuditData(data, 'NewAuditPublished');
                                    })();
                                }}
                            >
                                PUBLISH
                            </Button> */}

                            <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <Button type="button">
                                        PUBLISH
                                    </Button>
                                </AlertDialogTrigger>

                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>Are you sure you want to publish?</AlertDialogTitle>
                                        <AlertDialogDescription>
                                            You will not be able to edit it later.
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                        {/* <AlertDialogAction onClick={() => invokeTheAuditData(editPlanning, handleSubmit, 'publish')}>
                                        Confirm Publish
                                    </AlertDialogAction> */}
                                        <AlertDialogAction
                                            onClick={() => {
                                                form.handleSubmit((data) => {
                                                    creationOfAuditData(data, 'NewAuditPublished');
                                                })();
                                            }}
                                        >
                                            Confirm Publish
                                        </AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        </>
                    )}

                    {editPlanning && editPlanning.auditStatus != "Planned" && (
                        <Button type="submit" onClick={() => {
                            form.handleSubmit((data) => {
                                creationOfAuditData(data, 'EditAuditSaveAsDraft');
                            })();
                        }}>
                            SAVE AS DRAFT
                        </Button>
                    )}
                    {editPlanning && editPlanning.auditStatus != "Planned" && (
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button type="button">
                                    PUBLISH
                                </Button>
                            </AlertDialogTrigger>

                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Are you sure you want to publish?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        You will not be able to edit it later.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    {/* <AlertDialogAction onClick={() => invokeTheAuditData(editPlanning, handleSubmit, 'publish')}>
                                        Confirm Publish
                                    </AlertDialogAction> */}
                                    <AlertDialogAction
                                        onClick={() => {
                                            form.handleSubmit((data) => {
                                                creationOfAuditData(data, 'EditAuditPublished');
                                            })();
                                        }}
                                    >
                                        Confirm Publish
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog >
    );
}
