"use server";
import ikonBaseApi from "@/ikon/utils/api/ikonBaseApi";
import {
  GetInstructionHistoryProps,
  GetInstructionRunDataProps,
  GetInstructionRunHistoryProps,
  GetLogHistory2Props,
  InstructionHistoryProps,
  InstructionRun,
  LiveInstructionProps,
  InstructionRunHistoryProps,
  LogHistoryProps,
  LogEntry,
} from "./type";

export async function getInstructionHistory({
  probeId,
  fromDate,
  toDate,
}: GetInstructionHistoryProps): Promise<InstructionHistoryProps[]> {
  const result = await ikonBaseApi({
    service: "probeManagementService",
    operation: "getInstructionHistory",
    arguments_: [probeId, fromDate, toDate],
  });
  return result.data;
}

export async function getLiveInstructions({
  probeId,
}: {
  probeId: string;
}): Promise<LiveInstructionProps[]> {
  const result = await ikonBaseApi({
    service: "probeManagementService",
    operation: "getLiveInstructions",
    arguments_: [probeId],
  });
  return result.data;
}


export async function getLogHistory2({
  probeId, instructionId, fromDate, toDate
}: GetLogHistory2Props): Promise<LogEntry[]> {
  const result = await ikonBaseApi({
    service: "probeManagementService",
    operation: "getLogHistory2",
    arguments_: [probeId, instructionId, fromDate, toDate],
  });
  return result.data;
}

export async function getInstructionRunHistory(
  {
    probeId,
    instructionId,
    fromDate,
    toDate
  }
    : GetInstructionRunHistoryProps)
  : Promise<InstructionRun[]> {
  const result = await ikonBaseApi({
    service: "probeManagementService",
    operation: "getInstructionRunHistory",
    arguments_: [probeId, instructionId, fromDate, toDate],
  });
  return result.data;
}

export async function getServiceParameters({
  probeId,
  instructionId,
}: {
  probeId: string;
  instructionId: string;
}): Promise<String> {
  const result = await ikonBaseApi({
    service: "probeManagementService",
    operation: "getServiceParameters",
    arguments_: [probeId, instructionId],
  });

  return result.data;
}

export async function getLogHistory1({
  probeId,
  fromDate,
  toDate,
}: {
  probeId: string;
  fromDate: string;
  toDate: string;
}): Promise<LogHistoryProps[]> {
  const result = await ikonBaseApi({
    service: "probeManagementService",
    operation: "getLogHistory1",
    arguments_: [probeId, fromDate, toDate],
  });
  return result.data;
}

export async function getInstructionRunData(
  {
    probeId,
    instructionId,
    instructionRunId
  }
    : GetInstructionRunDataProps)
  : Promise<string> {
  const result = await ikonBaseApi({
    service: "probeManagementService",
    operation: "getInstructionRunData",
    arguments_: [probeId, instructionId, instructionRunId],
  });
  return result.data;
}

export async function getInstructionRunLogs(
  {
    probeId,
    instructionId,
    instructionRunId
  }
    : GetInstructionRunDataProps)
  : Promise<LogEntry[]> {
  const result = await ikonBaseApi({
    service: "probeManagementService",
    operation: "getInstructionRunLogs",
    arguments_: [probeId, instructionId, instructionRunId],
  });

  return result.data;
}


