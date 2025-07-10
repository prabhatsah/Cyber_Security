import Widgets from "@/ikon/components/widgets";
import { WidgetProps } from "@/ikon/components/widgets/type";

export default function TicketWidget({
  openTicketsCount,
  completedTicketsCount,
  totalTicketsCount,
  unassignedTicketsCount,
  myTickets,
}: {
  openTicketsCount: number;
  completedTicketsCount: number;
  totalTicketsCount: number;
  unassignedTicketsCount: number;
  myTickets: number;
}) {
  // Define the widgetData with fallback to empty array if no data is provided
  const widgetData: WidgetProps[] = [
    {
      id: "unassignedTicketsCount",
      widgetText: "Unassigned Ticket(s)",
      widgetNumber: "" + unassignedTicketsCount,
      iconName: "user-x",
    },
    {
      id: "openTicketsCount",
      widgetText: "Open Ticket(s)",
      widgetNumber: "" + openTicketsCount,
      iconName: "sticky-note",
    },
    {
      id: "totalTicketsCount",
      widgetText: "Total Ticket(s)",
      widgetNumber: "" + totalTicketsCount,
      iconName: "layers",
    },
    {
      id: "completedTicketsCount",
      widgetText: "Completed Ticket(s)",
      widgetNumber: "" + completedTicketsCount,
      iconName: "circle-check-big",
    },
    {
      id: "myTickets",
      widgetText: "My Ticket(s)",
      widgetNumber: "" + myTickets,
      iconName: "user-check",
    },
  ];

  // Fallback if widgetData is empty or undefined
  if (!widgetData || widgetData.length === 0) {
    return <div>No widget data available</div>;
  }

  return <Widgets widgetData={widgetData} />;
}
