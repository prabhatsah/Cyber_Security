import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shadcn/ui/dialog";
import React, { SetStateAction, useEffect, useState } from "react";
import { Button } from "@/shadcn/ui/button";
import { ChevronLeft, ChevronRight, Copy, EllipsisVertical, GraduationCap, NotepadText, Plus, UserRound } from "lucide-react";
import {
  mapProcessName,
  startProcessV2,
} from "@/ikon/utils/api/processRuntimeService";
import { useRouter } from "next/navigation";
import AlertDialogFn from "../alertDialogFn";
import AddActionMettingForm from "./addActionMettingForm";
import ActionWidgetCard from "./components/ActionWidgetCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/shadcn/ui/card";
import { format } from "date-fns";
import { SAVE_DATE_FORMAT_GRC } from "@/ikon/utils/config/const";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuTrigger } from "@/shadcn/ui/dropdown-menu";
import NoDataComponent from "@/ikon/components/no-data";
import { Badge } from "@/shadcn/ui/badge";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/shadcn/ui/carousel";
import { v4 } from "uuid";


interface AddActionsMettingProps {
  openActionForm: boolean;
  setOpenActionForm: React.Dispatch<SetStateAction<boolean>>;
  userIdNameMap: { value: string; label: string }[];
  selectedRowData: Record<string, any> | null;
  frameworkId: string
}

interface ActionProps {
  description: string;
  owner: string;
  assignedTo: string;
  dueDate: Date | undefined;
  timeEntries: { date: Date; hours: number }[];
}

