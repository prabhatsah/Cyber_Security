import { getMyInstancesV2 } from "@/ikon/utils/api/processRuntimeService";
import { TicketData } from "@/app/(protected)/(apps)/customer-support/components/type";

export default async function getDataOfGetMyInstance({ ticketNo }:{ticketNo : string;}) {

  const ticketInstance = await getMyInstancesV2<TicketData>({
    processName: "Customer Support Desk Ticket",
    mongoWhereClause: `this.Data.ticketNo == "${ticketNo}"`,
    projections: ["Data"],
  });

  return {

      ticketDetails: ticketInstance,
  
  };
}