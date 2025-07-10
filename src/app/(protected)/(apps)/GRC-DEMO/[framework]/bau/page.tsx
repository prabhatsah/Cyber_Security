import React from 'react'
import BauOpenForm from './components/bauOpenForm'
import { getUserIdWiseUserDetailsMap } from '@/ikon/utils/actions/users';
import BauTab from './components/bauTab';
import { getMyInstancesV2 } from '@/ikon/utils/api/processRuntimeService';

interface ControlObjective {

  objectiveDescription: string;
  objectiveIndex: string;
  objectiveName: string;
}

export interface PolicyControl {
  controlObjectives: ControlObjective[];
  controlName: string;
  policyIndex: string;
  type: string;
  controlDescription: string;
}

export interface FrameworkDraftData {
  controls: PolicyControl[];
  frameworkName: string;
  description: string;
  owners: string[];
  frameworkId: string;
  lastUpdatedOn: Date | undefined;
  effectiveDate: Date | undefined;
  version: string;
  currentAccountId: string;
  saveAsDraft: boolean;
}

export interface BauTableSchema {
  taskId: string;
  task: string;
  details: string;
  objectiveIndex: string[];
  referencedPolicy: string;
  owner: string;
  assignee: string;
  startDate: string;
  dueDate: string;
  status: string;
  priority: string;
  tasKType: string;
}

export type BauTaskType = string;

export interface Task {
  taskType: string;
  taskId: string;
  order?: number;
};

export type TaskFrequency = {
  [taskId: string]: Task;
};

export interface referencedPolicies {
  policyTitle: string;
  policyId: string;
}

export async function getUserDetailMap() {
  const allUsers = await getUserIdWiseUserDetailsMap();
  return allUsers;
}

export async function CreateUserMap() {
  const allUsers = await getUserDetailMap();
  const userIdNameMap: { value: string; label: string }[] = Object.values(allUsers)
    .map((user) => {
      if (user.userActive) {
        return {
          value: user.userId,
          label: user.userName
        };
      }
      return undefined;
    })
    .filter((user): user is { value: string; label: string } => user !== undefined);

  return userIdNameMap;
}

export async function createFrameworkControlsDropdown() {
  const isoFrameworkId = "fef2a63e-1c61-4342-a266-e3d983679d61";

  const frameworkInstance = await getMyInstancesV2({
    processName: 'Control Objectives V2',
    predefinedFilters: { taskName: "view control objecitve" },
    mongoWhereClause: `this.Data.frameworkId == "${isoFrameworkId}"`
  });
  const frameworkData = frameworkInstance.length > 0 ? frameworkInstance[0].data as FrameworkDraftData : null;
  const controlData = frameworkData?.controls || [];

  const dropDownControl = controlData.map((controlData) => ({
    id: controlData.type + "_" + controlData.policyIndex,
    label: controlData.controlName + " (" + controlData.type + ")",
    options: (controlData.controlObjectives || []).map((objective) => ({
      id: objective.objectiveIndex,
      label: objective.objectiveIndex,
      description: objective.objectiveName
    }))
  })
  );

  return dropDownControl;
}

export async function getBauTaskDetailsData() {
  const bauInstances = await getMyInstancesV2({
    processName: 'BAU',
    predefinedFilters: { taskName: "View BAU" }
  });

  const bauData = bauInstances.length > 0 ? bauInstances.map((bauInstance) => (bauInstance.data)) : null;
  return bauData;
}

export async function getReferencedPolicyDetaisl() {
  const addPolicyInstances = await getMyInstancesV2({
    processName: 'Add Policy',
    predefinedFilters: { taskName: "View Policy" },
    projections: ['Data.policyId', 'Data.policyTitle'],
    mongoWhereClause: `this.Data.sentForApproval==${true} && this.Data.status=='Approved'`
  });
  const addPolicyDatas = addPolicyInstances.length > 0 ? addPolicyInstances.map((policyInstace) => (policyInstace.data)) as referencedPolicies[] : null;
  const referencedPolicyMap = addPolicyDatas?.map((addPolicyData: referencedPolicies) => {
    return {
      value: addPolicyData.policyId,
      label: addPolicyData.policyTitle
    }
  }) || []
  return referencedPolicyMap
}


export async function getTaskFrequencyType() {
  const isoFrameworkId = "fef2a63e-1c61-4342-a266-e3d983679d61";
  const taskFrequencyInstance = await getMyInstancesV2({
    processName: "Task Frequency",
    predefinedFilters: { taskName: "View Task Frequency" },
    projections: ["Data.taskFrequency"],
    mongoWhereClause: `this.Data.frameworkId == '${isoFrameworkId}'`
  })

  const taskFrequencyDatas = taskFrequencyInstance.length > 0 ? taskFrequencyInstance[0].data as TaskFrequency : null;

  const bauTaskFrequency = Object.values(taskFrequencyDatas?.taskFrequency || {})
    .sort((a, b) => {
      if (a.order !== undefined && b.order !== undefined) {
        return a.order - b.order;
      } else {
        return a.taskId.localeCompare(b.taskId); // fallback sorting by taskId
      }
    })
    .map(item => item.taskType);

  return bauTaskFrequency;

}


export default async function BAU() {

  const allUsers = await CreateUserMap();
  const dropDownControl = await createFrameworkControlsDropdown();
  const bauData = await getBauTaskDetailsData() as BauTableSchema[];
  const bauTaskFrequencyData = await getTaskFrequencyType();
  const referencedPolicyMap = await getReferencedPolicyDetaisl();
  let groupedByTaskType: Partial<Record<BauTaskType, BauTableSchema[]>> = {};

  if (bauData && Array.isArray(bauData)) {
    groupedByTaskType = bauData.reduce((acc, task) => {
      const key = task.tasKType as BauTaskType;
      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key]!.push(task);
      return acc;
    }, {} as Partial<Record<BauTaskType, BauTableSchema[]>>);
  }

  const bauTaskFreqMap = bauTaskFrequencyData?.map((frequency: string) => {
    return {
      value: frequency,
      label: frequency
    }
  }) || []


  return (
    <>
      <div className="mb-3 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">BAU</h1>
          <p className="text-muted-foreground mt-1">
            Ensuring seamless day-to-day risk and compliance operations through BAU in GRC.
          </p>
        </div>
        <BauOpenForm allUsers={allUsers} dropDownControl={dropDownControl} referencedPolicyMap={referencedPolicyMap} bauTaskFreqMap={bauTaskFreqMap} />
      </div>
      <BauTab
        allUsers={allUsers}
        dropDownControl={dropDownControl}
        groupedByTaskType={groupedByTaskType}
        referencedPolicyMap={referencedPolicyMap}
        bauTaskFrequency={bauTaskFrequencyData}
        bauTaskFreqMap={bauTaskFreqMap}
      />
    </>
  )
}
