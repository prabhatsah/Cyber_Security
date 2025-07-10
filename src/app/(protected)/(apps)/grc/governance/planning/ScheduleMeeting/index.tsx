// the code below is working fine so always keep this code

import FormDateInput from '@/ikon/components/form-fields/date-input';
import FormInput from '@/ikon/components/form-fields/input';
import FormTextarea from '@/ikon/components/form-fields/textarea';
import FormMultiComboboxInput from '@/ikon/components/form-fields/multi-combobox-input';
import { Button } from '@/shadcn/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/shadcn/ui/dialog';
import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react'
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { v4 } from 'uuid';
import { useRouter } from "next/navigation";
import { SAVE_DATE_FORMAT_GRC } from '@/ikon/utils/config/const';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/shadcn/ui/form";
import { getMyInstancesV2, invokeAction, mapProcessName, startProcessV2 } from '@/ikon/utils/api/processRuntimeService';
import { Input } from '@/shadcn/ui/input';
import FormComboboxInput from '@/ikon/components/form-fields/combobox-input';
import { Checkbox } from '@/shadcn/ui/checkbox';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/shadcn/ui/accordion";
import { Trash } from 'lucide-react';
import { format, formatISO } from 'date-fns';
import { Alert, AlertDescription } from '@/shadcn/ui/alert';
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from "@/shadcn/ui/alert-dialog";
import { MultiSelect } from '../ModalForm/[auditId]/audit/AuditDropdownTest';



export const MeetingFormSchema = z.object({
  MEETING_TITLE: z.string().min(2, { message: 'Meeting Title must be at least 2 characters long.' }),
  MEETING_LINK: z.string().optional(),
  MEET_PARTICIPANTS: z.array(z.string()).min(1, { message: 'Select at least one participant.' }),
  MEETING_MODE: z.string({ required_error: 'Meeting Mode is required.' }).min(1, { message: 'Meeting Mode is required.' }),
  START_DATE: z.date({ required_error: 'Start Date is required.' }),
  START_TIME: z.string({ required_error: 'Start Time is required.' }),
  DURATION: z.string().optional(),
  MEETING_DESCRIPTION: z.string().min(2, { message: 'Meeting Description is required.' }),
  CONTROL_NAME: z.string().optional(),
  CONTROL_OBJ: z.string().optional(),
  FRAMEWORK: z.string().optional(),
  AUDIT_NAME: z.string().optional(),
  MEETING_STATUS: z.string().optional(),
  MEETING_VENUE: z.string().optional(),
})

export const AuditMode = [
  { value: 'Online', label: 'Online' },
  { value: 'Offline', label: 'Offline' },
];
export const MeetigStatus = [
  { value: 'In Progess', label: 'In Progess' },
  { value: 'Completed', label: 'Completed' },
  { value: 'Pending', label: 'Pending' },
];

