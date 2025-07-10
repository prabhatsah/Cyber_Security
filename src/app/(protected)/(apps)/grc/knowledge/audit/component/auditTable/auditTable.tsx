"use client";

import { DataTable } from "@/ikon/components/data-table";
import {
  DTColumnsProps,
  DTExtraParamsProps,
} from "@/ikon/components/data-table/type";
import { format } from "date-fns";
import React, { useEffect, useState } from "react";
import { SAVE_DATE_FORMAT_GRC } from "@/ikon/utils/config/const";
import { getMyInstancesV2 } from "@/ikon/utils/api/processRuntimeService";
import { CreateUserMap } from "../../../../components/createUserMap";
import { Button } from "@/shadcn/ui/button";
import { Plus } from "lucide-react";

export default function AuditTable({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (val: boolean) => void;
}) {
  const [tableData, setTableData] = useState<any[]>([]);
  const [map, setMap] = useState<any[]>([]);
  useEffect(() => {
    async function call() {
      const userIdNameMap: { value: string; label: string }[] =
        await CreateUserMap();
      setMap(userIdNameMap);
    }
    call();
  }, []);

  const auditData = async () => {
    try {
      const auditInsData = await getMyInstancesV2<any>({
        processName: "Add Audit",
        predefinedFilters: { taskName: "view audit" },
      });

      const audits = auditInsData.map((instance: any) => {
        const data = instance.data;
        console.log('dataaaaaaaaaaaaaaaaaaaa dekhneee ==')
        console.log(data)
        return {
          frameworkName: data.frameworkTitle || "",
          auditName: data.auditName || "",
          auditType: data.auditType || "",
          controlCount: data.frameworkData?.controls?.length || 0,
          startDate: data.startDate,
          endDate: data.endDate,
          lastUpdatedOn: data.lastUpdatedOn,
          lastUpdateByName: data.lastUpdateByName,
          status: data.status,
        };
      });

      setTableData(audits);
    } catch (error) {
      console.error("Error fetching audit data:", error);
    }
  };

  useEffect(() => {
    auditData();
  }, []);

  const columns: DTColumnsProps<Record<string, any>>[] = [
    {
      accessorKey: "frameworkName",
      header: "Framework Name",
    },
    {
      accessorKey: "auditName",
      header: "Audit Name",
      cell: ({ row }) => (
        <div className="capitalize">{row.original.auditName || "N/A"}</div>
      ),
    },
    {
      accessorKey: "auditType",
      header: "Audit Type",
      cell: ({ row }) => (
        <div className="capitalize">{row.original.auditType}</div>
      ),
    },
    {
      accessorKey: "controlCount",
      header: "No. of Controls",
    },
    // {
    //   accessorKey: "startDate",
    //   header: "Start Date",
    //   cell: ({ row }) =>
    //     row.original.startDate
    //       ? format(new Date(row.original.startDate), SAVE_DATE_FORMAT_GRC)
    //       : "N/A",
    // },
    // {
    //   accessorKey: "endDate",
    //   header: "End Date",
    //   cell: ({ row }) =>
    //     row.original.endDate
    //       ? format(new Date(row.original.endDate), SAVE_DATE_FORMAT_GRC)
    //       : "N/A",
    // },
    {
      accessorKey: "lastUpdateByName",
      header: "Last Updated By",
      // cell: ({ row }) =>
      //   row.original.endDate
      //     ? format(new Date(row.original.endDate), SAVE_DATE_FORMAT_GRC)
      //     : "N/A",
    },
    {
      accessorKey: "lastUpdatedOn",
      header: "Last Updated On",
      cell: ({ row }) =>
        row.original.endDate
          ? format(new Date(row.original.lastUpdatedOn), SAVE_DATE_FORMAT_GRC)
          : "N/A",
    },
    {
      accessorKey: "status",
      header: "Status",
      // cell: ({ row }) =>
      //   row.original.endDate
      //     ? format(new Date(row.original.endDate), SAVE_DATE_FORMAT_GRC)
      //     : "N/A",
    },
  //   {
  //     id: 'actions',
  //     header: 'Action',
  //     enableHiding: false,
  //     // cell: ({ row }) => (
  //     //     <Button
  //     //         variant="outline"
  //     //         size="sm"
  //     //         onClick={() => openModal(row.original)} // Pass the full row
  //     //     >
  //     //         <SquarePenIcon />
  //     //     </Button>
  //     // ),
  // },
    
  ];

  const extraParams: DTExtraParamsProps = {
    // Add any extra tools if needed
    extraTools: [
      <Button
        key="configure-audit"
        variant="outline"
        onClick={() => onOpenChange(true)}
      >
        <Plus />
      </Button>,
    ],
    actionMenu: {
      items: [
          {
              label: "Publish Audit",
              // onClick: (rowData) => {
              //     console.log(rowData);
              //     setOpenAuditReportForm(true);

              //     setEditRow(rowData);
              // },
              visibility: (rowData) => {
                  // const alreadyExists = complianceReportDatas.some(item =>
                  //     item.objectiveName === rowData.objectiveName &&
                  //     item.objectiveWeight === rowData.objectiveWeight
                  // );
                  // return !alreadyExists;
                  const status = rowData.status === 'InProgress' ? false : true
                  return status
              }
          },
          {
            label: "Edit",
            // onClick: (rowData) => {
            //     console.log(rowData);
            //     setOpenAuditReportForm(true);

            //     setEditRow(rowData);
            // },
            visibility: (rowData) => {
                // const alreadyExists = complianceReportDatas.some(item =>
                //     item.objectiveName === rowData.objectiveName &&
                //     item.objectiveWeight === rowData.objectiveWeight
                // );
                // return !alreadyExists;
                const status = rowData.status === 'InProgress' ? false : true
                return status
            }
        },

      ]
  },
  };

  return (
    <DataTable data={tableData} columns={columns} extraParams={extraParams} />
  );
}
