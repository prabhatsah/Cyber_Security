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
import { formatISO } from 'date-fns';

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
    auditId: string;
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


export const MeetingFormSchema = z.object({
    MEETING_TITLE: z.string().min(2, { message: 'Meeting Title must be at least 2 characters long.' }).trim(),
    MEETING_LINK: z.string().optional(),
    MEET_PARTICIPANTS: z.array(z.string()).min(1, { message: 'Select at least one participant.' }),
    MEETING_MODE: z.string({ required_error: 'Meeting Mode is required.' }).min(1, { message: 'Meeting Mode is required.' }),
    START_DATE: z.date({ required_error: 'Start Date is required.' }),
    START_TIME: z.string({ required_error: 'Start Time is required.' }),
    DURATION: z.string().optional(),
    MEETING_DESCRIPTION: z.string().optional(),
    CONTROL_NAME: z.string().optional(),
    CONTROL_OBJ: z.string().optional(),
    FRAMEWORK: z.string().optional(),
    AUDIT_NAME: z.string().optional(),
    MEETING_STATUS: z.string().optional(),
    MEETING_VENUE: z.string().optional(),
})
// .refine((data) => {
//   if (data.MEETING_MODE === 'Online') {
//     return !!data.MEETING_LINK?.trim();
//   }
//   return true;
// }, { message: 'Meeting Link is required for Online meetings.', path: ['MEETING_LINK'] });

export const AuditMode = [
    { value: 'Online', label: 'Online' },
    { value: 'Offline', label: 'Offline' },
];
export const MeetigStatus = [
    { value: 'In Progress', label: 'In Progress' },
    { value: 'Completed', label: 'Completed' },
    { value: 'Pending', label: 'Pending' },
];

