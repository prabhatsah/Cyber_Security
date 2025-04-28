"use server";
import ikonBaseApi from "@/ikon/utils/api/ikonBaseApi";
import {
  getDataForTaskIdProps,
  getMyInstancesCountV2Props,
  getMyInstancesV2Props,
  getMyInstancesV3Props,
  getParameterizedDataForTaskIdProps,
  InstanceV2Props,
  invokeActionProps,
  invokeTaskScriptProps,
  mapProcessNameProps,
  saveDataProps,
  startProcessV2Props,
  startProcessWithSpecificTransitionV2Props,
} from "./type";
import { revalidatePath, revalidateTag } from "next/cache";

export async function getMyInstancesV2<TData>({
  accountId,
  softwareId,
  processName,
  predefinedFilters = null,
  processVariableFilters = null,
  taskVariableFilters = null,
  mongoWhereClause = null,
  projections = ["Data"],
  allInstances = false,
}: getMyInstancesV2Props): Promise<InstanceV2Props<TData>[]> {
  const result = await ikonBaseApi({
    accountId,
    softwareId,
    service: "processRuntimeService",
    operation: "getMyInstancesV2",
    arguments_: [
      processName,
      accountId,
      predefinedFilters,
      processVariableFilters,
      taskVariableFilters,
      mongoWhereClause,
      projections,
      allInstances,
    ],
  });
  return result.data;
}

export async function getMyInstancesV3<TData>({
  accountId,
  softwareId,
  processName,
  mongoWhereClause = null,
  sortFields,
  sortOrders,
  recordStartIndex,
  resultSize,
  projections = ["Data"],
  allInstances = false,
}: getMyInstancesV3Props): Promise<InstanceV2Props<TData>[]> {
  const result = await ikonBaseApi({
    accountId,
    softwareId,
    service: "processRuntimeService",
    operation: "getMyInstancesV3",
    arguments_: [
      processName,
      accountId,
      mongoWhereClause,
      projections,
      sortFields,
      sortOrders,
      recordStartIndex,
      resultSize,
      allInstances,
    ],
  });
  return result.data;
}

export async function getMyInstancesCountV2<TData>({
  accountId,
  softwareId,
  processName,
  predefinedFilters = null,
  processVariableFilters = null,
  taskVariableFilters = null,
  mongoWhereClause = null,
  allInstances = false,
}: getMyInstancesCountV2Props): Promise<number> {
  const result = await ikonBaseApi({
    accountId,
    softwareId,
    service: "processRuntimeService",
    operation: "getMyInstancesCountV2",
    arguments_: [
      processName,
      accountId,
      predefinedFilters,
      processVariableFilters,
      taskVariableFilters,
      mongoWhereClause,
      allInstances,
    ],
  });
  return result.data;
}

export const mapProcessName = async ({
  processName,
  accountId,
  softwareId,
}: mapProcessNameProps): Promise<string> => {
  const result = await ikonBaseApi({
    accountId,
    softwareId,
    service: "processRuntimeService",
    operation: "mapProcessName",
    arguments_: [processName, accountId],
  });
  return result.data;
};

export const startProcessV2 = async (
  {
    processId,
    data,
    processIdentifierFields,
    accountId,
    softwareId,
  }: startProcessV2Props,
  tags?: string[]
) => {
  const result = await ikonBaseApi({
    accountId,
    softwareId,
    service: "processRuntimeService",
    operation: "startProcessV2",
    arguments_: [processId, data, processIdentifierFields],
  });

  if (tags) {
    for (const tag of tags) {
      revalidateTag(tag);
    }
  }
  return result.data;
};

export const startProcessWithSpecificTransitionV2 = async ({
  processId,
  data,
  specificTransition,
  processIdentifierFields,
  accountId,
  softwareId,
}: startProcessWithSpecificTransitionV2Props) => {
  const result = await ikonBaseApi({
    accountId,
    softwareId,
    service: "processRuntimeService",
    operation: "startProcessWithSpecificTransitionV2",
    arguments_: [processId, specificTransition, data, processIdentifierFields],
  });
  return result.data;
};

export const startProcessAsGuest = async ({
  processId,
  data,
  processIdentifierFields,
}: startProcessV2Props) => {
  const result = await ikonBaseApi({
    service: "processRuntimeService",
    operation: "startProcessAsGuest",
    arguments_: [processId, data, processIdentifierFields],
  });
  return result.data;
};

export const startProcessWithSpecificTransitionAsGuest = async ({
  processId,
  data,
  specificTransition,
  processIdentifierFields,
  accountId,
  softwareId,
}: startProcessWithSpecificTransitionV2Props) => {
  const result = await ikonBaseApi({
    accountId,
    softwareId,
    service: "processRuntimeService",
    operation: "startProcessWithSpecificTransitionAsGuest",
    arguments_: [processId, specificTransition, data, processIdentifierFields],
  });
  return result.data;
};

export const invokeAction = async (
  {
    taskId,
    transitionName,
    data,
    processInstanceIdentifierField,
    accountId,
    softwareId
}: invokeActionProps, tags?: string[]) => {
    const result = await ikonBaseApi({
        accountId,
        softwareId,
        service: 'processRuntimeService',
        operation: 'invokeAction',
        arguments_: [
            taskId,
            transitionName,
            data,
            processInstanceIdentifierField
        ]
    })
    if (tags) {
        for (const tag of tags) {
            revalidateTag(tag)
        }
    }
    return result.data
}


export async function getDataForTaskId<TData>({
  taskId,
  accountId,
}: getDataForTaskIdProps): Promise<TData> {
  const result = await ikonBaseApi({
    accountId,
    service: "processRuntimeService",
    operation: "getDataForTaskId",
    arguments_: [taskId],
  });
  return result.data;
}

export async function getParameterizedDataForTaskId<TData>({
  taskId,
  parameters,
  accountId,
}: getParameterizedDataForTaskIdProps): Promise<TData> {
  const result = await ikonBaseApi({
    accountId,
    service: "processRuntimeService",
    operation: "getParameterizedDataForTaskId",
    arguments_: [taskId, parameters],
  });
  return result.data;
}

export const saveData = async ({
  taskId,
  processInstanceTag,
  data,
  accountId,
}: saveDataProps) => {
  const result = await ikonBaseApi({
    accountId,
    service: "processRuntimeService",
    operation: "saveData",
    arguments_: [taskId, processInstanceTag, data],
  });
  return result.data;
};

export const invokeTaskScript = async ({
  taskId,
  parameters,
  accountId,
}: invokeTaskScriptProps) => {
  const result = await ikonBaseApi({
    accountId,
    service: "processRuntimeService",
    operation: "invokeTaskScript",
    arguments_: [taskId, parameters],
  });
  return result.data;
};
