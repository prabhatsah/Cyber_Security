// export default async function Testing(ticketNo, dataToBeInvoked) {

import { useDialog } from "@/ikon/components/alert-dialog/dialog-context";
import { InvokeTicketWorkflowTransition } from "../../../all-tickets/details/ticket-details/components/ticket-workflow-component/invokeTicketWorkflow";
import { getMyInstancesV2, invokeAction } from "@/ikon/utils/api/processRuntimeService";
import { TicketData } from "../../type";
import { makeActivityLogsData } from "../../../all-tickets/details/ticket-details/components/ActivityLogs";
import { invokeActionProps } from "@/ikon/utils/api/processRuntimeService/type";

//     let ref = LandingPage1679378634873;
//     var allTicketsMlpRef = CustomerSupportAllTicketsModuleLandingPage1680676754032;

//     let mainPreLoaderRef= Globals.GlobalAPI.PreLoader1679563139444;

//     let presentUserId = Globals.profile.value.USER_ID.value;
//     let supportAdminMap = LandingPage1679378634873.supportTeamAdminMap;
//     let supportNOCMap = LandingPage1679378634873.supportTeamLevel1Details;
//     //let supportTeamMap = LandingPage1679378634873.supportTeamDetailsMap;

//     var btnObj = {
//         confirmButtonName : "Ok",
//         closeButtonName : "Cancel"
//     }
//     var flagObj = {
//         closeButtonFlag:true,
//         cancelButtonFlag:false
//     }
//     var iconObj = {
//         name:"error",
//         colour:"#fadd6a",
//         iconHtml : '<i class="fad fa-exclamation"></i>'
//     }

//     if( (presentUserId in supportAdminMap) || LandingPage1679378634873.allTicketIdWiseTicketDetails[ticketNo].assigneeId == presentUserId){
//         bootstrapModalAlert({
//             icon: 'error',
//             text: "Do you want to unlock the ticket?",
//             confirmButtonText: 'Yes', 
//             cancelButtonText: 'Cancel', 
//             onConfirm: function() { 
//                 console.log('Confirmed!');
// -                console.log("inside to the sweetalert sucess function");
//                 var processName = "Customer Support Desk Ticket";
//                 //ticketNo = ticketNo + "";
//                 var predefinedFilters = {includeSharedInstances: true}
//                 var processVariableFilters = null;
//                 var taskVariableFilters = null;
//                 //var mongoWhereClause = `this.Data.ticketNo==${ticketNo}`;
//                 var mongoWhereClause ="this.Data.ticketNo == " + ticketNo;
//                 var projection = ["Data"];
//                 var isFetchAllInstances = false;
//                 var softwareId = Globals.SubscribedSoftwareNameMap['Customer Support_1'].SOFTWARE_ID
//                 IkonService.getMyInstancesV4(processName, globalAccountId, softwareId, predefinedFilters, processVariableFilters, taskVariableFilters, mongoWhereClause, projection, isFetchAllInstances, function(){
//                     console.log("inside to the get my instance v2 success function");
//                     var taskId = arguments[0][0].taskId;
//                     var data = arguments[0][0].data;
//                     allTicketsMlpRef.data = data;
//                     if(allTicketsMlpRef.data.assigneeLockStatus == "locked"){
//                         allTicketsMlpRef.data.assigneeLockStatus= "unlocked"
//                         allTicketsMlpRef.data.lockChanged= "true";
//                         console.log(allTicketsMlpRef.data.assigneeLockStatus);

//                         allTicketsMlpRef.data.activityLogsData = mainPreLoaderRef.makeActivityLogsData(ticketNo, "lockReleased");

//                     }
//                     console.log(taskId)
//                     var ticketStatus = allTicketsMlpRef.data.status;
//                     var transitionName;
//                     if(ticketStatus == "Resolved"){
//                         transitionName = 'Self Resolve';
//                     }
//                     else if(ticketStatus == "Cancelled"){
//                         transitionName = 'Self Cancel';
//                     }
//                     else if(ticketStatus != "Closed"){
//                         transitionName = 'Update';
//                     }

