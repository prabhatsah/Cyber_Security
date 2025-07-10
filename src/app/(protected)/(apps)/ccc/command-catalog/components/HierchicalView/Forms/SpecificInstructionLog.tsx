'use client'

import { DataTable } from "@/ikon/components/data-table";
import { DTColumnsProps, DTExtraParamsProps } from "@/ikon/components/data-table/type";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/shadcn/ui/dialog";

type SpecificExecutionLogDataType = {
    log_timestamp: string;
    log_text: string;
}

const getExtraParams = function(){
    const extraParams: DTExtraParamsProps = {
        grouping: false,
        pageSize: 10,
        pageSizeArray: [10, 15, 20, 25],
    };

    return extraParams;
}

const getColumns = function() {
    const columnDetailsSchema: DTColumnsProps<SpecificExecutionLogDataType>[] = [
        {
          accessorKey: "log_timestamp",
          header: 'Timestamp'
        },
        {
            accessorKey: "log_text",
            header: 'Info'
        }
    ]

    return columnDetailsSchema;
}

export default function SpecificInstructionLog({open, close, data}:{open: boolean, close: (val: boolean) => void, data: string}){
    console.time('st')
    const parsedData = JSON.parse(data) as SpecificExecutionLogDataType[];
    console.timeEnd('st')

    //console.log('parsedData: ', parsedData)

    const extraParams = getExtraParams();
    const columns = getColumns();

    return(
        <Dialog open={open} onOpenChange={close}>
            <DialogContent className="max-h-[50vh] overflow-hidden sm:max-w-[800px] bg-[#1a1a1a] border-gray-800 flex flex-col">

                
                    <DialogHeader className="pb-4">
                        <DialogTitle className="text-xl font-semibold text-white">
                            Specific Instruction Logs
                        </DialogTitle>
                        <DialogDescription></DialogDescription>
                    </DialogHeader>

                    <div className="overflow-auto flex-1">
                        {/* <div className="h-10"> */}
                            <DataTable  data={parsedData} columns={columns} extraParams={extraParams}/>
                        {/* </div> */}
                    </div>
                

            </DialogContent>
        </Dialog>
    )
}