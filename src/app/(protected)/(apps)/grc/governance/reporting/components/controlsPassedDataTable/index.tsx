import { DataTable } from '@/ikon/components/data-table';
import { DTColumnsProps, DTExtraParamsProps } from '@/ikon/components/data-table/type';
import { downloadResource } from '@/ikon/utils/actions/common/utils';
import { FileinfoProps } from '@/ikon/utils/api/file-upload/type';
import React from 'react'

export default function ControlsPassedDataTable({ passedAuditDatas, allUsers }: { passedAuditDatas: Record<string, string>[], allUsers: any }) {
  const donwloadFile = async function(fileInfo:FileinfoProps){
          try{
              await downloadResource({
                  resourceId: fileInfo.resourceId,
                  resourceName: fileInfo.resourceName,
                  resourceType: fileInfo.resourceType,
                  resourceSize: fileInfo.resourceSize
              })   
          }
          catch(err){
              console.error('Error in donwloadTemplateFile: ', err);
          }
      }
      
  
      const columnsFailedReportingTable: DTColumnsProps<Record<string, string>>[] = [
          {
              accessorKey: "frameworkName",
              header: "Framework Name"
          },
          {
              accessorKey: "objectiveName",
              header: "Control Objective"
          },
          {
              accessorKey: "controlName",
              header: "Control Name"
          },
          {
              accessorKey: "objectiveWeight",
              header: "Control Weightage",
              aggregationFn: undefined
          },
          {
              accessorKey: "auditType",
              header: "Audit Type",
              cell: ({ row }) => {
                  const value = row.original.auditType;
                  return value === "regulation" ? "Regulation" : value === 'best-practice' ? "Best Practice" : value === 'standard' ? "Standard Practice" : value;
              },
          },
          {
              accessorKey: "complianceStatus",
              header: "Status",
              cell: ({ row }) => (
                  <div className="capitalize">{row.original.complianceStatus}</div>
              ),
          },
      ];
      const extraParamsFailedReportingTable: DTExtraParamsProps = {
          defaultGroups: ["frameworkName", "controlName"],
          actionMenu: {
              items: [
                  {
                      label: "Download Report",
                      onClick: async (rowData) => {
                          console.log(rowData);
                          await donwloadFile(rowData.reportDocument)
                      },
                  }
              ]
          }
      }
      return (
          <DataTable data={passedAuditDatas} columns={columnsFailedReportingTable} extraParams={extraParamsFailedReportingTable} />
      )
}
