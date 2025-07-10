import fetchTicketDetails from "@/app/(protected)/(apps)/customer-support/components/ticket-details";
import { TicketData } from "@/app/(protected)/(apps)/customer-support/components/type";
import { getMyInstancesV2, invokeAction } from "@/ikon/utils/api/processRuntimeService";
import { invokeActionProps } from "@/ikon/utils/api/processRuntimeService/type";

export async function InvokeTicketWorkflowTransition(
    taskName : string,
    transitionName : string,
    status : string,
    ticketNo : string
) {
  

  try {
      
    const ticketInstanceData = await getMyInstancesV2<TicketData>({
        processName: "Customer Support Desk Ticket",
        predefinedFilters: { taskName: taskName },
        mongoWhereClause: `this.Data.ticketNo == "${ticketNo}"`,
      });
    console.log(ticketInstanceData)
    let ticketData = ticketInstanceData[0]?.data || []; 
    ticketData.status = status
    const taskId = ticketInstanceData[0]?.taskId || ""
    console.log(ticketData)


    // const result = await invokeAction({
    //   taskId: taskId,
    //   transitionName: transitionName,
    //   data: ticketData,
    //   processInstanceIdentifierField: "ticketNo",
    // });

    const invokeActionArgs: invokeActionProps = {
      taskId: taskId,
      transitionName: transitionName,
      data: ticketData,
      processInstanceIdentifierField: "ticketNo",
    };
    const result = await invokeAction(invokeActionArgs);
    
    console.log(result)
} catch (error) {
    console.error("Failed to invoke action:", error);
  }
}
