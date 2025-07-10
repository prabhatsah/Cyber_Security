import { Card, CardContent, CardHeader, CardTitle } from "@/shadcn/ui/card";
//import DropdownMenuWithEditLead from "../../components_edit_lead/lead_data_definition/DropdownMenuWithEditLead";
import { getMyInstancesV2 } from "@/ikon/utils/api/processRuntimeService";
import { ReactNode } from "react";
import { RenderAppBreadcrumb } from "@/ikon/components/app-breadcrumb";
import { TicketData } from "@/app/(protected)/(apps)/customer-support/components/type";
type TicketDetails = {
    createdByBot: any;
    portalName: any;
    serverName: string;
    requestedFrom: string;
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
  };
export default async function TicketSourceComponent({ ticketDetails }: { ticketDetails: TicketDetails}): Promise<ReactNode> {
  //const [isModalOpen, setIsModalOpen] = useState(false);

  console.log("ticketDetails", ticketDetails);
  let urlSubString = ticketDetails.requestedFrom;

  // Use a regular expression to extract the domain name (excluding the protocol and path)
  let extractedDomain = urlSubString.replace(/^https?:\/\//, '').split('/')[0];
  
  let serverName;
  if (!extractedDomain) {
      serverName = "Unknown Server";
  } else if (extractedDomain === "ikoncloud-dev.keross.com") {
      serverName = "Dev Server";
  } else if (extractedDomain === "ikoncloud.keross.com") {
      serverName = "Production Server";
  } else if (extractedDomain === "demo.ikon.keross.com") {
      serverName = "Demo Server";
  } else if (extractedDomain === "ikoncloud-uat.keross.com") {
      serverName = "UAT Server";
  } else if (extractedDomain === "14.98.103.203") {
      serverName = "203 Server";
  } else if (extractedDomain === "49.249.177.28") {
      serverName = "49 Server";
  } else {
      serverName = "New Server";
  }
  
  console.log(serverName);
  
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
        <CardTitle>Ticket Source</CardTitle>
      </CardHeader>
      <CardContent>
      <div className="grid gap-2 p-0 overflow-hidden">
  <div className="flex gap-2 align-middle border-b py-2 px-3">
    Requested From : {extractedDomain|| "n/a"}
  </div></div>
  <div className="grid grid-cols-2 gap-2 p-0 overflow-hidden">
  <div className="flex gap-2 align-middle border-b py-2 px-3">
    Server :  {serverName || "n/a"}
  </div>
  <div className="flex gap-2 align-middle border-b py-2 px-3">
  Source : 
  {ticketDetails.createdByBot 
    ? "Keross.com" 
    : (ticketDetails.portalName ? ticketDetails.portalName : "Manual")}
</div></div>
</CardContent>
    </Card>
  );
}
