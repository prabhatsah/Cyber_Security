
import fetchTicketDetails from "../../../components/ticket-details";
import TicketWidget from "../../../components/ticket-widget";
import Card from "../../../summary/components/Card";
import TabComponentTicketDetails from "../ticket-details/components/comments-log-component/tabComponent";
import EachTicketDescriptionComponent from "../ticket-details/components/description";
import EachTicketDetailsComponent from "../ticket-details/components/ticket-details-component";
import TicketSourceComponent from "../ticket-details/components/ticket-source-component";
import EachTicketUploadedFileComponent from "../ticket-details/components/uploaded-files";
import TicketUserInfoComponent from "../ticket-details/components/user-info";

export default async function EachTicketLayout({
    children,
    params,
  }: {
    children: React.ReactNode;
    params?: { ticketNo?: string };  // ✅ Match the param from URL
  }) {
    if (!params?.ticketNo) {
      return <div>No Ticket ID Provided</div>; 
    }
  
    const ticketData = await fetchTicketDetails();
    if (!ticketData || !ticketData.priorityWiseTicketInfo) {
      return <div>No ticket data available.</div>;
    }
  
    const numericTicketId = Number(params.ticketNo);
    if (isNaN(numericTicketId)) {
      return <div>Invalid ticket ID: {params.ticketNo}</div>;
    }
  
    const matchedTicket = ticketData.priorityWiseTicketInfo.find(
      (ticket: any) => ticket.ticketNo === numericTicketId
    );
  
    if (!matchedTicket) {
      return <div>No matching ticket found for ID: {params.ticketNo}</div>;
    }
  
    return (
      <div>
        <TicketWidget
          openTicketsCount={ticketData.openTicketsCount}
          completedTicketsCount={ticketData.completedTicketsCount}
          totalTicketsCount={ticketData.totalTicketsCount}
          unassignedTicketsCount={ticketData.unassignedTicketsCount}
          myTickets={ticketData.myTickets}
        />
        <div className="w-full h-full overflow-auto overflow-x-hidden mt-3">
          <div className="h-full flex flex-col lg:flex-row gap-3">
            <div className="w-full lg:w-1/3 h-full">
              <Card title={<div title={matchedTicket.subject}>{matchedTicket.subject}</div>}
                    tools={<div className="flex gap-2">
                      <span className="border border-pink-500 rounded-full px-1 py-1 text-s">{matchedTicket.priority}</span>
                      <span className="border border-sky-500 rounded-full px-1 py-1 text-s">{matchedTicket.type}</span>
                    </div>}
              >
                <div className="h-[800] flex flex-col overflow-auto p-2">
                  <EachTicketDetailsComponent ticketDetails={matchedTicket} />
                  <TicketSourceComponent ticketDetails={matchedTicket} />
                  <TicketUserInfoComponent ticketDetails={matchedTicket} />
                  <EachTicketUploadedFileComponent ticketDetails={matchedTicket} />
                  <EachTicketDescriptionComponent ticketDetails={matchedTicket} />
                </div>
              </Card>
            </div>
            <div className="w-full lg:w-1/3 h-full">
              <Card title={<div title={matchedTicket.subject}>{matchedTicket.subject}</div>}
                    tools={<div className="flex gap-2">
                      <span className="border border-pink-500 rounded-full px-1 py-1 text-s">{matchedTicket.priority}</span>
                      <span className="border border-sky-500 rounded-full px-1 py-1 text-s">{matchedTicket.type}</span>
                    </div>}
              >
                Some content here...
              </Card>
            </div>
            <div className="w-full lg:w-1/3 h-full">
              <TabComponentTicketDetails ticketId={params.ticketNo}>
                {children}  {/* ✅ Ensuring children (page.tsx content) is rendered here */}
              </TabComponentTicketDetails>
            </div>
          </div>
        </div>
      </div>
    );
  }
  