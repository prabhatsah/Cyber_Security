
import React from 'react'
import { WidgetProps } from "@/ikon/components/widgets/type";
import Widgets from "@/ikon/components/widgets";
import RiskDataTable from './component/riskDataTable/page';


async function generateWidgetData() {
  const widgetData: WidgetProps[] = [
    {
      id: "totalRisk",
      widgetText: "Total Risk",
      widgetNumber: "0",
      iconName: "folder-open" as const,
    },
    {
      id: "criticalRisk",
      widgetText: "Critical Risk",
      widgetNumber: "0",  
      iconName: "loader" as const,
    },
    {
      id: "riskMitigated",
      widgetText: "Risk Mitigated",
      widgetNumber: "0",
      iconName: "badge-check" as const,
    },
  ];
  return widgetData;
}

export default async function RiskManagement() {
 
  const riskData = [
    {
      riskTitle: "Data Breach",
      category: "Cybersecurity",
      riskScore: "85",
      priority: "High",
      assignedTo: "John Doe",
      status: "Open",
    },
    {
      riskTitle: "System Downtime",
      category: "IT Operations",
      riskScore: "70",
      priority: "Medium",
      assignedTo: "Jane Smith",
      status: "In Progress",
    },
    {
      riskTitle: "Regulatory Non-Compliance",
      category: "Compliance",
      riskScore: "90",
      priority: "High",
      assignedTo: "Alice Johnson",
      status: "Open",
    },
    {
      riskTitle: "Third-Party Vendor Risk",
      category: "Supply Chain",
      riskScore: "65",
      priority: "Medium",
      assignedTo: "Bob Brown",
      status: "Closed",
    },
    {
      riskTitle: "Fraudulent Transactions",
      category: "Finance",
      riskScore: "80",
      priority: "High",
      assignedTo: "Charlie Davis",
      status: "Open",
    },
    {
      riskTitle: "Unauthorized Access",
      category: "Cybersecurity",
      riskScore: "75",
      priority: "Medium",
      assignedTo: "Diana Evans",
      status: "In Progress",
    },
    {
      riskTitle: "Natural Disaster",
      category: "Business Continuity",
      riskScore: "95",
      priority: "Critical",
      assignedTo: "Ethan Wilson",
      status: "Open",
    },
    {
      riskTitle: "Data Loss",
      category: "IT Operations",
      riskScore: "60",
      priority: "Low",
      assignedTo: "Fiona Green",
      status: "Closed",
    },
    {
      riskTitle: "Reputation Damage",
      category: "Public Relations",
      riskScore: "88",
      priority: "High",
      assignedTo: "George Harris",
      status: "Open",
    },
    {
      riskTitle: "Phishing Attack",
      category: "Cybersecurity",
      riskScore: "78",
      priority: "Medium",
      assignedTo: "Hannah Lee",
      status: "In Progress",
    },
  ];

  const widgetData = await generateWidgetData();
  console.log(widgetData);

  return (
    <>
      <div className="flex flex-col gap-3">
        <Widgets widgetData={widgetData} />
      </div>
      <div className="mt-4">
        <RiskDataTable riskData={riskData} />
      </div>
    </>
  );
}
