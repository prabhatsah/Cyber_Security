import React, { useState, useEffect } from "react";
import GanttChartComponent from "../schedule_gantt_component";
import { getMyInstancesV2 } from "@/ikon/utils/api/processRuntimeService";
import NoDataComponent from "@/ikon/components/no-data";

interface ScheduleGanttShowProps {
  projectIdentifier: string;
}

interface Task {
  id: number;
  taskName: string;
  taskStart: string;
  taskDuration: number;
  taskEnd: string;
  progress: number;
  parentId?: number;
  taskColour?: string;
}

interface Dependency {
  id: number;
  predecessorId: number;
  successorId: number;
  type: number;
}

interface Group {
  id: number;
  groupName: string;
  schedules: Task[];
  groupStartDate: string;
  groupEndDate: string;
}

interface ScheduleData {
  task: Task[];
  dependency: Dependency[];
  group: Group[];
}

interface ProductScheduleData {
  scheduleData: ScheduleData;
}

const ScheduleGanttShowComponent: React.FC<ScheduleGanttShowProps> = ({
  projectIdentifier,
}) => {
  const [scheduleData, setScheduleData] = useState<ScheduleData | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log("Fetching deal instances...");
        const productInsData = await getMyInstancesV2<ProductScheduleData>({
          processName: "Product of Project",
          predefinedFilters: { taskName: "View State" },
          mongoWhereClause: `this.Data.projectIdentifier == "${projectIdentifier}"`,
          projections: ["Data"],
        });

        const extractedScheduleData = productInsData[0]?.data?.scheduleData || [];

        setScheduleData(extractedScheduleData);

      } catch (error) {
        console.error("Error fetching data", error);
      }
    };

    fetchData();
  }, [projectIdentifier]);

  return (
    <div className="flex flex-col flex-grow">
      {scheduleData ? (
        <GanttChartComponent scheduleData={scheduleData} />
      ) : (
        <NoDataComponent text="No Schedule Data Available" />
      )}
    </div>
  );
};

export default ScheduleGanttShowComponent;
