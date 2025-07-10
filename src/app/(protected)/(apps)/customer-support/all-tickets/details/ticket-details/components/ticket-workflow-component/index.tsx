import { Card, CardContent, CardHeader, CardTitle } from "@/shadcn/ui/card";
import { getMyInstancesV2 } from "@/ikon/utils/api/processRuntimeService";
 import TicketWorkflowComponent from "./ticketWorkflow";
import { ReactNode } from "react";
import fetchTicketDetails from "@/app/(protected)/(apps)/customer-support/components/ticket-details";
 type TicketDetails = {
    accountName: string;
    subject: string;
    priority: string;
    type: string;
    accountId: string;
    dateCreated: string;
    ticketNo: string;
    issueDate: string;
    status: string;
  };

// export default async function TicketWorkflowLayout({ ticketDetails }: { ticketDetails: TicketDetails}): Promise<ReactNode> {

   
//     const TicketData = await getMyInstancesV2<any>({
//         processName: "Customer Support Desk Ticket",
//         predefinedFilters: { taskName: "View State" },
//         mongoWhereClause: `this.Data.ticketNo == "${ticketDetails.ticketNo}"`,
//         projections: ["Data.status","Data.tickertNo","Data.assigneeName"],
//     });
//     console.log("products", TicketData)
    
export default async function EachTicketDetails({
    ticketId,
  }: {
    ticketId: string;
  }) {
  const ticketData = await fetchTicketDetails();
  // const {
  //   closedTickets,
  //   openTicketsCount,
  //   completedTicketsCount,
  //   unassignedTicketsCount,
  //   totalTicketsCount,
  //   myTickets,
  // } = ticketData;
  if (!ticketData || !ticketData.priorityWiseTicketInfo) {
    return <div>No ticket data available.</div>;
  }

  console.log("ticketData from tickt workflo component -------------------->>>>>>>>>>>>>>>>>>>>>>>>>>>>", ticketData.priorityWiseTicketInfo[0])
  const numericTicketId = Number(ticketId);
  const matchedTicket = ticketData.priorityWiseTicketInfo.find(
    (ticket: any) => ticket.ticketNo === numericTicketId
  );

  if (!matchedTicket) {
    return <div>No matching ticket found for ID: {ticketId}</div>;
  }
  console.log("ticketData from tickt workflo component -------------------->>>>>>>>>>>>>>>>>>>>>>>>>>>>", matchedTicket.activityLogsData)
  
//    const ticketNo = TicketData[0].data.ticketNo;
//    const ticketStatus = TicketData[0].data.status;
//    const assigneeName = TicketData[0].data.assigneeName;

 
    return (
        <Card className="h-[700]">
            <CardHeader className="flex flex-row justify-between overflow-auto p-4 items-center border-b">
                <CardTitle>Ticket Workflow</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col overflow-auto p-2" >
                 <TicketWorkflowComponent
                    ticketNo={matchedTicket.ticketNo}
                    ticketStatus={matchedTicket.status}
                    assigneeName={matchedTicket.assigneeName} assigneeId={matchedTicket.assigneeId} assigneeLockStatus={matchedTicket.assigneeLockStatus} allProductsCompleteFlag={false} activityLogsData={matchedTicket.activityLogsData} dateCreated={matchedTicket.dateCreated}            />  
            </CardContent>
        </Card>
    )
}