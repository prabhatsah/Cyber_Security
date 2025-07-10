"use client"

import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { Button } from '@/shadcn/ui/button';
import { Input } from '@/shadcn/ui/input';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/shadcn/ui/card';
import { Textarea } from '@/shadcn/ui/textarea';
import { Plus, Trash2, GripVertical, XCircle, ChevronDown, ChevronUp, LayoutList, CheckCircle, Pencil, Calculator, LockKeyhole, LockKeyholeOpen, Search, CalendarIcon } from 'lucide-react';
import { cn } from '@/shadcn/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/shadcn/ui/dialog';

import { IconButtonWithTooltip, TextButtonWithTooltip } from '@/ikon/components/buttons';
import { useRouter } from 'next/navigation';
import { getMyInstancesV2, invokeAction, mapProcessName, startProcessV2 } from '@/ikon/utils/api/processRuntimeService';
import { DeleteObjCtrl, DeletePoliciesObj, SaveAlertBox } from './alertBox';
import {
    Popover,
    PopoverTrigger,
    PopoverContent,
} from "@/shadcn/ui/popover"
import {
    Command,
    CommandInput,
    CommandList,
    CommandGroup,
    CommandItem,
    CommandEmpty,
} from "@/shadcn/ui/command"
import { Badge } from "@/shadcn/ui/badge"
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "@/shadcn/ui/tooltip"
import { ChevronsUpDown, Check, CircleX } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shadcn/ui/select';
import { TextArea } from '@progress/kendo-react-inputs';
import { Calendar } from '@/shadcn/ui/calendar';
import { format } from 'date-fns';
import { SAVE_DATE_FORMAT_GRC } from '@/ikon/utils/config/const';
import PublishFramework from './publishFramework';
import { getActiveAccountId } from '@/ikon/utils/actions/account';
import { Underdog } from 'next/font/google';
import { getProfileData } from '@/ikon/utils/actions/auth';

// Types
interface ControlObjective {

    objectiveDescription: string;
    objectiveIndex: string;
    objectiveName: string;
    objectiveId: string
}

export interface PolicyControl {
    indexName: string;
    controlObjectives: ControlObjective[];
    controlName: string;
    isEditingName: boolean;
    policyId: string;
    type: string;
    controlDescription: string;
}

const CONTROL_SOURCE_TYPE = [
    { label: 'Control', value: 'Control' },
    { label: 'Clause', value: 'Clause' },
]

interface Objective {
    objectiveName: string;
    objectiveDescription: string;
    objectiveIndex: string;
}

interface Control {
    controlName: string;
    policyIndex: string;
    type: string;
    controlDescription: string;
    controlObjectives: Objective[];
}

export interface FrameworkData {
    controls: Control[];
    frameworkName: string;
    description: string;
    owners: string[];
    frameworkId: string;
    lastUpdatedOn: Date | undefined;
    effectiveDate: Date | undefined;
    version: string;

}

export interface FrameworkDraftData {
    controls: PolicyControl[];
    frameworkName: string;
    description: string;
    owners: string[];
    frameworkId: string;
    lastUpdatedOn: Date | undefined;
    effectiveDate: Date | undefined;
    version: string;
    currentAccountId: string;
    saveAsDraft: boolean;
}


