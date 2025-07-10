import React, { useEffect, useState } from 'react'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/shadcn/ui/dialog'
import { Button } from '@/shadcn/ui/button'
import { FileinfoProps } from '@/ikon/utils/api/file-upload/type';
import { downloadResource, getResourceUrl, openFileInNewTab } from '@/ikon/utils/actions/common/utils';
import { Textarea } from '@/shadcn/ui/textarea';
import { getMyInstancesV2, invokeAction } from '@/ikon/utils/api/processRuntimeService';
import { useRouter } from 'next/navigation';
import { Label } from '@/shadcn/ui/label';
import AlertDialogFn from './alertDialogFn';


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
    remarks?: string[];
    status?: string;
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
    auditId: string;
    actions: FindingActionItem[];
};

type FormValues = {
    observations: string[];
    recommendations: string[];
    controlPolicy: string;
    controlObjective: string;
    actions: any[]; // or better type if you have
    assigneAction: {
        description: string;
        resourceData: {
            resourceId: string;
            resourceName: string;
            resourceSize: number;
            resourceType: string;
        }[];
    }[];
};

type ControlObjective = {
    controlObjId: number;
    ObjProgress: number;
    ObjStatus: string;
    controlObjAssignee: string | null;
    controlObjType: string;
    controlObjweight: number;
    description: string;
    name: string;
    practiceAreas: string;
    status?: string;
};

type Control = {
    policyId: number;
    controlName: string;
    controlAssignee: string | null;
    controlStatus: string;
    controlProgress: number;
    controlWeight: number;
    controlObjectives: ControlObjective[];
};

type AuditInstanceDataProps = {
    controls: Control[];
    auditProgress: number;
    frameworkId: string;
}
type FrameWrokInstanceDataProps = {
    controls: Control[];
    auditProgress: number;
    frameworkId: string;
    compliant: string;
}

interface InstanceData {
    controls: Control[];
}


