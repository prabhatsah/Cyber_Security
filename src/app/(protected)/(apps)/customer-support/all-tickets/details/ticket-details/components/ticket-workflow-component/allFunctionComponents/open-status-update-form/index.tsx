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
import { getMyInstancesV2, invokeAction } from "@/ikon/utils/api/processRuntimeService";
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
import { AddTicketFormSchema } from "../../components/assign-form-data-defination";
import {
  getUserIdWiseUserDetailsMap,
  getUsersByGroupName,
} from "@/ikon/utils/actions/users";
import fetchTicketDetails from "@/app/(protected)/(apps)/customer-support/components/ticket-details";
import {
  TicketData,
  TicketDetails,
  TicketsDetails,
} from "@/app/(protected)/(apps)/customer-support/components/type";
import { saveAssigneeDetails } from "../../components/save-ticket-data";
import { UnlockTicket } from "@/app/(protected)/(apps)/customer-support/components/actionButton-Components/unlock-ticket";
import { fetchAllUserData } from "@/app/(protected)/(apps)/customer-support/components/fetchUserData";
import { makeActivityLogsData } from "../../../ActivityLogs";
import { getCommentRelatedAllDetails } from "../GetCommentRelatedDetails";
import {
  resetTicketPastStateList,
  setTicketUpdateUserDetails,
} from "../setTicketUpdateUserDetails";
import { invokeActionProps } from "@/ikon/utils/api/processRuntimeService/type";
import { updateTicketStatus } from "../updateTicketStatus";
// import moment from "moment";

interface TicketModalProps {
  isOpen: boolean;
  onClose: () => void;
  ticketNo: string;
  action: string; // e.g., 'updateTicketStatus'
  transition: string; // e.g., 'Update'
  state: string; // e.g., 'In Progress'
}


