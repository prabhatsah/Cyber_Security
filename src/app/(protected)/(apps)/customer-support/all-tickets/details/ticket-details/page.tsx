import fetchTicketDetails from "../../../components/ticket-details";

export default function EachTicketDetailsPage({ ticketId }: { ticketId: string }) {
    
    //  const ticketData = await fetchTicketDetails();
    //     console.log("Open Tickets: from deeeeeeeettttttttttt page", ticketData);
    // // Ensure ticketData is valid
    // if (!ticketData || !ticketData.priorityWiseTicketInfo) {
    //     return <div>No ticket data available.</div>;
    // }

    // // Convert ticketId to a number for comparison
    // const numericTicketId = Number(ticketId);

    // // Find the ticket that matches the provided ticketNo
    // const matchedTicket = ticketData.priorityWiseTicketInfo.find(
    //     (ticket: any) => ticket.ticketNo === numericTicketId
    // );

    // // If no matching ticket is found
    // if (!matchedTicket) {
    //     return <div>No matching ticket found for ID: {ticketId}</div>;
    // }

    // Render the matched ticket details
    return (
        // <div>
        //     <h2>Ticket Details</h2>
        //     <p><strong>Account Name:</strong> {matchedTicket.accountName}</p>
        //     <p><strong>Subject:</strong> {matchedTicket.subject}</p>
        //     <p><strong>Priority:</strong> {matchedTicket.priority}</p>
        //     <p><strong>Type:</strong> {matchedTicket.type}</p>
        //     <p><strong>Status:</strong> {matchedTicket.status}</p>
        //     <p><strong>Issue Date:</strong> {new Date(matchedTicket.issueDate).toLocaleString()}</p>
        // </div>
        <>ticketno is : {ticketId}</>
    );
}
