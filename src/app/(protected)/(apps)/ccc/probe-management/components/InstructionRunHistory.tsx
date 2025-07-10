import { getInstructionRunHistory } from "@/ikon/utils/api/probeManagementService";
import moment from "moment";
import { useEffect, useState } from "react"
import { InstructionHistoryProps } from "../type";
import { DTColumnsProps } from "@/ikon/components/data-table/type";

export default function InstructionRunHistory(
    { probeId, instructionId }: { probeId: string; instructionId: string; }
) {
    const [runHistoryData, setRunHistoryData] = useState<InstructionHistoryProps[]>([]);
    
    useEffect(() => {
        const toDate = moment().format('YYYY-MM-DDTHH:mm:ss.SSSZZ');
		const fromDate = moment(toDate).subtract(48, 'hours').format('YYYY-MM-DDTHH:mm:ss.SSSZZ');
        getInstructionRunHistory({
            probeId: probeId,
            instructionId: instructionId,
            fromDate: fromDate,
            toDate: toDate,
        }).then((runHistory) => {  
            debugger
            setRunHistoryData(runHistory as any[])
            console.log("runHistory", runHistory)
        }).catch(error => {
            debugger
            console.error("Error fetching instruction run history:", error);
        })
    },[])


    const InstructionRUnHistoryDataTableColumns :DTColumnsProps<InstructionHistoryProps>[] = [
        {
            accessorKey: "instruction_run_id",
            header: "Instruction Run Id",


        },
        {
            accessorKey: "instruction_run_start",
            header: "Instruction Run Start",


        },
        {
            accessorKey: "instruction_run_end",
            header: "Instruction Run End",


        }
        ,
        {
            accessorKey: "instruction_run_status",
            header: "Status",


        },
        {
            accessorKey: "serviceName",
            header: "Action",


        }
    ]
    return (
        <div>InstructionRunHistory</div>
    )
}   