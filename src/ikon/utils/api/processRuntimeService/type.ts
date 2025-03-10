
export interface getMyInstancesV2Props {
    processName: string;
    accountId?: string;
    softwareId?: string;
    predefinedFilters?: {} | null;
    processVariableFilters?: {} | null;
    taskVariableFilters?: {} | null;
    mongoWhereClause?: string | null;
    projections?: string[] | null;
    allInstances?: boolean | null;
}

export interface getMyInstancesV3Props {
    processName: string;
    accountId?: string;
    softwareId?: string;
    sortFields?: {} | null;
    sortOrders?: {} | null;
    recordStartIndex?: {} | null;
    resultSize?: {} | null;
    mongoWhereClause?: string | null;
    projections?: string[] | null;
    allInstances?: boolean | null;
}

export interface InstanceV2Props<TData> {
    roleTitle: string;
    processInstanceId: string;
    data: TData;
    sender: string;
    processInstanceAccountId: string;
    lockedByMe: boolean;
    action: string;
    taskName: string;
    message: string;
    taskId: string;
    suspended: boolean;
    timestamp: string;
}

export interface getMyInstancesCountV2Props {
    processName: string;
    accountId?: string;
    softwareId?: string;
    predefinedFilters?: {} | null;
    processVariableFilters?: {} | null;
    taskVariableFilters?: {} | null;
    mongoWhereClause?: string | null;
    allInstances?: boolean | null;
}

export interface mapProcessNameProps {
    processName: string;
    accountId?: string;
    softwareId?: string;
}

export interface startProcessV2Props {
    processId: string;
    data: object;
    processIdentifierFields: string | null;
    accountId?: string;
    softwareId?: string;
}

export interface startProcessWithSpecificTransitionV2Props {
    processId: string;
    data: object;
    specificTransition: string;
    processIdentifierFields: string | null;
    accountId?: string;
    softwareId?: string;

}

export interface invokeActionProps {
    taskId: string;
    transitionName: string;
    data: object;
    processInstanceIdentifierField: string;
    accountId?: string;
    softwareId?: string;
}


export interface getDataForTaskIdProps {
    taskId: string;
    accountId?: string;
}

export interface getParameterizedDataForTaskIdProps {
    taskId: string;
    parameters: object | null;
    accountId?: string;
}

export interface saveDataProps {
    taskId: string;
    processInstanceTag: string;
    data: object;
    accountId?: string;
}

export interface invokeTaskScriptProps {
    taskId: string;
    parameters: object;
    accountId?: string;
}