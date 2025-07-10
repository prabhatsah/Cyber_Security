export interface protocolWiseCommandCount{
    protocol: string;
    commandCount: number;   
}
export interface commandCount{
    commandName: string;
    commandCount: number;   
}
export interface commandCountByDevice{
    device: string;
    executionCount: number;   
}

export interface activityList{
    commandId: string;
    executedAt: string;
    runStatus : string;
    deviceId:string;
    hostIp:string;
   
}

export interface upcomingActivities{
    commandId: string;
    executedAt: string;
    
    skipped:boolean;
    devices:string[]
}

export interface executionLogsProps{
    executedAt:string;
    finishedAt:string;
    status:string;
    probeId:string;
    instructionList:string[],
   
}

export interface dialogProps{
    content: React.ReactNode | React.ReactElement,
    title?: string,
    description?: string | React.ReactElement,
    openState: boolean,
    onOpenChange: Function,
    width?: number,
}

export interface probeLogsProps{
    
  log_type: string;
  log_timestamp: string;
  log_text: string;
}