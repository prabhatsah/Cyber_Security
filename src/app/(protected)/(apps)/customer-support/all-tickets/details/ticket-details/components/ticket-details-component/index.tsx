import { Card, CardContent, CardHeader, CardTitle } from "@/shadcn/ui/card";
//import DropdownMenuWithEditLead from "../../components_edit_lead/lead_data_definition/DropdownMenuWithEditLead";
import { getMyInstancesV2 } from "@/ikon/utils/api/processRuntimeService";
import { ReactNode } from "react";
import { RenderAppBreadcrumb } from "@/ikon/components/app-breadcrumb";
import { TicketData } from "@/app/(protected)/(apps)/customer-support/components/type";
type TicketDetails = {
    activityLogsData: any;
    assigneeByName: ReactNode;
    assigneeName: ReactNode;
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
export default async function EachTicketDetailsComponent({ ticketDetails }: { ticketDetails: TicketDetails}): Promise<ReactNode> {
  //const [isModalOpen, setIsModalOpen] = useState(false);

  const calculateDaysSince = (dateString: string): number => {
    const createdDate = new Date(dateString);
    const today = new Date();
    const diffTime = today.getTime() - createdDate.getTime();
    return Math.floor(diffTime / (1000 * 60 * 60 * 24)); // Convert ms to days
  };

  const newSinceDays = calculateDaysSince(ticketDetails.dateCreated);

  let firstAssignmentDays; // Default value if no assignment found

  if (ticketDetails.activityLogsData && ticketDetails.activityLogsData.length > 0) {
    const firstAssignment = ticketDetails.activityLogsData.find(
      (log: { action: string; }) => log.action === "assignment"
    );

    firstAssignmentDays = firstAssignment ? calculateDaysSince(firstAssignment.dateOfAction) : "N/A";
  }
  
  console.log("ticketDetails", ticketDetails);
  return (
    <Card className="h-1/2 flex flex-col">
      <RenderAppBreadcrumb
        breadcrumb={{
          level: 4,
          title: ticketDetails.subject || "Untitled Ticket",
          href: `/customer-support/all-tickets/details/${ticketDetails.ticketNo}`,
        }}
      />
      <CardHeader className="flex flex-row justify-between items-center border-b">
        <CardTitle>Ticket Details</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-2 gap-2 p-0 overflow-hidden">
  <div className="flex gap-2 align-middle border-b py-2 px-3">
    Creation date : {new Date(ticketDetails.dateCreated).toLocaleDateString("en-GB")}
  </div>
  <div className="flex gap-2 align-middle border-b py-2 px-3">
    Issue date :  {ticketDetails.issueDate ? new Date(ticketDetails.issueDate).toLocaleDateString("en-GB") : "N/A"}
  </div>
  <div className="flex gap-2 align-middle border-b py-2 px-3">
    Assigned to : {ticketDetails.assigneeName ? ticketDetails.assigneeName : "N/A"}
  </div>
  <div className="flex gap-2 align-middle border-b py-2 px-3">
    
    Assigned by : {ticketDetails.assigneeName ? ticketDetails.assigneeByName : "N/A"}
  </div>
  <div className="flex gap-2 align-middle border-b py-2 px-3">
  New since: {newSinceDays === 0 ? "Today" : `${newSinceDays} days`}
</div>
<div className="flex gap-2 align-middle border-b py-2 px-3">
  First assign: {firstAssignmentDays === "N/A" ? "N/A" : firstAssignmentDays === 0 ? "Today" : `${firstAssignmentDays} days`}
</div>
</CardContent>
    </Card>
  );
}
