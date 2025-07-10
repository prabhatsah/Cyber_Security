"use client"

import React, { useState, useCallback, useEffect } from 'react';
import { Button } from '@/shadcn/ui/button';
import { Input } from '@/shadcn/ui/input';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/shadcn/ui/card';
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from '@/shadcn/ui/select';
import { Textarea } from '@/shadcn/ui/textarea';
import { Plus, Trash2, GripVertical, XCircle, ChevronDown, ChevronUp, LayoutList, CheckCircle, Pencil, Calculator, LockKeyhole, LockKeyholeOpen } from 'lucide-react';
import { cn } from '@/shadcn/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { useKBContext } from './knowledgeBaseContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/shadcn/ui/dialog';
import { Label } from '@/shadcn/ui/label';
import { object } from 'zod';
import { IconButtonWithTooltip } from '@/ikon/components/buttons';
import { useRouter } from 'next/navigation';
import { mapProcessName, startProcessV2 } from '@/ikon/utils/api/processRuntimeService';

// Types
interface ControlObjective {
    existingObjectiveName: string;
    objectiveDescription: string;
    objectiveIndex: string;
    newObjectiveName: string;
    objectivePracticeArea: string;
    objectiveSource: string;
    objectiveType: string;
    objectiveWeight: string;
    objectiveId: string
}

interface PolicyControl {
    indexName: string;
    controlSource: string;
    controlObjectives: ControlObjective[];
    newControlName: string;
    controlWeight: string;
    isEditingName: boolean;
    existingControlName: string;
    policyId: string;
}


interface Framework {
    name: string;
    policyControls: PolicyControl[];
}


const CONTROL_SOURCE_TYPE = [
    { label: 'Existing', value: 'existing' },
    { label: 'New', value: 'new' },
]