//                     IkonService.invokeAction(
//                         taskId,
//                         transitionName,
//                         data,
//                         null,
//                         function () {
//                             console.log("inside to the invoke action sucess function");
//                             console.log(allTicketsMlpRef.data);
//                             toastr.success('Ticket Unlocked Successfully', 'Success!!!');
//                             allTicketsMlpRef.mainLandingPageRef.getPriorityWiseTicketInfo();
//                         },
//                         function () {
//                             console.log("inside to the invoke action sucess function");
//                         }
//                     );
//                 }, function(){
//                     console.log("inside to the get my instance v2 failure function");
//                 });
//             },             
//         });}








//     const data = await getUsersByRoleName(); // Fetch data
//     console.log("Fetched Data (Raw):", data);

//   return (
// <>fgfhjikojhjhhjk</>
//   );
// }


// components/UnlockTicketComponent.tsx


interface UnlockTicketProps {
  ticketNo: string;
  presentUserId: string;
}

export const UnlockTicket = async ({ ticketNo, presentUserId }: UnlockTicketProps) => {
    const ticketInstance = await getMyInstancesV2<TicketData>({
        processName: "Customer Support Desk Ticket",
        mongoWhereClause: `this.Data.ticketNo == "${ticketNo}"`,
      });
    
      const ticketDatadetails = ticketInstance[0].data;
      const thisTaskId = ticketInstance[0].taskId;


    if(ticketDatadetails["assigneeLockStatus"] = "locked"){
        ticketDatadetails["assigneeLockStatus"] = "unlocked";
        ticketDatadetails["lockChanged"] = true;


// Ensure activityLogsData is initialized
if (!Array.isArray(ticketDatadetails.activityLogsData)) {
  ticketDatadetails.activityLogsData = [];
}

// Create lockReleased logs
const lockReleasedLogs = await makeActivityLogsData({
  ticketNo: ticketNo,
  action: "lockReleased",
  argsList: [] // Pass an empty array or relevant arguments if needed
});

// Merge logs and remove duplicates
const mergedLogs = [...ticketDatadetails.activityLogsData, ...lockReleasedLogs];
const uniqueLogs = Array.from(
  new Map(mergedLogs.map(log => [`${log.action}-${log.dateOfAction}`, log])).values()
);

// Update ticketDetails with unique logs
ticketDatadetails.activityLogsData = uniqueLogs;
    }

    const ticketStatus = ticketDatadetails["status"]
    let transitionNameOfTicket: string;
    if(ticketStatus == "Resolved"){
         transitionNameOfTicket = 'Self Resolve';
    }
    else if(ticketStatus == "Cancelled"){
         transitionNameOfTicket = 'Self Cancel';
    }
    else if(ticketStatus != "Closed"){
         transitionNameOfTicket = 'Update';
    } else {
        // Handle the case where ticketStatus is "Closed" or any other unexpected value
        transitionNameOfTicket = 'update'; // Provide a default value
    }
    try {
    // Perform the unlock logic here

    //                     var ticketStatus = allTicketsMlpRef.data.status;



    console.log("Unlocking ticketuuuuhhhooooo resultssss:", ticketDatadetails["activityLogsData"] );
    console.log("Unlocking ticketuuuuhhhooooo total detaails of the ticket:", ticketDatadetails);
    const invokeActionArgs: invokeActionProps = {
    taskId: thisTaskId,
    transitionName: transitionNameOfTicket,
    data: ticketDatadetails,
    processInstanceIdentifierField: "ticketNo",
  };
  await invokeAction(invokeActionArgs);
  window.location.reload();
    // // Example API call
    // const result = await IkonService.invokeAction(/* parameters */);
    // if (result.success) {
    //   toastr.success("Ticket unlocked successfully!");
    // } else {
    //   toastr.error("Failed to unlock ticket.");
    // }

  } catch (error) {
    console.error("Error unlocking ticket:", error);
  }
};