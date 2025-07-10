// Import necessary components
// import EnvironmentDataTable from "./environment-datatable";

import { getMyInstancesV2 } from "@/ikon/utils/api/processRuntimeService";
import EnvironmentDataTable from "./environments-datatable";
import EnvironmentWidget from "./environment-widget";
import { WidgetProps } from "@/ikon/components/widgets/type";
import { Suspense } from "react";
import { Loader2Icon } from "lucide-react";

export default async function Env() {
  const envData = await getMyInstancesV2<any>({
    processName: "Environment Process",
    predefinedFilters: { taskName: "Edit Environment Task" },
  });
  console.log("envData-----", envData);
  const envDataDynamic = Array.isArray(envData)
    ? envData.map((e: any) => e.data)
    : [];
  let langData = envData
    .map((e) => e.data)
    .map((env) => env.language)
    .map((lang) => lang.toUpperCase())
    .reduce((acc, lang) => {
      acc[lang] = (acc[lang] || 0) + 1;
      return acc;
    }, {});
  const dummyEnvironmentData = [
    {
      status: "Online",
      environment: "Development",
      workspace: "AI Research",
      language: "Python",
      creationDate: "2025-02-15",
      creationTime: "14:30:00",
      libraryCount: 5,
      action: "",
    },
    {
      status: "Offline",
      environment: "Testing",
      workspace: "Data Science Lab",
      language: "R",
      creationDate: "2025-01-22",
      creationTime: "09:45:00",
      libraryCount: 2,
      action: "",
    },
    {
      status: "Online",
      environment: "Production",
      workspace: "Finance Analytics",
      language: "SQL",
      creationDate: "2025-03-10",
      creationTime: "11:15:00",
      libraryCount: 7,
      action: "",
    },
    {
      status: "Offline",
      environment: "Staging",
      workspace: "Web Development",
      language: "JavaScript",
      creationDate: "2025-02-05",
      creationTime: "16:20:00",
      libraryCount: 4,
      action: "",
    },
  ];
  const WidgetData: WidgetProps[] = [
    {
      id: "totalLeadCount",
      widgetText: "Total Environment",
      widgetNumber: (langData["PYTHON"] || 0) + (langData["R"] || 0),
      iconName: "sticky-note",
    },
    {
      id: "totalWonLeadCount",
      widgetText: "Online Environment",
      widgetNumber: "4",
      iconName: "trophy",
      // onButtonClickfunc: widgetNumberClickedFunction,
    },
    {
      id: "totalClosedLeadCount",
      widgetText: "R Environment(Active/Total)",
      widgetNumber:
        (langData["R"] || 0) +
        "/" +
        ((langData["PYTHON"] || 0) + (langData["R"] || 0)),
      iconName: "ban",
    },
    {
      id: "totalActiveLeadCount",
      widgetText: "Python Environment(Active/Total)",
      widgetNumber:
        (langData["PYTHON"] || 0) +
        "/" +
        ((langData["PYTHON"] || 0) + (langData["R"] || 0)),
      iconName: "trophy",
    },
  ];
  return (
    <div className="w-full h-full flex flex-col gap-3">
      <Suspense
        fallback={
          <div className="flex items-center justify-center h-screen">
            <Loader2Icon className="animate-spin w-16 h-16" />
          </div>
        }
      >
        <EnvironmentWidget widgetData={WidgetData} />
        <EnvironmentDataTable environmentData={envDataDynamic} />
      </Suspense>
    </div>
  );
}
