'use client';
import { DataTable } from "@/ikon/components/data-table";
import { DTColumnsProps, DTExtraParamsProps } from "@/ikon/components/data-table/type";
import { useEffect, useState } from "react";
import { getDynamicMonitoringData } from "../get-data/get-cassandra-data";
import { LoadingSpinner } from '@/ikon/components/loading-spinner';
import DelimiterInput from "./actions/delimiter";
import TreeView from "../components/view-components/Treeview";

export default function Page() {
  const [bacnetData, setBacnetData] = useState<any[]>([]);
  const [dataFetched, setDataFetched] = useState(false);
  const [treeData, setTreeData] = useState<any[]>([]); // State to hold tree data

  const bacnetDataTableColumns: DTColumnsProps<any>[] = [
    {
      accessorKey: "object_name",
      header: "Object Name",
      cell: ({ row }) => <div>{row.original.object_name}</div>,
    },
    {
      accessorKey: "description",
      header: "Description",
      cell: ({ row }) => <div>{row.original.description}</div>,
    },
    {
      accessorKey: "units",
      header: "Units",
      cell: ({ row }) => <div>{row.original.units}</div>,
    },
    {
      accessorKey: "present_value",
      header: "Present Value",
      cell: ({ row }) => <div>{row.original.present_value}</div>,
    },
  ];

  const ext: DTExtraParamsProps = {
    extraTools: [
      <DelimiterInput
        data={bacnetData}
        onDataProcessed={(processedData) => setTreeData(processedData)} // Update treeData when processed
      />,
    ],
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const backnetRawData = await getDynamicMonitoringData();
        console.log("backnetRawData", backnetRawData);
        setBacnetData(backnetRawData);
        setDataFetched(true);
      } catch (error) {
        console.error("Error fetching Bacnet data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <>
      {dataFetched ? (
        <>
          <DataTable columns={bacnetDataTableColumns} data={bacnetData} extraParams={ext} />
          {treeData.length > 0 && (
            <div className="mt-4">
              <h2 className="text-lg font-bold mb-2">Simplified Data</h2>
              <TreeView data={treeData} />
            </div>
          )}
        </>
      ) : (
        <div className="h-[100vh]">
          <LoadingSpinner />
        </div>
      )}
    </>
  );
}