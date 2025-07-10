import { getMyInstancesV2 } from "@/ikon/utils/api/processRuntimeService";
import LeadDataTable from "./components/lead-datatable";
import { WidgetProps } from "@/ikon/components/widgets/type";
import LeadWidget, {
  widgetNumberClickedFunction,
} from "./components/lead-widget";
import { LeadData } from "../../components/type";
import { getUserIdWiseUserDetailsMap } from "@/ikon/utils/actions/users";

export default async function Lead() {
  const leadsData = await getMyInstancesV2<LeadData>({
    processName: "Leads Pipeline",
    predefinedFilters: { taskName: "View State" },
  });
  const leadsDataDynamic = Array.isArray(leadsData)
    ? leadsData.map((e: any) => e.data)
    : [];

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

  for (let i = 0; i < leadsDataDynamic.length; i++) {
    if (
      leadsDataDynamic[i].leadStatus == "Lead Created" ||
      leadsDataDynamic[i].leadStatus == "Rejected From Lead" ||
      leadsDataDynamic[i].leadStatus == "Discovery Created" ||
      leadsDataDynamic[i].leadStatus == "Opportunity Created From Lead" ||
      leadsDataDynamic[i].leadStatus == "Recall Lead From Discovery" ||
      leadsDataDynamic[i].leadStatus == "Rejected From Discovery" ||
      leadsDataDynamic[i].leadStatus == "Opportunity Created From Discovery" ||
      leadsDataDynamic[i].leadStatus == "Recall Discovery From Opportunity" ||
      leadsDataDynamic[i].leadStatus == "Rejected From Opportunity" ||
      leadsDataDynamic[i].leadStatus == "Proposal Prepared" ||
      leadsDataDynamic[i].leadStatus == "Recall Opportunity From Proposal" ||
      leadsDataDynamic[i].leadStatus == "Rejected From Proposal" ||
      leadsDataDynamic[i].leadStatus == "Proposal Submitted To Client" ||
      leadsDataDynamic[i].leadStatus == "Recall Lead From Negotiation" ||
      leadsDataDynamic[i].leadStatus == "Recall Discovery From Negotiation" ||
      leadsDataDynamic[i].leadStatus == "New Proposal Requested" ||
      leadsDataDynamic[i].leadStatus == "Rejected From Negotiation" ||
      leadsDataDynamic[i].leadStatus == "Won" ||
      leadsDataDynamic[i].leadStatus == "Account Created" ||
      leadsDataDynamic[i].leadStatus == "New Proposal Requested" ||
      leadsDataDynamic[i].leadStatus == "Deal In Progress" ||
      leadsDataDynamic[i].leadStatus == "Deal Lost"
    ) {
      ++leadStatus.Lead;
    }
    if (
      leadsDataDynamic[i].leadStatus != "Account Created" &&
      leadsDataDynamic[i].leadStatus != "Deal Lost"
    ) {
      ++leadStatus.activeLeads;
    }
    if (
      leadsDataDynamic[i].leadStatus == "Account Created" ||
      leadsDataDynamic[i].leadStatus == "Deal Lost"
    ) {
      ++leadStatus.closedLeads;
    }
    if (
      leadsDataDynamic[i].leadStatus == "Won" ||
      leadsDataDynamic[i].leadStatus == "Account Created"
    ) {
      ++leadStatus.wonLeads;
    }
    if (
      leadsDataDynamic[i].leadStatus == "Won" ||
      leadsDataDynamic[i].leadStatus == "Account Created" ||
      leadsDataDynamic[i].leadStatus == "Deal Lost"
    ) {
      ++leadStatus.totalLeads;
    }
  }

  const WidgetData: WidgetProps[] = [
    {
      id: "totalLeadCount",
      widgetText: "Total No. of Lead(s)",
      widgetNumber: "" + leadStatus.Lead,
      iconName: "sticky-note",
    },
    {
      id: "totalWonLeadCount",
      widgetText: "No. of Won Lead(s)",
      widgetNumber: "" + leadStatus.wonLeads,
      iconName: "trophy",
      // onButtonClickfunc: widgetNumberClickedFunction,
    },
    {
      id: "totalClosedLeadCount",
      widgetText: "No. of Closed Lead(s)",
      widgetNumber: "" + leadStatus.closedLeads,
      iconName: "ban",
    },
    {
      id: "totalActiveLeadCount",
      widgetText: "No. of Active Lead(s)",
      widgetNumber: "" + leadStatus.activeLeads,
      iconName: "trophy",
    },
  ];

  const userIdWiseUserDetailsMap = await getUserIdWiseUserDetailsMap();
  return (
    <div className="w-full h-full flex flex-col gap-3">
      <LeadWidget widgetData={WidgetData} />
      <div className="flex-grow overflow-hidden">
        <LeadDataTable leadsData={leadsData.map((e: any) => e.data)} userIdWiseUserDetailsMap={userIdWiseUserDetailsMap}/>
      </div>
    </div>
  );
}
