import fetchTicketDetails from "../components/ticket-details";
import TicketWidget from "../components/ticket-widget";// Import the client wrapper
import { TicketData } from "../components/type";
import SummaryClientWrapper from "./SummaryClientWrapper";

export default async function Summary() {
  const ticketData = await fetchTicketDetails();
  console.log("Fetched ticket data:", ticketData);

  const {
    priorityWiseTicketInfo,
    typeGrouped,
    priorityGrouped,
    statusGrouped,
    accountGrouped,
    infraGrouped,
    infraChartData,
    priorityChartData,
    statusChartData,
    accountChartData,
    typeChartData,
  } = ticketData;
  console.log("from sppppwrapper")
  console.log(priorityWiseTicketInfo)
  return (
    <main className="h-full flex flex-col overflow-hidden">
      <TicketWidget {...ticketData} />

      {/* Pass data to the client-side wrapper */}
      <SummaryClientWrapper
        typeChartData={typeChartData}
        priorityChartData={priorityChartData}
        statusChartData={statusChartData}
        accountChartData={accountChartData}
        infraChartData={infraChartData}
        typeGrouped={typeGrouped}
        priorityGrouped={priorityGrouped}
        statusGrouped={statusGrouped}
        accountGrouped={accountGrouped}
        infraGrouped={infraGrouped}
        priorityWiseTicketInfo={priorityWiseTicketInfo}/>
    </main>
  );
}