export default function FrameworkCreationForm({ open, setOpen }: { open: boolean; setOpen: (val: boolean) => void }) {

    const router = useRouter();

    const { lockedWeights, setLockedWeights, lockedControlWeights, setLockedControlWeights, selectedControlsObj, objTypes, practiceArea, addExistingControl,setExistingPolicyForm } = useKBContext();

    console.log(addExistingControl);
    console.log(practiceArea);
    console.log(objTypes);

    const [frameworkName, setFrameworkName] = useState('');
    const [policyControls, setPolicyControls] = useState<PolicyControl[]>(addExistingControl)

    const [isDragging, setIsDragging] = useState(false);
    const [expandedControls, setExpandedControls] = useState<string[]>([]);
    const [expandedObjectives, setExpandedObjectives] = useState<Record<string, string[]>>({});
    const [showObjectivesInline, setShowObjectivesInline] = useState(false);

    // Function to add a new policy control

    const addPolicyControl = useCallback(() => {
        const newControl: PolicyControl = {
            indexName: crypto.randomUUID(),
            newControlName: "",
            controlWeight: "",
            controlSource: "new",
            existingControlName: "",
            policyId: "",
            isEditingName: false,
            controlObjectives: [
                {
                    objectiveSource: "new",
                    newObjectiveName: "",
                    existingObjectiveName: "",
                    objectiveWeight: "",
                    objectiveType: "",
                    objectiveIndex: crypto.randomUUID(),
                    objectivePracticeArea: "",
                    objectiveDescription: "",
                    objectiveId: ""
                },
            ],
        };
        setPolicyControls((prevControls) => [...prevControls, newControl]);
        setExpandedControls(prev => [...prev, newControl.indexName]);
    }, []);


    const distributeControlWeights = () => {
        const controls = policyControls;
        const weights = controls.map((control) =>
            parseFloat(control.controlWeight || "0")
        );

        const lockedMap = lockedControlWeights[0] || {};
        const lockedIndexes = weights
            .map((_, idx) => (lockedMap[idx] ? idx : null))
            .filter((v) => v !== null) as number[];

        const totalLocked = lockedIndexes.reduce((acc, i) => acc + weights[i], 0);
        const remaining = 100 - totalLocked;

        const unlockedIndexes = weights
            .map((_, idx) => (!lockedMap[idx] ? idx : null))
            .filter((v) => v !== null) as number[];

        const share = parseFloat((remaining / unlockedIndexes.length).toFixed(2));
        let newWeights = [...weights];

        unlockedIndexes.forEach((idx) => {
            newWeights[idx] = share;
        });

        const roundingDiff = parseFloat(
            (100 - newWeights.reduce((a, b) => a + b, 0)).toFixed(2)
        );

        if (unlockedIndexes.length > 0) {
            const lastIdx = unlockedIndexes[unlockedIndexes.length - 1];
            newWeights[lastIdx] = parseFloat(
                (newWeights[lastIdx] + roundingDiff).toFixed(2)
            );
        }
        const updatedControls = controls.map((control, idx) => ({
            ...control,
            controlWeight: newWeights[idx].toString(),
        }));

        setPolicyControls(updatedControls);
    };




    const distributeObjectiveWeights = (controlIdx: number) => {
        const objectives = policyControls[controlIdx].controlObjectives;

        const weights = objectives.map((objective) =>
            parseFloat(objective.objectiveWeight || "0")
        );

        const lockedMap = lockedWeights[controlIdx] || {};
        const lockedIndexes = weights
            .map((_, idx) => (lockedMap[idx] ? idx : null))
            .filter((v) => v !== null) as number[];

        const totalLocked = lockedIndexes.reduce((acc, i) => acc + weights[i], 0);
        const remaining = 100 - totalLocked;

        const unlockedIndexes = weights
            .map((_, idx) => (!lockedMap[idx] ? idx : null))
            .filter((v) => v !== null) as number[];

        const share = parseFloat((remaining / unlockedIndexes.length).toFixed(2));
        let newWeights = [...weights];

        unlockedIndexes.forEach((idx) => {
            newWeights[idx] = share;
        });

        const roundingDiff = parseFloat(
            (100 - newWeights.reduce((a, b) => a + b, 0)).toFixed(2)
        );

        if (unlockedIndexes.length > 0) {
            const lastIdx = unlockedIndexes[unlockedIndexes.length - 1];
            newWeights[lastIdx] = parseFloat(
                (newWeights[lastIdx] + roundingDiff).toFixed(2)
            );
        }

        setPolicyControls((prev) => {
            const updatedControls = [...prev];
            const updatedObjectives = updatedControls[controlIdx].controlObjectives.map((obj, idx) => ({
                ...obj,
                objectiveWeight: newWeights[idx].toString(),
            }));

            updatedControls[controlIdx] = {
                ...updatedControls[controlIdx],
                controlObjectives: updatedObjectives,
            };

            return updatedControls;
        });
    };



    const deletePolicyControl = (id: string) => {
        setPolicyControls(prevControls =>
            prevControls.filter(control => control.indexName !== id)
        );
        setExpandedControls(prevExpanded =>
            prevExpanded.filter(controlId => controlId !== id)
        );
        setExpandedObjectives(prevExpandedObjectives => {
            const { [id]: _, ...rest } = prevExpandedObjectives;
            return rest;
        });
    };

    // Function to update a policy control
    const updatePolicyControl = useCallback(
        (id: string, updates: Partial<Omit<PolicyControl, 'id'>>) => {
            setPolicyControls(prevControls =>
                prevControls.map(control =>
                    control.indexName === id ? { ...control, ...updates } : control
                )
            );
        },
        []
    );

    const handleDragEnd = (draggedItemIndex: number, targetIndex: number) => {
        if (draggedItemIndex === targetIndex) return;

        const updatedControls = [...policyControls];
        const [draggedItem] = updatedControls.splice(draggedItemIndex, 1);
        updatedControls.splice(targetIndex, 0, draggedItem);

        setPolicyControls(updatedControls);
    };

    const handleDragStart = () => {
        setIsDragging(true);
    };
    const handleDragCancel = () => {
        setIsDragging(false);
    };

    // Function to handle form submission
    const handleSubmit = async () => {
        if (!frameworkName.trim()) {
            alert("Framework name is required.");
            return;
        }

        for (const control of policyControls) {
            const controlName = control.newControlName|| control.existingControlName
            if (
                !controlName ||
                !control.controlWeight ||
                !control.policyId
            ) {
                alert("Please fill all required control fields.");
                return;
            }

            const seenObjectives = new Set<string>();

            for (const obj of control.controlObjectives) {
                const objName = obj.newObjectiveName || obj.existingObjectiveName;

                if (
                    !objName ||
                    !obj.objectiveDescription ||
                    !obj.objectiveId ||
                    !obj.objectivePracticeArea ||
                    !obj.objectiveType ||
                    !obj.objectiveWeight
                ) {
                    alert(`Please fill all required objective fields under ${controlName}`);
                    return;
                }

                if (seenObjectives.has(objName)) {
                    alert(`Duplicate objective "${objName}" found under the same control.`);
                    return;
                }
                seenObjectives.add(objName);
            }
        }

        const saveFormatData = {
            policyName: frameworkName,
            frameworkId: "324678d9-d361-4f8d-bdac-a52a80557cfc",
            framework: "bestPractice",
            controls: policyControls.map((control) => ({
                controlName: control.newControlName || control.existingControlName,
                controlWeight: parseFloat(control.controlWeight),
                policyId: parseFloat(control.policyId),
                controlObjectives: control.controlObjectives.map((obj) => ({
                    name: obj.newObjectiveName || obj.existingObjectiveName,
                    description: obj.objectiveDescription,
                    controlObjId: parseFloat(obj.objectiveId),
                    practiceAreas: obj.objectivePracticeArea,
                    controlObjType: obj.objectiveType,
                    controlObjweight: parseFloat(obj.objectiveWeight),
                })),
            })),
        };

        console.log("Ready to save:", saveFormatData);

        const processId = await mapProcessName({ processName: "Control Objectives", });
        await startProcessV2({
            processId,
            data: saveFormatData,
            processIdentifierFields: "",
        });

        setOpen(false);
        setExistingPolicyForm(false)
        router.refresh();
    };


    // Function to add a control objective to a policy control
    const addControlObjective = (controlId: string) => {
        const newObjective: ControlObjective = {
            objectiveSource: "new",
            newObjectiveName: "",
            objectiveWeight: "",
            objectiveType: "",
            objectiveIndex: crypto.randomUUID(),
            objectivePracticeArea: "",
            existingObjectiveName: "",
            objectiveDescription: "",
            objectiveId: ""
        };

        setPolicyControls(prevControls =>
            prevControls.map(control =>
                control.indexName === controlId
                    ? { ...control, controlObjectives: [...control.controlObjectives, newObjective] }
                    : control
            )
        );
        setExpandedObjectives(prevExpandedObjectives => ({
            ...prevExpandedObjectives,
            [controlId]: [...(prevExpandedObjectives[controlId] || []), newObjective.objectiveId],
        }));
    };

    // Function to remove a control objective
    const removeControlObjective = (controlId: string, objectiveId: string) => {
        setPolicyControls(prevControls =>
            prevControls.map(control =>
                control.indexName === controlId
                    ? {
                        ...control,
                        controlObjectives: control.controlObjectives.filter(obj => obj.objectiveIndex !== objectiveId)
                    }
                    : control
            )
        );

        setExpandedObjectives(prevExpandedObjectives => ({
            ...prevExpandedObjectives,
            [controlId]: (prevExpandedObjectives[controlId] || []).filter(id => id !== objectiveId)
        }));
    };

    // Function to update a control objective
    const updateControlObjective = (controlId: string, objectiveId: string, newValues: Partial<ControlObjective>) => {
        setPolicyControls(prevControls =>
            prevControls.map(control =>
                control.indexName === controlId
                    ? {
                        ...control,
                        controlObjectives: control.controlObjectives.map(objective =>
                            objective.objectiveIndex === objectiveId ? { ...objective, ...newValues } : objective
                        )
                    }
                    : control
            )
        );
    };

    const toggleControlExpansion = (controlId: string) => {
        setExpandedControls(prevExpanded =>
            prevExpanded.includes(controlId)
                ? prevExpanded.filter(id => id !== controlId)
                : [...prevExpanded, controlId]
        );
    };

    const isControlExpanded = (controlId: string) => expandedControls.includes(controlId);

    const toggleObjectiveExpansion = (controlId: string, objectiveId: string) => {
        setExpandedObjectives(prevExpandedObjectives => {
            const current = prevExpandedObjectives[controlId] || [];
            return {
                ...prevExpandedObjectives,
                [controlId]: current.includes(objectiveId)
                    ? current.filter(id => id !== objectiveId)
                    : [...current, objectiveId]
            };
        });
    };

    const isObjectiveExpanded = (controlId: string, objectiveId: string) => {
        const expanded = expandedObjectives[controlId] || [];
        return expanded.includes(objectiveId);
    };

    const toggleEditName = (controlId: string) => {
        setPolicyControls(prevControls =>
            prevControls.map(control =>
                control.indexName === controlId ? { ...control, isEditingName: !control.isEditingName } : control
            )
        );
    };

    const toggleControlLock = (controlIdx: number) => {
        setLockedControlWeights((prev) => ({
            ...prev,
            0: {
                ...prev[0],
                [controlIdx]: !prev[0]?.[controlIdx],
            },
        }));
    };

    const toggleObjectiveLock = (controlIdx: number, objIdx: number) => {
        console.log(controlIdx, objIdx)
        setLockedWeights((prev) => ({
            ...prev,
            [controlIdx]: {
                ...prev[controlIdx],
                [objIdx]: !prev[controlIdx]?.[objIdx],
            },
        }));
    };


    return (
        <>
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="!max-w-none !w-screen !h-screen p-6 flex flex-col">
                    <DialogHeader>
                        <DialogTitle>Framework Creation</DialogTitle>
                    </DialogHeader>
                    <div className='flex flex-row gap-3'>
                        <div className='flex-1'>
                            <label htmlFor="frameworkName" className="block text-sm font-medium text-gray-300 mb-1" >
                                Framework Name
                            </label>
                            < Input
                                id="frameworkName"
                                value={frameworkName}
                                onChange={(e) => setFrameworkName(e.target.value)}
                                placeholder="Enter Framework Name"
                            />
                        </div>
                        {/* Layout Toggle */}
                        <div className="self-end" >
                            <Button
                                variant="outline"
                                size="icon"
                                onClick={() => setShowObjectivesInline(prev => !prev)}
                                title={showObjectivesInline ? "Show as Cards" : "Show Inline"}
                            >
                                <LayoutList className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>

                    {/* Search Bar */}
                    {/* <div className="mb-4" >
                        <Input
                            placeholder="Search Policy Controls..."
                        />
                    </div> */}

                    {/* Add Policy Control Button */}
                    <div className="mb-6 ml-auto">
                        <div className='flex flex-row gap-3'>
                            <Button
                                onClick={addPolicyControl}
                            >
                                <Plus className="mr-2 h-4 w-4" /> Add Policy Control
                            </Button>
                            < Button
                                onClick={() => distributeControlWeights()}
                            >
                                <Calculator className="h-10" />
                            </Button>
                        </div>
                    </div>
                    <div className='flex flex-col gap-3 h-full overflow-y-auto'>
                        {/* Policy Controls */}
                        <AnimatePresence>
                            {
                                policyControls.map((control, index) => (
                                    <motion.div
                                        key={control.indexName}

                                        className={cn('relative group', isDragging ? 'z-50 shadow-lg' : 'z-10')}
                                    >
                                        <Card className="bg-gray-900 border-gray-700 mb-4" >
                                            <CardHeader>
                                                <CardTitle className="text-lg text-white flex items-center justify-between" >
                                                    <div className="flex items-center gap-2" >
                                                        <GripVertical className="w-4 h-4 text-gray-500 group-hover:text-gray-300 transition-colors" />
                                                        {
                                                            control.isEditingName ? (
                                                                control.controlSource === 'new' ? (
                                                                    <Input
                                                                        value={control.newControlName}
                                                                        onChange={(e) =>
                                                                            updatePolicyControl(control.indexName, {
                                                                                newControlName: e.target.value,
                                                                            })
                                                                        }
                                                                        placeholder="Policy Control Name"
                                                                        className="bg-gray-800 text-white border-gray-700 w-48"
                                                                    />
                                                                ) : (
                                                                    < Select
                                                                        value={control.existingControlName}
                                                                        onValueChange={(value) =>
                                                                            updatePolicyControl(control.indexName, {
                                                                                existingControlName: value,
                                                                            })
                                                                        }
                                                                    >
                                                                        <SelectTrigger className="bg-gray-700 text-white border-gray-600 w-48" >
                                                                            <SelectValue placeholder="Select" />
                                                                        </SelectTrigger>
                                                                        <SelectContent>
                                                                            {selectedControlsObj &&
                                                                                Object.keys(selectedControlsObj).map((controlName) => (
                                                                                    <SelectItem key={controlName} value={controlName}>
                                                                                        {controlName}
                                                                                    </SelectItem>
                                                                                ))}
                                                                        </SelectContent>
                                                                    </Select>
                                                                )
                                                            ) : (
                                                                <span className="cursor-pointer" onClick={() => toggleEditName(control.indexName)}>
                                                                    {control.controlSource === 'new' ? control.newControlName || "Policy Control" : control.existingControlName || "Existing Policy Control"}
                                                                </span>
                                                            )}
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={() => toggleControlLock(index)}
                                                        >
                                                            {lockedControlWeights[0]?.[index] ? <LockKeyhole className="h-4 w-4" /> : <LockKeyholeOpen className="h-4 w-4" />}
                                                        </Button>

                                                    </div>
                                                    <div className="flex  gap-3" >
                                                        <div className='flex flex-col' >
                                                            <label className="block text-xs font-medium text-gray-400 mb-1" >Control Source </label>
                                                            < Select
                                                                value={control.controlSource}
                                                                onValueChange={(value) =>
                                                                    updatePolicyControl(control.indexName, {
                                                                        controlSource: value,
                                                                    })
                                                                }
                                                            >
                                                                <SelectTrigger className="bg-gray-700 text-white border-gray-600 w-24" >
                                                                    <SelectValue placeholder="Select" />
                                                                </SelectTrigger>
                                                                <SelectContent>
                                                                    {
                                                                        CONTROL_SOURCE_TYPE.map((option) => (
                                                                            <SelectItem key={option.value} value={option.value} >
                                                                                {option.label}
                                                                            </SelectItem>
                                                                        ))
                                                                    }
                                                                </SelectContent>
                                                            </Select>
                                                        </div>
                                                        <div className='flex flex-col gap-1' >
                                                            <span className="block text-xs font-medium text-gray-400" > Control Id </span>
                                                            < Input
                                                                value={control.policyId}
                                                                onChange={(e) =>
                                                                    updatePolicyControl(control.indexName, {
                                                                        policyId: e.target.value,
                                                                    })
                                                                }
                                                                placeholder=""
                                                                className="bg-gray-800 text-white border-gray-700 w-24"

                                                            />
                                                        </div>
                                                        < div className='flex flex-col gap-1' >
                                                            <span className="block text-xs font-medium text-gray-400" > Weightage </span>
                                                            < Input
                                                                value={control.controlWeight}
                                                                onChange={(e) =>
                                                                    updatePolicyControl(control.indexName, {
                                                                        controlWeight: e.target.value,
                                                                    })
                                                                }
                                                                placeholder=""
                                                                className="bg-gray-800 text-white border-gray-700 w-24"
                                                            />
                                                        </div>
                                                        <div className='self-end'>
                                                            {
                                                                control.isEditingName ? (
                                                                    <Button
                                                                        variant="ghost"
                                                                        size="icon"
                                                                        onClick={() => toggleEditName(control.indexName)
                                                                        }
                                                                        className="text-green-400 hover:text-green-300"
                                                                        title="Save Name"
                                                                    >
                                                                        <CheckCircle className="h-4 w-4" />
                                                                    </Button>
                                                                ) : (
                                                                    <Button
                                                                        variant="ghost"
                                                                        size="icon"
                                                                        onClick={() => toggleEditName(control.indexName)}
                                                                        className="text-gray-400 hover:text-gray-300"
                                                                        title="Edit Name"
                                                                    >
                                                                        <Pencil className="h-4 w-4" />
                                                                    </Button>
                                                                )}


                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                onClick={() => distributeObjectiveWeights(index)}
                                                            >
                                                                <Calculator className="h-4 w-4" />
                                                            </Button>

                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                onClick={() => toggleControlExpansion(control.indexName)}
                                                                className="text-gray-400 hover:text-gray-300"
                                                                title={isControlExpanded(control.indexName) ? 'Collapse' : 'Expand'}
                                                            >
                                                                {isControlExpanded(control.indexName) ? (
                                                                    <ChevronUp className="h-4 w-4" />
                                                                ) : (
                                                                    <ChevronDown className="h-4 w-4" />
                                                                )}
                                                            </Button>
                                                            < Button
                                                                variant="ghost"
                                                                size="icon"
                                                                onClick={() => deletePolicyControl(control.indexName)}
                                                                className="text-red-400 hover:text-red-300 hover:bg-red-500/20"
                                                            >
                                                                <Trash2 className="h-4 w-4" />
                                                            </Button>
                                                        </div>
                                                    </div>
                                                </CardTitle>
                                            </CardHeader>

                                            < CardContent className={cn('space-y-4', isControlExpanded(control.indexName) ? 'block' : 'hidden')}>
                                                <div className="grid grid-cols-1 gap-4" >
                                                    {/* Control Objectives Section */}
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-300 mb-2" >
                                                            Control Objectives
                                                        </label>
                                                        {
                                                            control.controlObjectives.map((objective, objectiveIndex) =>
                                                                showObjectivesInline ? (
                                                                    <div key={objective.objectiveIndex} className="mb-2 flex items-start gap-4 border-b border-gray-700 pb-2 last:border-0" >
                                                                        <div className="flex-1" >
                                                                            <label className="block text-xs font-medium text-gray-400 mb-1" >Objective Name </label>
                                                                            {
                                                                                objective.objectiveSource === 'new' ? (
                                                                                    < Input
                                                                                        value={objective.newObjectiveName}
                                                                                        onChange={(e) =>
                                                                                            updateControlObjective(control.indexName, objective.objectiveIndex, {
                                                                                                newObjectiveName: e.target.value,
                                                                                            })
                                                                                        }
                                                                                        placeholder="Enter Objective Name"
                                                                                        className="bg-gray-700 text-white border-gray-600"
                                                                                    />
                                                                                ) : (
                                                                                    < Select
                                                                                        value={objective.existingObjectiveName}
                                                                                        onValueChange={(value) => {
                                                                                            updateControlObjective(control.indexName, objective.objectiveIndex, {
                                                                                                existingObjectiveName: value,
                                                                                            })
                                                                                        }}
                                                                                    >
                                                                                        <SelectTrigger className="w-full bg-gray-700 text-white border-gray-600" >
                                                                                            <SelectValue placeholder="Select Control Objective" />
                                                                                        </SelectTrigger>
                                                                                        <SelectContent className="max-h-72 overflow-y-auto">
                                                                                            {selectedControlsObj &&
                                                                                                Object.entries(selectedControlsObj).map(([controlName, objectives]) => {
                                                                                                    return (
                                                                                                        <SelectGroup key={controlName}>
                                                                                                            <SelectLabel>
                                                                                                                <div className="text-base font-semibold mb-1">
                                                                                                                    {controlName}
                                                                                                                </div>
                                                                                                            </SelectLabel>
                                                                                                            {objectives.map((obj, idx) => (
                                                                                                                <SelectItem
                                                                                                                    key={`${controlName}-${idx}`}
                                                                                                                    value={obj.name}
                                                                                                                // disabled={controlName === selectedControlName}
                                                                                                                >
                                                                                                                    {obj.name}
                                                                                                                </SelectItem>
                                                                                                            ))}
                                                                                                        </SelectGroup>
                                                                                                    )
                                                                                                })
                                                                                            }
                                                                                        </SelectContent>
                                                                                    </Select>
                                                                                )
                                                                            }
                                                                        </div>
                                                                        < div className="flex-1" >
                                                                            <label className="block text-xs font-medium text-gray-400 mb-1" > Objective Id </label>
                                                                            < Input
                                                                                value={objective.objectiveId}
                                                                                onChange={(e) =>
                                                                                    updateControlObjective(control.indexName, objective.objectiveIndex, {
                                                                                        objectiveId: e.target.value,
                                                                                    })
                                                                                }
                                                                                placeholder="Enter Objective Id"
                                                                                className="bg-gray-700 text-white border-gray-600"
                                                                            />
                                                                        </div>
                                                                        < div className="flex-1" >
                                                                            <label className="block text-xs font-medium text-gray-400 mb-1" > Practice Area </label>
                                                                            < Select
                                                                                value={objective.objectivePracticeArea}
                                                                                onValueChange={(value) =>
                                                                                    updateControlObjective(control.indexName, objective.objectiveIndex, {
                                                                                        objectivePracticeArea: value,
                                                                                    })
                                                                                }
                                                                            >
                                                                                <SelectTrigger className="w-full bg-gray-700 text-white border-gray-600" >
                                                                                    <SelectValue placeholder="Select" />
                                                                                </SelectTrigger>
                                                                                <SelectContent>
                                                                                    {
                                                                                        practiceArea?.map((option) => (
                                                                                            <SelectItem key={option} value={option} >
                                                                                                {option}
                                                                                            </SelectItem>
                                                                                        ))
                                                                                    }
                                                                                </SelectContent>
                                                                            </Select>
                                                                        </div>
                                                                        < div className="flex-1" >
                                                                            <label className="block text-xs font-medium text-gray-400 mb-1" > Procedural Type </label>
                                                                            < Select
                                                                                value={objective.objectiveType}
                                                                                onValueChange={(value) =>
                                                                                    updateControlObjective(control.indexName, objective.objectiveIndex, {
                                                                                        objectiveType: value,
                                                                                    })
                                                                                }
                                                                            >
                                                                                <SelectTrigger className="w-full bg-gray-700 text-white border-gray-600" >
                                                                                    <SelectValue placeholder="Select" />
                                                                                </SelectTrigger>
                                                                                <SelectContent>
                                                                                    {
                                                                                        objTypes?.map((option) => (
                                                                                            <SelectItem key={option} value={option} >
                                                                                                {option}
                                                                                            </SelectItem>
                                                                                        ))
                                                                                    }
                                                                                </SelectContent>
                                                                            </Select>
                                                                        </div>
                                                                        < div className="flex-grow col-span-2 min-w-[200px]" >
                                                                            <label className="block text-xs font-medium text-gray-400 mb-1" > Description </label>
                                                                            < Textarea
                                                                                value={objective.objectiveDescription}
                                                                                onChange={(e) =>
                                                                                    updateControlObjective(control.indexName, objective.objectiveIndex, {
                                                                                        objectiveDescription: e.target.value,
                                                                                    })
                                                                                }
                                                                                placeholder="Enter description"
                                                                                className="bg-gray-700 text-white border-gray-600 min-h-[60px] resize-y"
                                                                            />
                                                                        </div>
                                                                        < div className="mt-6 flex items-start" >
                                                                            <Button
                                                                                variant="ghost"
                                                                                size="icon"
                                                                                onClick={() => removeControlObjective(control.indexName, objective.objectiveIndex)}
                                                                                className="text-gray-400 hover:text-red-400"
                                                                            >
                                                                                <XCircle className="h-4 w-4" />
                                                                            </Button>
                                                                        </div>
                                                                    </div>

                                                                ) : (

                                                                    <Card
                                                                        key={objective.objectiveIndex}
                                                                        className="mb-2 bg-gray-800 border-gray-700 relative overflow-hidden"
                                                                        style={{
                                                                            height: isObjectiveExpanded(control.indexName, objective.objectiveIndex) ? 'auto' : '3rem',
                                                                        }}
                                                                    >
                                                                        <div className="absolute top-1 right-1 flex gap-2 z-10" >
                                                                            <Button
                                                                                variant="ghost"
                                                                                size="icon"
                                                                                onClick={() => toggleObjectiveExpansion(control.indexName, objective.objectiveIndex)}
                                                                                className="text-gray-400 hover:text-gray-300"
                                                                                title={isObjectiveExpanded(control.indexName, objective.objectiveIndex) ? "Collapse" : "Expand"}
                                                                            >
                                                                                {isObjectiveExpanded(control.indexName, objective.objectiveIndex) ? (
                                                                                    <ChevronUp className="h-4 w-4" />
                                                                                ) : (
                                                                                    <ChevronDown className="h-4 w-4" />
                                                                                )}
                                                                            </Button>
                                                                            < Button
                                                                                variant="ghost"
                                                                                size="icon"
                                                                                onClick={() => removeControlObjective(control.indexName, objective.objectiveIndex)}
                                                                                className="text-gray-400 hover:text-red-400"
                                                                            >
                                                                                <XCircle className="h-4 w-4" />
                                                                            </Button>
                                                                        </div>
                                                                        < div className="font-medium text-white px-4 py-2 truncate flex items-center gap-2" >
                                                                            {objective.objectiveSource === 'new' ? objective.newObjectiveName || "Objeciive Control" : objective.existingObjectiveName || "Existing Objeciive Control"}
                                                                            {isObjectiveExpanded(control.indexName, objective.objectiveIndex) && <CheckCircle className="h-4 w-4 text-green-400" />}
                                                                            <Button
                                                                                variant="ghost"
                                                                                size="icon"
                                                                                onClick={() => toggleObjectiveLock(index, objectiveIndex)}
                                                                            >
                                                                                {lockedWeights[index]?.[objectiveIndex] ? <LockKeyhole className="h-4 w-4" /> : <LockKeyholeOpen className="h-4 w-4" />}
                                                                            </Button>

                                                                        </div>
                                                                        < div className={cn("grid grid-cols-2 gap-4 pt-8 px-4 pb-4 transition-all duration-300", isObjectiveExpanded(control.indexName, objective.objectiveIndex) ? "opacity-100" : "opacity-0 pointer-events-none")}>

                                                                            < div >
                                                                                <label className="block text-xs font-medium text-gray-400 mb-1" >
                                                                                    Objective Source
                                                                                </label>
                                                                                < Select
                                                                                    value={objective.objectiveSource}
                                                                                    onValueChange={(value) =>
                                                                                        updateControlObjective(control.indexName, objective.objectiveIndex, {
                                                                                            objectiveSource: value,
                                                                                        })
                                                                                    }
                                                                                >
                                                                                    <SelectTrigger className="w-full bg-gray-700 text-white border-gray-600" >
                                                                                        <SelectValue placeholder="Select" />
                                                                                    </SelectTrigger>
                                                                                    <SelectContent>
                                                                                        {
                                                                                            CONTROL_SOURCE_TYPE.map((option) => (
                                                                                                <SelectItem key={option.value} value={option.value} >
                                                                                                    {option.label}
                                                                                                </SelectItem>
                                                                                            ))
                                                                                        }
                                                                                    </SelectContent>
                                                                                </Select>
                                                                            </div>

                                                                            <div>
                                                                                <label className="block text-xs font-medium text-gray-400 mb-1" >Objective Weight </label>
                                                                                < Input
                                                                                    value={objective.objectiveWeight}
                                                                                    onChange={(e) =>
                                                                                        updateControlObjective(control.indexName, objective.objectiveIndex, {
                                                                                            objectiveWeight: e.target.value,
                                                                                        })
                                                                                    }
                                                                                    placeholder="Enter Objective Weight"
                                                                                    className="bg-gray-700 text-white border-gray-600"
                                                                                />
                                                                            </div>

                                                                            <div>
                                                                                <label className="block text-xs font-medium text-gray-400 mb-1" >Objective Name </label>

                                                                                {
                                                                                    objective.objectiveSource === 'new' ? (
                                                                                        < Input
                                                                                            value={objective.newObjectiveName}
                                                                                            onChange={(e) =>
                                                                                                updateControlObjective(control.indexName, objective.objectiveIndex, {
                                                                                                    newObjectiveName: e.target.value,
                                                                                                })
                                                                                            }
                                                                                            placeholder="Enter Objective Name"
                                                                                            className="bg-gray-700 text-white border-gray-600"
                                                                                        />
                                                                                    ) : (
                                                                                        < Select
                                                                                            value={objective.existingObjectiveName}
                                                                                            onValueChange={(value) => {
                                                                                                let foundControlName = "";
                                                                                                let foundObj: Record<string, string> | null = null;

                                                                                                if (selectedControlsObj) {
                                                                                                    for (const [controlName, objectives] of Object.entries(selectedControlsObj)) {
                                                                                                        const match = objectives?.find(obj => obj.name === value);
                                                                                                        if (match) {
                                                                                                            foundControlName = controlName;
                                                                                                            foundObj = match;
                                                                                                            break;
                                                                                                        }
                                                                                                    }
                                                                                                }

                                                                                                console.log(foundObj)

                                                                                                updateControlObjective(control.indexName, objective.objectiveIndex, {
                                                                                                    existingObjectiveName: value,
                                                                                                    objectiveId: foundObj?.controlObjId || '',
                                                                                                    objectivePracticeArea: foundObj?.practiceAreas || '',
                                                                                                    objectiveType: foundObj?.controlObjType || '',
                                                                                                    objectiveDescription: foundObj?.description || ''

                                                                                                })
                                                                                            }}
                                                                                        >
                                                                                            <SelectTrigger className="w-full bg-gray-700 text-white border-gray-600" >
                                                                                                <SelectValue placeholder="Select Control Objective" />
                                                                                            </SelectTrigger>
                                                                                            <SelectContent className="max-h-72 overflow-y-auto">
                                                                                                {selectedControlsObj &&
                                                                                                    Object.entries(selectedControlsObj).map(([controlName, objectives]) => {
                                                                                                        return (
                                                                                                            <SelectGroup key={controlName}>
                                                                                                                <SelectLabel>
                                                                                                                    <div className="text-base font-semibold mb-1">
                                                                                                                        {controlName}
                                                                                                                    </div>
                                                                                                                </SelectLabel>
                                                                                                                {objectives.map((obj, idx) => (
                                                                                                                    <SelectItem
                                                                                                                        key={`${controlName}-${idx}`}
                                                                                                                        value={obj.name}
                                                                                                                    // disabled={controlName === selectedControlName}
                                                                                                                    >
                                                                                                                        {obj.name}
                                                                                                                    </SelectItem>
                                                                                                                ))}
                                                                                                            </SelectGroup>
                                                                                                        )
                                                                                                    })
                                                                                                }
                                                                                            </SelectContent>
                                                                                        </Select>
                                                                                    )
                                                                                }


                                                                            </div>
                                                                            < div >
                                                                                <label className="block text-xs font-medium text-gray-400 mb-1" > Objective Id </label>
                                                                                < Input
                                                                                    value={objective.objectiveId}
                                                                                    onChange={(e) =>
                                                                                        updateControlObjective(control.indexName, objective.objectiveIndex, {
                                                                                            objectiveId: e.target.value,
                                                                                        })
                                                                                    }
                                                                                    placeholder="Enter Objective Index"
                                                                                    className="bg-gray-700 text-white border-gray-600"
                                                                                />
                                                                            </div>
                                                                            < div >
                                                                                <label className="block text-xs font-medium text-gray-400 mb-1" >
                                                                                    Practice Area
                                                                                </label>
                                                                                < Select
                                                                                    value={objective.objectivePracticeArea}
                                                                                    onValueChange={(value) =>
                                                                                        updateControlObjective(control.indexName, objective.objectiveIndex, {
                                                                                            objectivePracticeArea: value,
                                                                                        })
                                                                                    }
                                                                                >
                                                                                    <SelectTrigger className="w-full bg-gray-700 text-white border-gray-600" >
                                                                                        <SelectValue placeholder="Select" />
                                                                                    </SelectTrigger>
                                                                                    <SelectContent>
                                                                                        {
                                                                                            practiceArea?.map((option) => (
                                                                                                <SelectItem key={option} value={option} >
                                                                                                    {option}
                                                                                                </SelectItem>
                                                                                            ))
                                                                                        }
                                                                                    </SelectContent>
                                                                                </Select>
                                                                            </div>
                                                                            < div >
                                                                                <label className="block text-xs font-medium text-gray-400 mb-1" >
                                                                                    Procedural Type
                                                                                </label>
                                                                                < Select
                                                                                    value={objective.objectiveType}
                                                                                    onValueChange={(value) =>
                                                                                        updateControlObjective(control.indexName, objective.objectiveIndex, {
                                                                                            objectiveType: value,
                                                                                        })
                                                                                    }
                                                                                >
                                                                                    <SelectTrigger className="w-full bg-gray-700 text-white border-gray-600" >
                                                                                        <SelectValue placeholder="Select" />
                                                                                    </SelectTrigger>
                                                                                    <SelectContent>
                                                                                        {
                                                                                            objTypes?.map((option) => (
                                                                                                <SelectItem key={option} value={option} >
                                                                                                    {option}
                                                                                                </SelectItem>
                                                                                            ))
                                                                                        }
                                                                                    </SelectContent>
                                                                                </Select>
                                                                            </div>
                                                                            < div className="col-span-2" >
                                                                                <label className="block text-xs font-medium text-gray-400 mb-1" >
                                                                                    Description
                                                                                </label>
                                                                                < Textarea
                                                                                    value={objective.objectiveDescription}
                                                                                    onChange={(e) =>
                                                                                        updateControlObjective(control.indexName, objective.objectiveIndex, {
                                                                                            objectiveDescription: e.target.value,
                                                                                        })
                                                                                    }
                                                                                    placeholder="Enter description"
                                                                                    className="bg-gray-700 text-white border-gray-600 min-h-[60px] resize-y"
                                                                                />
                                                                            </div>
                                                                        </div>
                                                                    </Card>
                                                                ))}
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => addControlObjective(control.indexName)}
                                                            className="bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white border-gray-700"
                                                        >
                                                            <Plus className="mr-2 h-4 w-4" /> Add Objective
                                                        </Button>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </motion.div>
                                ))}
                        </AnimatePresence>

                    </div>
                    {/* Submit Button */}
                    <div className="mt-8" >
                        <Button
                            onClick={handleSubmit}
                            className="bg-green-500/20 text-green-400 hover:bg-green-500/30 hover:text-green-300"
                        >
                            Submit
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    )
}
