'use client'
import React, { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shadcn/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/shadcn/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/shadcn/ui/alert-dialog";
import { Button } from "@/shadcn/ui/button";
import { toast } from "sonner";
import { Search, Settings2, Plus } from "lucide-react";
import { Input } from "@/shadcn/ui/input";
import { motion } from "framer-motion";
import { FrameworkDetails, FrameworkEntry, InputData, OutputData } from '../types/framework';
import { v4 } from 'uuid';
import { FrameworkDetailsForm } from './framework-details-form';
import { AddEntryForm } from './add-entry-form';
import { EntryList } from './entry-list';
import { getMyInstancesV2, invokeAction, mapProcessName, startProcessV2 } from '@/ikon/utils/api/processRuntimeService';
import { useRouter } from 'next/navigation';
import { AlertBox } from './alertBox';
import { getProfileData } from '@/ikon/utils/actions/auth';
import ActionMessageModal from './actionMessageModal';

export default function CustomFrameworkCreationForm({
    open,
    setOpen,
    allUsers,
    selectedFramework,
    viewselectedFramework,
    reviewselectedFramework
}: {
    open: boolean,
    setOpen: React.Dispatch<React.SetStateAction<boolean>>,
    allUsers: { value: string, label: string }[],
    selectedFramework?: any,
    viewselectedFramework?: any
    reviewselectedFramework?: any
}) {
    const router = useRouter();
    const [entries, setEntries] = useState<FrameworkEntry[]>([
        // {
        //     id: "1",
        //     index: "1",
        //     title: "Risk Assessment",
        //     description: "Processes for identifying and evaluating potential risks to the organization.",
        //     parentId: null,
        // },
        // {
        //     id: "2",
        //     index: "1.1",
        //     title: "Threat Identification",
        //     description: "Methods for identifying potential threats to security and operations.",
        //     parentId: "1",
        // },
        // {
        //     id: "3",
        //     index: "1.2",
        //     title: "Vulnerability Assessment",
        //     description: "Procedures for identifying and evaluating system vulnerabilities.",
        //     parentId: "1",
        // },
        // {
        //     id: "4",
        //     index: "2",
        //     title: "Compliance Management",
        //     description: "Processes for ensuring adherence to regulatory requirements and internal policies.",
        //     parentId: null,
        // },
    ]);

    console.log(selectedFramework);

    const [frameworkDetails, setFrameworkDetails] = useState<FrameworkDetails>({
        // name: "GRC Framework",
        // description: "Comprehensive Governance, Risk, and Compliance Framework",
        // version: "1.0.0",
        // owners: ["John Doe", "Jane Smith"],
        // pricing: {
        //     type: "free"
        // },
        // lastUpdated: new Date().toISOString(),
        name: "",
        description: "",
        version: "",
        owners: [],
        pricing: {
            type: "free"
        },
        responsibilityMatrixExists: false,
        soaExists: false,
        lastUpdated: new Date().toISOString(),
    });


    const [currentEntry, setCurrentEntry] = useState<FrameworkEntry | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
    const [isAddEntryDialogOpen, setIsAddEntryDialogOpen] = useState(false);
    const [deleteEntryId, setDeleteEntryId] = useState<string | null>(null);
    const [isAlertDialogOpen, setIsAlertDialogOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedEntries, setSelectedEntries] = useState<string[]>([]);
    const [parentsDropdownEntry, setParentDropdownEntry] = useState<FrameworkEntry[]>([]);
    const [alertBox, setAlertBox] = useState<boolean>(false);
    const [saveValidationMessage, setSaveValidationMessage] = useState<string>('');

    const [actionFn, setActionFn] = useState<null | ((actionMessage: string) => void)>(null)
    const [openMessageModal, setOpenMessageModal] = useState<boolean>(false);

    useEffect(() => {

        if (reviewselectedFramework) {
            setFrameworkDetails({
                name: reviewselectedFramework?.title || "",
                description: reviewselectedFramework?.description || "",
                version: reviewselectedFramework?.version || "",
                lastUpdated: new Date().toISOString(),
                owners: reviewselectedFramework?.owners || [],
                pricing: reviewselectedFramework?.pricing || {
                    type: "free"
                },
                responsibilityMatrixExists: reviewselectedFramework?.responsibilityMatrixExists || false,
                soaExists: reviewselectedFramework?.soaExists || false,
            })
            let flatTasks: FrameworkEntry[] = [];
            if (reviewselectedFramework) {
                const childIds = new Set(
                    reviewselectedFramework.parentEntries.flatMap((p) => p.childrenArray)
                );

                flatTasks = [];

                for (const parent of reviewselectedFramework.parentEntries) {
                    for (const childId of parent.childrenArray) {
                        const child = reviewselectedFramework.entries[childId];
                        flatTasks.push({
                            id: child.id,
                            index: child.index,
                            title: child.title,
                            description: child.description,
                            parentId: child.parentId,
                            treatAsParent: child.treatAsParent,
                        });
                    }

                    if (!childIds.has(parent.id)) {
                        flatTasks.push({
                            id: parent.id,
                            index: parent.index,
                            title: parent.title,
                            description: parent.description,
                            parentId: parent.parentId,
                            treatAsParent: parent.treatAsParent,
                        });
                    }
                }
            }

            const parentTasks: FrameworkEntry[] = reviewselectedFramework?.parentEntries.flatMap(parent => {
                return [
                    {
                        id: parent.id,
                        index: parent.index,
                        title: parent.title,
                        description: parent.description,
                        parentId: parent.parentId,
                        treatAsParent: parent.treatAsParent
                    },
                ]
            })

            setParentDropdownEntry(parentTasks)
            setEntries(flatTasks);
        }

        if (viewselectedFramework) {
            setFrameworkDetails({
                name: viewselectedFramework?.title || "",
                description: viewselectedFramework?.description || "",
                version: viewselectedFramework?.version || "",
                lastUpdated: new Date().toISOString(),
                owners: viewselectedFramework?.owners || [],
                pricing: viewselectedFramework?.pricing || {
                    type: "free"
                },
                responsibilityMatrixExists: viewselectedFramework?.responsibilityMatrixExists || false,
                soaExists: viewselectedFramework?.soaExists || false,
            })
            let flatTasks: FrameworkEntry[] = [];
            if (viewselectedFramework) {
                const childIds = new Set(
                    viewselectedFramework.parentEntries.flatMap((p) => p.childrenArray)
                );

                flatTasks = [];

                for (const parent of viewselectedFramework.parentEntries) {
                    for (const childId of parent.childrenArray) {
                        const child = viewselectedFramework.entries[childId];
                        flatTasks.push({
                            id: child.id,
                            index: child.index,
                            title: child.title,
                            description: child.description,
                            parentId: child.parentId,
                            treatAsParent: child.treatAsParent,
                        });
                    }

                    if (!childIds.has(parent.id)) {
                        flatTasks.push({
                            id: parent.id,
                            index: parent.index,
                            title: parent.title,
                            description: parent.description,
                            parentId: parent.parentId,
                            treatAsParent: parent.treatAsParent,
                        });
                    }
                }
            }

            const parentTasks: FrameworkEntry[] = viewselectedFramework?.parentEntries.flatMap(parent => {
                return [
                    {
                        id: parent.id,
                        index: parent.index,
                        title: parent.title,
                        description: parent.description,
                        parentId: parent.parentId,
                        treatAsParent: parent.treatAsParent
                    },
                ]
            })

            setParentDropdownEntry(parentTasks)
            setEntries(flatTasks);
        }

        if (selectedFramework) {
            setFrameworkDetails({
                name: selectedFramework?.title || "",
                description: selectedFramework?.description || "",
                version: selectedFramework?.version || "",
                lastUpdated: new Date().toISOString(),
                owners: selectedFramework?.owners || [],
                pricing: selectedFramework?.pricing || {
                    type: "free"
                },
                responsibilityMatrixExists: selectedFramework?.responsibilityMatrixExists || false,
                soaExists: selectedFramework?.soaExists || false,
            })

            // const flatTasks: FrameworkEntry[] = selectedFramework?.parentEntries.flatMap(parent => {
            //     const children = parent.childrenArray.map(childId => {
            //         const child = selectedFramework.entries[childId];
            //         return {
            //             id: child.id,
            //             index: child.index,
            //             title: child.title,
            //             description: child.description,
            //             parentId: child.parentId,
            //             treatAsParent: child.treatAsParent
            //         };
            //     });

            //     return [
            //         {
            //             id: parent.id,
            //             index: parent.index,
            //             title: parent.title,
            //             description: parent.description,
            //             parentId: parent.parentId,
            //             treatAsParent: parent.treatAsParent
            //         },
            //         ...children,
            //     ];
            // }) || [];

            let flatTasks: FrameworkEntry[] = [];

            if (selectedFramework) {
                const childIds = new Set(
                    selectedFramework.parentEntries.flatMap((p) => p.childrenArray)
                );

                flatTasks = [];

                for (const parent of selectedFramework.parentEntries) {
                    for (const childId of parent.childrenArray) {
                        const child = selectedFramework.entries[childId];
                        flatTasks.push({
                            id: child.id,
                            index: child.index,
                            title: child.title,
                            description: child.description,
                            // parentId: child.parentId,
                            parentId: child.parentId === "" ? null : child.parentId,
                            treatAsParent: child.treatAsParent,
                        });

                    }

                    if (!childIds.has(parent.id)) {
                        flatTasks.push({
                            id: parent.id,
                            index: parent.index,
                            title: parent.title,
                            description: parent.description,
                            // parentId: parent.parentId,
                            parentId: parent.parentId === "" ? null : parent.parentId,
                            treatAsParent: parent.treatAsParent,
                        });
                    }
                }
            }

            const parentTasks: FrameworkEntry[] = selectedFramework?.parentEntries.flatMap(parent => {
                return [
                    {
                        id: parent.id,
                        index: parent.index,
                        title: parent.title,
                        description: parent.description,
                        // parentId: parent.parentId,
                        parentId: parent.parentId === "" ? null : parent.parentId,
                        treatAsParent: parent.treatAsParent
                    },
                ]
            })

            setParentDropdownEntry(parentTasks)
            setEntries(flatTasks);
        }
    }, [])


    function handleAddEntry(values: Omit<FrameworkEntry, "id">) {
        const newEntry: FrameworkEntry = {
            ...values,
            id: v4(),
        };

        if (values.treatAsParent) {
            setParentDropdownEntry([...parentsDropdownEntry, newEntry]);
        }

        setEntries([...entries, newEntry]);
        setIsAddEntryDialogOpen(false);
        toast.success("Entry added successfully", { duration: 4000 });
    }

    function handleEditEntry(entry: FrameworkEntry) {
        setCurrentEntry(entry);
        setIsDialogOpen(true);
    }

    // function handleUpdateEntry(values: Omit<FrameworkEntry, "id">) {
    //     if (!currentEntry) return;

    //     setEntries(
    //         entries.map((entry) =>
    //             entry.id === currentEntry.id
    //                 ? { ...values, id: currentEntry.id }
    //                 : entry
    //         )
    //     );

    //     setCurrentEntry(null);
    //     setIsDialogOpen(false);
    //     toast.success("Entry updated successfully", { duration: 4000 });
    // }

    function handleUpdateEntry(values: Omit<FrameworkEntry, "id">) {
        if (!currentEntry) return;

        const updatedEntry = { ...values, id: currentEntry.id };

        const updatedEntries = entries.map((entry) =>
            entry.id === currentEntry.id ? updatedEntry : entry
        );
        setEntries(updatedEntries);

        setParentDropdownEntry((prev) => {
            const wasTreatAsParent = currentEntry.treatAsParent;
            const isNowTreatAsParent = values.treatAsParent;
            const isInDropdown = prev.some((e) => e.id === currentEntry.id);

            let updatedList = prev.map((e) =>
                e.id === currentEntry.id ? updatedEntry : e
            );

            if (wasTreatAsParent !== isNowTreatAsParent) {
                if (isNowTreatAsParent && !isInDropdown) {
                    updatedList = [...updatedList, updatedEntry];
                } else if (!isNowTreatAsParent && isInDropdown) {
                    updatedList = updatedList.filter((e) => e.id !== currentEntry.id);
                }
            }

            return updatedList;
        });

        setCurrentEntry(null);
        setIsDialogOpen(false);
        toast.success("Entry updated successfully", { duration: 4000 });
    }


    function handleDeleteEntry(entryId: string) {
        setDeleteEntryId(entryId);
        setIsAlertDialogOpen(true);
    }

    function confirmDeleteEntry() {
        if (!deleteEntryId) return;

        const getChildIds = (parentId: string): string[] => {
            const childEntries = entries.filter((entry) => entry.parentId === parentId);
            const childIds = childEntries.map((entry) => entry.id);

            return [
                ...childIds,
                ...childIds.flatMap((childId) => getChildIds(childId)),
            ];
        };

        const childIds = getChildIds(deleteEntryId);
        const idsToDelete = [deleteEntryId, ...childIds];

        setEntries(entries.filter((entry) => !idsToDelete.includes(entry.id)));
        setParentDropdownEntry(parentsDropdownEntry.filter((parentEntry) => !idsToDelete.includes(parentEntry.id)));
        setDeleteEntryId(null);
        setIsAlertDialogOpen(false);

        toast.success(
            childIds.length > 0
                ? `Entry and ${childIds.length} child entries deleted`
                : "Entry deleted successfully"
            , { duration: 4000 }
        );
    }

    function handleMoveEntries(parentId: string | null) {
        setEntries(entries.map(entry =>
            selectedEntries.includes(entry.id)
                ? { ...entry, parentId }
                : entry
        ));
        setSelectedEntries([]);
        toast.success("Entries moved successfully", { duration: 4000 });
    }

    function handleUpdateFrameworkDetails(details: FrameworkDetails) {
        setFrameworkDetails(details);
        setIsDetailsDialogOpen(false);
        toast.success("Framework details updated successfully", { duration: 4000 });
    }

    // Filter entries based on search term
    const filteredEntries = searchTerm
        ? entries.filter(
            (entry) =>
                entry.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                entry.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                entry.index.includes(searchTerm)
        )
        : entries;


    function convertStructure(input: InputData): OutputData {
        const { frameworkDetails, entries } = input;
        console.log(frameworkDetails);

        const entryMap: Record<string, FrameworkEntry> = {};
        const parentEntries: (FrameworkEntry & { childrenArray: string[] })[] = [];
        for (const entry of entries) {
            entryMap[entry.id] = entry;
        }
        for (const entry of entries) {
            if (entry.treatAsParent) {
                const childrenArray = entries
                    .filter(child => child.parentId === entry.id)
                    .map(child => child.id);

                parentEntries.push({ ...entry, childrenArray });
            }
        }

        return {
            ...frameworkDetails,
            entries: entryMap,
            parentEntries
        };
    }

    async function handleDraftSave(actionMessage: string) {
        const inputFormat = {
            frameworkDetails: frameworkDetails,
            entries: entries
        };
        const outputFormat = convertStructure(inputFormat);
        const userDetails = await getProfileData();
        const baseLog = {
            createBy: userDetails.USER_NAME,
            createdAt: new Date(),
            message: actionMessage
        };
        const previousLog = selectedFramework?.activityLog || reviewselectedFramework?.activityLog || [];
        const saveFormat = {
            ...outputFormat,
            id: selectedFramework?.id || reviewselectedFramework?.id || v4(),
            title: outputFormat.name,
            category: "Security",
            score: 0,
            status: "draft",
            isFavorite: false,
            lastAccessed: outputFormat.lastUpdated,
            activityLog: [...previousLog, baseLog]
        };
        console.log(saveFormat);


        if (selectedFramework || reviewselectedFramework) {
            const frameworkInstance = await getMyInstancesV2({
                processName: "Framework Processes",
                predefinedFilters: { taskName: "Saved as Draft" },
                mongoWhereClause: `this.Data.id == '${saveFormat.id}'`
            })

            const taskId = frameworkInstance[0]?.taskId;

            await invokeAction({
                taskId: taskId,
                data: saveFormat,
                transitionName: "Save Draft",
                processInstanceIdentifierField: "id"
            })
        } else {
            const processId = await mapProcessName({ processName: "Framework Processes" });
            await startProcessV2({
                processId,
                data: saveFormat,
                processIdentifierFields: "id",
            });
        }
        setOpen(false);
        router.refresh();
    }

    async function handleReview(actionMessage: string) {
        if (!frameworkDetails.name.trim()) {
            setSaveValidationMessage("Framework name is required.")
            setAlertBox(true);
            return;
        }

        if (!frameworkDetails.description.trim()) {
            setSaveValidationMessage("Framework Description is required.")
            setAlertBox(true);
            return;
        }
        if (!frameworkDetails.owners.length) {
            setSaveValidationMessage("Framework Owners is required.")
            setAlertBox(true);
            return;
        }
        if (!frameworkDetails.version.trim()) {
            setSaveValidationMessage("Framework Version is required.")
            setAlertBox(true);
            return;
        }

        for (const entry of entries) {
            if (entry.parentId === null && entry.treatAsParent === false) {
                setSaveValidationMessage(`Entry with name ${entry.title} must be a child of some other entry or it should be set as parent entry.`)
                setAlertBox(true);
                return;
            }
        }

        const inputFormat = {
            frameworkDetails: frameworkDetails,
            entries: entries
        };
        const outputFormat = convertStructure(inputFormat);
        const userDetails = await getProfileData();
        const baseLog = {
            createBy: userDetails.USER_NAME,
            createdAt: new Date(),
            message: actionMessage
        };
        const previousLog = selectedFramework?.activityLog || reviewselectedFramework?.activityLog || [];

        const saveFormat = {
            ...outputFormat,
            id: selectedFramework?.id || reviewselectedFramework?.id || v4(),
            title: outputFormat.name,
            category: "Security",
            score: 0,
            status: "review",
            isFavorite: false,
            lastAccessed: outputFormat.lastUpdated,
            activityLog: [...previousLog, baseLog]
        };
        console.log(saveFormat);

        if (selectedFramework || reviewselectedFramework) {
            const frameworkInstance = await getMyInstancesV2({
                processName: "Framework Processes",
                predefinedFilters: { taskName: "Saved as Draft" },
                mongoWhereClause: `this.Data.id == '${saveFormat.id}'`
            })
            const taskId = frameworkInstance[0]?.taskId;
            await invokeAction({
                taskId: taskId,
                data: saveFormat,
                transitionName: "Save Draft",
                processInstanceIdentifierField: "id"
            })
        } else {
            const processId = await mapProcessName({ processName: "Framework Processes" });
            await startProcessV2({
                processId,
                data: saveFormat,
                processIdentifierFields: "id",
            });
        }


        setOpen(false);
        router.refresh();
    }

    async function handleSave(actionMessage: string) {
        if (!frameworkDetails.name.trim()) {
            setSaveValidationMessage("Framework name is required.")
            setAlertBox(true);
            return;
        }

        if (!frameworkDetails.description.trim()) {
            setSaveValidationMessage("Framework Description is required.")
            setAlertBox(true);
            return;
        }
        if (!frameworkDetails.owners.length) {
            setSaveValidationMessage("Framework Owners is required.")
            setAlertBox(true);
            return;
        }
        if (!frameworkDetails.version.trim()) {
            setSaveValidationMessage("Framework Version is required.")
            setAlertBox(true);
            return;
        }

        for (const entry of entries) {
            if (entry.parentId === null && entry.treatAsParent === false) {
                setSaveValidationMessage(`Entry with name ${entry.title} must be a child of some other entry or it should be set as parent entry.`)
                setAlertBox(true);
                return;
            }
        }

        const inputFormat = {
            frameworkDetails: frameworkDetails,
            entries: entries
        };
        const outputFormat = convertStructure(inputFormat);
        const userDetails = await getProfileData();
        const baseLog = {
            createBy: userDetails.USER_NAME,
            createdAt: new Date(),
            message: actionMessage
        };
        const previousLog = selectedFramework?.activityLog || reviewselectedFramework?.activityLog || [];
        const saveFormat = {
            ...outputFormat,
            id: selectedFramework?.id || reviewselectedFramework?.id || v4(),
            title: outputFormat.name,
            category: "Security",
            score: 0,
            status: "published",
            isFavorite: false,
            lastAccessed: outputFormat.lastUpdated,
            activityLog: [...previousLog, baseLog]
        };
        console.log(saveFormat);

        if (selectedFramework || reviewselectedFramework) {
            const frameworkInstance = await getMyInstancesV2({
                processName: "Framework Processes",
                predefinedFilters: { taskName: "Saved as Draft" },
                mongoWhereClause: `this.Data.id == '${saveFormat.id}'`
            })
            const taskId = frameworkInstance[0]?.taskId;
            await invokeAction({
                taskId: taskId,
                data: saveFormat,
                transitionName: "Published after Draft",
                processInstanceIdentifierField: "id"
            })
        } else {
            const processId = await mapProcessName({ processName: "Framework Processes" });
            await startProcessV2({
                processId,
                data: saveFormat,
                processIdentifierFields: "id",
            });
        }
        setOpen(false);
        router.refresh();
    }
    return (
        <>
            <Dialog open={open} onOpenChange={setOpen} >
                <DialogContent
                    onInteractOutside={(e) => e.preventDefault()}
                    className="!max-w-none !w-screen !h-screen p-6 pt-4 flex flex-col "
                >
                    <DialogHeader>
                        <DialogTitle>Framework Creation</DialogTitle>
                    </DialogHeader>
                    <div className='h-full'>
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                            className="mb-8"
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h1 className="text-3xl font-bold tracking-tight">{frameworkDetails?.name || 'Sample Framework Name'}</h1>
                                    <p className="text-muted-foreground mt-1">
                                        {frameworkDetails?.description || "Sample Framework Description"}
                                    </p>
                                </div>
                                {/* Remove button when view */}
                                {
                                    !viewselectedFramework &&
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="flex items-center gap-2"
                                        onClick={() => setIsDetailsDialogOpen(true)}
                                    >
                                        <Settings2 className="h-4 w-4" />
                                        Framework Settings
                                    </Button>
                                }
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <Card>
                                    <CardHeader className="py-4">
                                        <CardTitle className="text-sm font-medium">Version</CardTitle>
                                    </CardHeader>
                                    <CardContent className="py-0">
                                        <p className="text-2xl font-bold">{frameworkDetails?.version || "N/A"}</p>
                                    </CardContent>
                                </Card>
                                <Card>
                                    <CardHeader className="py-4">
                                        <CardTitle className="text-sm font-medium">Owners</CardTitle>
                                    </CardHeader>
                                    <CardContent className="py-0">
                                        <p className="text-2xl font-bold">{frameworkDetails.owners.length}</p>
                                    </CardContent>
                                </Card>
                                <Card>
                                    <CardHeader className="py-4">
                                        <CardTitle className="text-sm font-medium">Pricing</CardTitle>
                                    </CardHeader>
                                    <CardContent className="py-0">
                                        <p className="text-2xl font-bold capitalize">{frameworkDetails.pricing.type}</p>
                                    </CardContent>
                                </Card>
                            </div>
                        </motion.div>

                        <Dialog open={isDetailsDialogOpen} onOpenChange={setIsDetailsDialogOpen}>
                            <DialogContent className="sm:max-w-[600px]">
                                <DialogHeader>
                                    <DialogTitle>Framework Details</DialogTitle>
                                    <DialogDescription>
                                        Update the framework details and settings.
                                    </DialogDescription>
                                </DialogHeader>
                                <FrameworkDetailsForm
                                    initialValues={frameworkDetails}
                                    onSubmit={handleUpdateFrameworkDetails}
                                    allUsers={allUsers}
                                />
                            </DialogContent>
                        </Dialog>

                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                            <div className="relative w-full sm:w-auto">
                                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Search entries..."
                                    className="pl-8 w-full sm:w-[250px]"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>


                            {/* Remove when view */}
                            {
                                !viewselectedFramework &&
                                <div className="flex items-center gap-4">
                                    <Button
                                        variant="default"
                                        onClick={() => setIsAddEntryDialogOpen(true)}
                                        className="flex items-center gap-2"
                                    >
                                        <Plus className="h-4 w-4" />
                                        Add Entry
                                    </Button>
                                </div>
                            }


                            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                                <DialogContent className="sm:max-w-[600px]">
                                    <DialogHeader>
                                        <DialogTitle>Edit Framework Entry</DialogTitle>
                                        <DialogDescription>
                                            Update the details of the selected framework entry.
                                        </DialogDescription>
                                    </DialogHeader>
                                    {currentEntry && (
                                        <AddEntryForm
                                            entries={entries.filter((entry) => entry.id !== currentEntry.id)}
                                            onSubmit={handleUpdateEntry}
                                            initialValues={currentEntry}
                                            parentsDropdownEntry={parentsDropdownEntry}
                                        />
                                    )}
                                </DialogContent>
                            </Dialog>

                            <Dialog open={isAddEntryDialogOpen} onOpenChange={setIsAddEntryDialogOpen}>
                                <DialogContent className="sm:max-w-[600px]">
                                    <DialogHeader>
                                        <DialogTitle>Add Framework Entry</DialogTitle>
                                        <DialogDescription>
                                            Create a new entry in your governance framework
                                        </DialogDescription>
                                    </DialogHeader>
                                    <AddEntryForm entries={entries} onSubmit={handleAddEntry} parentsDropdownEntry={parentsDropdownEntry} />
                                </DialogContent>
                            </Dialog>

                            <AlertDialog open={isAlertDialogOpen} onOpenChange={setIsAlertDialogOpen}>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                        <AlertDialogDescription>
                                            This will delete the entry and all its children. This action
                                            cannot be undone.
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel onClick={() => setDeleteEntryId(null)}>
                                            Cancel
                                        </AlertDialogCancel>
                                        <AlertDialogAction onClick={confirmDeleteEntry}>
                                            Delete
                                        </AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        </div>

                        <EntryList
                            entries={filteredEntries}
                            selectedEntries={selectedEntries}
                            parentsDropdownEntry={parentsDropdownEntry}
                            onSelectEntry={(id) => {
                                setSelectedEntries(prev =>
                                    prev.includes(id)
                                        ? prev.filter(entryId => entryId !== id)
                                        : [...prev, id]
                                );
                            }}
                            onMoveEntries={handleMoveEntries}
                            onEdit={handleEditEntry}
                            onDelete={handleDeleteEntry}
                            viewselectedFramework={viewselectedFramework}
                        />
                    </div>

                    {/* Remove when view */}
                    {
                        !viewselectedFramework &&
                        <DialogFooter>
                            {
                                !reviewselectedFramework &&
                                <Button
                                    onClick={() => {
                                        setActionFn(() => handleDraftSave);
                                        setOpenMessageModal(true);
                                    }}
                                >
                                    Save as Draft
                                </Button>
                            }
                            {
                                reviewselectedFramework &&
                                <Button
                                    onClick={() => {
                                        setActionFn(() => handleDraftSave);
                                        // handleDraftSave()
                                        setOpenMessageModal(true);
                                    }}
                                >
                                    Reject
                                </Button>
                            }
                            {
                                reviewselectedFramework &&
                                <Button onClick={() => {
                                    setActionFn(() => handleSave);
                                    // handleSave()
                                    setOpenMessageModal(true);
                                }}
                                >
                                    Publish
                                </Button>
                            }
                            {
                                !reviewselectedFramework &&
                                <Button onClick={() => {
                                    setActionFn(() => handleReview);
                                    // handleReview()
                                    setOpenMessageModal(true);
                                }}
                                >
                                    Send For Review
                                </Button>
                            }
                        </DialogFooter>
                    }
                </DialogContent>
            </Dialog>

            {
                alertBox && (
                    <AlertBox alertBox={alertBox} setAlertBox={setAlertBox} message={saveValidationMessage} />
                )
            }
            {
                openMessageModal && actionFn && (
                    <ActionMessageModal openMessageModal={openMessageModal} setOpenMessageModal={setOpenMessageModal} actionFn={actionFn} />
                )
            }
        </>
    )
}
