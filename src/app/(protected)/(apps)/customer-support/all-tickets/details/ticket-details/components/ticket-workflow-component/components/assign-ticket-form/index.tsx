"use client";
import { Button } from "@/shadcn/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shadcn/ui/select";
import { Textarea } from "@/shadcn/ui/textarea";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as zod from "@hookform/resolvers/zod";
import { getProfileData } from "@/ikon/utils/actions/auth";
import { AddTicketFormSchema } from "../assign-form-data-defination";
import { getUserIdWiseUserDetailsMap, getUsersByGroupName } from "@/ikon/utils/actions/users";
import fetchTicketDetails from "@/app/(protected)/(apps)/customer-support/components/ticket-details";
import { TicketData, TicketsDetails } from "@/app/(protected)/(apps)/customer-support/components/type";
import { saveAssigneeDetails } from "../save-ticket-data";
import FormComboboxInput from "@/ikon/components/form-fields/combobox-input";
import { makeActivityLogsData } from "../../../ActivityLogs";

interface TicketModalProps {
  isOpen: boolean;
  onClose: () => void;
  ticketNo: string;
}

const CreateAssigneeModalForm: React.FC<TicketModalProps> = ({
  isOpen,
  onClose,
  ticketNo
}) => {
  const form = useForm({
    resolver: zodResolver(AddTicketFormSchema),
    defaultValues: {
      selectedLevel: "",
      selectedAssignee: "",
      assigneeComment: "",
    },
  });
  
  const { control, watch, setValue } = form;

  const [matchedTicket, setMatchedTicket] = useState<TicketData | null>(null);
  const [isReassign, setIsReassign] = useState(false);
  const [loading, setLoading] = useState(true);

  // User data
  const [level1Users, setLevel1Users] = useState<{ value: string; label: string | null }[]>([]);
  const [level2Users, setLevel2Users] = useState<{ value: string; label: string | null }[]>([]);
  const [allUsers, setAllUsers] = useState<{ value: string; label: string | null }[]>([]);
  const [assigneeOptions, setAssigneeOptions] = useState<{ value: string; label: string | null }[]>([]);

  const userNameRef = useRef("");
  const userIdRef = useRef("");

  // Fetch all required data in parallel
  useEffect(() => {
    if (!isOpen || !ticketNo) return;

    const fetchAllData = async () => {
      try {
        setLoading(true);
        
        // Fetch data in parallel
        const [profileData, usersData, level1Data, level2Data, ticketData] = await Promise.all([
          getProfileData(),
          getUserIdWiseUserDetailsMap(),
          getUsersByGroupName("Customer Support Team Level 1 (NOC)"),
          getUsersByGroupName("Customer Support Level 2 (PM)"),
          fetchTicketDetails()
        ]);

        // Set profile data
        userNameRef.current = profileData.USER_NAME;
        userIdRef.current = profileData.USER_ID;

        // Process users data
        const activeUsers = Object.values(usersData)
          .filter(user => user.userActive)
          .map(user => ({
            value: user.userId,
            label: user.userName ?? "Unknown User",
          }));
        setAllUsers(activeUsers);

        // Process level 1 users
        if (level1Data?.users) {
          const level1Users = Object.values(level1Data.users).map(user => ({
            value: user.userId,
            label: user.userName,
          }));
          setLevel1Users(level1Users);
        }

        // Process level 2 users
        if (level2Data?.users) {
          const level2Users = Object.values(level2Data.users).map(user => ({
            value: user.userId,
            label: user.userName,
          }));
          setLevel2Users(level2Users);
        }

        // Process ticket data
        if (ticketData?.priorityWiseTicketInfo) {
          const numericTicketId = Number(ticketNo);
          const foundTicket = ticketData.priorityWiseTicketInfo.find(
            (ticket: any) => Number(ticket.ticketNo) === numericTicketId
          );

          if (foundTicket) {
            setMatchedTicket(foundTicket);
            
            // Check if reassignment
            if (foundTicket.assigneeId) {
              setIsReassign(true);
              
              // Determine level based on existing assignee
              const assigneeId = foundTicket.assigneeId;
              const isLevel1 = level1Users.some(u => u.value === assigneeId);
              const isLevel2 = level2Users.some(u => u.value === assigneeId);
              
              const level = isLevel1 ? "level1" : isLevel2 ? "level2" : "level3";
              
              // Set form values
              form.reset({
                selectedLevel: level,
                selectedAssignee: assigneeId,
                assigneeComment: ""
              });
            }
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, [isOpen, ticketNo, form]);

  const selectedLevel = form.watch("selectedLevel");

  // ✅ 1. Dynamic update when user changes level manually
  useEffect(() => {
    let newOptions: { value: string; label: string | null }[] = [];
  
    if (selectedLevel === "level1") {
      newOptions = level1Users;
    } else if (selectedLevel === "level2") {
      newOptions = level2Users;
    } else if (selectedLevel === "level3") {
      const excludedIds = new Set([...level1Users.map(u => u.value), ...level2Users.map(u => u.value)]);
      newOptions = allUsers.filter(user => !excludedIds.has(user.value));
    } else {
      newOptions = [];
    }
  
    setAssigneeOptions(newOptions);
  
    // ✅ Don't reset blindly; only reset if invalid
    const currentAssignee = form.getValues("selectedAssignee");
    const isValidAssignee = newOptions.some(user => user.value === currentAssignee);
    if (!isValidAssignee) {
      form.setValue("selectedAssignee", "");
    }
  
  }, [selectedLevel, level1Users, level2Users, allUsers]);
  
  
  // ✅ 2. Prefill data for reassignment (run only when matchedTicket loads)
  useEffect(() => {
    if (!matchedTicket?.assigneeId) return;
  
    const assigneeId = matchedTicket.assigneeId;
    let level = "";
  
    if (level1Users.some(user => user.value === assigneeId)) {
      level = "level1";
    } else if (level2Users.some(user => user.value === assigneeId)) {
      level = "level2";
    } else {
      level = "level3";
    }
  
    // Set initial values without breaking anything
    form.reset({
      selectedLevel: level,
      selectedAssignee: assigneeId,
      assigneeComment: ""
    });
  
    // Also set the options initially
    if (level === "level1") {
      setAssigneeOptions(level1Users);
    } else if (level === "level2") {
      setAssigneeOptions(level2Users);
    } else {
      const excludedIds = new Set([...level1Users.map(u => u.value), ...level2Users.map(u => u.value)]);
      setAssigneeOptions(allUsers.filter(user => !excludedIds.has(user.value)));
    }
  }, [matchedTicket, level1Users, level2Users, allUsers, form]);
  
  const handleSubmit = async (values: Record<string, any>) => {
    try { 
      const selectedAssignee = assigneeOptions.find(
        user => String(user.value) === String(values.selectedAssignee)
      );
      // utils/helpers.ts
 const removeDuplicateObjects = <T extends object>(
  arr: T[],
  keys: (keyof T)[]
): T[] => {
  const seen = new Map<string, boolean>();
  return arr.filter(obj => {
    const key = keys.map(k => JSON.stringify(obj[k])).join('|');
    return seen.has(key) ? false : seen.set(key, true);
  });
};
  
      const newActivityLogs = await makeActivityLogsData({
        ticketNo,
        action: "assignment",
        argsList: [values.selectedAssignee, selectedAssignee?.label ?? ""],
      });
      const newTicket = {
        ...matchedTicket,
        assigneeId: values.selectedAssignee,
        assigneeName: selectedAssignee?.label ?? "",
        assigneeComment: values.assigneeComment,
        assigneeTime: new Date(),
        onAssigneeTime: new Date().toISOString(),
        assigneeBy: userIdRef.current,
        assigneeByName: userNameRef.current,
        assigneeLockStatus: "unlocked",
        isAssigneeChange: true,
        assignHistory: [
          ...(matchedTicket?.assignHistory || []),
          ...(isReassign ? [{
            assigneeId: matchedTicket?.assigneeId || "",
            assigneeName: matchedTicket?.assigneeName || "",
            assigneeComment: "Reassigned from previous assignee",
            assigneeTime: new Date(),
            onAssigneeTime: new Date().toISOString(),
            assigneeBy: userIdRef.current,
            assigneeByName: userNameRef.current,
          }] : []),
          {
            assigneeId: values.selectedAssignee,
            assigneeName: selectedAssignee?.label ?? "",
            assigneeComment: values.assigneeComment,
            assigneeTime: new Date(),
            onAssigneeTime: new Date().toISOString(),
            assigneeBy: userIdRef.current,
            assigneeByName: userNameRef.current,
          }
        ],
        pastStateList: [
          ...(matchedTicket?.pastStateList || ["Created"]),
          ...(!matchedTicket?.pastStateList?.includes("Assigned") ? ["Assigned"] : [])
        ],
        activityLogsData: removeDuplicateObjects(
          [
            ...(matchedTicket?.activityLogsData || []),
            ...newActivityLogs
          ],
          ["action", "dateOfAction", "userId"] // Unique composite key
        )
      };

      
  
      await saveAssigneeDetails(newTicket, ticketNo);
      onClose();
      window.location.reload();
      window.location.reload();
    } catch (error) {
      console.error("Error saving assignee details:", error);
    }
  };

  const formattedAssigneeOptions = assigneeOptions.map(option => ({
    value: option.value,
    label: option.label ?? undefined,
  }));

  return (
    <Dialog open={isOpen} onOpenChange={(open) => open || onClose()} modal>
      <DialogContent className="max-w-5xl" onClick={(e) => e.stopPropagation()}>
        <DialogHeader>
          <DialogTitle>{isReassign ? 'Re-assign Ticket' : 'Assign Ticket'}</DialogTitle>
          <DialogDescription>
            {isReassign ? 'Update the assignee for this ticket' : 'Assign this ticket to a team member'}
          </DialogDescription>
        </DialogHeader>
        
        {loading ? (
          <div className="flex justify-center py-8">Loading...</div>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="grid grid-cols-1 gap-3">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="selectedLevel"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Select Level</FormLabel>
                      <FormControl>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <SelectTrigger>
                            <SelectValue placeholder="Choose Level" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="level1">Level 1</SelectItem>
                            <SelectItem value="level2">Level 2</SelectItem>
                            <SelectItem value="level3">Level 3</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

<FormField
  control={form.control}
  name="selectedAssignee"
  render={({ field }) => (
    <FormItem>
      <FormLabel>Select Assignee</FormLabel>
      <FormControl>
        <FormComboboxInput
          items={formattedAssigneeOptions}
          formControl={form.control}
          disabled={false}
          name="selectedAssignee"
          placeholder="Choose Assignee"
        />
      </FormControl>
      <FormMessage />
    </FormItem>
  )}
/>

</div>
              <div className="grid grid-cols-1 gap-4">
                <FormField
                  control={form.control}
                  name="assigneeComment"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Comment</FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          // placeholder={isReassign ? "Reason for reassignment" : "Assignment notes"}
                          placeholder={"Write Comment"}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <DialogFooter>
              <Button 
  type="submit" 
  disabled={loading || form.formState.isSubmitting}
>
  {form.formState.isSubmitting ? "Submitting..." : (isReassign ? 'Reassign' : 'Assign')}
</Button>
                
                {/* <Button type="submit" disabled={loading}>
                  {isReassign ? 'Reassign' : 'Assign'}
                </Button> */}
              </DialogFooter>
            </form>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default CreateAssigneeModalForm;