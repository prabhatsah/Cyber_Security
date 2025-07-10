import React from "react";
import { getMyInstancesV2 } from "@/ikon/utils/api/processRuntimeService";
import { WidgetProps } from "@/ikon/components/widgets/type";
import Widgets from "@/ikon/components/widgets";
import AuditTabs from "./component/auditTabs/page";
import AuditConfigurationDialog from "./component/auditConfigurationDialog/page";

async function getFrameworkData() {
  const frameworkInstances = await getMyInstancesV2({
    processName: "Add Framework",
    predefinedFilters: { taskName: "view framework" },
  });

  console.log(frameworkInstances);
  const frameworkData = frameworkInstances.length
    ? frameworkInstances.map((frameworkInstances) => frameworkInstances.data)
    : [];
  console.log(frameworkData);
  return frameworkData;
}

async function getControlObjectiveData() {
  const controlObjInstances = await getMyInstancesV2({
    processName: "Control Objectives",
    predefinedFilters: { taskName: "edit control objective" },
  });

  console.log("control Instances:", controlObjInstances);
  const controlObjData = controlObjInstances.length
    ? controlObjInstances.map((controlObjInstances) => controlObjInstances.data)
    : [];
  console.log("Framework Data:", controlObjData);
  return controlObjData;
}

async function generateWidgetData() {
  const widgetData: WidgetProps[] = [
    {
      id: "totalAudit",
      widgetText: "Total Audits",
      widgetNumber: "10",
      iconName: "folder-open" as const,
    },
    {
      id: "publishedAudit",
      widgetText: "Published Audits",
      widgetNumber: "2",
      iconName: "loader" as const,
    },
    {
      id: "nonPublishedAudit",
      widgetText: "Non Published Audits",
      widgetNumber: "8",
      iconName: "badge-check" as const,
    },
  ];
  return widgetData;
}

export default async function AuditManagement() {
  const widgetData = await generateWidgetData();
  return (
    <>
      <div className="flex flex-col gap-3">
        {/* <Widgets widgetData={widgetData} /> */}
        <AuditConfigurationDialog></AuditConfigurationDialog>
      </div>
    </>
  );
}
