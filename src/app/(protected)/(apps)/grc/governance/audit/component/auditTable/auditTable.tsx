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
  // useEffect(() => {
  //   async function call() {
  //     const userIdNameMap: { value: string; label: string }[] =
  //       await CreateUserMap();
  //     setMap(userIdNameMap);
  //   }
  //   call();
  // }, []);

  // const auditData = async () => {
  //   try {
  //     const auditInsData = await getMyInstancesV2<any>({
  //       processName: "Add Audit",
  //       predefinedFilters: { taskName: "view audit" },
  //     });

  //     const audits = auditInsData.map((instance: any) => {
  //       const data = instance.data;
  //       console.log('dataaaaaaaaaaaaaaaaaaaa dekhneee ==')
  //       console.log(data)
  //       return {
  //         frameworkName: data.frameworkTitle || "",
  //         auditName: data.auditName || "",
  //         auditType: data.auditType || "",
  //         controlCount: data.frameworkData?.controls?.length || 0,
  //         startDate: data.startDate,
  //         endDate: data.endDate,
  //         lastUpdatedOn: data.lastUpdatedOn,
  //         lastUpdateByName: data.lastUpdateByName,
  //         status: data.status,
  //       };
  //     });

  //     setTableData(audits);
  //   } catch (error) {
  //     console.error("Error fetching audit data:", error);
  //   }
  // };

  // useEffect(() => {
  //   auditData();
  // }, []);


  const audits = [
    {
      id: "soc2-2025",
      name: "SOC 2 Type II 2025",
      type: "SOC 2",
      lead: "Maria Auditore",
      status: "Fieldwork",
      due: "2025-09-15"
    },
    {
      id: "pci-2025",
      name: "PCI DSS Onsite 2025",
      type: "PCI DSS",
      lead: "John Gold",
      status: "Planning",
      due: "2025-03-22"
    },
    {
      name: "SOC 2 Type II",
      cycle: "Annual",
      status: "In Progress",
      due: "2024-09-15"
    },
    {
      name: "GDPR DSR Review",
      cycle: "Quarterly",
      status: "Planned",
      due: "2024-06-30"
    },
    {
      name: "PCI DSS Onsite",
      cycle: "Annual",
      status: "Complete",
      due: "2024-01-12"
    },
  ];

  
  const columns: DTColumnsProps<Record<string, any>>[] = [
    {
      accessorKey: "auditName",
      header: "Name",
    },
    {
      accessorKey: "type",
      header: "Type",
    },
    {
      accessorKey: "lead",
      header: "Lead",
    },
    {
     accessorKey: "status",
      header: "Status",
    }, 
    {
      accessorKey: "nextDue",
       header: "Next Due",
     }
    // {
    //   accessorKey: "lastUpdatedOn",
    //   header: "Last Updated On",
    //   cell: ({ row }) =>
    //     row.original.endDate
    //       ? format(new Date(row.original.lastUpdatedOn), SAVE_DATE_FORMAT_GRC)
    //       : "N/A",
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
    <DataTable data={audits} columns={columns} extraParams={extraParams} />
  );
}
