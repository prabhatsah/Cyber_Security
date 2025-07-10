import React from 'react'
import { getUserIdWiseUserDetailsMap } from '@/ikon/utils/actions/users';
import { getMyInstancesV2 } from '@/ikon/utils/api/processRuntimeService';
import { WidgetProps } from '@/ikon/components/widgets/type';
import Widgets from '@/ikon/components/widgets';
import IncidentTab from '@/app/(protected)/(apps)/grc/incident-management/components/incidentTab';
import ControlNewDataTable from './components/controlnewDataTable';


async function generateWidgetData(controlData: any[], controlObjectiveData: any[]) {
    const widgetData: WidgetProps[] = [
      {
        id: 'openIncident',
        widgetText: 'No. of Standards',
        widgetNumber: controlData.filter((item) => item.framework === 'standard').length.toString(),
        iconName: 'folder-open' as const,
      },
      {
        id: 'inProgressIncident',
        widgetText: 'No. of Best Practices',
        widgetNumber: controlData.filter((item) => item.framework === 'bestPractice').length.toString(),
        iconName: 'loader' as const,
      },
      {
        id: 'resolvedIncident',
        widgetText: 'No. of Rules and Regulations',
        widgetNumber: controlData.filter((item) => item.framework === 'rulesAndRegulations').length.toString(),
        iconName: 'badge-check' as const,
      },
      {
        id: 'controlObjectives',
        widgetText: 'No. of Control Objectives',
        widgetNumber: controlObjectiveData.length.toString(),
        iconName: 'list' as const,
      },
    ];
    return widgetData;
  }

async function getControlData() {
    const controlInstances = await getMyInstancesV2({
      processName: "Control",
      predefinedFilters: { taskName: "edit control" },
    });
  
    console.log("control Instances:", controlInstances);
    const controlData = controlInstances.length
      ? controlInstances.map((controlInstances) => controlInstances.data)
      : [];
    console.log("Framework Data:", controlData);
    return controlData;
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

export default async function IncidentManagement() {
   
  //  const widgetData = await generateWidgetData();

    const controlData = await getControlData();

    const controlObjectiveData = await getControlObjectiveData();

    const widgetData = await generateWidgetData(controlData, controlObjectiveData);

    
    return (
        <>
            <div className="flex flex-col gap-3">
                <Widgets widgetData={widgetData} />
                <ControlNewDataTable controlNewDatas={controlData} controlObjData = {controlObjectiveData}/>
            </div>
        </>
    )
}
