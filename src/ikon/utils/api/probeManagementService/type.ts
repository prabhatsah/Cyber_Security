export interface GetInstructionHistoryProps {
  probeId: string;
  fromDate: string;
  toDate: string;
}

export interface InstructionHistoryProps {
  cancelled_at: string | null;
  process_id: string;
  cancelled_by: string | null;
  finished_at: string;
  serviceName: string;
  instruction_id_ts: string;
  software_id: string;
  service_schedule: {
    scheduleType: "once" | string;
  };
  account_id: string;
  processName: string | null;
  instruction_type: "Standard" | string;
  service_id: string;
  posted_by: string;
  instruction_id: string;
}


export interface LiveInstructionProps {
  cancelled_at: string | null;
  process_id: string;
  cancelled_by: string | null;
  finished_at: string | null;
  serviceName: string;
  instruction_id_ts: string;
  software_id: string;
  service_schedule: string;
  account_id: string;
  processName: string | null;
  instruction_type: string;
  service_id: string;
  posted_by: string;
  instruction_id: string;
  instruction_class: string;
  probe_id: string;
}
export interface InstructionRunHistoryProps {
  instruction_id:string;
  instruction_run_end:string;
  instruction_run_error:string|null;
  instruction_run_files:string;
  instruction_run_id:string;
  instruction_run_start:string;
  instruction_run_status:string;

}

export interface LogHistoryProps{
  
  log_type: string;
  log_timestamp: string;
  log_text: string;
} 


export interface GetLogHistory2Props {
  probeId: string;
  fromDate: string;
  toDate: string;
  instructionId: string;
}

export interface LogEntry {
  log_text: string;
  log_timestamp: string; 
  log_type: "INFO" | "DEBUG" | "ERROR" | "WARN"; // Add more types if needed
}

export interface GetInstructionRunHistoryProps{
  probeId: string;
  instructionId: string;
  fromDate: string;
  toDate: string;
}

export interface InstructionRun {
  instruction_id: string;
  instruction_run_end: string; // Consider `Date` if you'll parse this as a date object
  instruction_run_error: string | null;
  instruction_run_files: string; // Assuming this is a serialized array, consider `string[]` if parsed
  instruction_run_id: string;
  instruction_run_start: string; // Consider `Date` if you'll parse this as a date object
  instruction_run_status: "Success" | "Failure" | "Pending" | "Running"; // Add more statuses if applicable
}

export interface GetInstructionRunDataProps {
  probeId: string;
  instructionId: string; 
  instructionRunId: string;
}