import { CardContent, CardHeader, CardTitle } from "@/shadcn/ui/card";
import fetchTicketDetails from "../../../components/ticket-details";
import EachTicketDetailsComponent from "../ticket-details/components/ticket-details-component";
import Card from "../../../summary/components/Card";
import TicketSourceComponent from "../ticket-details/components/ticket-source-component";
import TicketUserInfoComponent from "../ticket-details/components/user-info";
import EachTicketDescriptionComponent from "../ticket-details/components/description";
import EachTicketUploadedFileComponent from "../ticket-details/components/uploaded-files";
import TicketWidget from "../../../components/ticket-widget";
import TabComponentTicketDetails from "../ticket-details/components/comments-log-component/tabComponent";
import TicketWorkflowLayout from "../ticket-details/components/ticket-workflow-component";

export default async function EachTicketDetails({
  ticketId,
}: {
  ticketId: string;
}) {
  const ticketData = await fetchTicketDetails();
  const {
    closedTickets,
    openTicketsCount,
    completedTicketsCount,
    unassignedTicketsCount,
    totalTicketsCount,
    myTickets,
  } = ticketData;
  if (!ticketData || !ticketData.priorityWiseTicketInfo) {
    return <div>No ticket data available.</div>;
  }

  const numericTicketId = Number(ticketId);
  const matchedTicket = ticketData.priorityWiseTicketInfo.find(
    (ticket: any) => ticket.ticketNo === numericTicketId
  );

  if (!matchedTicket) {
    return <div>No matching ticket found for ID: {ticketId}</div>;
  }

  return (
    <div className="w-full h-full flex flex-col gap-3">
      <TicketWidget
        openTicketsCount={openTicketsCount}
        completedTicketsCount={completedTicketsCount}
        totalTicketsCount={totalTicketsCount}
        unassignedTicketsCount={unassignedTicketsCount}
        myTickets={myTickets}
      />
     <div className="flex-grow overflow-hidden">
      {/* <div className="w-full h-full overflow-auto overflow-x-hidden mt-3" id="dealMainTemplateDiv"> */}
        <div className="h-full flex flex-col lg:flex-row gap-3">
          <div className="w-full lg:w-1/3 h-full">
            <div className="flex flex-col gap-3 overflow-hidden">
              <Card
                title={
                  <div
                    className="max-w-[250px] overflow-hidden text-ellipsis whitespace-nowrap"
                    title={matchedTicket.subject}
                  >
                    {matchedTicket.subject}
                  </div>
                }
                tools={
                  <div className="flex gap-2">
                    <span className="border border-pink-500 rounded-full px-1 py-1 text-s">
                      {matchedTicket.priority}
                    </span>
                    <span className="border border-sky-500 rounded-full px-1 py-1 text-s">
                      {matchedTicket.type}
                    </span>
                  </div>
                }
              >
                <div className="h-[600] flex flex-col overflow-auto">
                  <EachTicketDetailsComponent ticketDetails={matchedTicket} />
                  <TicketSourceComponent ticketDetails={matchedTicket} />
                  <TicketUserInfoComponent ticketDetails={matchedTicket} />
                  <EachTicketUploadedFileComponent
                    ticketDetails={matchedTicket}
                  />
                  <EachTicketDescriptionComponent
                    ticketDetails={matchedTicket}
                  />
                </div>
              </Card>
            </div>
          </div>
          <div className="w-full lg:w-1/3 h-full">
            <div className="flex flex-col gap-3">

              <TicketWorkflowLayout ticketId={matchedTicket.ticketNo}/>
            </div>
          </div>
    
          <div className="w-full lg:w-1/3 h-full flex flex-col">
                <TabComponentTicketDetails
                  ticketId={ticketId}
                ></TabComponentTicketDetails>
              
       
          </div>
        </div>
      </div>
    </div>
  );
}
