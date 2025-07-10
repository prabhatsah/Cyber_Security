'use client';
import { DataTable } from "@/ikon/components/data-table";
import { DTColumnsProps, DTExtraParamsProps } from "@/ikon/components/data-table/type";
import { useEffect, useState } from "react";
import { getDynamicMonitoringData } from "../../../../get-data/get-cassandra-data";
import { LoadingSpinner } from '@/ikon/components/loading-spinner';
import DelimiterInput from "./actions/delimiter";
import TreeView from "../../../../components/view-components/Treeview";
import { formatRawBacnetData } from "../../../../utils/fomatRawBacnetData"; // Ensure the correct relative path

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
        onDataProcessed={(processedData) => {
          const filteredData = processedData.filter(e => e.id === "Rooftop");
          setTreeData(filteredData);
          return filteredData;
        }} // Update treeData when processed
      />,
    ],
  };

  const generateTreeData = (data: any[]) => {
    const levels = ["site", "system", "subSystem", "systemType", "serviceName"];
    const tree: any[] = [];
  
    data.forEach((item) => {
      let currentLevel = tree;
      let path: string[] = [];
      levels.forEach((level, idx) => {
        if (!item[level]) return; // skip missing levels
        path.push(item[level]);
        let id = path.join(" > ");
        let node = currentLevel.find((n: any) => n.id === id);
        if (!node) {
          node = {
            id,
            label: item[level],
            children: [],
          };
          // If this is the last present level, attach data fields
          if (
            idx === levels.length - 1 ||
            !item[levels[idx + 1]]
          ) {
            Object.assign(node, {
              description: item.description || "",
              status: item.present_value || "",
              object_id: item.object_id,
              object_type: item.object_type,
              units: item.units,
              data_received_on: item.data_received_on,
            });
          }
          currentLevel.push(node);
        }
        currentLevel = node.children;
      });
    });
  
    return tree;
  };


  useEffect(() => {
    const fetchData = async () => {
      try {
        const backnetRawData = await getDynamicMonitoringData();
        console.log("backnetRawData", backnetRawData);
        setBacnetData(backnetRawData);
        setDataFetched(true);
        console.log("backnetRawData", backnetRawData);
        handleSubmit(backnetRawData);
      } catch (error) {
        console.error("Error fetching Bacnet data:", error);
      }
    };

    const handleSubmit = async (data: any[]) => {
        try {
          /* console.log("Input Value:", inputValue); */
          console.log("Received Data:", data);
    
          // Process the data
          const formattedBacnetData = await formatRawBacnetData(data);
    
          // Generate treeData dynamically
          const treeData = generateTreeData(formattedBacnetData);
    
          console.log("Generated Tree Data:", treeData);
    
          // Send the processed treeData to the parent component
         /*  onDataProcessed(treeData); */
         const filteredData = treeData.filter(e => e.id === "Rooftop");
          setTreeData(filteredData);
        } catch (error) {
          console.error("Error formatting Bacnet data:", error);
        }
      };

    fetchData();
   
  }, []);

  return (
    <>
      {dataFetched ? (
        <>
         {/*  <DataTable columns={bacnetDataTableColumns} data={bacnetData} extraParams={ext} /> */}
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