export default function ActionReviewForm({ openReviewForm, setOpenReviewForm, reviewRow, findActionData }: any) {

    const router = useRouter();
    console.log(reviewRow);

    // const [initialValues, setInitialValues] = useState<FormValues>({
    //     observations: [],
    //     recommendations: [],
    //     controlPolicy: '',
    //     actions: [],
    //     controlObjective: '',
    //     assigneAction: [],
    // });

    const [remark, setRemark] = useState<string>('');
    const [openAlertBox, setOpenAlertBox] = useState<boolean>(false);
    const [alertMessage, setAlertMessage] = useState<string>('');

    // useEffect(() => {
    // In a real application, you would fetch these from an API.
    //     const fetchedValues = {
    //         observations: reviewRow?.observation &&
    //             reviewRow.observation.length > 0 ?
    //             reviewRow.observation.map((observation: string, index: number) => `Observation ${index + 1}:${" " + observation}`) :
    //             ["No Observation Found"],
    //         recommendations: reviewRow?.recommendation &&
    //             reviewRow.recommendation.length > 0 ?
    //             reviewRow.recommendation.map((recommendation: string, index: number) => `Recommendation ${index + 1}:${" " + recommendation}`) :
    //             ["No Recommendation Found"],
    //         actions: [reviewRow?.description],
    //         controlPolicy: reviewRow?.controlId && `${reviewRow?.controlId}: ${" " + reviewRow?.controlName}`,
    //         controlObjective: reviewRow?.controlObjId && `${reviewRow?.controlObjId}: ${" " + reviewRow?.controlObjName}`,
    //         assigneAction: reviewRow?.assigneAction || [],
    //     };
    //     setInitialValues(fetchedValues);
    // }, []);


    function calculateAuditProgress(controls: Control[]) {
        const progress = controls.reduce((acc, obj) => {
            return acc + (obj.controlProgress * obj.controlWeight) / 100;
        }, 0);
        return progress
    }

    function updateControlProgress(controls: Control[]): Control[] {
        return controls.map(control => {
            const progress = control.controlObjectives.reduce((acc, obj) => {
                return acc + (obj.ObjProgress * obj.controlObjweight) / 100;
            }, 0);

            return {
                ...control,
                controlProgress: progress,
            };
        });
    }

    function updateObjectiveProgress(
        data: Control[],
        policyId: number,
        controlObjId: number,
        newProgress: number
    ): Control[] {
        return data.map((control) => {
            if (control.policyId.toString() !== policyId.toString()) return control;

            const updatedObjectives = control.controlObjectives.map((obj) => {
                if (obj.controlObjId.toString() !== controlObjId.toString()) return obj;
                return {
                    ...obj,
                    ObjProgress: newProgress,
                };
            });

            return {
                ...control,
                controlObjectives: updatedObjectives,
            };
        });
    }
    
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

    async function handleReject() {
        if (remark.length <= 0) {
            setOpenAlertBox(true);
            setAlertMessage("Please Provide a Remark");
            return;
        }

        const saveRowFormat = {
            ...reviewRow,
            actionStatus: 'In Progress',
            remarks: [
                ...(Array.isArray(reviewRow.remarks) ? reviewRow.remarks : []),
                remark,
            ]
        }
        console.log(saveRowFormat);
        // const groupedDataMap: Map<string, FindingActionData> = new Map();
        // for (const flatAction of findActionData) {
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
        //             auditId: flatAction.auditId,
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
        //         if (editActionId === reviewRow?.editActionId) {
        //             resolvedStatus = 'In Progress';
        //         }
        //         group.actions.push({
        //             description: flatAction.description,
        //             assignedTo: flatAction.assignedTo,
        //             dueDate: flatAction.dueDate,
        //             timeEntries: flatAction.timeEntries,
        //             assigneAction: flatAction.assigneAction || [],
        //             status: resolvedStatus,
        //             ...(flatAction.editActionId === reviewRow?.editActionId && {
        //                 remarks: [
        //                     ...(Array.isArray(flatAction.remarks) ? flatAction.remarks : []),
        //                     remark,
        //                 ],
        //             }),
        //         })

        //     }
        // }
        // const rebuiltFindingActionDatas: FindingActionData[] = Array.from(groupedDataMap.values());
        // console.log(rebuiltFindingActionDatas[0]);

        const meetingFindingInstances = await getMyInstancesV2({
            processName: "Meeting Findings Actions",
            predefinedFilters: { taskName: "Edit Action" },
            mongoWhereClause: `this.Data.actionsId == "${saveRowFormat?.actionsId}"`,
        })
        console.log(meetingFindingInstances)
        const taskId = meetingFindingInstances[0]?.taskId;
        console.log(taskId);
        await invokeAction({
            taskId: taskId,
            transitionName: 'Update Edit',
            data: saveRowFormat,
            processInstanceIdentifierField: ''
        })
        router.refresh();
        setOpenReviewForm(false);
    }

    async function handleSubmit() {
        if (remark.length <= 0) {
            setOpenAlertBox(true);
            setAlertMessage("Please Provide a Remark");
            return;
        }

        const saveRowFormat = {
            ...reviewRow,
            actionStatus: "Completed",
            remarks: [
                ...(Array.isArray(reviewRow.remarks) ? reviewRow.remarks : []),
                remark,
            ]
        }
        console.log(saveRowFormat);

        // const groupedDataMap: Map<string, FindingActionData> = new Map();
        // for (const flatAction of findActionData) {
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
        //             auditId: flatAction.auditId,
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
        //         if (editActionId === reviewRow?.editActionId) {
        //             resolvedStatus = 'Completed';
        //         }
        //         group.actions.push({
        //             description: flatAction.description,
        //             assignedTo: flatAction.assignedTo,
        //             dueDate: flatAction.dueDate,
        //             timeEntries: flatAction.timeEntries,
        //             assigneAction: flatAction.assigneAction || [],
        //             status: resolvedStatus,
        //             followUpMetting: flatAction.followUpMetting || [],
        //             ...(flatAction.editActionId === reviewRow?.editActionId && {
        //                 remarks: [
        //                     ...(Array.isArray(flatAction.remarks) ? flatAction.remarks : []),
        //                     remark,
        //                 ]
        //             }),
        //         })

        //     }
        // }
        // const currentActionId = reviewRow?.actionsId;
        // const matchedAction = groupedDataMap.get(currentActionId);

        // console.log(matchedAction)
        if (saveRowFormat) {
            const meetingFindingInstances = await getMyInstancesV2({
                processName: "Meeting Findings Actions",
                predefinedFilters: { taskName: "Edit Action" },
                mongoWhereClause: `this.Data.actionsId == "${saveRowFormat?.actionsId}"`,
            })

            const taskId = meetingFindingInstances[0]?.taskId;
            console.log(taskId);
            await invokeAction({
                taskId: taskId,
                transitionName: 'Update Edit',
                data: saveRowFormat,
                processInstanceIdentifierField: ''
            })


            const findingActionInstance = await getMyInstancesV2({
                processName: "Meeting Findings Actions",
                predefinedFilters: { taskName: "Edit Action" },
                mongoWhereClause: `this.Data.auditId == "${saveRowFormat.auditId}" && this.Data.controlName == "${saveRowFormat.controlName}" && this.Data.controlObjName == "${saveRowFormat.controlObjName}"`,
            })

            const findingActionDatas = findingActionInstance.map((findingActionData) => findingActionData.data);
            console.log(findingActionDatas);
            // for calculating 'Control Objectives' progress
            let allCompletedActionCount = 0;
            for (let ac of findingActionDatas) {
                let status = ac?.actionStatus;
                if (status == 'Completed') allCompletedActionCount++; //only if completed
            }
            let each_co_progress = (allCompletedActionCount / findingActionDatas.length) * 100;

            const auditInstance = await getMyInstancesV2({
                processName: 'Audit',
                predefinedFilters: { taskName: 'Progress' },
                mongoWhereClause: `this.Data.auditId == "${saveRowFormat?.auditId}"`,
            })

            const auditInstanceData = auditInstance[0].data as AuditInstanceDataProps;
            const auditInstanceTaskId = auditInstance[0].taskId;
            const updatedObjectiveProgress = updateObjectiveProgress(auditInstanceData?.controls, saveRowFormat.controlId, saveRowFormat.controlObjId, each_co_progress);
            const newControlProgress = updateControlProgress(updatedObjectiveProgress);
            const auditProgress = calculateAuditProgress(newControlProgress);
            auditInstanceData.controls = newControlProgress;
            auditInstanceData.auditProgress = auditProgress;
            await invokeAction({
                data: auditInstanceData,
                transitionName: 'Update Progress',
                taskId: auditInstanceTaskId,
                processInstanceIdentifierField: ''
            })

            if (auditInstanceData.auditProgress === 100) {
                const frameworkInstance = await getMyInstancesV2({
                    processName: 'Control Objectives',
                    predefinedFilters: { taskName: 'view control objecitve' },
                    mongoWhereClause: `this.Data.frameworkId =="${auditInstanceData?.frameworkId}"`
                });
                const frameworkInstanceData = frameworkInstance[0]?.data as FrameWrokInstanceDataProps;
                const frameworkInstanceTaskId = frameworkInstance[0]?.taskId;

                console.log(frameworkInstanceData);

                //Total Audit Control
                const totalControls = auditInstanceData?.controls.length;
                const totalControlObjectives = auditInstanceData?.controls.reduce(
                    (sum, control) => sum + (control.controlObjectives?.length || 0),
                    0
                );

                //Total Knowledge Base Control
                const totalFrameworkControls = frameworkInstanceData?.controls.length;
                const totalFrameworkObjectives = frameworkInstanceData?.controls.reduce(
                    (sum, control) => sum + (control.controlObjectives?.length || 0),
                    0
                );

                if (totalControls === totalFrameworkControls && totalControlObjectives === totalFrameworkObjectives) {
                    frameworkInstanceData.compliant = 'fullyImplemented'
                } else {
                    frameworkInstanceData.compliant = 'partiallyImplemented'
                }


                const auditControlsMap = auditInstanceData.controls.reduce((map, control) => {
                    const key = `${control.controlName}-${control.policyId}`;
                    map[key] = control.controlObjectives.reduce((objMap, objective) => {
                        objMap[`${objective.name}-${objective.controlObjId}`] = objective;
                        return objMap;
                    }, {} as Record<string, ControlObjective>);
                    return map;
                }, {} as Record<string, Record<string, ControlObjective>>);

                frameworkInstanceData.controls.forEach((frameworkControl) => {
                    const controlKey = `${frameworkControl.controlName}-${frameworkControl.policyId}`;
                    const matchingAuditObjectives = auditControlsMap[controlKey];

                    if (matchingAuditObjectives) {
                        frameworkControl.controlObjectives.forEach((frameworkObjective) => {
                            const objectiveKey = `${frameworkObjective.name}-${frameworkObjective.controlObjId}`;
                            const matchingObjective = matchingAuditObjectives[objectiveKey];

                            if (matchingObjective) {
                                frameworkObjective.status = "fullyImplemented";
                            }
                        });
                    }
                });

                console.log(frameworkInstanceData);

                await invokeAction({
                    data: frameworkInstanceData,
                    taskId: frameworkInstanceTaskId,
                    transitionName: 'update view controlObj',
                    processInstanceIdentifierField: ''
                })
            }

            router.refresh();
            setOpenReviewForm(false);

        } else {
            alert("Could Not Save Data");
        }

    }

    // async function handleSubmit() {
    //     const updateRow = {
    //         ...reviewRow,
    //         remarks: [
    //             ...(Array.isArray(reviewRow.remarks) ? reviewRow.remarks : []),
    //             remark,
    //         ],
    //         actionStatus: "Completed"
    //     }
    //     console.log(updateRow);

    //     // const meetingFindingInstances = await getMyInstancesV2({
    //     //     processName: "Meeting Findings Actions",
    //     //     predefinedFilters: { taskName: "View Action" },
    //     //     mongoWhereClause: `this.Data.actionsId == "${updateRow?.actionsId}"`,
    //     // })
    //     // const taskId = meetingFindingInstances[0]?.taskId;
    //     // await invokeAction({
    //     //     taskId: taskId,
    //     //     transitionName: 'Update View',
    //     //     data: updateRow,
    //     //     processInstanceIdentifierField: ''
    //     // });


    //     const meetingFindingStatus = await getMyInstancesV2({
    //         processName: "Meeting Findings Actions",
    //         predefinedFilters: { taskName: "View Action" },
    //         mongoWhereClause: `this.Data.editCompleteActionId == "${updateRow?.editCompleteActionId}"`,
    //         projections: ['Data.actionStatus']
    //     })

    //     console.log(meetingFindingStatus)
    //     const meetingFindingStatusData = meetingFindingStatus.map((meetingFindingCurrentStatus) => meetingFindingCurrentStatus.data)
    //     console.log(meetingFindingStatusData)


    //     let allCompletedActionCount = 0;
    //     for (let ac of meetingFindingStatusData) {
    //         let status = ac?.actionStatus;
    //         if (status == 'Completed') allCompletedActionCount++; //only if completed
    //     }

    //     let each_co_progress = (allCompletedActionCount / meetingFindingStatusData.length) * 100;

    //     console.log(each_co_progress);

    //     const auditInstance = await getMyInstancesV2({
    //         processName: 'Audit',
    //         predefinedFilters: { taskName: 'Progress' },
    //     })

    //     const auditInstanceData = auditInstance[0].data as AuditInstanceDataProps;
    //     const auditInstanceTaskId = auditInstance[0].taskId;
    //     const updatedObjectiveProgress = updateObjectiveProgress(auditInstanceData?.controls, updateRow.controlId, parseFloat(updateRow.controlObjId), each_co_progress);
    //     console.log(updatedObjectiveProgress);

    //     const newControlProgress = updateControlProgress(updatedObjectiveProgress);
    //     const auditProgress = calculateAuditProgress(newControlProgress);
    //     auditInstanceData.controls = newControlProgress;
    //     auditInstanceData.auditProgress = auditProgress;

    //     console.log(auditInstanceData);

    //     // await invokeAction({
    //     //     data: auditInstanceData,
    //     //     transitionName: 'Update Progress',
    //     //     taskId: auditInstanceTaskId,
    //     //     processInstanceIdentifierField: ''
    //     // })

    //     // if (auditInstanceData.auditProgress === 100) {
    //     //     const totalControls = auditInstanceData?.controls.length;

    //     //     const totalControlObjectives = auditInstanceData?.controls.reduce(
    //     //         (sum, control) => sum + (control.controlObjectives?.length || 0),
    //     //         0
    //     //     );

    //     //     console.log(totalControls);
    //     //     console.log(totalControlObjectives);

    //     //     const frameworkInstance = await getMyInstancesV2({
    //     //         processName: 'Control Objectives',
    //     //         predefinedFilters: { taskName: 'edit control objective' },
    //     //         mongoWhereClause: `this.Data.frameworkId =="${auditInstanceData?.frameworkId}"`
    //     //     });

    //     //     const frameworkInstanceData = frameworkInstance[0]?.data as FrameWrokInstanceDataProps;
    //     //     console.log(frameworkInstanceData);
    //     //     const frameworkInstanceTaskId = frameworkInstance[0]?.taskId;
    //     //     console.log(frameworkInstanceTaskId);
    //     //     const totalFrameworkControls = frameworkInstanceData?.controls.length;

    //     //     const totalFrameworkObjectives = frameworkInstanceData?.controls.reduce(
    //     //         (sum, control) => sum + (control.controlObjectives?.length || 0),
    //     //         0
    //     //     );

    //     //     if (totalControls === totalFrameworkControls && totalControlObjectives === totalFrameworkObjectives) {
    //     //         frameworkInstanceData.compliant = 'fullyImplemented'
    //     //     } else {
    //     //         frameworkInstanceData.compliant = 'partiallyImplemented'
    //     //     }

    //     //     console.log(frameworkInstanceData);

    //     //     await invokeAction({
    //     //         data: frameworkInstanceData,
    //     //         taskId: frameworkInstanceTaskId,
    //     //         transitionName: 'update edit controlObj',
    //     //         processInstanceIdentifierField: ''
    //     //     })
    //     // }

    //     // router.refresh();
    //     // setOpenReviewForm(false);
    // }



    return (
        <>
            <Dialog open={openReviewForm} onOpenChange={setOpenReviewForm}>
                <DialogContent className="!max-w-none !w-screen !h-screen p-6 flex flex-col">
                    <DialogHeader>
                        <DialogTitle>Action Verification Form</DialogTitle>
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

                                {initialValues?.actions && (
                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-gray-300">
                                            Assigned Task
                                        </label>
                                        <ul className="list-disc list-inside p-3 bg-gray-800 rounded-md border border-gray-700 text-gray-400">
                                            {initialValues.actions.map((action, index) => (
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
                                        {reviewRow?.controlName}
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-gray-300">
                                        Control Objective
                                    </label>
                                    <div className="p-3 bg-gray-800 rounded-md border border-gray-700 text-gray-400">
                                        {reviewRow?.controlObjName}
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-gray-300">
                                        Observations
                                    </label>
                                    <div className="p-3 bg-gray-800 rounded-md border border-gray-700 text-gray-400">
                                        {reviewRow?.observation}
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-gray-300">
                                        Recommendations
                                    </label>
                                    <div className="p-3 bg-gray-800 rounded-md border border-gray-700 text-gray-400">
                                        {reviewRow?.recommendation}
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-gray-300">
                                        Your Assigned Task
                                    </label>
                                    <div className="p-3 bg-gray-800 rounded-md border border-gray-700 text-gray-400">
                                        {reviewRow?.description}
                                    </div>
                                </div>

                                {reviewRow?.assigneAction && reviewRow.assigneAction.length > 0 && (
                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-gray-300">
                                            Task Solutions
                                        </label>
                                        <ul className="space-y-3 p-3 max-h-44 overflow-y-auto bg-gray-800 rounded-md border border-gray-700 text-gray-400">
                                            {reviewRow.assigneAction.map((action, index) => (
                                                <li key={index} className="flex flex-col gap-1">
                                                    {/* Description */}
                                                    <div className="font-semibold text-gray-200">{action.description}</div>

                                                    {/* Resource Names */}
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

                                {reviewRow && Array.isArray(reviewRow.remarks) && reviewRow.remarks.length > 0 && (
                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-gray-300">
                                            Previous Remarks
                                        </label>
                                        <ul className="space-y-3 max-h-44 overflow-y-auto list-disc  list-inside p-3 bg-gray-800 rounded-md border border-gray-700 text-gray-400">
                                            {reviewRow.remarks.map((remark: string, index: number) => (
                                                <li key={index}>{remark}</li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                                <div className='mt-3'>
                                    <Label>Enter Your Remarks</Label>
                                    <Textarea
                                        value={remark}
                                        onChange={(e) => setRemark(e.target.value)}
                                        placeholder="Enter Your Remarks..."
                                        className="bg-gray-700 border-gray-600 text-gray-100 placeholder:text-gray-400
                                                                                       focus:ring-2 focus:ring-blue-500 focus:border-blue-500  min-h-[100px] flex-1"
                                        required
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <>
                            <div className='flex flex-row gap-3'>
                                <Button
                                    type="submit"
                                    onClick={handleReject}
                                >
                                    Reject
                                </Button>
                                <Button
                                    type="submit"
                                    onClick={handleSubmit}
                                >
                                    Approve
                                </Button>
                            </div>
                        </>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <AlertDialogFn openAlertBox={openAlertBox} setOpenAlertBox={setOpenAlertBox} message={alertMessage} />
        </>
    )

}
