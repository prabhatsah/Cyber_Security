import React from 'react'
import { getMyInstancesV2 } from '@/ikon/utils/api/processRuntimeService';
import { WidgetProps } from '@/ikon/components/widgets/type';
import Widgets from '@/ikon/components/widgets';
import FrameworkTable from './complianceRulesTable';

async function getFrameworkData() {
  const frameworkInstances = await getMyInstancesV2({
    processName: "Add Framework",
    predefinedFilters: { taskName: "view framework" },
  })

  console.log(frameworkInstances);
  const frameworkData = frameworkInstances.length ? frameworkInstances.map((frameworkInstances) => frameworkInstances.data) : []
  console.log(frameworkData);
  return frameworkData;
}

async function generateWidgetData() {
  const frameworkData = await getFrameworkData();
  console.log(frameworkData);
  let bestPracticeFramework = 0, standardFramework = 0, rulesAndRegulationFramework = 0;
  (frameworkData as Record<string, string>[])
    .map(
      (frameworkData) => {
        if (frameworkData.frameworkType === "bestPractice") {
          bestPracticeFramework++;
        } else if (frameworkData.frameworkType === "standard") {
          standardFramework++;
        } else if (frameworkData.frameworkType === "rulesAndRegulation") {
          rulesAndRegulationFramework++;
        }
      }
    );

    const widgetData: WidgetProps[] = [
      {
        id: "bestPracticeFramework",
        widgetText: "No. of Best Practice Frameworks",
        widgetNumber: bestPracticeFramework.toString(),
        iconName: "puzzle" as const, // 🧩 Best practices are pieces of a larger solution
      },
      {
        id: "standardFramework",
        widgetText: "No. of Standard Frameworks",
        widgetNumber: standardFramework.toString(),
        iconName: "ruler" as const, // 📏 Standards imply measurement or consistency
      },
      {
        id: "rulesAndRegulationFramework",
        widgetText: "No. of Rules & Regulation Frameworks",
        widgetNumber: rulesAndRegulationFramework.toString(),
        iconName: "gavel" as const, // ⚖️ Law/Rules representation
      },
    ];
  return widgetData;
}


export default async function IncidentManagement() {
  const frameworkData = await getFrameworkData();
  console.log(frameworkData);
  const widgetData = await generateWidgetData();

  return (
    <>
      <div className="flex flex-col gap-3">
        <Widgets widgetData={widgetData} />
        <FrameworkTable fragmentData={frameworkData} />

      </div>
    </>
  )
}

// "use client";

// export default function HelloWorld() {
//   return <h1>Hello, World!</h1>;
// }
