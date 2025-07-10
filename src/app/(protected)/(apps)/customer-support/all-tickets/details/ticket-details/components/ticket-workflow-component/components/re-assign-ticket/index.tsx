"use client";
import { Button } from "@/shadcn/ui/button";
import { Checkbox } from "@/shadcn/ui/checkbox";
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
import { Input } from "@/shadcn/ui/input";
import { Label } from "@/shadcn/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/shadcn/ui/select";
import { Textarea } from "@/shadcn/ui/textarea";
import { getMyInstancesV2 } from "@/ikon/utils/api/processRuntimeService";
import { SetStateAction, useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { se } from "date-fns/locale";
// import form from "@/app/(protected)/examples/form/page";
import * as zod from "@hookform/resolvers/zod";
import { getProfileData, getTicket } from "@/ikon/utils/actions/auth";
// import { startCustomerSupportTicketProcess } from "./start-ticket-instance/index";
import { usePathname } from "next/navigation";
import { AddTicketFormSchema } from "../assign-form-data-defination";
import { getUserIdWiseUserDetailsMap, getUsersByGroupName } from "@/ikon/utils/actions/users";
import fetchTicketDetails from "@/app/(protected)/(apps)/customer-support/components/ticket-details";
import { TicketData, TicketsDetails } from "@/app/(protected)/(apps)/customer-support/components/type";
import { saveAssigneeDetails } from "../save-ticket-data";
import FormComboboxInput from "@/ikon/components/form-fields/combobox-input";
import { makeActivityLogsData } from "../../../ActivityLogs";
// import moment from "moment";


interface TicketModalProps {
  isOpen: boolean;
  onClose: () => void;
  ticketNo:string
}


const CreateAssigneeModalForm: React.FC<TicketModalProps> = ({
  isOpen,
  onClose,ticketNo}) => {
    const form = useForm({
      resolver: zod.zodResolver(AddTicketFormSchema),
      defaultValues: {
        selectedLevel: "",
        selectedAssignee: "",
        assigneeComment: "",
      },
    });

  const [ticketData, setTicketData] = useState<TicketsDetails | null>(null);

  const [matchedTicket, setMatchedTicket] = useState<TicketData | null>(null);

  const [loading, setLoading] = useState(true);

  interface FormData {
    selectedLevel:string;
    selectedAssignee:string;
    assigneeComment: string;
  }

  const { control, watch, setValue } = useForm({
    defaultValues: {
      selectedLevel: "",
      selectedAssignee: "",
    },
  });
  const selectedLevel = watch("selectedLevel");

  const [level1Users, setLevel1Users] = useState<{ value: string; label: string | null }[]>([]);
  const [level2Users, setLevel2Users] = useState<{ value: string; label: string | null }[]>([]);
  const [allUsers, setAllUsers] = useState<{ value: string; label: string | null }[]>([]);
  const [assigneeOptions, setAssigneeOptions] = useState<{ value: string; label: string | null }[]>([]);
  

  interface OptionType {
    value: string;
    label: string;
  }
  const userNameRef = useRef("");
  const userIdRef = useRef("");
  const userLoginRef = useRef("");
  const userEmailRef = useRef("");

  useEffect(() => {
    if (!ticketNo) return;

    const fetchTicketData = async () => {
      try {
        setLoading(true);
        const data = await fetchTicketDetails();
        
        if (!data || !data.priorityWiseTicketInfo) {
          console.error("No ticket data available.");
          setLoading(false);
          return;
        }

        const numericTicketId = Number(ticketNo);
        const foundTicket = data.priorityWiseTicketInfo.find(
          (ticket: any) => Number(ticket.ticketNo) === numericTicketId
        );

        setTicketData(data);
        setMatchedTicket(foundTicket || null);
        console.log(" matchedTicket-----------------------------------------");
        console.log(matchedTicket);
      } catch (error) {
        console.error("Error fetching ticket details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTicketData();
  }, [isOpen]); // Runs when ticketNo changes

  useEffect(() => {
    if (matchedTicket) {
      console.log("Updated matchedTicketfrgtbhynjumki,lkmujnyhbgvgfhbnjhbgfvd:", matchedTicket);
    }
  }, [matchedTicket]);


  // Fetch Level 1 Users
  useEffect(() => {
    const fetchLevel1Users = async () => {
      const data = await getUsersByGroupName("Customer Support Team Level 1 (NOC)");
      console.log("Customer Support Team Level 1 (NOC)------>>>", data)
      if (data?.users) {
        const users = Object.values(data.users).map(user => ({
          value: user.userId,
          label: user.userName,
        }));

        setLevel1Users(users);
      }
    };
    fetchLevel1Users();
  }, [isOpen]);


    // Fetch Level 1 Users
    useEffect(() => {
      const fetchCustomerSupportAdminUsers = async () => {
        const data = await getUsersByGroupName("Customer Support Admin");
        console.log("Customer Support Admin------>>>", data)
        if (data?.users) {
          const users = Object.values(data.users).map(user => ({
            value: user.userId,
            label: user.userName,
          }));
  
          setLevel1Users(users);
        }
      };
      fetchCustomerSupportAdminUsers();
    }, [isOpen]);

  // Fetch Level 2 Users
  useEffect(() => {
    const fetchLevel2Users = async () => {
      const data = await getUsersByGroupName("Customer Support Level 2 (PM)");
      console.log("Customer Support Team Level 2 (PM)------>>>", data)
      if (data?.users) {
        const users = Object.values(data.users).map(user => ({
          value: user.userId,
          label: user.userName,
        }));
        console.log("this one is level 3 oh sorry 2: -")
        console.log(users)
        setLevel2Users(users);
      }
    };
    fetchLevel2Users();
  }, [isOpen]);


  //Fetch Level 3 Users
  useEffect(() => {
    const fetchAllUsers = async () => {
      try {
        const data = await getUserIdWiseUserDetailsMap(); // Fetch data
        console.log("Fetched Data (Raw):", data);
  
        // Convert object of objects into an array and filter only active users
        const usersArray = Object.values(data).filter(user => user.userActive);
  
        // Map to required format
        const users = usersArray.map(user => ({
          value: user.userId, // Ensure userId exists
          label: user.userName ?? "Unknown User", // Default label if userName is missing
        }));
  
        console.log("Processed Active Users:", users);
        setAllUsers(users);
      } catch (error) {
        console.error("Error fetching users:", error);
        setAllUsers([]); // Ensure it's never undefined
      }
    };
  
    fetchAllUsers();
  }, []);
  
  // Debugging UseEffect (Optional)
  useEffect(() => {
    console.log("Updated allUsers:", allUsers);
  }, [allUsers]);

  
  // Update Assignee Dropdown based on selected Level
  useEffect(() => {
    if (selectedLevel === "level1") {
      setAssigneeOptions(level1Users);
    } else if (selectedLevel === "level2") {
      setAssigneeOptions(level2Users);
    } else if (selectedLevel === "level3") {
      // Exclude Level 1 & Level 2 members from Level 3 list
      const excludedIds = new Set([...level1Users.map(u => u.value), ...level2Users.map(u => u.value)]);
      const filteredUsers = allUsers.filter(user => !excludedIds.has(user.value));
      setAssigneeOptions(filteredUsers);
    } else {
      setAssigneeOptions([]);
    }

    // Reset selected assignee when level changes
    setValue("selectedAssignee", "");
  }, [selectedLevel, level1Users, level2Users, allUsers, setValue]);

 
  useEffect(() => {
    const fetchProfileData = async () => {
      const data = await getProfileData();
      userNameRef.current = data.USER_NAME;
      userIdRef.current = data.USER_ID;
      userLoginRef.current = data.USER_LOGIN;
      userEmailRef.current = data.USER_EMAIL;
      console.log("hey bro -> data d" + data);
      console.log(data)
    };
    fetchProfileData();
  }, [isOpen]);


  console.log("hey bro -> " + userIdRef.current);

  // const ticket = await getTicket();
  // const url =
  // `${DOWNLOAD_URL}?ticket=${encodeURIComponent(ticket)}` +
  // `&resourceId=${encodeURIComponent(data.resourceId)}` +
  // `&resourceName=${encodeURIComponent(data.resourceName)}` +
  // `&resourceType=${encodeURIComponent(data.resourceType)}`;

//window.open(encodeURI(url), "_blank");

const formattedAssigneeOptions = assigneeOptions.map(option => ({
  value: option.value,
  label: option.label ?? undefined, // Convert null to undefined
}));

  const handleSubmit = async (values: Record<string, any>) => {
    console.log("Form Values:", values); 
        let newTicket: {
            assigneeId: string | null;
            assigneeName: string;
            assigneeComment: string;
            assigneeTime: Date | null;
            onAssigneeTime: string | null;
            assigneeBy: string;
            assigneeByName: string;
            assigneeLockStatus: string;
            assignHistory: Array<{
              assigneeId: string;
              assigneeName: string;
              assigneeComment: string;
              assigneeTime: Date;
              onAssigneeTime: string;
              assigneeBy: string;
              assigneeByName: string;
            }>;
            isAssigneeChange: boolean;
            pastStateList: string[];
            activityLogsData: any[]; 
          } = {
            
            assigneeId: null,
            assigneeName: "",
            assigneeComment: "",
            assigneeTime: null,
            onAssigneeTime: null,
            assigneeBy: "",
            assigneeByName: "",
            assigneeLockStatus: "unlocked",
            assignHistory: [],
            isAssigneeChange: true,
            pastStateList: ["Created"],
            activityLogsData: [],
          };
      
        // Assigning default values similar to your first code snippet
        console.log("Selected Assignee Value:", values.selectedAssignee);

        newTicket.assigneeId = values.selectedAssignee;

        console.log("Assignee Options:", assigneeOptions);

        const selectedAssignee = assigneeOptions.find(user => String(user.value) === String(values.selectedAssignee));
        console.log("Matched Assignee Object:selectedAssignee", selectedAssignee);

        newTicket.assigneeName = selectedAssignee?.label ?? "";
        newTicket.assigneeComment = values.assigneeComment;
        newTicket.assigneeTime = new Date();
        newTicket.onAssigneeTime = new Date().toISOString(),
        newTicket.assigneeBy = userIdRef.current;
        newTicket.assigneeByName = userNameRef.current;
      
        newTicket.assignHistory = newTicket.assignHistory || [];
        newTicket.assignHistory.push({
          assigneeId:values.selectedAssignee,
          assigneeName:values.selectedAssignee?.label ?? "",
          assigneeComment: values.assigneeComment,
          assigneeTime: new Date(),
          onAssigneeTime: new Date().toISOString(),
          assigneeBy: userIdRef.current,
          assigneeByName: userNameRef.current,
        });
      
        newTicket.isAssigneeChange = true;
         newTicket = { ...matchedTicket, ...newTicket };

        console.log("Updated Ticket:", newTicket);
        if (!newTicket.pastStateList.includes("Assigned")) {
          newTicket.pastStateList.push("Assigned");
        }

        // Create postComment logs
        const ActivityLogs = await makeActivityLogsData({
          ticketNo,
          action: "assignment",
          argsList: [values.selectedAssignee,selectedAssignee?.label ?? ""],
        });
        
        // Merge logs and remove duplicates
        const mergedLogs = [...newTicket.activityLogsData, ...ActivityLogs];
        // const uniqueLogs = Array.from(
        //   new Map(mergedLogs.map(log => [`${log.action}-${log.dateOfAction}`, log])).values()
        // );
        
        // Update ticketDetails with unique logs
        newTicket.activityLogsData = mergedLogs;
        
      
        // // Adding activity logs
        // newTicket.activityLogsData = mainPreLoaderRef.makeActivityLogsData(ticketNo, "assignment", assigneeId, assigneeName);
      
        // // Global activity log
        // let activityObj = mainPreLoaderRef.makeActivityLogsDataGlobal(ticketNo, "assignment", assigneeId, assigneeName);
        // mainPreLoaderRef.saveDataOfActivityLogGlobal(activityObj);
      
        try {
          await saveAssigneeDetails(newTicket, ticketNo);
          onClose();
        } catch (error) {
          console.error("Error starting the process:", error);

        }
        
      };



  return (
<Dialog open={isOpen} onOpenChange={(open) => open || onClose()} modal>
  <DialogContent 
    className="max-w-5xl" 
    onClick={(e) => e.stopPropagation()} 
    aria-describedby={undefined} 
  >
    <DialogHeader>
      <DialogTitle>Create Ticket</DialogTitle>
      <DialogDescription>
        Fill out the form to create a new ticket.
      </DialogDescription>
    </DialogHeader>
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="grid grid-cols-1 gap-3"
      >
        <div className="grid grid-cols-2 gap-4">
          {/* Select Level */}
          <FormField
            control={control}
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

          {/* Select Assignee */}
          {/* <FormField
  control={form.control}
  name="selectedAssignee"
  render={({ field }) => (
    <FormItem>
      <FormLabel>Select Assignee</FormLabel>
      <FormControl>
      <Select onValueChange={field.onChange} value={field.value}>
  <SelectTrigger>
    <SelectValue placeholder="Choose Assignee" />
  </SelectTrigger>
  <SelectContent>
    {assigneeOptions.length > 0 ? (
      assigneeOptions.map(user => (
        <SelectItem key={user.value} value={user.value}>
          {user.label}
        </SelectItem>
      ))
    ) : (
      <SelectItem key="no-assignee" value="no-selection" disabled>
        No Assignees Available
      </SelectItem>
    )}
  </SelectContent>
</Select>
      </FormControl>
      <FormMessage />
    </FormItem>
  )}
/> */}

{/* <FormField
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
  onSelect={(selectedValue) => {
    console.log("Selected Value:", selectedValue); // Debugging log
    field.onChange(selectedValue);
  }}
/>
      </FormControl>
      <FormMessage />
    </FormItem>
  )}
/> */}


<FormComboboxInput
                items={formattedAssigneeOptions}
                formControl={form.control}
                name="selectedAssignee"
                placeholder="Choose Assignee"
                label="Select Assignee*"
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
                    id="assigneeComment"
                    placeholder="Enter Description"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <DialogFooter>
          <Button type="submit">Submit</Button>
        </DialogFooter>
      </form>
    </Form>
  </DialogContent>
</Dialog>

  );
};

export default CreateAssigneeModalForm;
function moment(arg0: Date) {
  throw new Error("Function not implemented.");
}

