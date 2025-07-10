import { Button } from '@/shadcn/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/shadcn/ui/dialog';
import { Copy, EllipsisVertical, GraduationCap, Plus, UserRound } from 'lucide-react';
import React, { SetStateAction, useEffect, useState } from 'react'
import ActionWidgetCard from '../actionMetting/components/ActionWidgetCard';
import AddActionSolnForm from './addActionSolnForm';
import { FileinfoProps } from '@/ikon/utils/api/file-upload/type';
import NoDataComponent from '@/ikon/components/no-data';
import { Card, CardContent, CardHeader, CardTitle } from '@/shadcn/ui/card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuTrigger } from '@/shadcn/ui/dropdown-menu';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/shadcn/ui/carousel';
import { Badge } from '@/shadcn/ui/badge';
import { getResourceUrl, openFileInNewTab } from '@/ikon/utils/actions/common/utils';
import AlertDialogFn from '../alertDialogFn';
import { getMyInstancesV2, invokeAction } from '@/ikon/utils/api/processRuntimeService';
import { useRouter } from 'next/navigation';




interface AddActionSolnProps {
    openEditableActionForm: boolean;
    setOpenEditableActionForm: React.Dispatch<SetStateAction<boolean>>;
    selectedRow: Record<string, any> | null;
}

interface CorrectionProps {
    description: string;
    resourceData: FileinfoProps[] | null;
}


