import { TicketData } from "@/app/(protected)/(apps)/customer-support/components/type";
import { getMyInstancesV2, invokeAction, mapProcessName, startProcessV2 } from "@/ikon/utils/api/processRuntimeService";
import { invokeActionProps } from "@/ikon/utils/api/processRuntimeService/type";
const  saveAssigneeDetails = async (newTicket: Record<string, any>, ticketNo: string) => {
    const processId = await mapProcessName({processName: "Customer Support Desk Ticket",});
  //  await startProcessV2({processId, data: newTicket, processIdentifierFields: "newTicket.ticketNo"});



const ticketInstance = await getMyInstancesV2<TicketData>({
    processName: "Customer Support Desk Ticket",
    predefinedFilters: { taskName: "Edit Activity" },
    mongoWhereClause: `this.Data.ticketNo == "${ticketNo}"`,
  });

  const thisTaskId = ticketInstance[0].taskId;

//   thisData.workspaceName = updatedWorkspaceName;

  const invokeActionArgs: invokeActionProps = {
    taskId: thisTaskId,
    transitionName: "Update",
    data: newTicket,
    processInstanceIdentifierField: "ticketNo",
  };
  await invokeAction(invokeActionArgs);

};


export {saveAssigneeDetails}

// try {
//   const leadPipelineData = await getMyInstancesV2({
//       processName: "Leads Pipeline",
//       predefinedFilters: { taskName: taskName },
//       mongoWhereClause: `this.Data.leadIdentifier == "${leadIdentifier}"`,
//     });
//   console.log(leadPipelineData)
//   let leadData = leadPipelineData[0]?.data || []; 
//   leadData.leadStatus = leadStatus
//   if(data.remarks != ""){
//       var commentsLog = leadData.commentsLog ? leadData.commentsLog : [];
//       commentsLog.push(data)
//       leadData.commentsLog = commentsLog
//   }
//   const taskId = leadPipelineData[0]?.taskId || ""
//   console.log(leadData)
//   const result = await invokeAction({
//     taskId: taskId,
//     transitionName: transitionName,
//     data: leadData,
//     processInstanceIdentifierField: "leadIdentifier",
//   });
//   console.log(result)
// } catch (error) {
//   console.error("Failed to invoke action:", error);
// }
// onClose();



// const ticketInstanceData = await getMyInstancesV2<TicketData>({
//   processName: "Customer Support Desk Ticket",
//   predefinedFilters: { taskName: taskName },
//   mongoWhereClause: `this.Data.ticketNo == "${ticketNo}"`,
// });
// console.log(ticketInstanceData)
// let ticketData = ticketInstanceData[0]?.data || []; 
// ticketData.status = status
// const taskId = ticketInstanceData[0]?.taskId || ""
// console.log(ticketData)


// // const result = await invokeAction({
// //   taskId: taskId,
// //   transitionName: transitionName,
// //   data: ticketData,
// //   processInstanceIdentifierField: "ticketNo",
// // });

// const invokeActionArgs: invokeActionProps = {
// taskId: taskId,
// transitionName: transitionName,
// data: ticketData,
// processInstanceIdentifierField: "ticketNo",
// };
// const result = await invokeAction(invokeActionArgs);

// console.log(result)
// } catch (error) {
// console.error("Failed to invoke action:", error);
// }