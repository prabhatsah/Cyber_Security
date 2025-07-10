"use client";

import {
  IconButtonWithTooltip,
  IconTextButtonWithTooltip,
} from "@/ikon/components/buttons";
import FormMultiComboboxInput from "@/ikon/components/form-fields/multi-combobox-input";
import { getProfileData } from "@/ikon/utils/actions/auth";
import { Button } from "@/shadcn/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shadcn/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/shadcn/ui/form";
import { Input } from "@/shadcn/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shadcn/ui/select";
import { Textarea } from "@/shadcn/ui/textarea";
import { Plus } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";

const assigneeMember = [
  { value: "K2205070", label: "Ankita Saha" },
  { value: "K2306125", label: "Prity Karmakar" },
  { value: "K2209078", label: "Ankush Banerjee" },
  { value: "K1812040", label: "Baishali Roy Chowdhury" },
  { value: "K2209080", label: "Soham Chakraborty" },
  { value: "K2207073", label: "Sanjib Dolai" },
  { value: "K2301095", label: "Anushri Dutta" },
];

export default function AddEventForm() {
  const form = useForm({
    defaultValues: {
      eventTitle: "",
      meetingLink: "",
      startDate: "",
      endDate: "",
      startTime: "",
      endTime: "",
      description: "",
      meetingRepeat: "none",
      remindBefore: "",
      assigneeMembers: [],
    },
  });

  const [isOpen, setIsOpen] = useState(false);
  const [showEndDate, setShowEndDate] = useState(false);

  const handleSubmit = async (values: {
    eventTitle: string;
    startDate: string;
    endDate: string;
    description: string;
    meetingLink: string;
    startTime: string;
    endTime: string;
    meetingRepeat: string;
    remindBefore: string;
    assigneeMembers: string[];
  }) => {
    const profileData = await getProfileData();
    const eventData = {
      //Id: v4(),
      Created_User: profileData?.USER_ID,
      Title: values.eventTitle,
      Start_Date: values.startDate,
      End_Date: values.endDate,
      Description: values.description,
      Repeat: values.meetingRepeat,
      Team_List: values.assigneeMembers,
      Meet_Link: values.meetingLink,
      Reminder: values.remindBefore,
      createdOn: new Date().toISOString(),
      updatedOn: new Date().toISOString(),
      eventStartTime: values.startTime,
      eventEndTime: values.endTime,
      source: "Lead",
    };

    try {
      // await startEventProcess(eventData);
      // onClose();
    } catch (error) {
      console.error("Error starting the process:", error);
    }
  };

  return (
    <>
      {/* <IconButtonWithTooltip
        tooltipContent="Add Event"
        onClick={() => setIsOpen(true)}
      >
        <Plus />
      </IconButtonWithTooltip> */}

      <IconTextButtonWithTooltip
        tooltipContent="Add Event"
        onClick={() => setIsOpen(true)}
      >
        <Plus /> Event
      </IconTextButtonWithTooltip>

      {/* <IconTextButtonWithTooltip
        children={"+ Event"}
        tooltipContent={"Add Event"}
        onClick={() => setIsOpen(true)}
      ></IconTextButtonWithTooltip> */}
      {isOpen && (
        <Dialog open={isOpen} onOpenChange={setIsOpen} modal>
          <DialogContent
            className="max-w-5xl"
            onClick={(e) => e.stopPropagation()}
          >
            <DialogHeader>
              <DialogTitle>Event Form</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(handleSubmit)}
                className="grid grid-cols-1 gap-3"
              >
                {/* Event Title */}
                <FormField
                  control={form.control}
                  name="eventTitle"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Event Title*</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="text"
                          placeholder="Enter event title"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Assignee Members */}
                {/* <FormField
                                    control={form.control}
                                    name="assigneeMembers"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Assignee Member(s)</FormLabel>
                                            <FormControl>
                                                <MultiSelectDropdown
                                                    options={assigneeMember.map((member) => ({
                                                        key: member.label || member.value,
                                                        value: member.value,
                                                    }))}
                                                    showSearch={true}
                                                    onChange={(selectedValues) => {
                                                        field.onChange(selectedValues);
                                                    }}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                /> */}
                <FormMultiComboboxInput
                  formControl={form.control}
                  name="assigneeMembers"
                  label="Assignee Team Member(s)*"
                  placeholder="Select team members"
                  items={assigneeMember.map((member) => ({
                    value: member.value,
                    label: member.label || member.value,
                  }))}
                />

                {/* Meeting Link */}
                <FormField
                  control={form.control}
                  name="meetingLink"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Enter Meeting Link (if any)</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="text"
                          placeholder="Enter meeting link"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Date and Time */}
                <div className="grid grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="startDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Start Date*</FormLabel>
                        <FormControl>
                          <Input {...field} type="date" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="meetingRepeat"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Meeting Repeat*</FormLabel>
                        <FormControl>
                          <Select
                            defaultValue="none"
                            onValueChange={(value) => {
                              form.setValue("meetingRepeat", value);
                              setShowEndDate(value !== "none");
                            }}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select repeat frequency" />
                            </SelectTrigger>
                            <SelectContent>
                              {[
                                { value: "none", label: "None" },
                                { value: "daily", label: "Daily" },
                                { value: "weekly", label: "Weekly" },
                                { value: "monthly", label: "Monthly" },
                              ].map((option) => (
                                <SelectItem
                                  key={option.value}
                                  value={option.value}
                                >
                                  {option.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="remindBefore"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Remind Me Before*</FormLabel>
                        <FormControl>
                          <Select
                            onValueChange={(value) =>
                              form.setValue("remindBefore", value)
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Choose reminder time" />
                            </SelectTrigger>
                            <SelectContent>
                              {[
                                { value: "1hr", label: "1 Hour" },
                                { value: "2hr", label: "2 Hours" },
                                { value: "12hr", label: "12 Hours" },
                                { value: "24hr", label: "24 Hours" },
                              ].map((option) => (
                                <SelectItem
                                  key={option.value}
                                  value={option.value}
                                >
                                  {option.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Time */}
                <div className="grid grid-cols-3 gap-4">
                  {showEndDate && (
                    <FormField
                      control={form.control}
                      name="endDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>End Date*</FormLabel>
                          <FormControl>
                            <Input {...field} type="date" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                  <FormField
                    control={form.control}
                    name="startTime"
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
                  <FormField
                    control={form.control}
                    name="endTime"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>End Time</FormLabel>
                        <FormControl>
                          <Input {...field} type="time" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Description */}
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea {...field} placeholder="Enter description" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <DialogFooter>
                  <Button type="submit">Create</Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
