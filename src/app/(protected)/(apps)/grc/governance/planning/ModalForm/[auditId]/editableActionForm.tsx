import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/shadcn/ui/dialog'
import React, { SetStateAction, useEffect, useRef, useState } from 'react'
import ActionMeetingForm from './actionMeetingForm'
import { Button } from "@/shadcn/ui/button";
import { Input } from "@/shadcn/ui/input";
import { Textarea } from "@/shadcn/ui/textarea";
import {
    CheckCircle,
    AlertTriangle,
    Loader2,
    XCircle,
    User,
    Calendar,
    Clock,
    ChevronDown,
    ChevronUp,
    Pencil
} from 'lucide-react';
import { cn } from "@/shadcn/lib/utils";
import { motion, AnimatePresence } from 'framer-motion';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shadcn/ui/select"
import { Calendar as CalendarUI } from "@/shadcn/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/shadcn/ui/popover"
import { format } from "date-fns"
import { multipleFileUpload } from '@/ikon/utils/api/file-upload';
import { coerce } from 'zod';
import { Description } from '@radix-ui/react-dialog';
import { getMyInstancesV2, invokeAction } from '@/ikon/utils/api/processRuntimeService';
import { useParams, useRouter } from 'next/navigation';
import { FileinfoProps } from '@/ikon/utils/api/file-upload/type';
import { getResourceUrl, openFileInNewTab } from '@/ikon/utils/actions/common/utils';
import { TextButtonWithTooltip } from '@/ikon/components/buttons';
import AlertDialogFn from './alertDialogFn';

interface FormValues {
    actions: {
        description: string;
        assignedTo: string;
        dueDate: Date | undefined;
        timeEntries: { date: Date; hours: number }[];
    }[];
    observations: string[];
    recommendations: string[];
    action: string[];
    controlPolicy: string;
    controlObjective: string;
}

const users = [
    { id: 'user1', name: 'John Doe' },
    { id: 'user2', name: 'Jane Smith' },
    { id: 'user3', name: 'Bob Johnson' },
    { id: 'user4', name: 'Alice Brown' },
];

interface EditableActionFormProps {
    openEditableActionForm: boolean;
    setOpenEditableActionForm: React.Dispatch<SetStateAction<boolean>>;
    selectedRow: Record<string, any> | null;
    findActionData: any[];
}

interface TimeEntry {
    date: Date;
    hours: number;
}

interface Action {
    description: string;
    assignedTo: string;
    dueDate: string;
    timeEntries: TimeEntry[];

}

type FindingActionItem = {
    assignedTo: string;
    description: string;
    dueDate: string;
    timeEntries: any[]; // or better type
    assigneAction?: FindingActionData[];
    status?: string;
    remarks?: string[];
    followUpMetting?: Record<string, string>[];
};

type FindingActionData = {
    actionsId: string;
    controlId: number;
    controlName: string;
    controlObjId: string;
    controlObjName: string;
    findingId: string;
    lastUpdateOn: string;
    meetingId: string;
    observation: string[];
    owner: string;
    recommendation: string[];
    severity: string;
    actions: FindingActionItem[];
};


