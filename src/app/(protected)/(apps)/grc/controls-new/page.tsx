import React from "react";
import { getUserIdWiseUserDetailsMap } from "@/ikon/utils/actions/users";
import { getMyInstancesV2 } from "@/ikon/utils/api/processRuntimeService";
import { WidgetProps } from "@/ikon/components/widgets/type";
import Widgets from "@/ikon/components/widgets";
import IncidentTab from "@/app/(protected)/(apps)/grc/incident-management/components/incidentTab";
import ControlNewDataTable from "./components/controlnewDataTable";

async function getIncidentCreateData() {
  const incidentCreateInstances = await getMyInstancesV2({
    processName: "Incident Create",
    predefinedFilters: { taskName: "View Incident" },
  });

  console.log(incidentCreateInstances);
  const incidentCreateDatas = incidentCreateInstances.length
    ? incidentCreateInstances.map(
        (incidentCreateInstance) => incidentCreateInstance.data
      )
    : [];
  console.log(incidentCreateDatas);
  return incidentCreateDatas;
}

async function generateWidgetData() {
  const incidentCreateDatas = await getIncidentCreateData();
  console.log(incidentCreateDatas);
  let openIncident = 0,
    inProgressIncident = 0,
    resolvedIncident = 0,
    closedIncident = 0;
  (incidentCreateDatas as Record<string, string>[]).map(
    (incidentCreateData) => {
      if (incidentCreateData.incidentStatus === "Open") {
        openIncident++;
      } else if (incidentCreateData.incidentStatus === "InProgress") {
        inProgressIncident++;
      } else if (incidentCreateData.incidentStatus === "ResolvedIncident") {
        resolvedIncident++;
      } else if (incidentCreateData.closedIncident === "ClosedIncident") {
        closedIncident++;
      }
    }
  );

  const widgetData: WidgetProps[] = [
    {
      id: "openIncident",
      widgetText: "No. of Standards",
      widgetNumber: "10",
      iconName: "folder-open" as const,
    },
    {
      id: "inProgressIncident",
      widgetText: "No. of Best Practices",
      widgetNumber: "10",
      iconName: "loader" as const,
    },
    {
      id: "resolvedIncident",
      widgetText: "No. of Rules and Regulations",
      widgetNumber: "10ss",
      iconName: "badge-check" as const,
    },
  ];
  return widgetData;
}

async function getFrameworkData() {
  const frameworkInstances = await getMyInstancesV2({
    processName: "Add Framework",
    predefinedFilters: { taskName: "view framework" },
  });

  console.log("Framework Instances:", frameworkInstances);
  const frameworkData = frameworkInstances.length
    ? frameworkInstances.map((frameworkInstance) => frameworkInstance.data)
    : [];
  console.log("Framework Data:", frameworkData);
  return frameworkData;
}

async function getControlData() {
    const controlInstances = await getMyInstancesV2({
      processName: "Control",
      predefinedFilters: { taskName: "view control" },
    });
  
    console.log("Framework Instances:", controlInstances);
    const controlData = controlInstances.length
      ? controlInstances.map((controlInstances) => controlInstances.data)
      : [];
    console.log("Framework Data:", controlData);
    return controlData;
  }

export default async function IncidentManagement() {
  const incidentCreateDatas = await getIncidentCreateData();
  console.log(incidentCreateDatas);
  const widgetData = await generateWidgetData();


  // const controlNewDatas = [
  //     {
  //         'controlNumber': '12345',
  //         'controlName': 'Control 1',
  //         'framework': 'Standard',
  //         'frameworkType': 'ISO8601',
  //     },
  //     {
  //         'controlNumber': '12346',
  //         'controlName': 'Control 2',
  //         'framework': 'Best Practices',
  //         'frameworkType': 'CISSP',
  //     },
  //     {
  //         'controlNumber': '12347',
  //         'controlName': 'Control 3',
  //         'framework': 'Rules and Regulations',
  //         'frameworkType': 'ISO27001',
  //     },
  //     {
  //         'controlNumber': '12348',
  //         'controlName': 'Control 4',
  //         'framework': 'Standard',
  //         'frameworkType': 'ISO27001',
  //     },
  //     {
  //         'controlNumber': '12349',
  //         'controlName': 'Control 5',
  //         'framework': 'Best Practices',
  //         'frameworkType': 'XiOS',
  //     },
  //     {
  //         'controlNumber': '12350',
  //         'controlName': 'Control 6',
  //         'framework': 'Rules and Regulations',
  //         'frameworkType': 'WFH',
  //     }

  // ];

  // Fetch framework data and assign it to controlNewDatas
  const formdata = await getFrameworkData();
  console.log("Control New Datas:", formdata);

  const controlData = await getControlData();
  console.log("Control Data:", controlData);

  return (
    <>
      <div className="flex flex-col gap-3">
        <Widgets widgetData={widgetData} />
        <ControlNewDataTable controlNewDatas={controlData} formData = {formdata}/>
      </div>
    </>
  );
}
