export type probeManagementColumnDataType = {
    PROBE_NAME: string,
    PROBE_ID: string,
    ACTIVE: boolean,
    USER_NAME: string,
    LAST_HEARTBEAT: string | null,
}
export interface CustomDialougeProps {
    children: React.ReactNode,
    content: React.ReactNode | React.ReactElement,
    title?: string,
    description?: string | React.ReactElement,
}

export interface AdvanceDialogProps {

    content: React.ReactNode | React.ReactElement,
    title?: string,
    description?: string | React.ReactElement,
    openState: boolean,
    onOpenChange: Function,
    width?: number,
}
export type InstructionHistoryTableDataType = {

    posted_by: string,
    serviceName: string,
    instruction_id_ts: string,
    instruction_id: string,
    PROBE_ID: string,

}

export interface InstructionHistoryProps{
instruction_id:string; 
instruction_run_end: string
instruction_run_id: string
instruction_run_start: string
instruction_run_status:string
}

export interface LogHistoryProps{
    log_type: string,
    log_timestamp: string,

    log_text: string,
}

