import React, { useState, useEffect } from "react";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/shadcn/ui/form";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/shadcn/ui/dialog";
import { Textarea } from "@/shadcn/ui/textarea";
import { Input } from "@/shadcn/ui/input";
import { Button } from "@/shadcn/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shadcn/ui/select";
import { useForm, FieldValues } from "react-hook-form";
//import MultiSelectDropdown from "@/ikon/components/select2-Checkbox";
import { zodResolver } from "@hookform/resolvers/zod";
import { EventFormSchema } from "../event-data-definitions";
import { getMyInstancesV2 } from "@/ikon/utils/api/processRuntimeService";
import { invokeEventProcess } from "../event-data-definitions/invokeEvent";
import { TextButton } from "@/ikon/components/buttons";

interface EditEventFormProps {
    isOpen: boolean;
    onClose: () => void;
    eventId?: string;
}

interface EventData {
    Title: string;
    Start_Date: string;
    End_Date: string;
    Description: string;
    Repeat: string;
    Team_List: string[];
    Meet_Link: string;
    Reminder: string;
    Guest_Email: string;
    eventStartTime: string;
    eventEndTime: string;
}

const assigneeMember = [
    { value: "K2205070", label: "Ankita Saha" },
    { value: "K2306125", label: "Prity Karmakar" },
    { value: "K2209078", label: "Ankush Banerjee" },
    { value: "K1812040", label: "Baishali Roy Chowdhury" },
    { value: "K2209080", label: "Soham Chakraborty" },
    { value: "K2207073", label: "Sanjib Dolai" },
    { value: "K2301095", label: "Anushri Dutta" },
];

const EditEventForm: React.FC<EditEventFormProps> = ({ isOpen, onClose, eventId }) => {
    const [eventData, setEventData] = useState<EventData | null>(null);
    const [showEndDate, setShowEndDate] = useState(false);

    const form = useForm<FieldValues>({
        resolver: zodResolver(EventFormSchema),
        defaultValues: {
            Title: "",
            Meet_Link: "",
            Start_Date: "",
            End_Date: "",
            eventStartTime: "",
            eventEndTime: "",
            Description: "",
            Repeat: "",
            Reminder: "",
            Guest_Email: "",
            Team_List: [],
        },
    });

    useEffect(() => {
        if (eventId) {
            (async () => {
                try {
                    const response = await getMyInstancesV2<EventData>({
                        processName: "Event Creation Process",
                        predefinedFilters: { taskName: "Event_View" },
                        mongoWhereClause: `this.Data.Id == "${eventId}"`,
                    });
                    if (response && response.length > 0) {
                        const fetchedEventData = response[0].data;
                        //setEventData(fetchedEventData);
                        form.reset({
                            Title: fetchedEventData.Title || "",
                            Start_Date: fetchedEventData.Start_Date || "",
                            End_Date: fetchedEventData.End_Date || "",
                            Description: fetchedEventData.Description || "",
                            Repeat: fetchedEventData.Repeat || "none",
                            Team_List: fetchedEventData.Team_List || [],
                            Meet_Link: fetchedEventData.Meet_Link || "",
                            Reminder: fetchedEventData.Reminder || "",
                            eventStartTime: fetchedEventData.eventStartTime || "",
                            eventEndTime: fetchedEventData.eventEndTime || "",
                            Guest_Email: fetchedEventData.Guest_Email || "",
                        });
                    }
                } catch (error) {
                    console.error("Error fetching event data:", error);
                }
            })();
        }
    }, [eventId, form]);

    const handleSubmit = async (data: Record<string, any>) => {
        if (!eventData) return;

        const updatedEvent = {
            ...eventData,
            ...data,
        };

        try {
            await invokeEventProcess(updatedEvent);
            //console.log("Event successfully updated:", updatedEvent);
            onClose();
        } catch (error) {
            console.error("Error updating event:", error);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => open || onClose()}>
            <DialogContent className="max-w-5xl" onClick={(e) => e.stopPropagation()}>
                <DialogHeader>
                    <DialogTitle>Edit Event</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleSubmit)} className="grid grid-cols-1 gap-3">
                        {/* Event Title */}
                        <FormField
                            control={form.control}
                            name="Title"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Event Title*</FormLabel>
                                    <FormControl>
                                        <Input {...field} placeholder="Enter event title" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className="grid grid-cols-2 gap-4">
                            {/* Assignee Members */}
                            <FormField
                                control={form.control}
                                name="Team_List"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Assignee Member(s)</FormLabel>
                                        <FormControl>
                                            {/* <MultiSelectDropdown
                                                options={assigneeMember.map((member) => ({
                                                    key: member.label,
                                                    value: member.value,
                                                }))}
                                                value={field.value} // Bind pre-selected values
                                                onChange={(selected) => field.onChange(selected)} // Update form state
                                                showSearch={true}
                                            /> */}
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="Guest_Email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>External Guests (Email)</FormLabel>
                                        <FormControl>
                                            <Input {...field} placeholder="Enter email" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        {/* Meeting Link */}
                        <FormField
                            control={form.control}
                            name="Meet_Link"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Meeting Link</FormLabel>
                                    <FormControl>
                                        <Input {...field} placeholder="Enter meeting link" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Date and Time */}
                        <div className="grid grid-cols-3 gap-4">
                            <FormField
                                control={form.control}
                                name="Start_Date"
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
                                name="Repeat"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Repeat*</FormLabel>
                                        <FormControl>
                                            <Select
                                                value={form.watch("Repeat")} // Bind value to form state
                                                onValueChange={(value) => {
                                                    setShowEndDate(value !== "none");
                                                    field.onChange(value);
                                                }}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Repeat frequency" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="none">None</SelectItem>
                                                    <SelectItem value="daily">Daily</SelectItem>
                                                    <SelectItem value="weekly">Weekly</SelectItem>
                                                    <SelectItem value="monthly">Monthly</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="Reminder"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Remind Me Before*</FormLabel>
                                        <FormControl>
                                            <Select
                                                value={form.watch("Reminder")} // Bind value to form state
                                                onValueChange={field.onChange}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Choose reminder time" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="1hr">1 Hour</SelectItem>
                                                    <SelectItem value="2hr">2 Hours</SelectItem>
                                                    <SelectItem value="12hr">12 Hours</SelectItem>
                                                    <SelectItem value="24hr">24 Hours</SelectItem>
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
                                    name="End_Date"
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
                                name="eventStartTime"
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
                                name="eventEndTime"
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
                            name="Description"
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
                            {/* <Button type="submit">Update</Button> */}
                            <TextButton type="submit" children={"Update"}></TextButton>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog >
    );
};

export default EditEventForm;
