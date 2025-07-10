import React, { useState, useEffect } from "react";
import GanttChartComponent from "../schedule_gantt_component";
import { getMyInstancesV2 } from "@/ikon/utils/api/processRuntimeService";

interface ScheduleGanttShowProps {
  productIdentifier: string;
}

const ScheduleGanttShowComponent: React.FC<ScheduleGanttShowProps> = ({
  productIdentifier,
}) => {
  const [scheduleData, setScheduleData] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log("Fetching deal instances...");
        const productInsData = await getMyInstancesV2({
          processName: "Product",
          predefinedFilters: { taskName: "Schedule" },
          mongoWhereClause: `this.Data.productIdentifier == "${productIdentifier}"`,
          projections: ["Data"],
        });

        console.log("Fetched schedule data:", productInsData[0]?.data);

          const extractedScheduleData =
          productInsData[0]?.data?.scheduleData?.task || [];

        const tasks = extractedScheduleData.map((item: any) => ({
          name: item.taskName,
          start: item.taskStart,
          end: item.taskEnd,  
          progress: 0,                    
          type: item.type || "defaultType", 
          id: item.id || Date.now().toString(), 
        }));

        setScheduleData(tasks);

      } catch (error) {
        console.error("Error fetching data", error);
      }
    };

    fetchData();
  }, [productIdentifier]);

  return (
    
    <div>
      {/* {scheduleData.length > 0 ? (
        <div className="flex flex-col w-full overflow-hidden">
            <GanttChartComponent scheduleData={scheduleData} />
        </div>
      ) : (
        <div className="flex justify-center items-center border h-[30vh] text-gray-500">
          No tasks to show
        </div>
      )} */}
    </div>
  );
};

export default ScheduleGanttShowComponent;