export default function MeetingForm({ open, setOpen, userIdNameMap, auditData, editMeeting }: { open: boolean; setOpen: React.Dispatch<React.SetStateAction<boolean>>; userIdNameMap: { value: string, label: string }[]; auditData: Record<string, any> | null; editMeeting: Record<string, any> | null; }) {
  const router = useRouter();
  debugger;
  const form = useForm<z.infer<typeof MeetingFormSchema>>({
    resolver: zodResolver(MeetingFormSchema),
    defaultValues: {
      MEETING_TITLE: '',
      MEETING_LINK: '',
      MEET_PARTICIPANTS: [],
      MEETING_MODE: '',
      START_DATE: undefined,
      START_TIME: '',
      MEETING_STATUS: 'In Progess',
      MEETING_VENUE: '',
      DURATION: '',
      MEETING_DESCRIPTION: '',
      CONTROL_NAME: '',
      CONTROL_OBJ: '',
      FRAMEWORK: '',
      AUDIT_NAME: '',
    },
  });

  function getMappedParticipants(auditee: string[], auditor: string[], userIdNameMap: { value: string, label: string }[]) {
    const uniqueIds = new Set([...auditee, ...auditor]);
    return [...uniqueIds]
      .map(id => userIdNameMap.find(user => user.value === id))
      .filter(Boolean);
  }

  function generateDescription(combinations: { controlName: string; objectives: { id: string; name: string }[] }[]) {
    if (combinations.length === 0) {
      return "This meeting is scheduled to discuss audit-related topics.";
    }

    const controlSections = combinations.map((combo) => {
      const objNames = combo.objectives.map(obj => obj.name).join("\n\n");
      return `* Under ${combo.controlName}, we will focus on:\n\n${objNames}`;
    });

    return `This meeting is scheduled to review the following control policies and their objectives:\n\n${controlSections.join('\n\n')}\n\n`;
  }

  const controlData = auditData?.controls || [];
  const controlNames = controlData.map((control: any) => ({
    value: control.policyId.toString(),
    label: control.controlName,
  }));

  const controlObjectives = controlData.reduce(
    (acc: Record<string, { id: string; name: string }[]>, control: any) => {
      acc[control.policyId.toString()] = control.controlObjectives.map((obj: any) => ({
        id: obj.controlObjId.toString(),
        name: obj.name,
      }));
      return acc;
    },
    {}
  );

  const [combinations, setCombinations] = React.useState<{ controlName: string; controlId: string; objectives: { id: string; name: string }[] }[]>([]);
  const meetingMode = form.watch('MEETING_MODE');
  const selectedControlId = form.watch('CONTROL_NAME');
  const selectedObjectivesIds = form.watch('CONTROL_OBJ')?.split(',') || [];

  const selectedControlName = controlNames.find((c: any) => c.value === selectedControlId)?.label || '';

  const selectedObjectives = selectedControlId ? controlObjectives[selectedControlId]?.filter((obj: any) => selectedObjectivesIds.includes(obj.id)) || [] : [];

  React.useEffect(() => {
    if (open) {
      form.reset({
        MEETING_TITLE: '',
        MEETING_LINK: '',
        MEET_PARTICIPANTS: getMappedParticipants(auditData?.auditeeTeam || [], auditData?.auditorTeam || [], userIdNameMap).map(p => p?.value || ''),
        MEETING_MODE: '',
        START_DATE: undefined,
        START_TIME: '',
        MEETING_STATUS: 'In Progess',
        MEETING_VENUE: '',
        DURATION: '',
        MEETING_DESCRIPTION: '',
        CONTROL_NAME: '',
        CONTROL_OBJ: '',
        FRAMEWORK: auditData?.policyName || '',
        AUDIT_NAME: auditData?.auditName || '',
      });
      setCombinations([]);
    }
  }, [open, auditData, userIdNameMap]);

  async function saveMeetingInfo(data: z.infer<typeof MeetingFormSchema>) {
  
    const meetingData = {
      meetingId: editMeeting ? editMeeting.meetingId : v4(),
      meetingTitle: data.MEETING_TITLE,
      meetingLink: data.MEETING_LINK,
      meetingVenue: data.MEETING_VENUE,
      meetingParticipants: data.MEET_PARTICIPANTS,
      meetingMode: data.MEETING_MODE,
      startDate: format(data.START_DATE, SAVE_DATE_FORMAT_GRC),
      startTime: data.START_TIME,
      meetingStatus: data.MEETING_STATUS,
      duration: data.DURATION,
      description: data.MEETING_DESCRIPTION,
      auditId: auditData?.auditId || "",
      frameworkId: auditData?.frameworkId || "",
      emailDateFormate: formatISO(new Date(data.START_DATE)),
      selectedControls: combinations.map(combo => ({
        controlName: combo.controlName,
        policyId: controlData.find((c: any) => c.controlName === combo.controlName)?.policyId,
        controlObj: combo.objectives.map((obj: any) => ({
          objName: obj.name,
          objId: obj.id,
        })),
      })),
    };

    debugger;
    console.log("meetingData ---------- ", meetingData);

    try {
      if (editMeeting) {
        const meetingCreateInstances = await getMyInstancesV2({
          processName: "Schedule Meeting",
          predefinedFilters: { taskName: "Edit Meeting" },
          mongoWhereClause: `this.Data.meetingId == "${editMeeting.meetingId}"`,
        });
        const taskId = meetingCreateInstances[0].taskId;
        await invokeAction({ taskId: taskId, data: meetingData, transitionName: 'Update Edit', processInstanceIdentifierField: 'meetingId', });
      } else {
        const meetingProcessId = await mapProcessName({ processName: "Schedule Meeting" });
        await startProcessV2({ processId: meetingProcessId, data: meetingData, processIdentifierFields: "meetingId", });
      }
    } catch (error) {
      console.error("Error saving meeting data:", error);
    }

    setOpen(false);
    router.refresh();
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="!max-w-none !w-screen !h-screen p-6 flex flex-col">
        <DialogHeader>
          <DialogTitle>
            Schedule Meeting
          </DialogTitle>
        </DialogHeader>

        <Form {...form} >
          <form onSubmit={form.handleSubmit(saveMeetingInfo)} className="h-[95%]">
            {/* <div className="grid gap-3"> */}
            <div className="grid grid-cols-2 gap-4 overflow-auto h-full">
              <div className="overflow-y-auto pr-4 h-full  border-muted bg-card-new p-4 ">
                <div className="grid grid-cols-2 gap-3 mb-3">
                  <FormInput formControl={form.control} name="FRAMEWORK" label="Framework" disabled />
                  <FormInput formControl={form.control} name="AUDIT_NAME" label="Audit Name" disabled />
                </div>
                <div className="grid grid-cols-2 gap-3 mb-3">
                  <FormInput formControl={form.control} name="MEETING_TITLE" label="Title*" placeholder="Enter Meeting Title" />
                  <FormComboboxInput items={AuditMode} formControl={form.control} name="MEETING_MODE" placeholder="Select Meeting Mode" label="Mode*" />
                </div>

                {meetingMode === 'Online' && (
                  <FormInput formControl={form.control} name="MEETING_LINK" label="Meeting Link" placeholder="Enter Meeting Link" />
                )}
                {meetingMode === 'Offline' && (
                  <FormInput formControl={form.control} name="MEETING_VENUE" label="Meeting Venue" placeholder="Enter Meeting Venue" />
                )}
                <div className="grid grid-cols-1 gap-3 mb-3">
                  <FormMultiComboboxInput formControl={form.control} name="MEET_PARTICIPANTS" label="Participant(s)*" placeholder="Select Participants" items={userIdNameMap} defaultValue={form.getValues("MEET_PARTICIPANTS")} defaultOptions={4} />
                </div>
                <div className="grid grid-cols-2 gap-3 mb-3">
                  <FormDateInput formControl={form.control} name="START_DATE" label="Date*" placeholder="Enter Start Date" dateFormat={SAVE_DATE_FORMAT_GRC} />
                  <FormField
                    control={form.control}
                    name="START_TIME"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Start Time*</FormLabel>
                        <FormControl>
                          <Input {...field} type="time" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid grid-cols-2 gap-3 mb-3">
                  <FormInput formControl={form.control} type="number" name="DURATION" label="Duration(hrs)" placeholder="Enter Duration" />
                  <FormComboboxInput items={MeetigStatus} formControl={form.control} name="MEETING_STATUS" placeholder="Select Status" label="Status*" />
                </div>

                <div className="grid grid-cols-1 gap-3 h-40">
                  <FormTextarea formControl={form.control} name="MEETING_DESCRIPTION" placeholder="Description" formItemClass="h-full" className="h-full" label="Description" />
                </div>

                <div className='flex justify-end space-x-2 mt-10'>
                  <Button
                    type="button"
                    onClick={() => {
                      const newDescription = generateDescription(combinations);
                      form.setValue('MEETING_DESCRIPTION', newDescription);
                    }}
                  >
                    Generate
                  </Button>
                </div>
              </div>

              <div className="overflow-y-auto pl-4 border-1 border-muted h-full border-l border-white bg-card-new p-2">
                {/* <span className="text-sm text-muted-foreground">*Please select the control policies & control objectives that you would like to review in the meeting</span> */}
                <Alert
                  variant="default"
                  className=" border-l-4 border-green-500 bg-green-500/10 text-green-400 dark:bg-green-900/50 dark:text-green-300 p-2 rounded-md shadow-md"
                >
                  <AlertDescription>
                    Please select the control policies & control objectives that you would like to review in the meeting
                  </AlertDescription>
                </Alert>

                <div className="m-2">
                  <FormComboboxInput items={controlNames} formControl={form.control} name="CONTROL_NAME" placeholder="Select Control Policy" label="Control Policy" />
                </div>
                {selectedControlId && (
                  <FormField
                    control={form.control}
                    name="CONTROL_OBJ"
                    render={({ field }) => {
                      const valueArray = field.value ? field.value.split(',') : [];
                      const objectives = controlObjectives[selectedControlId] || [];


                      const toggleValue = (id: string) => {
                        const newValues = valueArray.includes(id)
                          ? valueArray.filter((v) => v !== id)
                          : [...valueArray, id];
                        field.onChange(newValues.join(','));
                      };

                      return (
                        <FormItem>
                          <FormLabel>Control Objective Name</FormLabel>
                          <FormControl>
                            <div className="border rounded-md p-4 h-24 overflow-y-auto">
                              {objectives.map((obj: any) => (
                                <div key={obj.id} className="flex items-center space-x-2">
                                  <Checkbox
                                    id={`control-obj-${obj.id}`}
                                    checked={valueArray.includes(obj.id)}
                                    onCheckedChange={() => toggleValue(obj.id)}
                                  />
                                  <label htmlFor={`control-obj-${obj.id}`} className="text-sm">{obj.name}</label>
                                </div>
                              ))}
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      );
                    }}
                  />
                )}

                <div className="flex justify-end space-x-2 m-2">
                  <Button
                    type="button"
                    onClick={() => {
                      if (selectedControlName && selectedObjectives.length > 0) {
                        setCombinations(prev => {
                          const existingIndex = prev.findIndex(c => c.controlName === selectedControlName);
                          const updated = {
                            controlName: selectedControlName,
                            controlId: selectedControlId || "",
                            objectives: selectedObjectives,
                          };
                          if (existingIndex !== -1) {
                            const newCombinations = [...prev];
                            newCombinations[existingIndex] = updated;
                            return newCombinations;
                          } else {
                            return [...prev, updated];
                          }
                        });

                        form.setValue('CONTROL_NAME', '');
                        form.setValue('CONTROL_OBJ', '');
                      }
                    }}
                  >
                    Add
                  </Button>
                </div>

                <div className={`${combinations.length > 0 && 'max-h-[70vh] overflow-y-auto'} overflow-x-hidden m-2`}>
                  <Accordion type="multiple">
                    {combinations.map((combo, idx) => (
                      <AccordionItem key={idx} value={`combo-${idx}`}>
                        <div className="border rounded-md pl-2 pr-2 mb-1">
                          <AccordionTrigger className='text-md'><span><span className="font-mono text-xs bg-muted px-1.5 py-0.5 rounded mr-2">{combo.controlId}</span>{combo.controlName}</span></AccordionTrigger>
                          <AccordionContent>
                            {/* <ul className="space-y-2">
                              {combo.objectives.map(obj => (
                                <li key={obj.id} className="flex justify-between items-center">
                                 <span> <span className="font-mono text-xs bg-muted px-1.5 py-0.5 rounded mr-2">{obj.id}</span>{obj.name}</span>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const newCombos = [...combinations];
                                      newCombos[idx].objectives = newCombos[idx].objectives.filter(o => o.id !== obj.id);
                                      if (newCombos[idx].objectives.length === 0) newCombos.splice(idx, 1);
                                      setCombinations(newCombos);
                                    }}
                                  >
                                    <Trash className="h-4 w-4" />
                                  </button>
                                </li>
                              ))}
                            </ul> */}
                            <ul className="space-y-2 p-4">
                              {combo.objectives.map(obj => (
                                <li key={obj.id} className="flex justify-between items-center">
                                  <span>
                                    <span className="font-mono text-xs bg-muted px-1.5 py-0.5 rounded mr-2">
                                      {obj.id}
                                    </span>
                                    {obj.name}
                                  </span>

                                  {/* Alert Dialog for Delete */}
                                  <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                      <button type="button">
                                        <Trash className="h-4 w-4 text-destructive" />
                                      </button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                      <AlertDialogHeader>
                                        <AlertDialogTitle>Delete Objective?</AlertDialogTitle>
                                        <AlertDialogDescription>
                                          This will remove "<strong>{obj.name}</strong>" from the list. If it's the last objective in the group, the entire group will also be removed.
                                        </AlertDialogDescription>
                                      </AlertDialogHeader>
                                      <AlertDialogFooter>
                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                        <AlertDialogAction
                                          onClick={() => {
                                            const newCombos = [...combinations];
                                            newCombos[idx].objectives = newCombos[idx].objectives.filter(o => o.id !== obj.id);
                                            if (newCombos[idx].objectives.length === 0) newCombos.splice(idx, 1);
                                            setCombinations(newCombos);
                                          }}
                                          className="bg-destructive hover:bg-destructive/90"
                                        >
                                          Delete
                                        </AlertDialogAction>
                                      </AlertDialogFooter>
                                    </AlertDialogContent>
                                  </AlertDialog>
                                </li>
                              ))}
                            </ul>

                          </AccordionContent>
                        </div>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button type="submit">Save</Button>
            </DialogFooter>
            {/* </div> */}
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}