import { AssignemntData } from "../../components/type";
import { getMyInstancesV2 } from "@/ikon/utils/api/processRuntimeService";
import { WidgetProps } from "@/ikon/components/widgets/type";
import AssignmentWidget from "../../data-scientists/assignments/assignment-widget";
import AssignmentDataTable from "../../data-scientists/assignments/assignment-datatable";

export default async function Lead() {
  const assignmentsData = await getMyInstancesV2<AssignemntData>({
    processName: "Assignments",
    predefinedFilters: { taskName: "Assignment Update Activity" },
  });
  console.log("assignmentsData-----", assignmentsData);
  const assignmentsDataDynamic = Array.isArray(assignmentsData)
    ? assignmentsData.map((e: any) => e.data)
    : [];
  console.log("assignmentsDataDynamic-----", assignmentsDataDynamic);
  interface LeadStatus {
    Lead: number;
    totalLeads: number;
    activeLeads: number;
    closedLeads: number;
    wonLeads: number;
  }

  const leadStatus: LeadStatus = {
    Lead: 0,
    totalLeads: 0,
    activeLeads: 0,
    closedLeads: 0,
    wonLeads: 0,
  };

  const WidgetData: WidgetProps[] = [
    {
      id: "totalLeadCount",
      widgetText: "Total Assignment(s)",
      widgetNumber: "2",
      iconName: "sticky-note",
    },
    {
      id: "totalWonLeadCount",
      widgetText: "Assignment(s) - Done",
      widgetNumber: "4",
      iconName: "trophy",
      // onButtonClickfunc: widgetNumberClickedFunction,
    },
    {
      id: "totalClosedLeadCount",
      widgetText: "Assignment(s) - Ongoing",
      widgetNumber: "4",
      iconName: "ban",
    },
    {
      id: "totalActiveLeadCount",
      widgetText: "Assignment(s) - To Do",
      widgetNumber: "2",
      iconName: "trophy",
    },
  ];

  const assignmentData = [
    {
      name: "John Doe",
      email: "john.doe@example.com",
      status: "Active",
    },
    {
      name: "Jane Smith",
      email: "jane.smith@example.com",
      status: "Inactive",
    },
    {
      name: "Sam Wilson",
      email: "sam.wilson@example.com",
      status: "Pending",
    },
  ];

  return (
    <div className="w-full h-full flex flex-col gap-3">
      <AssignmentWidget widgetData={WidgetData} />
      <div className="flex-grow overflow-hidden">
        <AssignmentDataTable assignmentData={assignmentsDataDynamic} />
      </div>
    </div>
  );
}
