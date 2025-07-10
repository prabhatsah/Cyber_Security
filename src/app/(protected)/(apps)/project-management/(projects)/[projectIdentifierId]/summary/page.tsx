import { RenderAppBreadcrumb } from "@/ikon/components/app-breadcrumb";
import { getMyInstancesV2 } from "@/ikon/utils/api/processRuntimeService";
import { getSoftwareIdByNameVersion } from "@/ikon/utils/actions/software";
import { format, parse } from "date-fns";
import RoleWiseFtData from "./components/roleWiseFtData";
import BaseLineForCastChart from "./components/baseLineForCastChart";
import BarChartsSummaryPage from "./components/barCharts";
import HeatMapForRole from "./components/heatMap";
import { Card } from "@/app/(protected)/(apps)/ai-workforce/components/ui/Card";
import { CardContent } from "@/shadcn/ui/card";

export default async function ProductScheduleTab({
  params,
}: {
  params: { projectIdentifierId: string };
}) {
  const projectIdentifier = params?.projectIdentifierId || "";

  const productOfProjectInst = await getMyInstancesV2({
    processName: "Product of Project",
    predefinedFilters: { taskName: "View State" },
    processVariableFilters: { "projectIdentifier": projectIdentifier }
  });

  console.log(productOfProjectInst);

  //Heat Map Data

  let resourceDataWithAllocation = productOfProjectInst[0]?.data?.resourceDataWithAllocation;

  console.log(resourceDataWithAllocation);
  let dataByRole= [];
  if (resourceDataWithAllocation) {
    dataByRole = resourceDataWithAllocation?.reduce((acc: Record<string, any>, resourceAllocationData: Record<string, any>[]) => {
      const role = resourceAllocationData.role;

      if (!acc[role]) {
        acc[role] = {}; // Create role entry if it doesn't exist
      }

      for (const [month, value] of Object.entries(resourceAllocationData.allocation)) {
        if (acc[role][month]) {
          acc[role][month] = Number((acc[role][month] + value).toFixed(2)); // Add value if month exists
        } else {
          acc[role][month] = value; // Create new entry if month doesn't exist
        }
      }

      return acc;
    }, {});
  }



  //Bar Chart Data

  const finalResultNameProgress: Record<string, { percentage: number }> = {};

  if (productOfProjectInst[0]?.data?.scheduleData) {

    let { group, task } = productOfProjectInst[0]?.data?.scheduleData;

    console.log(task);

    const progressResultProject: Record<number, { parentId: number; progress: number; count: number }> = task?.reduce(
      (acc: Record<number, { progress: number; count: number }>, taskInfo: { id: number; parentId: number; progress: number; }) => {
        if (taskInfo.parentId) {
          if (!acc[taskInfo.parentId]) {

            acc[taskInfo.parentId] = { progress: 0, count: 0 };
          }
          acc[taskInfo.parentId].progress += taskInfo.progress;
          acc[taskInfo.parentId].count += 1;
        } else {
          if (!acc[taskInfo.id]) {

            acc[taskInfo.id] = { progress: 0, count: 0 };
          }
          acc[taskInfo.id].progress += taskInfo.progress;
          acc[taskInfo.id].count += 1;
        }
        return acc;
      },
      {} as Record<number, { id: number; parentId: number; progress: number; count: number }>
    );

    console.log(progressResultProject);



    Object.values(group).map((groupInfo: any) => {
      const groupId = groupInfo?.id;
      const groupName = groupInfo?.groupName;
      if (progressResultProject[groupId]) {
        const { progress, count } = progressResultProject[groupId];
        finalResultNameProgress[groupName] = {
          percentage: count > 0 ? parseFloat((progress / count).toFixed(2)) : 0,
        };
      } else {
        finalResultNameProgress[groupName] = { percentage: 0 };
      }
    })

    if (Object.keys(finalResultNameProgress).length === 0) {
      task.map((taskInfo: any) => {
        const id = taskInfo?.id;
        const taskName = taskInfo?.taskName;
        if (progressResultProject[id]) {
          const { progress, count } = progressResultProject[id];
          finalResultNameProgress[taskName] = {
            percentage: count > 0 ? parseFloat((progress / count).toFixed(2)) : 0,
          };
        } else {
          finalResultNameProgress[taskName] = { percentage: 0 };
        }
      })
    }
  }


  console.log(finalResultNameProgress);

  return (
    <>
      <RenderAppBreadcrumb
        breadcrumb={{
          level: 5,
          title: "Summary",
          href: `/summary`,
        }}
      />

      <div className="flex flex-col gap-3 h-full">
        <div className="flex-grow h-[50%]">
          <BarChartsSummaryPage barChartData={finalResultNameProgress} />
        </div>

        <div className="flex-grow h-[50%]">
          <HeatMapForRole heatMapData={dataByRole} />
        </div>

      </div>


    </>
  );
}
