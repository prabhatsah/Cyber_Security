'use client'
import { useMemo, useState } from "react";
//import moment from "moment";
import { parse, compareAsc } from "date-fns";
import ResourceMainDataTable from "./resourceMainDataTable";
import ResourceModal from "./add-resource/AddResourceModalForm";

interface ResourceAllocation {
  [monthKey: string]: number;
}

interface ResourceData {
  employeeName: string;
  taskName: string;
  role: string;
  gradeId: string;
  allocation: ResourceAllocation;
}

export default function ResourceComponent({ resourceData, productIdentifier }: { resourceData: ResourceData[]; productIdentifier: string }) {
  const { processedData, columnSchema } = useMemo(() => {
    const monthSet = new Set<string>();

    const processedData = resourceData.map(({ employeeName, taskName, role, gradeId, allocation }) => {
      let totalFTE = Object.values(allocation).reduce((sum, val) => sum + val, 0);

      Object.keys(allocation).forEach(monthKey => monthSet.add(monthKey));

      return {
        staff: employeeName,
        task: taskName,
        role,
        grade: gradeId ? `G ${gradeId}` : "",
        totalFTE,
        ...allocation, // Spread allocation dynamically
      };
    });

    // Sorted month array & column schema
    //const sortedMonthArray = Array.from(monthSet).sort((a, b) => moment(a, "MMM_YYYY").valueOf() - moment(b, "MMM_YYYY").valueOf());
    const sortedMonthArray = Array.from(monthSet).sort((a, b) => 
      compareAsc(
        parse(a, "MMM-yyyy", new Date()), 
        parse(b, "MMM-yyyy", new Date())
      )
    );
    const columnSchema = sortedMonthArray.map(month => ({
     //]] title: moment(month, "MMM_YYYY").format("MMM YYYY"),
      title: month,
      dataField: month,
      class: "text-end",
    }));

    return { processedData, columnSchema };
  }, [resourceData]);

  return (
    <div>
      <ResourceMainDataTable resourceData={processedData} columnSchema={columnSchema} productIdentifier={productIdentifier}/>
    </div>
  );
}
