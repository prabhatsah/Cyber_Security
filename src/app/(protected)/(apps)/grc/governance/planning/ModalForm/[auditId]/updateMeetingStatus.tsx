import FormInput from "@/ikon/components/form-fields/input";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shadcn/ui/dialog";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useRouter } from "next/navigation";
import {
  getMyInstancesV2,
  invokeAction,
} from "@/ikon/utils/api/processRuntimeService";
import FormComboboxInput from "@/ikon/components/form-fields/combobox-input";
import { Form } from "@/shadcn/ui/form";
import { Button } from "@/shadcn/ui/button";

export const MeetingFormSchema = z.object({
  MEETING_STATUS: z.string().min(1, { message: "Meeting Status is required" }),
  DURATION: z.string().optional(),
});

export const MeetigStatus = [
  { value: 'In Progess', label: 'In Progess' },
  { value: 'Completed', label: 'Completed' },
  { value: 'Pending', label: 'Pending' },
];

export default function UpdateMeetingStatus({
  open,
  setOpen,
  meetingData,
}: {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  meetingData: Record<string, any> | null;
}) {
  const router = useRouter();

  const form = useForm<z.infer<typeof MeetingFormSchema>>({
    resolver: zodResolver(MeetingFormSchema),
    defaultValues: {
      MEETING_STATUS: "",
      DURATION: "",
    },
  });

  useEffect(() => {
    if (meetingData) {
      form.reset({
        MEETING_STATUS: meetingData.meetingStatus ?? "",
        DURATION: meetingData.duration ?? "",
      });
    }
  }, [meetingData, form]);

  React.useEffect(() => {
      if (open) {
        form.reset({                                                                                                     
          MEETING_STATUS: meetingData?.meetingStatus ?? '',
          DURATION: meetingData?.duration ?? '',
        });
      }
    }, [open]);

  async function saveMeetingInfo(data: z.infer<typeof MeetingFormSchema>) {
    const updatedData = {
      ...meetingData,
      meetingStatus: data.MEETING_STATUS,
      duration: data.DURATION,
    };
    console.log("Updated Data:", updatedData);

    try {
      if (meetingData) {
        const meetingCreateInstances = await getMyInstancesV2({
          processName: "Schedule Meeting",
          predefinedFilters: { taskName: "Edit Meeting" },
          mongoWhereClause: `this.Data.meetingId == "${meetingData.meetingId}"`,
        });
        const taskId = meetingCreateInstances[0].taskId;
        await invokeAction({
          taskId: taskId,
          data: updatedData,
          transitionName: "Update Edit",
          processInstanceIdentifierField: "meetingId",
        });
      }
    } catch (error) {
      console.error("Error saving meeting data:", error);
    }

    setOpen(false);
    router.refresh();
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-[60%]">
        <DialogHeader>
          <DialogTitle> Update Meeting Status </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(saveMeetingInfo)}>
            <div className="grid gap-3">
              <div className="grid grid-cols-2 gap-3">
                <FormComboboxInput
                  items={MeetigStatus}
                  formControl={form.control}
                  name="MEETING_STATUS"
                  placeholder="Select Status"
                  label="Status*"
                />
                <FormInput
                  formControl={form.control}
                  name="DURATION"
                  placeholder="Duration"
                  label="Duration*"
                  type="number"
                />
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
