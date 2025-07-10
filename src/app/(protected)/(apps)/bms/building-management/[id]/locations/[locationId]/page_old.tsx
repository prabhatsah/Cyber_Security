
'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { DataTable } from "@/ikon/components/data-table";
import { DTColumnsProps, DTExtraParamsProps } from "@/ikon/components/data-table/type";
import { getDynamicMonitoringData } from "../../../../get-data/get-cassandra-data";
import { LoadingSpinner } from '@/ikon/components/loading-spinner';
/* import DelimiterInput from "./actions/delimiter";
import TreeView from "../components/view-components/Treeview"; */
import TreeView from "../../../../components/view-components/Treeview";
import { formatRawBacnetData } from '../../../../utils/fomatRawBacnetData';
import { set } from 'date-fns';



// Define interfaces for our data structure
interface RooftopElement {
    id: string;
    name: string;
    type: string;
    children?: RooftopElement[];
}

export default async function RooftopElementsPage( { params: any } ) {
    const params = useParams();
    const buildingId = await params.locationId;
    const [loading, setLoading] = useState(true);
    const [rooftopElements, setRooftopElements] = useState<RooftopElement[]>([]);
    const [bacnetData, setBacnetData] = useState<any[]>([]);
    const [dataFetched, setDataFetched] = useState(false);
    const [treeData, setTreeData] = useState<any[]>([]); // State to hold tree data

     useEffect(() => {
        // Fetch rooftop elements data
         const fetchData = async () => {
              try {
                const backnetRawData = await getDynamicMonitoringData();
                console.log("backnetRawData", backnetRawData);
                setBacnetData(backnetRawData);
                let tempdata  = await formatRawBacnetData(backnetRawData); // Format the raw data
               // Generate tree data from raw data
               setTreeData(tempdata);
               generateTreeData(tempdata)
                console.log("treeData", treeData);
              } catch (error) {
                console.error("Error fetching Bacnet data:", error);
              }
            };
        
        fetchData();
          
    }, []);

    // Recursive function to render tree items
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

    return (
        <>
        {dataFetched ? (
          <>
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