const CommentModalForm: React.FC<TicketModalProps> = ({
  isOpen,
  onClose,
  ticketNo,
  action,
  transition,
  state,
}) => {
  const form = useForm({
    resolver: zodResolver(AddTicketFormSchema),
    defaultValues: {
      addComment: "",
    },
  });

  const [userData, setUserData] = useState<{
    profileData: any;
    level1Users: any[];
    level2Users: any[];
    adminUsers: any[];
  } | null>(null);

  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchAllUserData();
      setUserData(data);
      setUserId(data.profileData.USER_ID);
    };
    fetchData();
  }, []);


  const handleSubmit = async (values: Record<string, any>) => {
    console.log("Form Values:", values);
    console.log("Ticket No:", ticketNo);
    console.log("Transition:", transition);
    console.log("State:", state);

    try {
      await updateTicketStatus(ticketNo, `${transition},${state}`, values.addComment);
      onClose();
      window.location.reload();
    } catch (error) {
      console.error("Error submitting the form:", error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()} modal>
      <DialogContent className="max-w-5xl" onClick={(e) => e.stopPropagation()}>
        <DialogHeader>
          <DialogTitle>Ticket [{ticketNo}] - Status Update</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="grid grid-cols-1 gap-3"
          >
            <div className="grid grid-cols-1 gap-4">
              <FormField
                control={form.control}
                name="addComment"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Comment</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        id="addComment"
                        placeholder="Enter Description"
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
  disabled={form.formState.isSubmitting}
>
  {form.formState.isSubmitting ? "Submitting..." : "Update"}
</Button>
              {/* <Button type="submit">Update</Button> */}
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
export default CommentModalForm;
function moment(arg0: Date) {
  throw new Error("Function not implemented.");
}

// updateTicketStatus: function(ticketNo, args){
//     const ref = LandingPage1679378634873;
//     const mainPreLoaderRef= Globals.GlobalAPI.PreLoader1679563139444;
//     const ticketDetailsModRef = CustomerSupportTicketViewModuleLandingPage1679554638202;

//     let statesWithLock = mainPreLoaderRef.getStatesWithLockRequired();
//     //CHANGED
//     let activityObj = {};
// /* 		if(!mainPreLoaderRef.commentValidation(ticketNo, "addComment")){
//         bootstrapModalAlert("Comment can't be blank !");
//         return;
//     } */

//     const commentId = "addComment-" + ticketNo;
//     const comment = $("#" + commentId).val();
//     ref.validateMessage(commentId, true);
//     if(comment == undefined || comment == '' || comment == null  || comment =='-1'){
//         ref.validateMessage(commentId, false, "Please add your comment!");
//         return;
//     }

//     args = args.split(",");
//     let transition = args[1];
//     let state = args[2];

//     $("#viewCommentModal").modal('hide');

//     if(state == "Assign"){
//         ref.assigneeTicket(ticketNo, ticketDetailsModRef.reloadModuleLandingPage);
//         return;
//     }

//     var processName = "Customer Support Desk Ticket";
//     var predefinedFilters = null;
//     var processVariableFilters = null;
//     var taskVariableFilters = null;
//     var mongoWhereClause = `this.Data.ticketNo=="${ticketNo}"`;
//     var projection = ["Data"];
//     var isFetchAllInstances = false;
//     loadSpinner("IkonMainContentDiv");
//     IkonService.getMyInstancesV2(processName, globalAccountId, {includeSharedInstances: true}, processVariableFilters, taskVariableFilters, mongoWhereClause, projection, isFetchAllInstances, function(){
//         console.log("Success");
//         let taskId = arguments[0][0].taskId;
//         let ticketDetails = arguments[0][0].data;

//         let previousStatus = ticketDetails["status"];
//         let newStatus = state;

//         ticketDetails["activityLogsData"] = mainPreLoaderRef.makeActivityLogsData(ticketNo, "stateChange", previousStatus, newStatus);

//         //NEW
//         activityObj = mainPreLoaderRef.makeActivityLogsDataGlobal(ticketNo, "stateChange", previousStatus, newStatus);
//         mainPreLoaderRef.saveDataOfActivityLogGlobal(activityObj,()=>{
//             if(previousStatus == "New" && newStatus == "In Progress"){
//                 activityObj = mainPreLoaderRef.makeActivityLogsDataGlobal(ticketNo, "lockAcquired", ticketDetails['assigneeId']);
//                 mainPreLoaderRef.saveDataOfActivityLogGlobal(activityObj);
//             }
//         });

//         if(previousStatus == "New" && newStatus == "In Progress"){
//             ticketDetails["activityLogsData"] = mainPreLoaderRef.makeActivityLogsData(ticketNo, "lockAcquired", ticketDetails['assigneeId']);
//         }

//         ticketDetails["previousStatus"] = ticketDetails["status"];
//         ticketDetails["status"] = state;
//         ticketDetails["isStatusChange"] = true;

//         ticketDetails["pastStateList"] = ticketDetails["pastStateList"] ?? [];
//         ticketDetails["pastStateList"].push(state);

//         if(statesWithLock.includes(state)){
//             ticketDetails["assigneeLockStatus"] = "locked";
//         }

//         ticketDetails = mainPreLoaderRef.getCommentRelatedAllDetails(ticketNo, ticketDetails);

//         ticketDetails = mainPreLoaderRef.setTicketUpdateUserDetails(state, ticketDetails);
//         ticketDetails = mainPreLoaderRef.resetTicketpastStateList(transition, ticketDetails);

//         IkonService.invokeAction(taskId, transition, ticketDetails,"",function(){
//             ref.getPriorityWiseTicketInfo(true, ticketDetails);

// // 				ticketDetailsModRef.reloadModuleLandingPage(ticketNo);

//             console.log("Data Updated");
//             unloadSpinner("IkonMainContentDiv")
//         },function(){
//             console.log("Data Updation failed");
//         });
//     }, function(){
//         console.log("Failed");
//     })
// },