export default function EditableActionForm({ openEditableActionForm, setOpenEditableActionForm, selectedRow, findActionData }: EditableActionFormProps) {
    const router = useRouter()
    console.log(selectedRow);
    console.log(findActionData);
    const [corrections, setCorrections] = useState<{
        description: string;
        assignedFile: File[] | null;

    }[]>([]);

    // const [prevCorrection, setPrevCorrection] = useState<{
    //     description: string;
    //     resourceData: File[] | null;
    // }[]>([])

    // const [initialValues, setInitialValues] = useState<FormValues>({
    //     observations: [],
    //     recommendations: [],
    //     controlPolicy: '',
    //     actions: [],
    //     action: [],
    //     controlObjective: '',
    // });
    const [newActionInput, setNewActionInput] = useState('');
    const [expandedActionIndex, setExpandedActionIndex] = useState<number | null>(null); // Track expanded action
    const [openAlertBox, setOpenAlertBox] = useState<boolean>(false);
    const [alertMessage, setAlertMessage] = useState<string>('');
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    // Simulate fetching initial values
    // useEffect(() => {
    // // In a real application, you would fetch these from an API.
    // const fetchedValues = {
    //     observations: selectedRow?.observation &&
    //         selectedRow.observation.length > 0 ?
    //         selectedRow.observation.map((observation: string, index: number) => `Observation ${index + 1}:${" " + observation}`) :
    //         ["No Observation Found"],
    //     recommendations: selectedRow?.recommendation &&
    //         selectedRow.recommendation.length > 0 ?
    //         selectedRow.recommendation.map((recommendation: string, index: number) => `Recommendation ${index + 1}:${" " + recommendation}`) :
    //         ["No Recommendation Found"],
    //     action: [selectedRow?.description],
    //     controlPolicy: selectedRow?.controlId && `${selectedRow?.controlId}: ${" " + selectedRow?.controlName}`,
    //     controlObjective: selectedRow?.controlObjId && `${selectedRow?.controlObjId}: ${" " + selectedRow?.controlObjName}`,
    //     actions: []
    // };
    // setInitialValues(fetchedValues);
    // setPrevCorrection(selectedRow?.assigneAction)
    // }, []);

    // console.log(prevCorrection);

    const handleAddAction = (newAction: string) => {
        if (newAction.trim()) {
            setCorrections(prevCoreection => [...prevCoreection, { description: newAction.trim(), assignedFile: null }]);
            setNewActionInput('');
            setExpandedActionIndex(corrections.length);
        }
    };

    const handleRemoveAction = (index: number) => {
        setCorrections(prevCorrection => prevCorrection.filter((_, i) => i !== index));
        if (expandedActionIndex === index) {
            setExpandedActionIndex(null); // Collapse if the expanded action is removed
        }
    };


    const handleCorrectionChange = (
        index: number,
        field: 'description' | 'assignedFile',
        value: string | File[]
    ) => {
        const updatedCorrections = [...corrections];
        console.log(value);

        if (field === 'assignedFile') {
            const existingFiles = updatedCorrections[index]?.assignedFile || [];
            updatedCorrections[index] = {
                ...updatedCorrections[index],
                assignedFile: [...existingFiles, ...(value as File[])],
            };
        } else if (field === 'description') {
            // description should be string
            updatedCorrections[index] = {
                ...updatedCorrections[index],
                description: value as string,
            };
        }

        setCorrections(updatedCorrections);
    };

    const handleRemoveFile = (correctionIndex: number, fileIndex: number) => {
        const updatedCorrections = [...corrections];
        const updatedFiles = [...(updatedCorrections[correctionIndex].assignedFile || [])];
        updatedFiles.splice(fileIndex, 1); // Remove that file
        updatedCorrections[correctionIndex].assignedFile = updatedFiles;
        setCorrections(updatedCorrections);
    };

    const handleDraft = async () => {

        const convertFileIntoResource = await Promise.all(
            corrections.map(async (correction) => {
                const files = correction?.assignedFile || [];
                const resourceData = await multipleFileUpload(files);
                return {
                    description: correction.description,
                    resourceData,
                };
            })
        );
        const updateRow = {
            ...selectedRow,
            actionStatus: "In Progress",
            assigneAction: [
                ...(selectedRow?.assigneAction || []),
                ...convertFileIntoResource,
            ],

        }
        console.log(updateRow);
        // const saveFormatData = findActionData.map(item => item.editActionId === updateRow?.editActionId ? updateRow : item)
        // console.log(saveFormatData);

        // const groupedDataMap: Map<string, FindingActionData> = new Map();

        // for (const flatAction of saveFormatData) {
        //     if (!groupedDataMap.has(flatAction.actionsId)) {
        //         groupedDataMap.set(flatAction.actionsId, {
        //             actionsId: flatAction.actionsId,
        //             controlId: flatAction.controlId,
        //             controlName: flatAction.controlName,
        //             controlObjId: flatAction.controlObjId,
        //             controlObjName: flatAction.controlObjName,
        //             findingId: flatAction.findingId,
        //             lastUpdateOn: flatAction.lastUpdateOn,
        //             meetingId: flatAction.meetingId,
        //             observation: flatAction.observation,
        //             owner: flatAction.owner,
        //             recommendation: flatAction.recommendation,
        //             severity: flatAction.severity,
        //             actions: [],
        //         });
        //     }

        //     const group = groupedDataMap.get(flatAction.actionsId);
        //     if (group) {
        //         const { status, editActionId } = flatAction;

        //         let resolvedStatus: 'Completed' | 'Pending' | 'In Progress' | undefined;
        //         if (status === 'Completed' || status === 'Pending' || status === 'In Progress') {
        //             resolvedStatus = status;
        //         }
        //         if (editActionId === updateRow?.editActionId) {
        //             resolvedStatus = 'In Progress';
        //         }
        //         group.actions.push({
        //             description: flatAction.description,
        //             assignedTo: flatAction.assignedTo,
        //             dueDate: flatAction.dueDate,
        //             timeEntries: flatAction.timeEntries,
        //             assigneAction: flatAction.assigneAction || [],
        //             status: resolvedStatus,
        //             remarks: flatAction.remarks || [],
        //             followUpMetting: flatAction.followUpMetting || [],
        //         })

        //     }
        // }
        // const currentActionId = selectedRow?.actionsId;
        // const matchedAction = groupedDataMap.get(currentActionId);

        if (updateRow) {
            const meetingFindingInstances = await getMyInstancesV2({
                processName: "Meeting Findings Actions",
                predefinedFilters: { taskName: "Edit Action" },
                mongoWhereClause: `this.Data.actionsId == "${updateRow?.actionsId}"`,
            })
            console.log(meetingFindingInstances)
            const taskId = meetingFindingInstances[0]?.taskId;
            console.log(taskId);
            await invokeAction({
                taskId: taskId,
                transitionName: 'Update Edit',
                data: updateRow,
                processInstanceIdentifierField: ''
            })
            router.refresh();
            setOpenEditableActionForm(false);
        } else {
            alert("Could No Save Data");
        }

    }

    const handleSubmit = async () => {
        if (corrections.length <= 0) {
            setOpenAlertBox(true);
            setAlertMessage("Please Atleast add one Solution Field");
            return;
        }
        if (newActionInput.length !== 0) {
            setOpenAlertBox(true);
            setAlertMessage("Please add Your Solution Field");
            return;
        }
        const convertFileIntoResource = await Promise.all(
            corrections.map(async (correction) => {
                const files = correction?.assignedFile || [];
                const resourceData = await multipleFileUpload(files);
                return {
                    description: correction.description,
                    resourceData,
                };
            })
        );

        // const existingFileResource = prevCorrection && prevCorrection.length > 0 && await Promise.all(
        //     prevCorrection?.map(async (correction) => {
        //         const files = correction?.resourceData || [];
        //         const resourceData = await multipleFileUpload(files);
        //         return {
        //             description: correction.description,
        //             resourceData,
        //         };
        //     })
        // );
        const updateRow = {
            ...selectedRow,
            actionStatus: "Pending",
            assigneAction: [
                ...(selectedRow?.assigneAction || []),
                // ...(Array.isArray(existingFileResource) ? existingFileResource : []),
                ...convertFileIntoResource,
            ],

        }
        console.log(updateRow);
        const meetingFindingInstances = await getMyInstancesV2({
            processName: "Meeting Findings Actions",
            predefinedFilters: { taskName: "Edit Action" },
            mongoWhereClause: `this.Data.actionsId == "${updateRow?.actionsId}"`,
        })
        console.log(meetingFindingInstances)
        const taskId = meetingFindingInstances[0]?.taskId;
        console.log(taskId);
        await invokeAction({
            taskId: taskId,
            transitionName: 'Update Edit',
            data: updateRow,
            processInstanceIdentifierField: ''
        })
        router.refresh();
        setOpenEditableActionForm(false);

        // const saveFormatData = findActionData.map(item => item.editActionId === updateRow?.editActionId ? updateRow : item)
        // console.log(saveFormatData);

        // const groupedDataMap: Map<string, FindingActionData> = new Map();

        // for (const flatAction of saveFormatData) {
        //     if (!groupedDataMap.has(flatAction.actionsId)) {
        //         groupedDataMap.set(flatAction.actionsId, {
        //             actionsId: flatAction.actionsId,
        //             controlId: flatAction.controlId,
        //             controlName: flatAction.controlName,
        //             controlObjId: flatAction.controlObjId,
        //             controlObjName: flatAction.controlObjName,
        //             findingId: flatAction.findingId,
        //             lastUpdateOn: flatAction.lastUpdateOn,
        //             meetingId: flatAction.meetingId,
        //             observation: flatAction.observation,
        //             owner: flatAction.owner,
        //             recommendation: flatAction.recommendation,
        //             severity: flatAction.severity,
        //             actions: [],
        //         });
        //     }

        //     const group = groupedDataMap.get(flatAction.actionsId);
        //     if (group) {
        //         const { status, editActionId } = flatAction;

        //         let resolvedStatus: 'Completed' | 'Pending' | 'In Progress' | undefined;
        //         if (status === 'Completed' || status === 'Pending' || status === 'In Progress') {
        //             resolvedStatus = status;
        //         }
        //         if (editActionId === updateRow?.editActionId) {
        //             resolvedStatus = 'Pending';
        //         }
        //         group.actions.push({
        //             description: flatAction.description,
        //             assignedTo: flatAction.assignedTo,
        //             dueDate: flatAction.dueDate,
        //             timeEntries: flatAction.timeEntries,
        //             assigneAction: flatAction.assigneAction || [],
        //             status: resolvedStatus,
        //             remarks: flatAction.remarks || [],
        //             followUpMetting: flatAction.followUpMetting || [],
        //         })

        //     }
        // }
        // const currentActionId = selectedRow?.actionsId;
        // const matchedAction = groupedDataMap.get(currentActionId);

        // if (matchedAction) {
        //     const meetingFindingInstances = await getMyInstancesV2({
        //         processName: "Meeting Findings Actions",
        //         predefinedFilters: { taskName: "View Action" },
        //         mongoWhereClause: `this.Data.actionsId == "${matchedAction?.actionsId}"`,
        //     })
        //     console.log(meetingFindingInstances)
        //     const taskId = meetingFindingInstances[0]?.taskId;
        //     console.log(taskId);
        //     await invokeAction({
        //         taskId: taskId,
        //         transitionName: 'Update View',
        //         data: matchedAction,
        //         processInstanceIdentifierField: ''
        //     })
        //     router.refresh();
        //     setOpenEditableActionForm(false);
        // }
        // else {
        //     alert("Could No Save Data");
        // }
    };

    const donwloadFile = async function (fileInfo: FileinfoProps) {
        try {
            const resourceLink = await getResourceUrl({
                resourceId: fileInfo.resourceId,
                resourceName: fileInfo.resourceName,
                resourceType: fileInfo.resourceType,
                resourceSize: fileInfo.resourceSize
            });
            openFileInNewTab(resourceLink);
        } catch (err) {
            console.error('Error in donwloadTemplateFile: ', err);
        }
    };

    const handleDivClick = () => {
        fileInputRef.current?.click();
    };


    return (
        <>
            <Dialog open={openEditableActionForm} onOpenChange={setOpenEditableActionForm}>
                <DialogContent className="!max-w-none !w-screen !h-screen p-6 flex flex-col">
                    <DialogHeader>
                        <DialogTitle>Task Form</DialogTitle>
                    </DialogHeader>
                    <div className="h-full overflow-y-auto">
                        <div className="space-y-6">
                            <div className="space-y-4">
                                {/* {initialValues?.controlPolicy && (
                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-gray-300">
                                            Control Policy
                                        </label>
                                        <div className="p-3 bg-gray-800 rounded-md border border-gray-700 text-gray-400">
                                            {initialValues.controlPolicy}
                                        </div>
                                    </div>
                                )}

                                {initialValues?.controlObjective && (
                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-gray-300">
                                            Control Objective
                                        </label>
                                        <div className="p-3 bg-gray-800 rounded-md border border-gray-700 text-gray-400">
                                            {initialValues.controlObjective}
                                        </div>
                                    </div>
                                )}

                                {initialValues?.observations && (
                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-gray-300">
                                            Observations
                                        </label>
                                        <ul className="list-disc list-inside p-3 bg-gray-800 rounded-md border border-gray-700 text-gray-400">
                                            {initialValues.observations.map((observation, index) => (
                                                <li key={index}>{observation}</li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                {initialValues?.recommendations && (
                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-gray-300">
                                            Recommendations
                                        </label>
                                        <ul className="list-disc list-inside p-3 bg-gray-800 rounded-md border border-gray-700 text-gray-400">
                                            {initialValues.recommendations.map((recommendation, index) => (
                                                <li key={index}>{recommendation}</li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                {initialValues?.action && (
                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-gray-300">
                                            Your Assigned Task
                                        </label>
                                        <ul className="list-disc list-inside p-3 bg-gray-800 rounded-md border border-gray-700 text-gray-400">
                                            {initialValues.action.map((action, index) => (
                                                <li key={index}>{action}</li>
                                            ))}
                                        </ul>
                                    </div>
                                )} */}

                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-gray-300">
                                        Control Policy
                                    </label>
                                    <div className="p-3 bg-gray-800 rounded-md border border-gray-700 text-gray-400">
                                        {selectedRow?.controlName}
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-gray-300">
                                        Control Objective
                                    </label>
                                    <div className="p-3 bg-gray-800 rounded-md border border-gray-700 text-gray-400">
                                        {selectedRow?.controlObjName}
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-gray-300">
                                        Observations
                                    </label>
                                    <div className="p-3 bg-gray-800 rounded-md border border-gray-700 text-gray-400">
                                        {selectedRow?.observation}
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-gray-300">
                                        Recommendations
                                    </label>
                                    <div className="p-3 bg-gray-800 rounded-md border border-gray-700 text-gray-400">
                                        {selectedRow?.recommendation}
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-gray-300">
                                        Your Assigned Task
                                    </label>
                                    <div className="p-3 bg-gray-800 rounded-md border border-gray-700 text-gray-400">
                                        {selectedRow?.description}
                                    </div>
                                </div>


                                {selectedRow && Array.isArray(selectedRow.remarks) && selectedRow.remarks.length > 0 && (
                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-gray-300">
                                            Remarks
                                        </label>
                                        <ul className="list-disc list-inside p-3 bg-gray-800 rounded-md border border-gray-700 text-gray-400">
                                            {selectedRow.remarks.map((remark: string, index: number) => (
                                                <li key={index}>{remark}</li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                {/* <div className="space-y-2">
                                    <label className="block text-sm font-medium text-gray-300">
                                        Previous Solutions
                                    </label>
                                    {prevCorrection?.map((correction, index) => (
                                        <div key={index} className="space-y-3 bg-gray-800 p-4 rounded-md border border-gray-700">

                                            <Textarea
                                                value={correction.description}
                                                onChange={(e) => {
                                                    const updated = [...prevCorrection];
                                                    updated[index].description = e.target.value;
                                                    setPrevCorrection(updated);
                                                }}
                                                className="bg-gray-700 border-gray-600 text-gray-100"
                                                placeholder="Edit correction description"
                                            />

                                            <div className="space-y-1">
                                                <div className="text-sm text-gray-300">Uploaded Documents:</div>
                                                <div className="flex flex-wrap gap-2">
                                                    {correction.resourceData?.map((file, fileIndex) => (
                                                        <div key={fileIndex} className="flex items-center gap-1 bg-gray-700 px-2 py-1 rounded">
                                                            <span className="text-sm text-gray-200">{file?.resourceName}</span>
                                                            <XCircle
                                                                className="w-4 h-4 text-red-400 cursor-pointer"
                                                                onClick={() => {
                                                                    const updated = [...prevCorrection];
                                                                    if (updated[index]?.resourceData) {
                                                                        updated[index].resourceData.splice(fileIndex, 1);
                                                                        setPrevCorrection(updated);
                                                                    }
                                                                }}
                                                            />
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>


                                            <Input
                                                type="file"
                                                multiple
                                                className="bg-gray-700 text-gray-200"
                                                onChange={(e) => {
                                                    const newFiles = Array.from(e.target.files || []);
                                                    const mappedFiles: FileinfoProps[] = newFiles.map((file) => ({
                                                        resourceId: crypto.randomUUID(),
                                                        resourceName: file.name,
                                                        resourceSize: file.size,
                                                        resourceType: file.type,
                                                    }));

                                                    const updated = [...prevCorrection];
                                                    updated[index].resourceData = [...updated[index]?.resourceData, ...mappedFiles];
                                                    setPrevCorrection(updated);
                                                }}
                                            />
                                        </div>
                                    ))}
                                </div> */}


                                {selectedRow && selectedRow?.assigneAction && selectedRow.assigneAction.length > 0 && (
                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-gray-300">
                                            Previous Solutions
                                        </label>
                                        <ul className="space-y-3 p-3 max-h-44 overflow-y-auto bg-gray-800 rounded-md border border-gray-700 text-gray-400">
                                            {selectedRow.assigneAction.map((action, index) => (
                                                <li key={index} className="flex flex-col gap-1">

                                                    <div className='flex flex-row gap-3'>
                                                        <div className="font-semibold text-gray-200">{action.description}</div>
                                                    </div>

                                                    <div className="flex flex-row gap-2">
                                                        <div className='self-center'>
                                                            Uploaded Documents
                                                        </div>
                                                        <div className='flex flex-wrap'>
                                                            {action.resourceData.map((resource, rIndex) => (
                                                                <Button
                                                                    variant='link'
                                                                    key={rIndex}
                                                                    onClick={() => donwloadFile(resource)}

                                                                >
                                                                    {resource.resourceName}
                                                                </Button>
                                                            )
                                                            )}
                                                        </div>
                                                    </div>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}


                                <div className="space-y-4">
                                    <div className="flex flex-col">
                                        <label className="block text-sm font-medium text-gray-300">
                                            Enter Your Actions <span className="text-red-500">*</span>
                                        </label>
                                        <span className="text-xs text-muted-foreground">
                                            Here you can list down all your actions that you have taken and upload evidences (if there are any)
                                        </span>
                                    </div>
                                    <div className='flex flex-col-reverse gap-3 pr-2'>
                                        {corrections.map((correction, index) => (
                                            <div key={index} className="space-y-4 mb-4 p-4 rounded-md bg-gray-800 border border-gray-700">
                                                <div className="flex items-center justify-between">
                                                    <div className='flex flex-col sm:flex-row items-start sm:items-center gap-2 flex-1'>
                                                        {expandedActionIndex === index ? (
                                                            <Textarea
                                                                value={correction.description}
                                                                onChange={(e) => handleCorrectionChange(index, 'description', e.target.value)}
                                                                placeholder="Describe the action..."
                                                                className="bg-gray-700 border-gray-600 text-gray-100 placeholder:text-gray-400
                                                       focus:ring-2 focus:ring-blue-500 focus:border-blue-500  min-h-[60px] resize-none flex-1"
                                                                required
                                                            />
                                                        ) : (
                                                            <div className="text-gray-300 p-2 rounded-md flex-1 break-words">
                                                                {correction.description}
                                                                <div className='flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mt-1'>
                                                                    {correction && correction?.assignedFile && correction?.assignedFile.length > 0 && (
                                                                        <div className="flex flex-row flex-wrap gap-2">
                                                                            <div className="text-sm text-gray-300">Uploaded Files:</div>
                                                                            {correction.assignedFile?.map((file, fileIndex) => (
                                                                                <div key={fileIndex} className="flex flex-row items-center gap-1">
                                                                                    <a
                                                                                        href={URL.createObjectURL(file)}
                                                                                        target="_blank"
                                                                                        rel="noopener noreferrer"
                                                                                        className="text-blue-400 underline hover:text-blue-300 text-sm"
                                                                                    >
                                                                                        {file.name}
                                                                                    </a>
                                                                                    <XCircle className='h-4 w-4 self-end cursor-pointer' onClick={() => handleRemoveFile(index, fileIndex)} />
                                                                                </div>
                                                                            ))}
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        )}

                                                    </div>
                                                    <div className='flex gap-2'>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={() => setExpandedActionIndex(prevIndex => prevIndex === index ? null : index)}
                                                            className="text-gray-400 hover:text-gray-300"
                                                        >
                                                            {expandedActionIndex === index ? (
                                                                <ChevronUp className="w-4 h-4" />
                                                            ) : (
                                                                <ChevronDown className="w-4 h-4" />
                                                            )}
                                                            <span className="sr-only">
                                                                {expandedActionIndex === index ? 'Collapse action' : 'Expand action'}
                                                            </span>
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={() => handleRemoveAction(index)}
                                                            className="text-red-400 hover:text-red-300"
                                                        >
                                                            <XCircle className="w-4 h-4" />
                                                            <span className="sr-only">Remove action</span>
                                                        </Button>
                                                    </div>
                                                </div>
                                                <AnimatePresence>
                                                    {expandedActionIndex === index && (
                                                        <motion.div
                                                            initial={{ opacity: 0, height: 0 }}
                                                            animate={{ opacity: 1, height: 'auto' }}
                                                            exit={{ opacity: 0, height: 0 }}
                                                            transition={{ duration: 0.2 }}
                                                            className="space-y-4"
                                                        >
                                                            <div className="grid grid-cols-1 gap-4">
                                                                <div className="space-y-2">
                                                                    <label className="block text-sm font-medium text-gray-300">Upload Files (You can add multiple files here)</label>
                                                                    <div
                                                                        onClick={handleDivClick}
                                                                        className="bg-gray-700 border border-gray-600 text-gray-300 p-2 rounded cursor-pointer"
                                                                    >
                                                                        {correction && correction?.assignedFile && correction?.assignedFile.length > 0 ? (
                                                                            <ul className="list-disc pl-4">
                                                                                {correction.assignedFile?.map((file, idx) => (
                                                                                    <li key={idx}>{file.name}</li>
                                                                                ))}
                                                                            </ul>
                                                                        ) : (
                                                                            <span>Click to upload files</span>
                                                                        )}
                                                                    </div>
                                                                    <Input
                                                                        ref={fileInputRef}
                                                                        type="file"
                                                                        multiple
                                                                        onChange={(e) =>
                                                                            handleCorrectionChange(index, 'assignedFile', Array.from(e.target.files || []))
                                                                        }
                                                                        className="bg-gray-700 border-gray-600 text-gray-300 hidden"
                                                                    />
                                                                </div>
                                                            </div>
                                                        </motion.div>
                                                    )}
                                                </AnimatePresence>
                                            </div>
                                        ))}
                                        <div className="flex items-center gap-2">
                                            <Input
                                                value={newActionInput}
                                                onChange={(e) => setNewActionInput(e.target.value)}
                                                placeholder="Add Actions..."
                                                className="bg-gray-800 border-gray-700 text-gray-100 placeholder:text-gray-400
                                       focus:ring-2 focus:ring-blue-500 focus:border-blue-500 flex-1"
                                            />
                                            <Button
                                                variant="outline"
                                                onClick={() => handleAddAction(newActionInput)}
                                                className="text-blue-400 hover:text-blue-300 hover:bg-blue-500/20 border-blue-500/30"
                                                disabled={!newActionInput.trim()}
                                            >
                                                Add
                                            </Button>
                                        </div>
                                    </div>

                                </div>
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <div className='flex flex-row gap-3'>
                            <Button onClick={handleDraft}>
                                Save as Draft
                            </Button>
                            <Button
                                type="submit"
                                onClick={handleSubmit}
                            >
                                Proceed
                            </Button>
                        </div>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <AlertDialogFn openAlertBox={openAlertBox} setOpenAlertBox={setOpenAlertBox} message={alertMessage} />
        </>
    )
}