export default function FrameworkCreationForm({ open, setOpen, userMap, frameworkDraftData, fromUploadFile = false }:
    {
        open: boolean;
        setOpen: React.Dispatch<React.SetStateAction<boolean>>;
        userMap: { value: string, label: string }[],
        frameworkDraftData: FrameworkDraftData | null
        fromUploadFile?: boolean;
    }) {

    console.log("Framework draft data from the formmmmm ===================>>>>>")
    console.log(frameworkDraftData)
    const router = useRouter();
    const [frameworkName, setFrameworkName] = useState('');
    const [owner, setOwner] = useState<string[]>([]);
    const [date, setDate] = useState<Date>();
    const [version, setVersion] = useState<string>('');
    const [frameworkDescription, setFrameworkDescription] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [expandedControls, setExpandedControls] = useState<string[]>([]);
    const [expandedObjectives, setExpandedObjectives] = useState<Record<string, string[]>>({});
    const [showObjectivesInline, setShowObjectivesInline] = useState(false);
    const [openSaveAlertBox, setOpenSaveAlertBox] = useState<boolean>(false);
    const [saveValidationMessage, setSaveValidationMessage] = useState<string>('');
    const [comboBoxOpen, setComboBoxOpen] = useState<boolean>(false);
    const [policyControls, setPolicyControls] = useState<PolicyControl[]>([])
    const [deleteAlertPolicy, setDeleteAlertPolicy] = useState<boolean>(false);
    const [deleteAlertObj, setDeleteAlertObj] = useState<boolean>(false);
    const [deleteIndexName, setDeleteIndexName] = useState<string>('');
    const [deleteObjIndex, setDeleteObjIndex] = useState<string>('');

    const [openPublishForm, setOpenPublishForm] = useState<boolean>(false);
    const [frameworkData, setFrameworkData] = useState<FrameworkData | null>(null);

    // useEffect(() => {
    //     if (frameworkDraftData) {
    //         setFrameworkName(frameworkDraftData?.frameworkName || '');
    //         setOwner(frameworkDraftData?.owners || []);
    //         setDate(frameworkDraftData?.effectiveDate || undefined);
    //         setVersion(frameworkDraftData?.version || '');
    //         setFrameworkDescription(frameworkDraftData?.description || '');
    //         setPolicyControls(frameworkDraftData?.controls || []);
    //     }
    // }, [frameworkDraftData])

    useEffect(() => {
        if (frameworkDraftData) {
            setFrameworkName(frameworkDraftData.frameworkName || '');
            setOwner(frameworkDraftData.owners || []);
            setDate(frameworkDraftData.effectiveDate || undefined);
            setVersion(frameworkDraftData.version || '');
            setFrameworkDescription(frameworkDraftData.description || '');
            setPolicyControls(
                (frameworkDraftData.controls || []).map((control) => ({
                    ...control,
                    indexName: control.indexName || crypto.randomUUID(),
                    controlObjectives: (control.controlObjectives || []).map((objective) => ({
                        ...objective,
                        objectiveIndex: objective.objectiveIndex || crypto.randomUUID(),
                    })),
                }))
            );
        } else {
            // Clear form on create/new mode
            setFrameworkName('');
            setOwner([]);
            setDate(undefined);
            setVersion('');
            setFrameworkDescription('');
            setPolicyControls([]);
        }
    }, [frameworkDraftData]);
    // Function to add a new policy control

    const toggleSelect = (value: string) => {
        setOwner((prev) =>
            prev.includes(value)
                ? prev.filter((v) => v !== value)
                : [...prev, value]
        )
    }

    const addPolicyControl = useCallback(() => {
        const newControl: PolicyControl = {
            indexName: crypto.randomUUID(),
            controlName: "",
            policyId: "",
            isEditingName: false,
            type: "Control",
            controlDescription: "",
            controlObjectives: [
                {
                    objectiveName: "",
                    objectiveIndex: crypto.randomUUID(),
                    objectiveDescription: "",
                    objectiveId: ""
                },
            ],
        };
        setPolicyControls((prevControls) => [...prevControls, newControl]);
        setExpandedControls(prev => [...prev, newControl.indexName]);
    }, []);

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


    const handleDraftSave = async () => {
        if (!frameworkName.trim()) {
            setSaveValidationMessage("Framework name is required.");
            setOpenSaveAlertBox(true);
            return;
        }
        if (!owner.length) {
            setSaveValidationMessage("Framework Owner is required.");
            setOpenSaveAlertBox(true);
            return;
        }

        if (!frameworkDescription.trim()) {
            setSaveValidationMessage("Framework Description name is required.");
            setOpenSaveAlertBox(true);
            return;
        }
        const profileData = await getProfileData();
        const draftFormatData = {
            frameworkName: frameworkName,
            description: frameworkDescription,
            owners: owner,
            version: version,
            frameworkId: frameworkDraftData ? frameworkDraftData.frameworkId : crypto.randomUUID(),
            lastUpdatedOn: new Date(),
            effectiveDate: date,
            currentAccountId: frameworkDraftData ? frameworkDraftData.currentAccountId : profileData.USER_ID,
            saveAsDraft: true,
            controls: policyControls.map((control) => ({
                controlName: control.controlName,
                policyId: control.policyId,
                type: control.type,
                controlDescription: control.controlDescription,
                indexName: control.indexName,
                controlObjectives: control.controlObjectives.map((obj) => ({
                    objectiveName: obj.objectiveName,
                    objectiveDescription: obj.objectiveDescription,
                    objectiveId: obj.objectiveId,
                    objectiveIndex: obj.objectiveIndex
                })),
            })),
        };

        console.log("Ready to save:", draftFormatData);
        if (frameworkDraftData && !fromUploadFile) {
            const draftSavedInstance = await getMyInstancesV2({
                processName: "Framework Draft Save",
                predefinedFilters: { taskName: "Edit Framework Draft" },
                // mongoWhereClause: `this.Data.currentAccountId =="${frameworkDraftData.currentAccountId}" && this.Data.saveAsDraft ==${true}`,
                mongoWhereClause: `this.Data.frameworkId =="${frameworkDraftData.frameworkId}"`,
            })
            const draftInstanceTaskId = draftSavedInstance[0]?.taskId;

            await invokeAction({
                data: draftFormatData,
                taskId: draftInstanceTaskId,
                transitionName: 'Update Edit',
                processInstanceIdentifierField: "frameworkId"
            })

        } else {
            const processId = await mapProcessName({ processName: "Framework Draft Save" });
            await startProcessV2({
                processId,
                data: draftFormatData,
                processIdentifierFields: "frameworkId",
            });

        }

        setOpen(false);
        router.refresh();

    }

    // Function to handle form submission
    const handleSubmit = async () => {
        if (!frameworkName.trim()) {
            setSaveValidationMessage("Framework name is required.")
            setOpenSaveAlertBox(true);
            return;
        }
        if (!owner.length) {
            setSaveValidationMessage("Framework Owner is required.")
            setOpenSaveAlertBox(true);
            return;
        }

        if (!date) {
            setSaveValidationMessage("Effective Date is required.")
            setOpenSaveAlertBox(true);
            return;
        }

        if (!frameworkDescription.trim()) {
            setSaveValidationMessage("Framework Description name is required.")
            setOpenSaveAlertBox(true);
            return;
        }

        for (const control of policyControls) {
            const controlName = control.controlName
            if (
                !controlName ||
                !control.policyId ||
                !control.type
                // ||
                // !control.controlDescription
            ) {
                setSaveValidationMessage("Please fill all required control fields.")
                setOpenSaveAlertBox(true);
                return;
            }

            // const seenObjectives = new Set<string>();

            for (const obj of control.controlObjectives) {
                const objName = obj.objectiveName;
                if (
                    !objName ||
                    // !obj.objectiveDescription ||
                    !obj.objectiveId
                ) {
                    setSaveValidationMessage(`Please fill all required objective fields under ${controlName}`)
                    setOpenSaveAlertBox(true);
                    return;
                }

                // if (seenObjectives.has(objName)) {
                //     setSaveValidationMessage(`Duplicate objective "${objName}" found under the same control.`)
                //     setOpenSaveAlertBox(true);
                //     return;
                // }
                // seenObjectives.add(objName);
            }
        }

        const saveFormatData = {
            frameworkName: frameworkName,
            description: frameworkDescription,
            owners: owner,
            version: version,
            frameworkId: frameworkDraftData ? frameworkDraftData.frameworkId : crypto.randomUUID(),
            lastUpdatedOn: new Date(),
            effectiveDate: date,
            controls: policyControls.map((control) => ({
                controlName: control.controlName,
                policyIndex: control.policyId,
                type: control.type,
                controlDescription: control.controlDescription,
                controlObjectives: control.controlObjectives.map((obj) => ({
                    objectiveName: obj.objectiveName,
                    objectiveDescription: obj.objectiveDescription,
                    objectiveIndex: obj.objectiveId,
                })),
            })),
        };

        console.log("Ready to save:", saveFormatData);

        setFrameworkData(saveFormatData);
        setOpenPublishForm(true);

        // const processId = await mapProcessName({ processName: "Control Objectives", });
        // await startProcessV2({
        //     processId,
        //     data: saveFormatData,
        //     processIdentifierFields: "frameworkId",
        // });

        // setOpen(false);
        // router.refresh();
    };


    // Function to add a control objective to a policy control
    const addControlObjective = (controlId: string) => {
        const newObjective: ControlObjective = {
            objectiveName: "",
            objectiveIndex: crypto.randomUUID(),
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

    const filteredControls = useMemo(() => {
        const search = searchQuery.toLowerCase();
        return policyControls?.filter(control =>
            control.controlName.toLowerCase().includes(search) ||
            control.policyId.toString().toLowerCase().includes(search) ||
            control.type.toLowerCase().includes(search) ||
            control.controlDescription.toLowerCase().includes(search) ||
            control.controlObjectives.some(objective =>
                objective.objectiveName.toLowerCase().includes(search) ||
                objective.objectiveId.toString().toLowerCase().includes(search) ||
                objective.objectiveDescription.toLowerCase().includes(search)
            )
        );
    }, [policyControls, searchQuery]);

    return (
        <>
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="!max-w-none !w-screen !h-screen p-6 pt-4 flex flex-col">
                    <DialogHeader>
                        <DialogTitle>
                            Framework Creation
                        </DialogTitle>
                    </DialogHeader>
                    <SaveAlertBox openAlertBox={openSaveAlertBox} setOpenAlertBox={setOpenSaveAlertBox} message={saveValidationMessage} />
                    <div className="grid grid-cols-[3fr_9fr] gap-4 overflow-auto h-full">
                        <div className="overflow-y-auto pr-4 h-full  border-muted bg-card-new p-4">
                            <div className='flex flex-row gap-3 mb-4'>
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
                            </div>
                            <div className='flex flex-row gap-3 mb-4'>
                                <div className='flex-1'>
                                    <label htmlFor="frameworkName" className="block text-sm font-medium text-gray-300 mb-1" >
                                        Framework Owner
                                    </label>
                                    <Popover open={comboBoxOpen} onOpenChange={setComboBoxOpen}>
                                        <PopoverTrigger asChild>
                                            <Button variant="outline" role="combobox" className="w-full justify-between">
                                                <div className="w-full flex flex-wrap gap-2 text-left">
                                                    {owner.length > 0 ? (
                                                        <>
                                                            {owner.slice(0, 2).map((value) => {
                                                                const label = userMap?.find((u) => u.value === value)?.label
                                                                return (
                                                                    <Badge key={value} className="flex items-center gap-1">
                                                                        {label}
                                                                        {/* <CircleX
                                                                    className="h-4 w-4 cursor-pointer"
                                                                    onClick={(e) => {
                                                                        e.stopPropagation()
                                                                        toggleSelect(value)
                                                                    }}
                                                                /> */}
                                                                    </Badge>
                                                                )
                                                            })}
                                                            {owner.length > 2 && (
                                                                <TooltipProvider>
                                                                    <Tooltip>
                                                                        <TooltipTrigger asChild>
                                                                            <Badge className="cursor-pointer">+{owner.length - 2}</Badge>
                                                                        </TooltipTrigger>
                                                                        <TooltipContent side="top" className="bg-black text-white rounded-md px-3 py-1 text-sm">
                                                                            {owner
                                                                                .slice(2)
                                                                                .map((value) => userMap?.find((u) => u.value === value)?.label)
                                                                                .join(", ")}
                                                                        </TooltipContent>
                                                                    </Tooltip>
                                                                </TooltipProvider>
                                                            )}
                                                        </>
                                                    ) : (
                                                        "Select Owners"
                                                    )}
                                                </div>
                                                <ChevronsUpDown className="opacity-50" />
                                            </Button>
                                        </PopoverTrigger>

                                        <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
                                            <Command>
                                                <CommandInput placeholder="Search user" className="h-9" />
                                                <CommandList>
                                                    <CommandEmpty>No user found.</CommandEmpty>
                                                    <CommandGroup>
                                                        {userMap?.map((user) => (
                                                            <CommandItem
                                                                key={user.value}
                                                                value={user.label}
                                                                onSelect={() => toggleSelect(user.value)}
                                                            >
                                                                {user.label}
                                                                <Check
                                                                    className={cn(
                                                                        "ml-auto",
                                                                        owner.includes(user.value) ? "opacity-100" : "opacity-0"
                                                                    )}
                                                                />
                                                            </CommandItem>
                                                        ))}
                                                    </CommandGroup>
                                                </CommandList>
                                            </Command>
                                        </PopoverContent>
                                    </Popover>
                                </div>
                            </div>

                            <div className='flex flex-row gap-3 mb-4'>
                                <div className='flex-1'>
                                    <label htmlFor="frameworkName" className="block text-sm font-medium text-gray-300 mb-1" >
                                        Effective Date
                                    </label>

                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Button
                                                variant={"outline"}
                                                className={cn(
                                                    "w-full justify-start text-left font-normal",
                                                    !date && "text-muted-foreground"
                                                )}
                                            >
                                                <CalendarIcon className="mr-2 h-4 w-4" />
                                                {date ? format(date, SAVE_DATE_FORMAT_GRC) : <span>Pick Effective date</span>}
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-full p-0">
                                            <Calendar
                                                mode="single"
                                                selected={date}
                                                onSelect={setDate}
                                                initialFocus
                                            />
                                        </PopoverContent>
                                    </Popover>
                                </div>
                            </div>
                            <div className='flex flex-row gap-3 mb-4'>
                                <div className='flex-1'>
                                    <label htmlFor="version" className="block text-sm font-medium text-gray-300 mb-1" >
                                        Version
                                    </label>
                                    < Input
                                        id="version"
                                        value={version}
                                        onChange={(e) => setVersion(e.target.value)}
                                        placeholder="Enter Version"
                                    />
                                </div>

                            </div>

                            <div className='flex flex-row gap-3 mb-4'>
                                <div className='flex-1'>
                                    <label htmlFor="frameworDescription" className="block text-sm font-medium text-gray-300 mb-1" >
                                        Framework Description
                                    </label>
                                    < Textarea
                                        id="frameworDescription"
                                        className='h-40'
                                        value={frameworkDescription}
                                        onChange={(e) => setFrameworkDescription(e.target.value)}
                                        placeholder="Enter Framework Description"
                                    />
                                </div>

                            </div>
                        </div>


                        <div className="overflow-y-hidden pl-4 border-1 border-muted h-full border-l border-white">
                            <div className='flex flex-row gap-3'>
                                <div className='flex-1'>
                                    <Input
                                        placeholder="Search"
                                        className="bg-gray-800 text-white border-gray-700 w-full"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                    />
                                </div>
                                {/* Add Policy Control Button */}
                                <div className="mb-6 ml-auto">
                                    <div className='flex flex-row gap-3'>
                                        {/* Layout Toggle */}
                                        <IconButtonWithTooltip
                                            tooltipContent={showObjectivesInline ? "Show as Cards" : "Show Inline"}
                                            variant="outline"
                                            size="icon"
                                            onClick={() => setShowObjectivesInline(prev => !prev)}
                                        >
                                            <LayoutList className="h-4 w-4" />
                                        </IconButtonWithTooltip>

                                        <TextButtonWithTooltip
                                            tooltipContent={'Add Control/Clause'}
                                            onClick={addPolicyControl}
                                        >
                                            <Plus className="mr-2 h-4 w-4" /> Add Control/Clause
                                        </TextButtonWithTooltip>

                                    </div>
                                </div>
                            </div>
                            <div className='flex flex-col gap-3 h-[90%] overflow-y-auto'>
                                {/* Policy Controls */}
                                <AnimatePresence>
                                    {
                                        filteredControls?.map((control, index) => (
                                            <motion.div
                                                key={control.indexName}
                                                className='z-10'
                                            >
                                                <Card className="bg-gray-900 border-gray-700 mb-4 group" >
                                                    <CardHeader>
                                                        <CardTitle className="text-lg text-white flex items-center justify-between" >
                                                            <div className="flex items-center gap-2" >
                                                                <GripVertical className="w-4 h-4 text-gray-500 group-hover:text-gray-300 transition-colors" />
                                                                {
                                                                    control.isEditingName ? (
                                                                        <Input
                                                                            value={control.controlName}
                                                                            onChange={(e) =>
                                                                                updatePolicyControl(control.indexName, {
                                                                                    controlName: e.target.value,
                                                                                })
                                                                            }
                                                                            placeholder="Name"
                                                                            className="bg-gray-800 text-white border-gray-700 w-48"
                                                                        />
                                                                    ) : (
                                                                        <span className="cursor-pointer" onClick={() => toggleEditName(control.indexName)}>
                                                                            {control.controlName || "Name"}
                                                                            {control.controlObjectives.length > 0 && (
                                                                                <Badge className="ml-2 bg-blue-600 text-white text-xs px-2 py-0.5 rounded-full">
                                                                                    {control.controlObjectives.length} Objectives
                                                                                </Badge>
                                                                            )}
                                                                        </span>
                                                                    )
                                                                }
                                                            </div>
                                                            <div className="flex  gap-3" >
                                                                <div className='flex flex-col' >
                                                                    <label className="block text-xs font-medium text-gray-400 mb-1" >Type </label>
                                                                    < Select
                                                                        value={control.type}
                                                                        onValueChange={(value) =>
                                                                            updatePolicyControl(control.indexName, {
                                                                                type: value,
                                                                            })
                                                                        }
                                                                    >
                                                                        <SelectTrigger className="bg-gray-700 text-white border-gray-600 w-48" >
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
                                                                    <span className="block text-xs font-medium text-gray-400" > Index </span>
                                                                    < Input
                                                                        value={control.policyId}
                                                                        onChange={(e) =>
                                                                            updatePolicyControl(control.indexName, {
                                                                                policyId: e.target.value,
                                                                            })
                                                                        }
                                                                        placeholder="Index"
                                                                        className="bg-gray-800 text-white border-gray-700 w-48"

                                                                    />
                                                                </div>
                                                                <div className='self-end'>
                                                                    {
                                                                        control.isEditingName ? (
                                                                            <IconButtonWithTooltip
                                                                                tooltipContent={"Save Name"}
                                                                                variant="ghost"
                                                                                size="icon"
                                                                                onClick={() => toggleEditName(control.indexName)
                                                                                }
                                                                                // className="text-green-400 hover:text-green-300"
                                                                                className="text-green-400 hover:text-green-300 opacity-0 group-hover:opacity-100 transition-opacity"
                                                                            >
                                                                                <CheckCircle className="h-4 w-4" />
                                                                            </IconButtonWithTooltip>
                                                                        ) : (
                                                                            <IconButtonWithTooltip
                                                                                tooltipContent={"Edit Name"}
                                                                                variant="ghost"
                                                                                size="icon"
                                                                                onClick={() => toggleEditName(control.indexName)}
                                                                                // className="text-gray-400 hover:text-gray-300"
                                                                                className="text-gray-400 hover:text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity"
                                                                            >
                                                                                <Pencil className="h-4 w-4" />
                                                                            </IconButtonWithTooltip>
                                                                        )
                                                                    }
                                                                    < IconButtonWithTooltip
                                                                        tooltipContent={`Delete Control Policy`}
                                                                        variant="ghost"
                                                                        size="icon"
                                                                        onClick={() => { setDeleteIndexName(control.indexName), setDeleteAlertPolicy(true) }}
                                                                        // className="text-red-400 hover:text-red-300 hover:bg-red-500/20"
                                                                        className="text-red-400 hover:text-red-300 hover:bg-red-500/20 opacity-0 group-hover:opacity-100 transition-opacity"
                                                                    >
                                                                        <Trash2 className="h-4 w-4" />
                                                                    </IconButtonWithTooltip>
                                                                    <>
                                                                        <DeletePoliciesObj
                                                                            openAlertBox={deleteAlertPolicy}
                                                                            setOpenAlertBox={setDeleteAlertPolicy}
                                                                            message={'Are you sure you want to delete this Control/Clause?'}
                                                                            indexName={deleteIndexName}
                                                                            deleteFn={deletePolicyControl}
                                                                        />
                                                                    </>
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
                                                                </div>
                                                            </div>
                                                        </CardTitle>
                                                    </CardHeader>

                                                    < CardContent className={cn('space-y-4', isControlExpanded(control.indexName) ? 'block' : 'hidden')}>
                                                        <div className='flex flex-col gap-1' >
                                                            <span className="block text-xs font-medium text-gray-400" >Descripton</span>
                                                            < TextArea
                                                                value={control.controlDescription}
                                                                onChange={(e) =>
                                                                    updatePolicyControl(control.indexName, {
                                                                        controlDescription: e.target.value,
                                                                    })
                                                                }
                                                                placeholder="Description"
                                                                className="!bg-gray-800 !text-white !border-gray-600 !h-[60px] !resize-none !w-full"
                                                            />
                                                        </div>
                                                        <div className="grid grid-cols-1 gap-4" >

                                                            {/* Control Objectives Section */}

                                                            <div>
                                                                <label className="block text-sm font-medium text-gray-300 mb-2" >
                                                                    Objectives
                                                                </label>
                                                                {
                                                                    control.controlObjectives?.map((objective, objectiveIndex) =>
                                                                        showObjectivesInline ? (
                                                                            <div key={objective.objectiveIndex} className="mb-2 flex items-start gap-4 border-b border-gray-700 pb-2 last:border-0" >
                                                                                <div className="flex-1" >
                                                                                    <label className="block text-xs font-medium text-gray-400 mb-1" >Objective Name </label>
                                                                                    < Input
                                                                                        value={objective.objectiveName}
                                                                                        onChange={(e) =>
                                                                                            updateControlObjective(control.indexName, objective.objectiveIndex, {
                                                                                                objectiveName: e.target.value,
                                                                                            })
                                                                                        }
                                                                                        placeholder="Enter Objective Name"
                                                                                        className="bg-gray-700 text-white border-gray-600"
                                                                                    />
                                                                                </div>
                                                                                < div className="flex-1" >
                                                                                    <label className="block text-xs font-medium text-gray-400 mb-1" >Objective Index</label>
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
                                                                                    <IconButtonWithTooltip
                                                                                        tooltipContent={'Delete Control Objecive'}
                                                                                        variant="ghost"
                                                                                        size="icon"
                                                                                        onClick={() => { setDeleteIndexName(control.indexName), setDeleteObjIndex(objective.objectiveIndex), setDeleteAlertObj(true) }}
                                                                                        className="text-gray-400 hover:text-red-400"
                                                                                    >
                                                                                        <XCircle className="h-4 w-4" />
                                                                                    </IconButtonWithTooltip>
                                                                                </div>
                                                                                <>
                                                                                    <DeleteObjCtrl
                                                                                        openAlertBox={deleteAlertObj}
                                                                                        setOpenAlertBox={setDeleteAlertObj}
                                                                                        message={'Are you sure you want to delete this Objective?'}
                                                                                        indexName={deleteIndexName}
                                                                                        objIndexName={deleteObjIndex}
                                                                                        deleteFn={removeControlObjective}
                                                                                    />
                                                                                </>
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
                                                                                    < IconButtonWithTooltip
                                                                                        tooltipContent={'Delete Control Objecive'}
                                                                                        variant="ghost"
                                                                                        size="icon"
                                                                                        onClick={() => { setDeleteIndexName(control.indexName), setDeleteObjIndex(objective.objectiveIndex), setDeleteAlertObj(true) }}
                                                                                        className="text-gray-400 hover:text-red-400"
                                                                                    >
                                                                                        <XCircle className="h-4 w-4" />
                                                                                    </IconButtonWithTooltip>
                                                                                    <>
                                                                                        <DeleteObjCtrl
                                                                                            openAlertBox={deleteAlertObj}
                                                                                            setOpenAlertBox={setDeleteAlertObj}
                                                                                            message={'Are you sure you want to delete this Objective Policy?'}
                                                                                            indexName={deleteIndexName}
                                                                                            objIndexName={deleteObjIndex}
                                                                                            deleteFn={removeControlObjective}
                                                                                        />
                                                                                    </>
                                                                                </div>
                                                                                <div className="flex items-center gap-2 w-[300px] px-4 py-2 text-white font-medium" title={objective.objectiveName || "Objective"}>
                                                                                    <span className="truncate block whitespace-nowrap overflow-hidden text-ellipsis flex-1">
                                                                                        {objective.objectiveName || "Objective"}
                                                                                    </span>
                                                                                    {isObjectiveExpanded(control.indexName, objective.objectiveIndex) && (
                                                                                        <CheckCircle className="h-5 w-5 text-green-400 flex-shrink-0" />
                                                                                    )}
                                                                                </div>
                                                                                <div className={cn("grid grid-cols-2 gap-4 pt-2 px-4 pb-4 transition-all duration-300", isObjectiveExpanded(control.indexName, objective.objectiveIndex) ? "opacity-100" : "opacity-0 pointer-events-none")}>
                                                                                    <div>
                                                                                        <label className="block text-xs font-medium text-gray-400 mb-1" >Objective Name </label>
                                                                                        < Input
                                                                                            value={objective.objectiveName}
                                                                                            onChange={(e) =>
                                                                                                updateControlObjective(control.indexName, objective.objectiveIndex, {
                                                                                                    objectiveName: e.target.value,
                                                                                                })
                                                                                            }
                                                                                            placeholder="Enter Objective Name"
                                                                                            className="bg-gray-700 text-white border-gray-600"
                                                                                        />
                                                                                    </div>
                                                                                    < div >
                                                                                        <label className="block text-xs font-medium text-gray-400 mb-1" >Objective Index </label>
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
                        </div>
                    </div>
                    {/* Submit Button */}
                    <DialogFooter>
                        <div className="flex flex-row gap-3" >
                            <Button
                                onClick={handleDraftSave}
                                variant='outline'
                            // className="bg-green-500/20 text-green-400 hover:bg-green-500/30 hover:text-green-300"
                            >
                                Save as Draft
                            </Button>
                            <Button
                                onClick={handleSubmit}
                                className="bg-green-500/20 text-green-400 hover:bg-green-500/30 hover:text-green-300"
                            >
                                Preview and Publish
                            </Button>
                        </div>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {
                openPublishForm && (
                    <PublishFramework frameworkData={frameworkData} openPublishForm={openPublishForm} setOpenPublishForm={setOpenPublishForm} userMap={userMap} setOpen={setOpen} />
                )
            }
        </>
    )
}