export default function FollowUpMeetingForm({ open, setOpen, userIdNameMap, auditData, editMeeting, profileData, findActionData }:
    {
        open: boolean; setOpen: React.Dispatch<React.SetStateAction<boolean>>;
        userIdNameMap: { value: string, label: string }[]; auditData: Record<string, any> | null;
        editMeeting: Record<string, any> | null; profileData: Record<string, any> | null; findActionData: any
    }) {
    const router = useRouter();

    console.log("edit data ----->coming from actions data table ----->", editMeeting);
    console.log("profile data ----->coming from actions data table ----->", profileData);
    console.log(findActionData);

    const actionDescription = editMeeting?.description || '';

    const participants = editMeeting?.owner || '';
    const participantsArray = Array.isArray(participants) ? participants : [participants];

    const assignedTo = editMeeting?.assignedTo || '';
    const assignedToArray = Array.isArray(assignedTo) ? assignedTo : [assignedTo];

    const finalParticipantsArray = [...participantsArray, ...assignedToArray];

    const profileDataArray = Array.isArray(profileData?.USER_ID) ? profileData.USER_ID : [profileData?.USER_ID];


    const form = useForm<z.infer<typeof MeetingFormSchema>>({
        resolver: zodResolver(MeetingFormSchema),
        defaultValues: {
            MEETING_TITLE: '',
            MEETING_LINK: '',
            MEET_PARTICIPANTS: [],
            MEETING_MODE: '',
            START_DATE: undefined,
            START_TIME: '',
            MEETING_STATUS: 'In Progress',
            MEETING_VENUE: '',
            DURATION: '',
            MEETING_DESCRIPTION: '',
            // CONTROL_NAME: '',
            // CONTROL_OBJ: ''
        },
    });

    function getMappedParticipants(participants: string[], profileDataArray: string[], userIdNameMap: { value: string, label: string }[]) {
        const uniqueIds = new Set([...participants, ...profileDataArray]);
        return [...uniqueIds]
            .map(id => userIdNameMap.find(user => user.value === id))
            .filter(Boolean);
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

    const [combinations, setCombinations] = React.useState<{ controlName: string; objectives: { id: string; name: string }[] }[]>([]);

    const meetingMode = form.watch('MEETING_MODE');
    const selectedControlId = form.watch('CONTROL_NAME');
    const selectedObjectivesIds = form.watch('CONTROL_OBJ')?.split(',') || [];

    const selectedControlName = controlNames.find((c: any) => c.value === selectedControlId)?.label || '';
    const selectedObjectives = selectedControlId ? controlObjectives[selectedControlId]?.filter((obj: any) =>
        selectedObjectivesIds.includes(obj.id)
    ) || []
        : [];

    // ➡️ This is the important part to reset form on open
    React.useEffect(() => {
        if (open) {
            form.reset({
                MEETING_TITLE: '',
                MEETING_LINK: '',
                MEET_PARTICIPANTS: getMappedParticipants(finalParticipantsArray, profileDataArray, userIdNameMap).map(p => p?.value || ''),
                MEETING_MODE: '',
                START_DATE: undefined,
                START_TIME: '',
                MEETING_STATUS: 'In Progress',
                MEETING_VENUE: '',
                DURATION: '',
                MEETING_DESCRIPTION: '',
                // CONTROL_NAME: '',
                // CONTROL_OBJ: ''
            });
            setCombinations([]);
        }
    }, [open, auditData, userIdNameMap]);

    async function saveMeetingInfo(data: z.infer<typeof MeetingFormSchema>) {
        const meetingData = {
            auditId: editMeeting?.auditId || "",
            actionsId: editMeeting ? editMeeting.actionsId : '',
            followUpMeetingId: v4(),
            findingId: editMeeting ? editMeeting.findingId : '',
            editActionId: editMeeting ? editMeeting.editActionId : '',
            meetingTitle: data.MEETING_TITLE,
            meetingLink: data.MEETING_LINK,
            meetingVenue: data.MEETING_VENUE,
            meetingParticipants: data.MEET_PARTICIPANTS,
            meetingMode: data.MEETING_MODE,
            // startDate: data.START_DATE,
            startDate: formatISO(new Date(data.START_DATE)),
            startTime: data.START_TIME,
            meetingStatus: data.MEETING_STATUS,
            duration: data.DURATION,
            description: data.MEETING_DESCRIPTION,
            lastUpdatedOn: new Date().toISOString(),
            //  meetingId: editMeeting ? editMeeting.meetingId : v4(),
            // auditId: auditData?.auditId || "",
            // frameworkId: auditData?.frameworkId || "",   
            // selectedControls: combinations.map(combo => ({
            //     controlName: combo.controlName,
            //     policyId: controlData.find((c: any) => c.controlName === combo.controlName)?.policyId,
            //     controlObj: combo.objectives.map((obj: any) => ({
            //         objName: obj.name,
            //         objId: obj.id,
            //     })),
            // })),
        };

        console.log("Follow up Meeting Data Saved ===================>>>>> ", meetingData);

        // try {
        //     if (editMeeting) {
        //         const meetingCreateInstances = await getMyInstancesV2({
        //             processName: "Schedule Meeting",
        //             predefinedFilters: { taskName: "View Meeting" },
        //             mongoWhereClause: `this.Data.meetingId == "${editMeeting.meetingId}"`,
        //         });
        //         const taskId = meetingCreateInstances[0].taskId;
        //         await invokeAction({
        //             taskId: taskId,
        //             data: meetingData,
        //             transitionName: 'Update View',
        //             processInstanceIdentifierField: 'meetingId',
        //         });
        //     } else {
        //         const meetingProcessId = await mapProcessName({ processName: "Schedule Meeting" });
        //         await startProcessV2({
        //             processId: meetingProcessId,
        //             data: meetingData,
        //             processIdentifierFields: "meetingId",
        //         });
        //     }
        // } catch (error) {
        //     console.error("Error saving meeting data:", error);
        // }

        const meetingProcessId = await mapProcessName({ processName: "FollowUp Meeting" });
        await startProcessV2({
            processId: meetingProcessId,
            data: meetingData,
            processIdentifierFields: "followUpMeetingId",
        });
     
        // const groupedDataMap: Map<string, FindingActionData> = new Map();

        // for (const flatAction of findActionData) {
        //     if (!groupedDataMap.has(flatAction.actionsId)) {
        //         groupedDataMap.set(flatAction.actionsId, {
        //             auditId: flatAction.auditId,
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
        //         const { followUpMetting, editActionId } = flatAction;
        //         let meeting: [];
        //         if (editActionId === editMeeting?.editActionId) {
        //             meeting = [
        //                 ...(Array.isArray(flatAction.followUpMetting) ? flatAction.followUpMetting : []),
        //                 {
        //                     owner: data.MEET_PARTICIPANTS,
        //                     date: data.START_DATE,
        //                     remark: data.MEETING_TITLE
        //                 },
        //             ]
        //         }else{
        //             meeting = followUpMetting
        //         }
        //         group.actions.push({
        //             description: flatAction.description,
        //             assignedTo: flatAction.assignedTo,
        //             dueDate: flatAction.dueDate,
        //             timeEntries: flatAction.timeEntries,
        //             assigneAction: flatAction.assigneAction || [],
        //             status: flatAction.status,
        //             remarks: flatAction.remarks || [],
        //             followUpMetting: meeting,
        //         })

        //     }
        // }
        // const currentActionId = editMeeting?.actionsId;
        // const matchedAction = groupedDataMap.get(currentActionId);
        // if (matchedAction) {
        //     const meetingFindingInstances = await getMyInstancesV2({
        //         processName: "Meeting Findings Actions",
        //         predefinedFilters: { taskName: "Edit Action" },
        //         mongoWhereClause: `this.Data.actionsId == "${matchedAction.actionsId}"`,
        //     })
        //     console.log(meetingFindingInstances)
        //     const taskId = meetingFindingInstances[0]?.taskId;
        //     console.log(taskId);
        //     await invokeAction({
        //         taskId: taskId,
        //         transitionName: 'Update Edit',
        //         data: matchedAction,
        //         processInstanceIdentifierField: ''
        //     })
        // } else {
        //     alert("Could Not Save Data")
        // }

        setOpen(false);
        router.refresh();
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="max-w-[60%]">
                <DialogHeader>
                    <DialogTitle>
                        <div>
                            <h1 className="text-lg font-semibold">Schedule FollowUp Meeting</h1>
                            <p className="text-sm text-muted-foreground">
                                This will schedule a follow up call to discuss regarding the following action {actionDescription}
                            </p>
                        </div>
                    </DialogTitle>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(saveMeetingInfo)}>
                        <div className="grid gap-3">
                            <div className="grid grid-cols-2 gap-3">
                                <FormInput formControl={form.control} name="MEETING_TITLE" label="Meeting Title*" placeholder="Enter Meeting Title" />
                                <FormComboboxInput items={AuditMode} formControl={form.control} name="MEETING_MODE" placeholder="Select Meeting Mode" label="Mode*" />
                            </div>

                            {meetingMode === 'Online' && (
                                <FormInput formControl={form.control} name="MEETING_LINK" label="Meeting Link" placeholder="Enter Meeting Link" />
                            )}
                            {meetingMode === 'Offline' && (
                                <FormInput formControl={form.control} name="MEETING_VENUE" label="Meeting Venue" placeholder="Enter Meeting Venue" />
                            )}

                            <FormMultiComboboxInput formControl={form.control} name="MEET_PARTICIPANTS" label="Participant(s)*" placeholder="Select Participants" items={userIdNameMap} defaultValue={form.getValues("MEET_PARTICIPANTS")} defaultOptions={6}/>

                            <div className="grid grid-cols-4 gap-3">
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
                                <FormInput formControl={form.control} type="number" name="DURATION" label="Duration(hrs)" placeholder="Enter Duration" />
                                <FormComboboxInput items={MeetigStatus} formControl={form.control} name="MEETING_STATUS" placeholder="Select Status" label="Status*" />
                            </div>

                            <div className="grid grid-cols-1 gap-3">
                                <FormTextarea formControl={form.control} name="MEETING_DESCRIPTION" placeholder="Description" formItemClass="h-full" className="h-full" />
                            </div>

                            <DialogFooter>
                                <Button type="submit">Save</Button>
                            </DialogFooter>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}