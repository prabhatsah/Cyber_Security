import OpenTicketsDatatable from "../../components/ticket-datatable";
import fetchTicketDetails from "../../components/ticket-details";
import TicketWidget from "../../components/ticket-widget"

export default async function CustomerSupportOpenTickets() {

    const ticketData = await fetchTicketDetails();
    console.log("Open Tickets: from main page", ticketData);

    const { openTickets, openTicketsCount, completedTicketsCount, unassignedTicketsCount, totalTicketsCount, myTickets } = ticketData;

  return (
    // <main className="h-screen flex flex-col">
    //   <div className="w-full h-full flex flex-col gap-3 overflow-hidden">
    //     {/* <Widgets widgetData={WidgetData} /> */}
    //     <TicketWidget
    //       openTicketsCount={openTicketsCount}
    //       completedTicketsCount={completedTicketsCount}
    //       totalTicketsCount={totalTicketsCount}
    //       unassignedTicketsCount={unassignedTicketsCount}
    //       myTickets={myTickets}
    //     />
    //     <div className="flex-grow overflow-x-auto">
    //     <div className="min-w-full">
    //       <OpenTicketsDatatable ticketData={openTickets} showExtraParam={true} showActionBtn={true}/>
    //     </div>
    //     </div>
    //   </div>
    // </main>


    <div className="w-full h-full flex flex-col gap-3">
              <TicketWidget
          openTicketsCount={openTicketsCount}
          completedTicketsCount={completedTicketsCount}
          totalTicketsCount={totalTicketsCount}
          unassignedTicketsCount={unassignedTicketsCount}
          myTickets={myTickets}
        />
      <div className="flex-grow overflow-hidden">
      <OpenTicketsDatatable ticketData={openTickets} isOpen={false} showCreateTicket={true} showExtraParam={true} showActionBtn={true}/>
      </div>
    </div>
  );
}
