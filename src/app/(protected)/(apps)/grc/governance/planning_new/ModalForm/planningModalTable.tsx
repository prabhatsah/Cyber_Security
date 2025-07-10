'use client'
import React, { useState, forwardRef, useImperativeHandle, useRef } from "react";
import { useEffect } from 'react';
import { DataTable } from "@/ikon/components/data-table";
import { DTColumnsProps, DTExtraParamsProps } from "@/ikon/components/data-table/type";
import { Input } from "@/shadcn/ui/input";
import { Calculator, Lock, Unlock } from "lucide-react";
import { IconButtonWithTooltip } from "@/ikon/components/buttons";
import { Button } from "@/shadcn/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/shadcn/ui/dialog";
import { Alert, AlertDescription, AlertTitle } from "@/shadcn/ui/alert"
import { cn } from "@/shadcn/lib/utils";
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "@/shadcn/ui/tooltip"
import { getMyInstancesV2 } from "@/ikon/utils/api/processRuntimeService";

export const fetchControlsData = async () => {
    try {
        const controlsData = await getMyInstancesV2({
            processName: "Control Objectives",
            predefinedFilters: { taskName: "edit control objective" },
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




const PlanningModalTable = forwardRef(({ selectedSOPData, auditorsList, userIdNameMap, editPlanning }: { selectedSOPData: any[]; auditorsList: string[]; userIdNameMap: { value: string; label: string }[]; editPlanning: Record<string, string> | null; }, ref) => {
    console.log(selectedSOPData, "Selected SOP Data");



    const frameworkTypeControlAssigneeMap = React.useRef(new Map<string, string>());
    const controlObjectiveNameControlObjAssigneeMap = React.useRef(new Map<string, Map<string, string>>());
    const controlNameSelectedAndAssociatedWeight = React.useRef<{ [key: string]: string }>({});
    const controlObjectivesSelectedAndAssociatedWeight = React.useRef<{ [controlName: string]: { [controlObjective: string]: string } }>({});


    useImperativeHandle(ref, () => ({
        getFrameworkTypeControlAssigneeMap: () => frameworkTypeControlAssigneeMap.current,
        getControlObjectiveNameControlObjAssigneeMap: () => controlObjectiveNameControlObjAssigneeMap.current,
        getSelectedControls: () => selectedControls,
        getControlNameSelectedAndAssociatedWeight: () => controlNameSelectedAndAssociatedWeight.current,
        getControlObjectivesSelectedAndAssociatedWeight: () => controlObjectivesSelectedAndAssociatedWeight.current,
    }));

    const [selectedControls, setSelectedControls] = useState<Record<string, Set<string>>>({});
    const [weightages, setWeightages] = useState<Record<string, string>>({});
    const [lockedControls, setLockedControls] = useState<Record<string, boolean>>({});
    const [lockedObjectives, setLockedObjectives] = useState<Record<string, Record<string, boolean>>>({});
    const [openAlertDialog, setOpenAlertDialog] = useState(false);
    const [openErrorDialog, setOpenErrorDialog] = useState(false); // New state for error dialog
    const [error, setError] = useState<string | null>(null);
    const [errorFields, setErrorFields] = useState<string[]>([]);
    const [uniqueDraftSopData, setUniqueDraftSopData] = useState<any[]>([]);

    const hasInitialized = useRef(false);

    useEffect(() => {
        if (
            hasInitialized.current ||
            !Array.isArray(selectedSOPData) ||
            selectedSOPData.length === 0
        ) return;

        hasInitialized.current = true;

        const controlMap: Record<string, Set<string>> = {};
        const controlWeights: { [key: string]: string } = {};
        const controlObjectiveWeights: { [controlName: string]: { [controlObjective: string]: string } } = {};

        selectedSOPData.forEach(item => {
            const { controlName, controlObj, controlweightage, controlObjweightage, controlUpdatedByUser, objectiveUpdatedByUser } = item;

            // For selectedControls
            if (controlUpdatedByUser && objectiveUpdatedByUser) {
                if (!controlMap[controlName]) {
                    controlMap[controlName] = new Set();
                }
                controlMap[controlName].add(controlObj);
            }

            // For controlNameSelectedAndAssociatedWeight
            if (controlUpdatedByUser) {
                controlWeights[controlName] = controlweightage.toString();
            }

            // For controlObjectivesSelectedAndAssociatedWeight
            if (objectiveUpdatedByUser) {
                if (!controlObjectiveWeights[controlName]) {
                    controlObjectiveWeights[controlName] = {};
                }
                controlObjectiveWeights[controlName][controlObj] = controlObjweightage.toString();
            }
        });

        setSelectedControls(controlMap);
        controlNameSelectedAndAssociatedWeight.current = controlWeights;
        controlObjectivesSelectedAndAssociatedWeight.current = controlObjectiveWeights;

        console.log("controlNameSelectedAndAssociatedWeight.current", controlNameSelectedAndAssociatedWeight.current);
        console.log("controlObjectivesSelectedAndAssociatedWeight.current", controlObjectivesSelectedAndAssociatedWeight.current);
    }, [selectedSOPData]);


    // useEffect(() => {
    //     if (!selectedSOPData || selectedSOPData.length === 0) return;

    //     const controlMap: Record<string, Set<string>> = {};

    //     selectedSOPData.forEach(item => {
    //         if (item.controlUpdatedByUser && item.objectiveUpdatedByUser) {
    //             const controlName = item.controlName;
    //             const controlObj = item.controlObj;

    //             if (!controlMap[controlName]) {
    //                 controlMap[controlName] = new Set();
    //             }

    //             controlMap[controlName].add(controlObj);
    //         }
    //     });

    //     setSelectedControls(controlMap);
    // }, [selectedSOPData]);


    // const handleParentCheck = (controlName: string, checked: boolean, objectiveIds: string[]) => {
    //     setSelectedControls(prev => ({
    //         ...prev,
    //         [controlName]: checked ? new Set(objectiveIds) : new Set()
    //     }));

    //     if (checked) {
    //         const associatedWeight = selectedSOPData.find(item => item.controlName === controlName)?.controlweightage;
    //         if (associatedWeight) {
    //             controlNameSelectedAndAssociatedWeight.current[controlName] = associatedWeight;
    //         }
    //         controlObjectivesSelectedAndAssociatedWeight.current[controlName] = {};
    //     } else {
    //         delete controlNameSelectedAndAssociatedWeight.current[controlName];
    //         delete controlObjectivesSelectedAndAssociatedWeight.current[controlName];
    //     }
    // };




    const handleParentCheck = (controlName: string, checked: boolean, objectiveIds: string[]) => {
        console.log(`Parent checkbox for "${controlName}" changed to: ${checked}`);
        console.log(`Objectives affected: ${objectiveIds}`);

        setSelectedControls(prev => {
            const updated = {
                ...prev,
                [controlName]: checked ? new Set(objectiveIds) : new Set()
            };

            console.log("Updated selectedControls (after parent check):", updated);

            if (checked) {
                const associatedWeight = selectedSOPData.find(item => item.controlName === controlName)?.controlweightage;
                if (associatedWeight) {
                    controlNameSelectedAndAssociatedWeight.current[controlName] = associatedWeight;
                }
                controlObjectivesSelectedAndAssociatedWeight.current[controlName] = {};
                objectiveIds.forEach((objId) => {
                    const objWeight = selectedSOPData.find(item => item.controlName === controlName && item.controlObj === objId)?.controlObjweightage;
                    if (objWeight) {
                        controlObjectivesSelectedAndAssociatedWeight.current[controlName][objId] = objWeight;
                    }
                });
            } else {
                delete controlNameSelectedAndAssociatedWeight.current[controlName];
                delete controlObjectivesSelectedAndAssociatedWeight.current[controlName];
            }

            console.log("Updated controlNameSelectedAndAssociatedWeight:", controlNameSelectedAndAssociatedWeight.current);
            console.log("Updated controlObjectivesSelectedAndAssociatedWeight:", controlObjectivesSelectedAndAssociatedWeight.current);

            return updated;
        });
    };

    // const handleChildCheck = (controlName: string, objId: string, checked: boolean) => {
    //     setSelectedControls(prev => {
    //         const updatedControlSet = new Set(prev[controlName] ?? []);
    //         if (checked) {
    //             updatedControlSet.add(objId);
    //             if (!controlObjectivesSelectedAndAssociatedWeight.current[controlName]) {
    //                 controlObjectivesSelectedAndAssociatedWeight.current[controlName] = {};
    //             }
    //             const associatedWeight = selectedSOPData.find(item => item.controlName === controlName && item.controlObj === objId)?.controlObjweightage;
    //             if (associatedWeight) {
    //                 controlObjectivesSelectedAndAssociatedWeight.current[controlName][objId] = associatedWeight;
    //             }
    //             if (!controlNameSelectedAndAssociatedWeight.current[controlName]) {
    //                 const parentWeight = selectedSOPData.find(item => item.controlName === controlName)?.controlweightage;
    //                 if (parentWeight) {
    //                     controlNameSelectedAndAssociatedWeight.current[controlName] = parentWeight;
    //                 }
    //             }
    //         } else {
    //             updatedControlSet.delete(objId);
    //             if (controlObjectivesSelectedAndAssociatedWeight.current[controlName]) {
    //                 delete controlObjectivesSelectedAndAssociatedWeight.current[controlName][objId];
    //             }
    //             if (updatedControlSet.size === 0) {
    //                 delete controlNameSelectedAndAssociatedWeight.current[controlName];
    //             }
    //         }

    //         return { ...prev, [controlName]: updatedControlSet };
    //     });
    // };

    const handleChildCheck = (controlName: string, objId: string, checked: boolean) => {
        console.log(`Child checkbox for "${controlName}" -> "${objId}" changed to: ${checked}`);

        setSelectedControls(prev => {
            const updatedControlSet = new Set(prev[controlName] ?? []);

            if (checked) {
                updatedControlSet.add(objId);
                if (!controlObjectivesSelectedAndAssociatedWeight.current[controlName]) {
                    controlObjectivesSelectedAndAssociatedWeight.current[controlName] = {};
                }
                const associatedWeight = selectedSOPData.find(item => item.controlName === controlName && item.controlObj === objId)?.controlObjweightage;
                if (associatedWeight) {
                    controlObjectivesSelectedAndAssociatedWeight.current[controlName][objId] = associatedWeight;
                }
                if (!controlNameSelectedAndAssociatedWeight.current[controlName]) {
                    const parentWeight = selectedSOPData.find(item => item.controlName === controlName)?.controlweightage;
                    if (parentWeight) {
                        controlNameSelectedAndAssociatedWeight.current[controlName] = parentWeight;
                    }
                }
            } else {
                updatedControlSet.delete(objId);
                if (controlObjectivesSelectedAndAssociatedWeight.current[controlName]) {
                    delete controlObjectivesSelectedAndAssociatedWeight.current[controlName][objId];
                    if (Object.keys(controlObjectivesSelectedAndAssociatedWeight.current[controlName]).length === 0) {
                        delete controlObjectivesSelectedAndAssociatedWeight.current[controlName];
                    }
                }
                if (updatedControlSet.size === 0) {
                    delete controlNameSelectedAndAssociatedWeight.current[controlName];
                }
            }

            const updated = {
                ...prev,
                [controlName]: updatedControlSet
            };

            console.log("Updated selectedControls (after child check):", updated);
            console.log("Updated controlNameSelectedAndAssociatedWeight:", controlNameSelectedAndAssociatedWeight.current);
            console.log("Updated controlObjectivesSelectedAndAssociatedWeight:", controlObjectivesSelectedAndAssociatedWeight.current);

            return updated;
        });
    };

    const handleWeightageChange = (key: string, value: string, row?: any, type: string) => {
        setWeightages(prev => ({ ...prev, [key]: value }));

        if (row) {
            if (row.original && type === "cell") {
                if (row.original.controlObjweightage !== undefined) {
                    row.original.controlObjweightage = value;
                }
            }
            if (row.original && type === "aggregatedCell") {
                if (row.original.controlweightage !== undefined) {
                    row.original.controlweightage = value;
                }
            }
        }

        if (controlNameSelectedAndAssociatedWeight.current[key] !== undefined) {
            controlNameSelectedAndAssociatedWeight.current[key] = value;
        } else {
            for (const control in controlObjectivesSelectedAndAssociatedWeight.current) {
                if (controlObjectivesSelectedAndAssociatedWeight.current[control][key] !== undefined) {
                    controlObjectivesSelectedAndAssociatedWeight.current[control][key] = value;
                    break;
                }
            }
        }

        console.log("controlNameSelectedAndAssociatedWeight.current", controlNameSelectedAndAssociatedWeight.current);
        console.log("controlObjectivesSelectedAndAssociatedWeight.current", controlObjectivesSelectedAndAssociatedWeight.current);
    };

    const isParentChecked = (controlName: string, objectives: string[]) => {
        return selectedControls[controlName]?.size === objectives.length;
    };

    const isChildChecked = (controlName: string, objId: string) => {
        return selectedControls[controlName]?.has(objId);
    };

    const toggleControlLock = (controlName: string) => {
        setLockedControls(prev => ({ ...prev, [controlName]: !prev[controlName] }));
    };

    const toggleObjectiveLock = (controlName: string, objId: string) => {
        setLockedObjectives(prev => ({
            ...prev,
            [controlName]: { ...prev[controlName], [objId]: !prev[controlName]?.[objId] }
        }));
    };

    // const handleAutoCalculate = () => {
    //     console.log("Auto Calculate button clicked!");
    //     setError(null);
    //     setErrorFields([]);

    //     const newWeightages: Record<string, string> = { ...weightages };
    //     const newControlNameSelectedAndAssociatedWeight: { [key: string]: string } = {};
    //     const newControlObjectivesSelectedAndAssociatedWeight: { [controlName: string]: { [objId: string]: string } } = {};

    //     let hasErrors = false;
    //     const checkedControlPolicies = Object.keys(selectedControls).filter(
    //         key => selectedControls[key].size > 0
    //     );
    //     let allControlPolicies = selectedSOPData.map(item => item.controlName);
    //     allControlPolicies = [...new Set(allControlPolicies)];

    //     let totalLockedControlWeight = 0;
    //     const currentControlWeights: { [key: string]: number } = {};
    //     const policyErrors: string[] = [];

    //     checkedControlPolicies.forEach(controlName => {
    //         const weight = Number(controlNameSelectedAndAssociatedWeight.current[controlName] || 0);
    //         currentControlWeights[controlName] = weight;
    //         if (lockedControls[controlName]) {
    //             totalLockedControlWeight += weight;
    //         }
    //     });

    //     if (totalLockedControlWeight > 100) {
    //         setError("Sum of locked Control Policy weights exceeds 100");
    //         hasErrors = true;
    //         checkedControlPolicies.forEach(controlName => {
    //             if (lockedControls[controlName]) {
    //                 policyErrors.push(controlName);
    //             }
    //         });
    //         setErrorFields(prev => [...prev, ...policyErrors]);
    //         setOpenErrorDialog(true);
    //         return;
    //     }

    //     const remainingControlWeightForPolicies = Math.max(0, 100 - totalLockedControlWeight);
    //     const unlockedCheckedControlCount = checkedControlPolicies.filter(cn => !lockedControls[cn] && selectedControls[cn]).length;
    //     const weightPerUnlockedControl = unlockedCheckedControlCount > 0 ? remainingControlWeightForPolicies / unlockedCheckedControlCount : 0;
    //     let distributedPolicyWeight = 0;

    //     checkedControlPolicies.forEach(controlName => {
    //         if (selectedControls[controlName]) {
    //             if (lockedControls[controlName]) {
    //                 newControlNameSelectedAndAssociatedWeight[controlName] = String(currentControlWeights[controlName].toFixed(2));
    //                 newWeightages[controlName] = String(currentControlWeights[controlName].toFixed(2));
    //                 distributedPolicyWeight += currentControlWeights[controlName];
    //             } else {
    //                 const policyWeight = Math.round((remainingControlWeightForPolicies / unlockedCheckedControlCount) * 10000) / 10000;
    //                 newControlNameSelectedAndAssociatedWeight[controlName] = String(policyWeight);
    //                 newWeightages[controlName] = String(policyWeight);
    //                 distributedPolicyWeight += policyWeight;
    //             }
    //         } else {
    //             newWeightages[controlName] = "0.00";
    //             newControlNameSelectedAndAssociatedWeight[controlName] = "0.00";
    //         }
    //         newControlObjectivesSelectedAndAssociatedWeight[controlName] = {};
    //     });

    //     if (unlockedCheckedControlCount > 0) {
    //         const difference = parseFloat((100 - distributedPolicyWeight).toFixed(2));
    //         const lastUnlockedControl = checkedControlPolicies.filter(cn => !lockedControls[cn] && selectedControls[cn]).pop();
    //         if (lastUnlockedControl) {
    //             let lastWeight = Number(newControlNameSelectedAndAssociatedWeight[lastUnlockedControl] || 0);
    //             lastWeight = parseFloat((lastWeight + difference).toFixed(2));
    //             if (lastWeight > 100) lastWeight = 100;
    //             newControlNameSelectedAndAssociatedWeight[lastUnlockedControl] = lastWeight.toFixed(2);
    //             newWeightages[lastUnlockedControl] = lastWeight.toFixed(2);
    //         }
    //     }

    //     checkedControlPolicies.forEach(controlName => {
    //         const checkedObjectives = selectedControls[controlName];
    //         const allObjectives = selectedSOPData.filter(item => item.controlName === controlName).map(item => item.controlObj);

    //         if (checkedObjectives && checkedObjectives.size > 0) {
    //             let totalLockedObjectiveWeight = 0;
    //             let distributedObjectiveWeight = 0;
    //             const currentObjectiveWeights: { [objId: string]: number } = {};
    //             const objectiveErrors: string[] = [];

    //             Array.from(checkedObjectives).forEach(objId => {
    //                 const weight = Number(controlObjectivesSelectedAndAssociatedWeight.current[controlName]?.[objId] || 0);
    //                 currentObjectiveWeights[objId] = weight;
    //                 if (lockedObjectives[controlName]?.[objId]) {
    //                     totalLockedObjectiveWeight += weight;
    //                 }
    //             });

    //             if (totalLockedObjectiveWeight > 100) {
    //                 setError("Sum of locked Control Objective weights exceeds 100 for Control Policy: " + controlName);
    //                 hasErrors = true;
    //                 Array.from(checkedObjectives).forEach(objId => {
    //                     if (lockedObjectives[controlName]?.[objId]) {
    //                         objectiveErrors.push(objId);
    //                     }
    //                 });
    //                 setErrorFields(prev => [...prev, ...objectiveErrors]);
    //                 setOpenErrorDialog(true);
    //                 return;
    //             }

    //             const remainingObjectiveWeightForPolicy = Math.max(0, 100 - totalLockedObjectiveWeight);
    //             const weightPerUnlockedObjective = checkedObjectives.size > 0 ? remainingObjectiveWeightForPolicy / checkedObjectives.size : 0;

    //             const newObjectiveWeightsForControl: { [objId: string]: string } = {};
    //             Array.from(checkedObjectives).forEach(objId => {
    //                 if (lockedObjectives[controlName]?.[objId]) {
    //                     newObjectiveWeightsForControl[objId] = String(currentObjectiveWeights[objId].toFixed(2));
    //                     newWeightages[objId] = String(currentObjectiveWeights[objId].toFixed(2));
    //                     distributedObjectiveWeight += Number(newObjectiveWeightsForControl[objId]);
    //                 } else {
    //                     const objWeight = parseFloat(weightPerUnlockedObjective.toFixed(2));
    //                     newObjectiveWeightsForControl[objId] = String(objWeight);
    //                     newWeightages[objId] = String(objWeight);
    //                     distributedObjectiveWeight += objWeight;
    //                 }
    //             });

    //             if (checkedObjectives.size > 0) {
    //                 const lastObjective = Array.from(checkedObjectives).pop();
    //                 if (lastObjective) {
    //                     const difference = 100 - distributedObjectiveWeight;
    //                     let lastWeight = Number(newObjectiveWeightsForControl[lastObjective] || 0);
    //                     lastWeight = parseFloat((lastWeight + difference).toFixed(2));
    //                     if (lastWeight > 100) lastWeight = 100;
    //                     newObjectiveWeightsForControl[lastObjective] = lastWeight.toFixed(2);
    //                     newWeightages[lastObjective] = lastWeight.toFixed(2);
    //                 }
    //             }
    //             newControlObjectivesSelectedAndAssociatedWeight[controlName] = newObjectiveWeightsForControl;
    //         } else {
    //             newControlObjectivesSelectedAndAssociatedWeight[controlName] = {};
    //             allObjectives.forEach(objId => {
    //                 newWeightages[objId] = "0.00";
    //             });
    //         }
    //     });

    //     allControlPolicies.forEach(controlName => {
    //         if (!checkedControlPolicies.includes(controlName)) {
    //             newWeightages[controlName] = "0.00";
    //             newControlNameSelectedAndAssociatedWeight[controlName] = "0.00";


    //             const allObjectives = selectedSOPData
    //                 .filter(item => item.controlName === controlName)
    //                 .map(item => item.controlObj);

    //             allObjectives.forEach(objId => {
    //                 newWeightages[objId] = "0.00";
    //             });
    //         }else{
    //             const allObjectives = selectedSOPData
    //                 .filter(item => item.controlName === controlName)
    //                 .map(item => item.controlObj);
    //                 const selectedObjectivesObj = controlObjectivesSelectedAndAssociatedWeight.current[controlName];
    //                 const selecteObjectives = Object.keys(selectedObjectivesObj)
    //                 const nonSelectedObjectives = allObjectives.filter(obj => !selecteObjectives.includes(obj))
    //                 nonSelectedObjectives.forEach(objId => {
    //                     newWeightages[objId] = "0.00";
    //                 });
    //         }
    //     });


    //     if (!hasErrors) {
    //         setWeightages(newWeightages);
    //         controlNameSelectedAndAssociatedWeight.current = newControlNameSelectedAndAssociatedWeight;
    //         controlObjectivesSelectedAndAssociatedWeight.current = newControlObjectivesSelectedAndAssociatedWeight;

    //         console.log("Updated weightages after auto-calculate:", newWeightages);
    //         console.log("Updated controlNameSelectedAndAssociatedWeight after auto-calculate:", controlNameSelectedAndAssociatedWeight.current);
    //         console.log("Updated controlObjectivesSelectedAndAssociatedWeight after auto-calculate:", controlObjectivesSelectedAndAssociatedWeight.current);

    //     }
    // };



    const handleAutoCalculate = () => {
        console.log("Auto Calculate button clicked!");
        setError(null);
        setErrorFields([]);

        const newWeightages: Record<string, string> = { ...weightages };
        const newControlNameSelectedAndAssociatedWeight: { [key: string]: string } = {};
        const newControlObjectivesSelectedAndAssociatedWeight: {
            [controlName: string]: { [objId: string]: string };
        } = {};

        let hasErrors = false;
        const errorMessages: string[] = [];
        const policyErrors: string[] = [];
        const objectiveErrors: string[] = [];

        const checkedControlPolicies = Object.keys(selectedControls).filter(
            key => selectedControls[key].size > 0
        );
        let allControlPolicies = selectedSOPData.map(item => item.controlName);
        allControlPolicies = [...new Set(allControlPolicies)];

        let totalLockedControlWeight = 0;
        const currentControlWeights: { [key: string]: number } = {};

        // Calculate total locked control weights and identify errors
        checkedControlPolicies.forEach(controlName => {
            const weight = Number(controlNameSelectedAndAssociatedWeight.current[controlName] || 0);
            currentControlWeights[controlName] = parseFloat(weight.toFixed(2));
            if (lockedControls[controlName]) {
                totalLockedControlWeight += weight;
            }
        });

        if (totalLockedControlWeight > 100) {
            hasErrors = true;
            const overWeightControls = checkedControlPolicies.filter(controlName => lockedControls[controlName]);
            policyErrors.push(...overWeightControls);
            errorMessages.push("Sum of locked Control Policy weights exceeds 100");
        }

        const remainingControlWeightForPolicies = Math.max(0, 100 - totalLockedControlWeight);
        const unlockedCheckedControlCount = checkedControlPolicies.filter(
            cn => !lockedControls[cn] && selectedControls[cn]
        ).length;
        const weightPerUnlockedControl =
            unlockedCheckedControlCount > 0 ? remainingControlWeightForPolicies / unlockedCheckedControlCount : 0;
        let distributedPolicyWeight = 0;

        checkedControlPolicies.forEach(controlName => {
            if (selectedControls[controlName]) {
                if (lockedControls[controlName]) {
                    newControlNameSelectedAndAssociatedWeight[controlName] = String(
                        currentControlWeights[controlName].toFixed(2)
                    );
                    newWeightages[controlName] = String(currentControlWeights[controlName].toFixed(2));
                    distributedPolicyWeight += currentControlWeights[controlName];
                } else {
                    const policyWeight = parseFloat((weightPerUnlockedControl).toFixed(2));
                    newControlNameSelectedAndAssociatedWeight[controlName] = String(policyWeight);
                    newWeightages[controlName] = policyWeight.toFixed(2) //String(policyWeight);
                    distributedPolicyWeight += policyWeight;
                }
            } else {
                newWeightages[controlName] = "0.00";
                newControlNameSelectedAndAssociatedWeight[controlName] = "0.00";
            }
            newControlObjectivesSelectedAndAssociatedWeight[controlName] = {};
        });

        if (unlockedCheckedControlCount > 0) {
            const difference = parseFloat((100 - distributedPolicyWeight).toFixed(2));
            const lastUnlockedControl = checkedControlPolicies
                .filter(cn => !lockedControls[cn] && selectedControls[cn])
                .pop();
            if (lastUnlockedControl) {
                let lastWeight = Number(newControlNameSelectedAndAssociatedWeight[lastUnlockedControl] || 0);
                lastWeight = parseFloat((lastWeight + difference).toFixed(2));
                if (lastWeight > 100) lastWeight = 100;
                newControlNameSelectedAndAssociatedWeight[lastUnlockedControl] = lastWeight.toFixed(2);
                newWeightages[lastUnlockedControl] = lastWeight.toFixed(2);
            }
        }

        checkedControlPolicies.forEach(controlName => {
            const checkedObjectives = selectedControls[controlName];
            const allObjectives = selectedSOPData
                .filter(item => item.controlName === controlName)
                .map(item => item.controlObj);

            if (checkedObjectives && checkedObjectives.size > 0) {
                let totalLockedObjectiveWeight = 0;
                let distributedObjectiveWeight = 0;
                const currentObjectiveWeights: { [objId: string]: number } = {};

                Array.from(checkedObjectives).forEach(objId => {
                    const weight = Number(
                        controlObjectivesSelectedAndAssociatedWeight.current[controlName]?.[objId] || 0
                    );
                    currentObjectiveWeights[objId] = weight;
                    if (lockedObjectives[controlName]?.[objId]) {
                        totalLockedObjectiveWeight += weight;
                    }
                });

                if (totalLockedObjectiveWeight > 100) {
                    hasErrors = true;
                    const overWeightObjectives = Array.from(checkedObjectives).filter(
                        objId => lockedObjectives[controlName]?.[objId]
                    );
                    objectiveErrors.push(...overWeightObjectives);
                    errorMessages.push(
                        `Sum of locked Control Objective weights exceeds 100 for Control Policy: ${controlName}`
                    );
                }

                const remainingObjectiveWeightForPolicy = Math.max(0, 100 - totalLockedObjectiveWeight);
                const unlockedObjectives = Array.from(checkedObjectives).filter(
                    objId => !lockedObjectives[controlName]?.[objId]
                );
                const weightPerUnlockedObjective =
                    unlockedObjectives.length > 0 ? remainingObjectiveWeightForPolicy / unlockedObjectives.length : 0;

                const newObjectiveWeightsForControl: { [objId: string]: string } = {};
                Array.from(checkedObjectives).forEach(objId => {
                    if (lockedObjectives[controlName]?.[objId]) {
                        newObjectiveWeightsForControl[objId] = String(currentObjectiveWeights[objId].toFixed(2));
                        newWeightages[objId] = String(currentObjectiveWeights[objId].toFixed(2));
                        distributedObjectiveWeight += Number(newObjectiveWeightsForControl[objId]);
                    } else {
                        const objWeight = parseFloat(weightPerUnlockedObjective.toFixed(2));
                        newObjectiveWeightsForControl[objId] = String(objWeight);
                        newWeightages[objId] = objWeight.toFixed(2)//String(objWeight);
                        distributedObjectiveWeight += objWeight;
                    }
                });

                if (unlockedObjectives.length > 0) {
                    const lastObjective = unlockedObjectives[unlockedObjectives.length - 1];
                    if (lastObjective) {
                        const difference = 100 - distributedObjectiveWeight;
                        let lastWeight = Number(newObjectiveWeightsForControl[lastObjective] || 0);
                        lastWeight = parseFloat((lastWeight + difference).toFixed(2));
                        if (lastWeight > 100) lastWeight = 100;
                        newObjectiveWeightsForControl[lastObjective] = lastWeight.toFixed(2);
                        newWeightages[lastObjective] = lastWeight.toFixed(2);
                    }
                }
                newControlObjectivesSelectedAndAssociatedWeight[controlName] = newObjectiveWeightsForControl;
            } else {
                newControlObjectivesSelectedAndAssociatedWeight[controlName] = {};
                allObjectives.forEach(objId => {
                    newWeightages[objId] = "0.00";
                });
            }
        });

        allControlPolicies.forEach(controlName => {
            if (!checkedControlPolicies.includes(controlName)) {
                newWeightages[controlName] = "0.00";
                newControlNameSelectedAndAssociatedWeight[controlName] = "0.00";

                const allObjectives = selectedSOPData
                    .filter(item => item.controlName === controlName)
                    .map(item => item.controlObj);

                allObjectives.forEach(objId => {
                    newWeightages[objId] = "0.00";
                });
            } else {
                const allObjectives = selectedSOPData
                    .filter(item => item.controlName === controlName)
                    .map(item => item.controlObj);
                const selectedObjectivesObj = controlObjectivesSelectedAndAssociatedWeight.current[controlName];
                const selectedObjectives = Object.keys(selectedObjectivesObj || {});
                const nonSelectedObjectives = allObjectives.filter(obj => !selectedObjectives.includes(obj));
                nonSelectedObjectives.forEach(objId => {
                    newWeightages[objId] = "0.00";
                });
            }
        });

        if (!hasErrors) {
            setWeightages(newWeightages);
            controlNameSelectedAndAssociatedWeight.current = newControlNameSelectedAndAssociatedWeight;
            controlObjectivesSelectedAndAssociatedWeight.current = newControlObjectivesSelectedAndAssociatedWeight;

            console.log("Updated weightages after auto-calculate:", newWeightages);
            console.log(
                "Updated controlNameSelectedAndAssociatedWeight after auto-calculate:",
                controlNameSelectedAndAssociatedWeight.current
            );
            console.log(
                "Updated controlObjectivesSelectedAndAssociatedWeight after auto-calculate:",
                controlObjectivesSelectedAndAssociatedWeight.current
            );
        } else {
            setErrorFields([...policyErrors, ...objectiveErrors]);
            setError(errorMessages.join(" | "));
            setOpenErrorDialog(true);
        }
    };


    const columns: DTColumnsProps<Record<string, any>>[] = [
        {
            accessorKey: "controlName",
            cell: ({ row }) => {
                const controlName = row.original.controlName;
                const objectives = selectedSOPData
                    .filter(item => item.controlName === controlName)
                    .map(item => item.controlObj);
                const checked = isParentChecked(controlName, objectives);
                const isLocked = lockedControls[controlName];
                const isError = errorFields.includes(controlName);

                return (
                    <div className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            checked={checked}
                            onChange={(e) => {
                                const isChecked = e.target.checked;
                                handleParentCheck(controlName, isChecked, objectives);
                            }}
                            className="h-4 w-4 border rounded-sm cursor-pointer"
                        />
                        <span>{controlName}</span>
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <span
                                        // type="button"
                                        className="cursor-pointer"
                                        onClick={() => toggleControlLock(controlName)}
                                    >
                                        {isLocked ? (
                                            <Lock className="h-4 w-4 text-gray-500" />
                                        ) : (
                                            <Unlock className="h-4 w-4 text-gray-500" />
                                        )}
                                    </span>
                                </TooltipTrigger>
                                <TooltipContent>
                                    {isLocked
                                        ? "Unlock to allow auto weight calculation"
                                        : "Lock to prevent auto weight calculation"}
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                        {isError && <span className="text-red-500">Error</span>}
                    </div>
                );
            },
        },
        {
            accessorKey: "controlObj",
            header: "Control Objective",
            cell: ({ row }) => {
                const controlName = row.original.controlName;
                const objId = row.original.controlObj;
                const checked = isChildChecked(controlName, objId);
                const isLocked = lockedObjectives[controlName]?.[objId];
                const isError = errorFields.includes(objId);

                return (
                    <div className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            checked={checked}
                            onChange={(e) => {
                                handleChildCheck(controlName, objId, e.target.checked);
                            }}
                            className="h-4 w-4 border rounded-sm cursor-pointer"
                        />
                        {/* <span>{objId}</span> */}
                        <span className="truncate max-w-[350px]" title={objId}>{objId}</span>
                        {objId && (
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <span
                                            //type="button"
                                            className="cursor-pointer"
                                            onClick={() => toggleObjectiveLock(controlName, objId)}
                                        >
                                            {isLocked ? (
                                                <Lock className="h-4 w-4 text-gray-500" />
                                            ) : (
                                                <Unlock className="h-4 w-4 text-gray-500" />
                                            )}
                                        </span>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        {isLocked
                                            ? "Unlock to allow auto weight calculation"
                                            : "Lock to prevent auto weight calculation"}
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        )}
                        {isError && <span className="text-red-500">Error</span>}
                    </div>
                );
            },
        },
        {
            accessorKey: "category",
            header: "Procedural Type",
        },
        {
            accessorKey: "controlObjweightage",
            header: "Weightage",
            cell: ({ row }) => {
                const isControl = !!row.original.controlName && !row.original.controlObj;
                const key = isControl ? row.original.controlName : row.original.controlObj;
                const defaultWeightage = row.original.controlObjweightage !== undefined
                    ? Number(row.original.controlObjweightage).toFixed(2)
                    : "0.00";

                const [localValue, setLocalValue] = React.useState(
                    weightages[key] !== undefined ? String(weightages[key]) : defaultWeightage
                );
                const isError = errorFields.includes(key);


                React.useEffect(() => {
                    setLocalValue(weightages[key] !== undefined ? String(weightages[key]) : defaultWeightage);
                }, [weightages, key]);

                const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
                    setLocalValue(e.target.value);
                };

                const handleBlur = () => {
                    handleWeightageChange(key, localValue, row, "cell");
                };

                return (
                    <Input
                        type="number"
                        value={localValue}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className={cn("w-40", isError && "border-red-500")}
                        step="0.01"
                        min="0"
                    />
                );
            },
            aggregatedCell: ({ row }) => {
                const key = row.original.controlName;
                const defaultWeightage = row.original.controlweightage !== undefined
                    ? Number(row.original.controlweightage).toFixed(2)
                    : "0.00";

                const [localValue, setLocalValue] = React.useState(
                    weightages[key] !== undefined ? String(weightages[key]) : defaultWeightage
                );
                const isError = errorFields.includes(key);

                React.useEffect(() => {
                    setLocalValue(weightages[key] !== undefined ? String(weightages[key]) : defaultWeightage);
                }, [weightages, key]);

                const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
                    setLocalValue(e.target.value);
                };

                const handleBlur = () => {
                    handleWeightageChange(key, localValue, row, "aggregatedCell");
                };

                return (
                    <Input
                        type="number"
                        value={localValue}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className={cn("w-40", isError && "border-red-500")}
                        step="0.01"
                        min="0"
                    />
                );
            },
        }
    ];

    const extraParams: DTExtraParamsProps = {
        defaultGroups: ["controlName"],
        extraTools: [
            <IconButtonWithTooltip
                key="add-btn"
                tooltipContent="Auto Calculate"
                onClick={() => setOpenAlertDialog(true)}
            >
                <Calculator />
            </IconButtonWithTooltip>,
        ],
        pagination: false,
        grouping: false
    };

    return (
        <>
            <div className="h-full overflow-y-auto">
                <DataTable data={selectedSOPData} columns={columns} extraParams={extraParams} />
            </div>
            <Dialog open={openAlertDialog} onOpenChange={setOpenAlertDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Confirm Auto Calculation</DialogTitle>
                    </DialogHeader>
                    <div>This will allocate 100% of the weightage across all selected control policies and their respective control objectives.

                        If any control policy or control objective is locked, its value will remain unchanged during the calculation.</div>
                    <DialogFooter className="mt-4">
                        <Button variant="secondary" onClick={() => setOpenAlertDialog(false)}>Cancel</Button>
                        <Button
                            onClick={() => {
                                handleAutoCalculate();
                                setOpenAlertDialog(false);
                            }}
                        >
                            Confirm
                        </Button>
                    </DialogFooter>
                </DialogContent>

            </Dialog>
            <Dialog open={openErrorDialog} onOpenChange={setOpenErrorDialog}>

                <DialogContent>
                    <DialogTitle>Errors in Auto Calculation</DialogTitle>
                    <DialogDescription>
                        The following errors were encountered during the auto calculation process:
                    </DialogDescription>
                    {error && (
                        <Alert variant="destructive">
                            <AlertTitle>Error</AlertTitle>
                            <AlertDescription>
                                {error && error.split(" | ").map((msg, index) => (
                                    <div key={index}>• {msg}</div>
                                ))}
                            </AlertDescription>
                        </Alert>
                    )}
                </DialogContent>
            </Dialog>


        </>
    );
});

export default PlanningModalTable;

