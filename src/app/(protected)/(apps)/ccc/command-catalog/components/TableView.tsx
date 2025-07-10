'use client'

import { DataTable } from "@/ikon/components/data-table";
import { DTColumnsProps, DTExtraParamsProps } from "@/ikon/components/data-table/type";
import { Tooltip } from "@/ikon/components/tooltip";
import { AlarmClockOff, Calendar, CircleCheck, CircleOff, Hourglass, ScrollText } from "lucide-react";
import { FC } from "react"

type TableDataType = {
    key: string;
    parent: string | undefined;
    name: string;
    commandId?: string | undefined;
    deviceId?: string | undefined;
    executionStatus?: 'success' | 'failure' | 'in-progress' | 'waiting' | 'not scheduled' | '' | undefined;
    selectedNode?: (deviceId: string, commandId: string) => void,
    showCommandSchedule?: (val: boolean) => void,
    showCommandExecutionLogs?: (val: boolean) => void,
}

type TableViewProps = {
    data: TableDataType[]
}
function getExtraParams(){
    const extraParams: DTExtraParamsProps = {
        grouping: true,
        pageSize: 10,
        pageSizeArray: [10, 15, 20, 25, 50, 100],
    };

    return extraParams;
}


function getColumns() {
    const columnDetailsSchema: DTColumnsProps<TableDataType>[] = [
      {
          accessorKey: "name",
          header: 'Name',
          cell: ({ row }) => {
            const yy = row.original.selectedNode;
            const fn = row.original.showCommandSchedule;
            const z1 = row.original.deviceId;
            const z2 = row.original.commandId;
            if(row.original.executionStatus && fn && z1 && z2 && yy){
                
                return  <div className="flex gap-2 items-center">
                            <div>
                                {row.original.name}
                            </div>
                            <div>
                                <Tooltip tooltipContent={row.original.executionStatus}>
                                    {row.original.executionStatus == 'success' ? <CircleCheck size={12} color="green" /> : (row.original.executionStatus == 'failure' ? <CircleOff size={12} color="red" /> : (row.original.executionStatus == 'waiting' ? <Hourglass color="blue" size={12} /> : <AlarmClockOff size={12} color="red" />))} 
                                </Tooltip>
                            </div>
                            <div onClick={()=>{
                                yy(z1, z2); 
                                fn(true)
                            }}>
                                <Tooltip tooltipContent='Command schedule'>
                                    <Calendar size={12} />
                                </Tooltip>
                            </div>
                            <div>
                                <Tooltip tooltipContent='Command logs'>
                                    <ScrollText size={12} />
                                </Tooltip>
                            </div>
                        </div>
            }
            else{
                return  <div>
                            {row.original.name}
                        </div>
            }
          }
      }
    ]

    return columnDetailsSchema;
}


const TableView: FC<TableViewProps> = function({data}){
    console.log('table view: ', data);

    const extraParams = getExtraParams();
    const columns = getColumns();

    return (
        <div>
             <DataTable  data={data} columns={columns} extraParams={extraParams}/>
        </div>
    )
}

export default TableView;