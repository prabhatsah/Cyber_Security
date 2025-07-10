"use client"
import React, { useEffect, useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/shadcn/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shadcn/ui/tabs';
import { Button } from '@/shadcn/ui/button';
import FrameworkMetaDataForm from './frameworkMetaDataForm';
import { z } from 'zod';
import { DynamicFieldConfigFormData, DynamicFieldConfigFormDataWithId, DynamicFieldFrameworkContext, dynamicFieldschema, frameworkMetaDataSchema } from '../context/dynamicFieldFrameworkContext';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import DynamicFieldTable from './dynamicFieldTable';
import FrameworkStructure from './frameworkStructure';
import SubmitFramework from './submitFramework';
import { getMyInstancesV2, invokeAction, mapProcessName, startProcessV2 } from '@/ikon/utils/api/processRuntimeService';
import { useRouter } from 'next/navigation';
import { Framework } from '../page';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/shadcn/ui/alert-dialog';

export const tabsData = [
    {
        id: 'tab1',
        title: '1. Basic Information',
    },
    {
        id: 'tab2',
        title: '2. Framework Fields',
    },
    {
        id: 'tab3',
        title: '3. Framework Structure',
    },
    {
        id: 'tab4',
        title: '4. Review & Submit',
    },
];


export default function FrameworkTab({
    openFrameworkTab,
    setOpenFrameworkTab,
    selectedFramework
}: {
    openFrameworkTab: boolean;
    setOpenFrameworkTab: React.Dispatch<React.SetStateAction<boolean>>;
    selectedFramework?: Framework | null
}) {
    const router = useRouter();
    const {
        activeTab,
        setActiveTab,
        frameworkMetaDeta,
        setFrameworkMetaData,
        frameworkFieldConfigData,
        setFrameworkFieldConfigData,
        frameworkStructureData,
        setFrameworkStructureData,
        setFrameworkEntries,
        frameworkEntries,
        setParentEntries,
        setIdentifier,
        identifier,
        fieldIdentifer
    } = DynamicFieldFrameworkContext();
    const [isAlertDialogOpenPublish, setIsAlertDialogOpenPublish] = useState(false);

    console.log(selectedFramework);

    const replaceFieldIdsWithNames = () => {
        const idToNameMap = Object.fromEntries(frameworkFieldConfigData.map(f => [f.id, f.name]));

        return frameworkStructureData.map(row => {
            const newRow: Record<string, string | boolean | null> = {};

            for (const key in row) {
                if (idToNameMap[key]) {
                    newRow[idToNameMap[key]] = row[key];
                } else {
                    newRow[key] = row[key];
                }
            }

            return newRow;
        });
    }

    const replaceFieldNamesWithIds = (draftEntries: Record<string, string>[], configData: DynamicFieldConfigFormDataWithId[]) => {
        const nameToIdMap = Object.fromEntries(configData.map(f => [f.name, f.id]));

        return draftEntries.map(row => {
            const newRow: Record<string, string | boolean | null> = {};

            for (const key in row) {
                if (nameToIdMap[key]) {
                    newRow[nameToIdMap[key]] = row[key];
                } else {
                    newRow[key] = row[key];
                }
            }

            return newRow;
        });
    }

    useEffect(() => {
        if (selectedFramework) {
            setFrameworkMetaData({
                name: selectedFramework?.name || '',
                acronym: selectedFramework?.acronym || '',
                type: selectedFramework?.type || '',
                version: selectedFramework?.version || '',
                description: selectedFramework?.description || '',
                regulatoryAuthority: selectedFramework?.regulatoryAuthority || '',
                industry: selectedFramework?.industry || '',
                status: selectedFramework?.status || 'draft',
                // effectiveDate: frameworkMetaDeta?.effectiveDate || selectedFramework?.effectiveDate|| undefined,
                effectiveDate: selectedFramework?.effectiveDate ? new Date(selectedFramework.effectiveDate) : new Date(),
                contactEmail: selectedFramework?.contactEmail || '',
                responsibilityMatrixExists: selectedFramework?.responsibilityMatrixExists || false,
                soaExists: selectedFramework?.soaExists || false
            })
            setFrameworkFieldConfigData(selectedFramework?.configureData);
            setIdentifier(selectedFramework?.identifierField);
            const draftEntries = Object.values(selectedFramework?.entries || {});
            const frameworkStructurDrafteData = replaceFieldNamesWithIds(draftEntries, selectedFramework?.configureData) as Record<string, string>[];
            setFrameworkStructureData(frameworkStructurDrafteData)
            console.log(selectedFramework);
            const identifierFieldConfig = selectedFramework?.configureData.find(
                (data) => data.id === selectedFramework?.identifierField?.index
            );
            const identifierFieldName = identifierFieldConfig?.name;
            if (identifierFieldName) {
                const parentEntries = selectedFramework.parentEntries.map((parentEntry) => ({
                    label: parentEntry[identifierFieldName as keyof typeof parentEntry] as string,
                    value: parentEntry.id
                }));
                console.log(parentEntries);
                setParentEntries(parentEntries);
            }
        } else {
            setFrameworkMetaData(null);
            form.reset();
            setIdentifier(fieldIdentifer);
            setFrameworkFieldConfigData([
                {
                    "name": "index",
                    "type": "text",
                    "description": "Enter Index",
                    "extraInfo": [],
                    "id": `FormField${crypto.randomUUID()}`
                },
                {
                    "name": "title",
                    "type": "text",
                    "description": "Enter title",
                    "extraInfo": [],
                    "id": `FormField${crypto.randomUUID()}`
                },
                {
                    "name": "description",
                    "type": "textarea",
                    "description": "Enter Index",
                    "extraInfo": [],
                    "id": `FormField${crypto.randomUUID()}`
                }
            ]);
            setFrameworkStructureData([]);
            setFrameworkEntries([]);
            setParentEntries([]);
            setActiveTab(0);
        }
    }, [])

    const form = useForm<z.infer<typeof frameworkMetaDataSchema>>({
        resolver: zodResolver(frameworkMetaDataSchema),
        defaultValues: {
            name: '',
            acronym: '',
            type: '',
            version: '',
            description: '',
            regulatoryAuthority: '',
            industry: '',
            status: 'draft',
            effectiveDate: new Date(), // or undefined if you update schema
            contactEmail: '',
            responsibilityMatrixExists: false,
            soaExists: false,
        }
        // defaultValues: {
        //     name: frameworkMetaDeta?.name || selectedFramework?.name || '',
        //     acronym: frameworkMetaDeta?.acronym || selectedFramework?.acronym || '',
        //     type: frameworkMetaDeta?.type || selectedFramework?.type || '',
        //     version: frameworkMetaDeta?.version || selectedFramework?.version || '',
        //     description: frameworkMetaDeta?.description || selectedFramework?.description || '',
        //     regulatoryAuthority: frameworkMetaDeta?.regulatoryAuthority || selectedFramework?.regulatoryAuthority || '',
        //     industry: frameworkMetaDeta?.industry || selectedFramework?.industry || '',
        //     status: frameworkMetaDeta?.status || selectedFramework?.status || 'draft',
        //     // effectiveDate: frameworkMetaDeta?.effectiveDate || selectedFramework?.effectiveDate|| undefined,
        //     effectiveDate: frameworkMetaDeta?.effectiveDate
        //         ? new Date(frameworkMetaDeta.effectiveDate)
        //         : selectedFramework?.effectiveDate
        //             ? new Date(selectedFramework.effectiveDate)
        //             : undefined,
        //     contactEmail: frameworkMetaDeta?.contactEmail || selectedFramework?.contactEmail || '',
        //     responsibilityMatrixExists: frameworkMetaDeta?.responsibilityMatrixExists || selectedFramework?.responsibilityMatrixExists || false,
        //     soaExists: frameworkMetaDeta?.soaExists || selectedFramework?.soaExists || false
        // },
    });

    const onSubmit = (data: z.infer<typeof frameworkMetaDataSchema>) => {
        console.log(data)
        setFrameworkMetaData(data);
        setActiveTab((prevTab) => Math.min(prevTab + 1, tabsData.length - 1));
    }

    const onDynamicFieldSubmit = () => {
        console.log(frameworkFieldConfigData);
        if (frameworkFieldConfigData.length > 0) {
            setActiveTab((prevTab) => Math.min(prevTab + 1, tabsData.length - 1));
        } else {
            alert("Please add a Field Configuration")
        }
    }

    const onFrameworkStructureSubmit = () => {
        if (frameworkStructureData.length > 0) {
            const entries = replaceFieldIdsWithNames();
            console.log(entries);
            setFrameworkEntries(entries);
            setActiveTab((prevTab) => Math.min(prevTab + 1, tabsData.length - 1));
        } else {
            alert("Please add a Framework Policies")
        }
    }

    const handlePrevious = () => {
        setActiveTab((prevTab) => Math.max(prevTab - 1, 0));
    };

    function convertStructure() {
        console.log(frameworkEntries)
        const entryMap = {};
        const parentEntries = [];
        for (const entry of frameworkEntries) {
            const entryID = entry.id?.toString();
            entryMap[entryID] = entry;
        }
        for (const entry of frameworkEntries) {
            if (entry.treatAsParent) {
                const childrenArray = frameworkEntries
                    .filter(child => child.parentId === entry.id)
                    .map(child => child.id);

                parentEntries.push({ ...entry, childrenArray });
            }
        }

        return {
            entries: entryMap,
            parentEntries
        };
    }

    const handleDraft = async () => {
        const saveFormatData = {
            id: selectedFramework?.id || crypto.randomUUID(),
            ...frameworkMetaDeta,
            title: frameworkMetaDeta?.name,
            category: "Security",
            score: 0,
            status: "draft",
            isFavorite: false,
            configureData: frameworkFieldConfigData,
            identifierField: identifier,
            ...convertStructure()
        }

        if (selectedFramework) {
            const frameworkInstance = await getMyInstancesV2({
                processName: "Framework Processes",
                predefinedFilters: { taskName: "Saved as Draft" },
                mongoWhereClause: `this.Data.id == '${saveFormatData.id}'`
            })
            const taskId = frameworkInstance[0]?.taskId;
            await invokeAction({
                taskId: taskId,
                data: saveFormatData,
                transitionName: "Save Draft",
                processInstanceIdentifierField: "id"
            })
        } else {
            const processId = await mapProcessName({ processName: "Framework Processes" });
            console.log(processId);
            await startProcessV2({
                processId,
                data: saveFormatData,
                processIdentifierFields: "id",
            });
        }

        console.log('Form submitted!');

        setFrameworkMetaData(null);
        setFrameworkFieldConfigData([
            {
                "name": "index",
                "type": "text",
                "description": "Enter Index",
                "extraInfo": [],
                "id": `FormField${crypto.randomUUID()}`
            },
            {
                "name": "title",
                "type": "text",
                "description": "Enter title",
                "extraInfo": [],
                "id": `FormField${crypto.randomUUID()}`
            },
            {
                "name": "description",
                "type": "textarea",
                "description": "Enter Index",
                "extraInfo": [],
                "id": `FormField${crypto.randomUUID()}`
            }
        ]);
        setFrameworkStructureData([])
        setParentEntries([]);
        setActiveTab(0);

        setOpenFrameworkTab(false);
        router.refresh();
    }

    const handleSubmit = async () => {
        setIsAlertDialogOpenPublish(false);
        const saveFormatData = {
            id: selectedFramework?.id || crypto.randomUUID(),
            ...frameworkMetaDeta,
            title: frameworkMetaDeta?.name,
            category: "Security",
            score: 0,
            status: "published",
            isFavorite: false,
            configureData: frameworkFieldConfigData,
            identifierField: identifier,
            ...convertStructure()
        }

        if (selectedFramework) {
            const frameworkInstance = await getMyInstancesV2({
                processName: "Framework Processes",
                predefinedFilters: { taskName: "Saved as Draft" },
                mongoWhereClause: `this.Data.id == '${saveFormatData.id}'`
            })
            const taskId = frameworkInstance[0]?.taskId;
            await invokeAction({
                taskId: taskId,
                data: saveFormatData,
                transitionName: "Published after Draft",
                processInstanceIdentifierField: "id"
            })
        } else {
            const processId = await mapProcessName({ processName: "Framework Processes" });
            console.log(processId);
            await startProcessV2({
                processId,
                data: saveFormatData,
                processIdentifierFields: "id",
            });
        }
        console.log('Form submitted!');

        setFrameworkMetaData(null);
        setFrameworkFieldConfigData([
            {
                "name": "index",
                "type": "text",
                "description": "Enter Index",
                "extraInfo": [],
                "id": `FormField${crypto.randomUUID()}`
            },
            {
                "name": "title",
                "type": "text",
                "description": "Enter title",
                "extraInfo": [],
                "id": `FormField${crypto.randomUUID()}`
            },
            {
                "name": "description",
                "type": "textarea",
                "description": "Enter Index",
                "extraInfo": [],
                "id": `FormField${crypto.randomUUID()}`
            }
        ]);
        setFrameworkStructureData([])
        setParentEntries([]);
        setActiveTab(0);

        setOpenFrameworkTab(false);
        router.refresh();
    };
    const isLastTab = activeTab === tabsData.length - 1;
    return (
        <>
            <Dialog open={openFrameworkTab} onOpenChange={setOpenFrameworkTab}>
                <DialogContent className="!max-w-none w-[80vw] h-[90vh] p-6 pt-4 flex flex-col">
                    <DialogHeader>
                        <DialogTitle>Custom Framework Builder</DialogTitle>
                    </DialogHeader>

                    <div className="w-full h-full flex-1 overflow-hidden">
                        <Tabs value={tabsData[activeTab].id} onValueChange={() => { }} className="h-full flex flex-col">
                            <TabsList className="w-full flex justify-between">
                                {tabsData.map((tab, index) => (
                                    <TabsTrigger key={tab.id} value={tab.id} className='cursor-default'>
                                        {tab.title}
                                    </TabsTrigger>
                                ))}
                            </TabsList>

                            <div className="flex-1 overflow-auto">
                                {tabsData.map((tab) => (
                                    <TabsContent key={tab.id} value={tab.id}>
                                        {
                                            tab.id === "tab1" ?
                                                <FrameworkMetaDataForm form={form} onSubmit={onSubmit} /> :
                                                tab.id === "tab2" ?
                                                    <DynamicFieldTable /> :
                                                    tab.id === "tab3" ?
                                                        <FrameworkStructure /> :
                                                        <SubmitFramework />
                                        }
                                    </TabsContent>
                                ))}
                            </div>
                        </Tabs>
                    </div>

                    <DialogFooter className="w-full flex flex-row !justify-between">
                        <Button onClick={handlePrevious} disabled={activeTab === 0} variant="ghost">
                            Previous
                        </Button>
                        {!isLastTab ? (
                            activeTab === 0 ?
                                <Button onClick={() => form.handleSubmit(onSubmit)()} variant="destructive">
                                    Next
                                </Button> :
                                activeTab === 1 ?
                                    <Button onClick={onDynamicFieldSubmit} variant="destructive">
                                        Next
                                    </Button> :
                                    <Button onClick={onFrameworkStructureSubmit} variant="destructive">
                                        Next
                                    </Button>
                        ) : (
                            <div className='flex flex-row gap-3'>
                                <Button
                                    onClick={handleDraft}
                                >
                                    Save as Draft
                                </Button>
                                <Button onClick={() => { setIsAlertDialogOpenPublish(true) }} variant="default">
                                    Publish
                                </Button>
                            </div>
                        )}
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {isAlertDialogOpenPublish && (
                <AlertDialog open={isAlertDialogOpenPublish} onOpenChange={setIsAlertDialogOpenPublish}>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                                This will publish the form. This form cannot be edited further
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel onClick={() => { setIsAlertDialogOpenPublish(false) }}>
                                Cancel
                            </AlertDialogCancel>
                            <AlertDialogAction onClick={handleSubmit}>
                                Proceed
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            )
            }

        </>
    )
}