export default function AddActionSoln({
    openEditableActionForm,
    setOpenEditableActionForm,
    selectedRow,
}: AddActionSolnProps) {
    const router = useRouter()
    const [solutionForm, setSolutioinForm] = useState<boolean>(false);
    const [corrections, setCorrections] = useState<CorrectionProps[]>([]);
    const [solutionEditForm, setSolutionEditForm] = useState<boolean>(false);
    const [editSolution, setEditSolution] = useState<CorrectionProps | null>(null);
    const [editSolnIndex, setEditSolnIndex] = useState<number | null>(null);
    const [openAlertBox, setOpenAlertBox] = useState<boolean>(false);
    const [alertMessage, setAlertMessage] = useState<string>('');

    useEffect(() => {
        if (selectedRow && selectedRow?.assigneAction && selectedRow.assigneAction.length) {
            setCorrections(selectedRow?.assigneAction || []);
        }
    }, [])

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

    const handleDraft = async () => {
        if (corrections.length <= 0) {
            setOpenAlertBox(true);
            setAlertMessage("Please Atleast add one Solution Field");
            return;
        }

        const updateRow = {
            ...selectedRow,
            actionStatus: "In Progress",
            assigneAction: [
                ...(selectedRow?.assigneAction || []),
                ...corrections,
            ],
        }
        console.log(updateRow);
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
        } else {
            alert("Could No Save Data");
        }
        router.refresh();
        setOpenEditableActionForm(false);
    }

    const handleSubmit = async () => {
        if (corrections.length <= 0) {
            setOpenAlertBox(true);
            setAlertMessage("Please Atleast add one Solution Field");
            return;
        }
        const updateRow = {
            ...selectedRow,
            actionStatus: "Pending",
            assigneAction: [
                ...(selectedRow?.assigneAction || []),
                ...corrections,
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
    }

    return (
        <>
            <Dialog open={openEditableActionForm} onOpenChange={setOpenEditableActionForm}>
                <DialogContent className="!max-w-none !w-screen !h-screen p-4 flex flex-col">
                    <DialogHeader>
                        <DialogTitle>Solution Form</DialogTitle>
                    </DialogHeader>
                    <div className="flex flex-col gap-6 h-full">
                        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
                            <ActionWidgetCard
                                title="Control Policy"
                                content={selectedRow?.controlName}
                                icon={Copy}
                            />
                            <ActionWidgetCard
                                title="Control Objective"
                                content={selectedRow?.controlObjective}
                                icon={Copy}
                            />
                            <ActionWidgetCard
                                title="Observations"
                                content={selectedRow?.observation}
                                icon={Copy}
                            />
                            <ActionWidgetCard
                                title="Recommendations"
                                content={selectedRow?.recommendation}
                                icon={Copy}
                            />
                            <ActionWidgetCard
                                title="Your Assigned Task"
                                content={selectedRow?.description}
                                icon={Copy}
                            />
                        </div>

                        <div className="flex flex-row justify-between">
                            <span>Task and Policies</span>
                            <Button variant='outline' onClick={() => { setSolutioinForm(true) }}>
                                Add Solutions
                                <Plus className="w-5 h-5" />
                            </Button>
                        </div>

                        {
                            corrections.length === 0 ?
                                <NoDataComponent text="No Action Availabel" /> :
                                <div className="mb-3">
                                    <div className="grid grid-cols-1 md:grid-cols-4 gap-3 h-[65vh] overflow-y-auto">
                                        {
                                            corrections.map((correction, index) => {
                                                return (
                                                    <Card key={index} className="p-1 h-[30%] overflow-y-auto">
                                                        <CardHeader>
                                                            <CardTitle>
                                                                <div className="flex flex-row justify-between">
                                                                    <div className="flex flex-row gap-2">
                                                                        <UserRound className="w-5 h-5" />
                                                                        <div className="self-center">
                                                                            Solution {index + 1}
                                                                        </div>
                                                                    </div>
                                                                    <div>
                                                                        <DropdownMenu>
                                                                            <DropdownMenuTrigger asChild>
                                                                                <EllipsisVertical className="cursor-pointer" />
                                                                            </DropdownMenuTrigger>
                                                                            <DropdownMenuContent className="w-56">
                                                                                <DropdownMenuGroup>
                                                                                    <DropdownMenuItem onClick={() => {
                                                                                        setEditSolution(correction);
                                                                                        setEditSolnIndex(index);
                                                                                        setSolutionEditForm(true);
                                                                                    }}
                                                                                    >
                                                                                        Edit
                                                                                    </DropdownMenuItem>
                                                                                    <DropdownMenuItem onClick={() => {
                                                                                        setCorrections(prevActions => prevActions.filter((_, i) => i !== index));
                                                                                    }}>
                                                                                        Delete
                                                                                    </DropdownMenuItem>
                                                                                </DropdownMenuGroup>
                                                                            </DropdownMenuContent>
                                                                        </DropdownMenu>
                                                                    </div>
                                                                </div>
                                                            </CardTitle>
                                                        </CardHeader>
                                                        <CardContent>
                                                            <div className="flex flex-col gap-3">
                                                                <div className="w-full">
                                                                    <div className="line-clamp-2" title={correction?.description || 'N/A'}>
                                                                        {correction?.description || 'N/A'}
                                                                    </div>
                                                                </div>
                                                                <Carousel className="w-full">
                                                                    <div className="flex flex-row justify-between items-center mb-2">
                                                                        <div className="flex flex-row gap-1 items-center">
                                                                            <GraduationCap className="w-5 h-5" />
                                                                            <span>Uploaded Files</span>
                                                                        </div>
                                                                        <div className="flex flex-row gap-2">
                                                                            <CarouselPrevious className="relative left-0 top-3 w-5 h-5 p-1" />
                                                                            <CarouselNext className="relative right-0 top-3 w-5 h-5 p-1 " />
                                                                        </div>
                                                                    </div>

                                                                    {/* Carousel content or fallback */}
                                                                    <div className="w-full overflow-hidden">
                                                                        {correction?.resourceData?.length === 0 ? (
                                                                            <Badge className="text-center py-2">
                                                                                No File Uploaded
                                                                            </Badge>
                                                                        ) : (
                                                                            <CarouselContent>
                                                                                {correction?.resourceData?.map((resourceFileInfo, index) => (
                                                                                    <CarouselItem
                                                                                        key={index}
                                                                                        className="flex justify-center basis-full md:basis-1/2"
                                                                                    >
                                                                                        <Badge className="w-full text-center py-2 cursor-pointer" onClick={() => { donwloadFile(resourceFileInfo) }}>
                                                                                            <div className='truncate w-[150px]' title={resourceFileInfo?.resourceName}>
                                                                                                {resourceFileInfo?.resourceName || 'N/A'}
                                                                                            </div>
                                                                                        </Badge>
                                                                                    </CarouselItem>
                                                                                ))}
                                                                            </CarouselContent>
                                                                        )}
                                                                    </div>
                                                                </Carousel>
                                                            </div>
                                                        </CardContent>
                                                    </Card>
                                                )
                                            })
                                        }
                                    </div>
                                </div>
                        }

                    </div>
                    <DialogFooter>
                        <div className='flex flex-row gap-3'>
                            <Button onClick={handleDraft}>
                                Save as Draft
                            </Button>
                            <Button type="submit" onClick={() => { handleSubmit() }}>
                                Save changes
                            </Button>
                        </div>
                    </DialogFooter>
                </DialogContent>
            </Dialog >
            {
                solutionForm && (
                    <AddActionSolnForm solutionForm={solutionForm} setSolutioinForm={setSolutioinForm} setCorrections={setCorrections} type={'new'} />
                )
            }
            {
                solutionEditForm && editSolution && editSolnIndex !== null && (
                    <AddActionSolnForm
                        solutionForm={solutionEditForm}
                        setSolutioinForm={setSolutionEditForm}
                        setCorrections={setCorrections}
                        type={'existing'}
                        editSolution={editSolution}
                        editSolnIndex={editSolnIndex}
                    />
                )
            }

            {
                openAlertBox && (
                    <AlertDialogFn openAlertBox={openAlertBox} setOpenAlertBox={setOpenAlertBox} message={alertMessage} />
                )
            }
        </>
    )
}