export default function AddMettingActions({
  openActionForm,
  setOpenActionForm,
  userIdNameMap,
  selectedRowData,
  frameworkId
}: AddActionsMettingProps) {
  const router = useRouter();
  console.log(userIdNameMap);
  console.log(selectedRowData);
  console.log(frameworkId);
  const [actions, setActions] = useState<ActionProps[]>([]);
  const [openAlertBox, setOpenAlertBox] = useState<boolean>(false);
  const [alertMessage, setAlertMessage] = useState<string>('');
  const [openActionMeetingForm, setOpenActionMeetingForm] = useState<boolean>(false);
  const [openActionEditMeetingForm, setOpenActionEditMeetingForm] = useState<boolean>(false);
  const [editAction, setEditAction] = useState<ActionProps | null>(null);
  const [editIndex, setEditIndex] = useState<number | null>(null);

  const handleSubmit = async () => {
    if (actions.length <= 0) {
      setOpenAlertBox(true);
      setAlertMessage("Please Atleast add one Action Field");
      return;
    }

    const saveDataFormat = actions.map((action) => ({
      actionsId: v4(),
      ...action,
      actionStatus: "In Progress",
      ...selectedRowData,
      frameworkId: frameworkId
    }));

    console.log(saveDataFormat)

    const processId = await mapProcessName({
      processName: "Meeting Findings Actions",
    });
    for (const saveData of saveDataFormat) {
      await startProcessV2({
        processId: processId,
        data: saveData,
        processIdentifierFields: "",
      });
    }
    router.refresh();
    setOpenActionForm(false);
  };
  return (
    <>
      <Dialog open={openActionForm} onOpenChange={setOpenActionForm}>
        <DialogContent className="!max-w-none !w-screen !h-screen p-4 flex flex-col">
          <DialogHeader>
            <DialogTitle>Task Form</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-6 h-full">
            {/* Action Widget */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <ActionWidgetCard
                title="Control Policy"
                content={selectedRowData?.controlName}
                icon={Copy}
              />
              <ActionWidgetCard
                title="Control Objective"
                content={selectedRowData?.controlObjective}
                icon={Copy}
              />
              <ActionWidgetCard
                title="Observations"
                content={selectedRowData?.observation}
                icon={Copy}
              />
              <ActionWidgetCard
                title="Recommendations"
                content={selectedRowData?.recommendation}
                icon={Copy}
              />
            </div>

            <div className="flex flex-row justify-between">
              <span>Task and Policies</span>
              <Button variant='outline' onClick={() => { setOpenActionMeetingForm(true) }}>
                Add Action
                <Plus className="w-5 h-5" />
              </Button>
            </div>
            {
              actions.length === 0 ?
                <NoDataComponent text="No Action Availabel" /> :
                <div className="mb-3">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-3 h-[65vh] overflow-y-auto">
                    {
                      actions.map((action, index) => {
                        return (
                          <Card key={index} className="p-1 h-[40%] overflow-y-auto">
                            <CardHeader>
                              <CardTitle>
                                <div className="flex flex-row justify-between">
                                  <div className="flex flex-row gap-2">
                                    <UserRound className="w-5 h-5" />
                                    <div className="self-center">
                                      {userIdNameMap?.find((u) => u.value === action?.assignedTo)?.label || 'N/A'}
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
                                            setEditAction(action);
                                            setEditIndex(index);
                                            setOpenActionEditMeetingForm(true);
                                          }}>
                                            Edit
                                          </DropdownMenuItem>
                                          <DropdownMenuItem onClick={() => {
                                            setActions(prevActions => prevActions.filter((_, i) => i !== index));
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
                                  <div className="line-clamp-2" title={action?.description || 'N/A'}>
                                    {action?.description || 'N/A'}
                                  </div>
                                </div>

                                <div className="flex flex-row gap-3">
                                  <NotepadText className="w-5 h-5" />
                                  <span>Due Date: </span>
                                  {action.dueDate ? format(action.dueDate, SAVE_DATE_FORMAT_GRC) : 'N/A'}
                                </div>

                                <Carousel className="w-full">
                                  <div className="flex flex-row justify-between items-center mb-2">
                                    <div className="flex flex-row gap-1 items-center">
                                      <GraduationCap className="w-5 h-5" />
                                      <span>Time Entry</span>
                                    </div>
                                    <div className="flex flex-row gap-2">
                                      <CarouselPrevious className="relative left-0 top-3 w-5 h-5 p-1" />
                                      <CarouselNext className="relative right-0 top-3 w-5 h-5 p-1 " />
                                    </div>
                                  </div>

                                  {/* Carousel content or fallback */}
                                  <div className="w-full overflow-hidden">
                                    {action.timeEntries.length === 0 ? (
                                      <Badge className="text-center py-2">
                                        No Time Entries Available
                                      </Badge>
                                    ) : (
                                      <CarouselContent>
                                        {action.timeEntries.map((timeEntry, index) => (
                                          <CarouselItem
                                            key={index}
                                            className="flex justify-center basis-full md:basis-1/2"
                                          >
                                            <Badge className="w-full text-center py-2">
                                              {timeEntry.date
                                                ? format(timeEntry.date, SAVE_DATE_FORMAT_GRC)
                                                : 'N/A'}
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
            <Button type="submit" onClick={()=>{handleSubmit()}}>
              Save changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog >
      {
        openActionMeetingForm &&
        (
          <AddActionMettingForm
            openActionMeetingForm={openActionMeetingForm}
            setOpenActionMeetingForm={setOpenActionMeetingForm}
            userIdNameMap={userIdNameMap}
            owner={selectedRowData?.owner || ''}
            setActions={setActions}
            type='new'
          />
        )}
      {openActionEditMeetingForm && editAction && editIndex !== null && (
        <AddActionMettingForm
          openActionMeetingForm={openActionEditMeetingForm}
          setOpenActionMeetingForm={setOpenActionEditMeetingForm}
          userIdNameMap={userIdNameMap}
          owner={selectedRowData?.owner || ''}
          setActions={setActions}
          type="existing"
          editAction={editAction}
          editIndex={editIndex}
        />
      )}
      {
        openAlertBox &&
        <AlertDialogFn openAlertBox={openAlertBox} setOpenAlertBox={setOpenAlertBox} message={alertMessage} />
      }
    </>
  );
}
