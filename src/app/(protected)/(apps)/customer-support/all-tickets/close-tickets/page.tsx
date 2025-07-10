import OpenTicketsDatatable from "../../components/ticket-datatable";
import fetchTicketDetails from "../../components/ticket-details";
import TicketWidget from "../../components/ticket-widget";

export default async function CustomerSupportCloseTickets() {

  const ticketData = await fetchTicketDetails();
  console.log("close Tickets: from main page", ticketData);

  const { closedTickets, openTicketsCount, completedTicketsCount, unassignedTicketsCount, totalTicketsCount, myTickets } = ticketData;

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
      <OpenTicketsDatatable ticketData={closedTickets} showCreateTicket={true} isOpen={false} showExtraParam={true} showActionBtn={false}/>
      </div>
    </div>
  );
}
