import { Card, CardContent, CardHeader, CardTitle } from "@/shadcn/ui/card";
//import DropdownMenuWithEditLead from "../../components_edit_lead/lead_data_definition/DropdownMenuWithEditLead";
import { getMyInstancesV2 } from "@/ikon/utils/api/processRuntimeService";
import { ReactNode } from "react";
import { RenderAppBreadcrumb } from "@/ikon/components/app-breadcrumb";
import { TicketData } from "@/app/(protected)/(apps)/customer-support/components/type";
type TicketDetails = {
    assinedTo: string;
    accountName: string;
    subject: string;
    priority: string;
    type: string;
    accountId: string;
    dateCreated: string;
    ticketNo: string;
    issueDate: string;
    status: string;
    supportMessage:string;
  };
export default async function EachTicketDescriptionComponent({ ticketDetails }: { ticketDetails: TicketDetails}): Promise<ReactNode> {
  //const [isModalOpen, setIsModalOpen] = useState(false);

  console.log("ticketDetails", ticketDetails);
  return (
    <Card className="h-1/2 flex flex-col mt-3">
      <RenderAppBreadcrumb
        breadcrumb={{
          level: 4,
          title: ticketDetails.subject || "Untitled Ticket",
          href: `/customer-support/all-tickets/details/${ticketDetails.ticketNo}`,
        }}
      />
      <CardHeader className="flex flex-row justify-between items-center border-b">
        <CardTitle>Description</CardTitle>
      </CardHeader>
      <CardContent>
      <div className="grid gap-2 p-0 overflow-hidden">
  <div className="flex gap-2 align-middle border-b py-2 px-3">
   {ticketDetails.supportMessage || "n/a"}
  </div></div>
</CardContent>
    </Card>
  );
}
