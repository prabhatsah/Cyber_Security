import React from "react";
import BauOpenForm from "./components/bauOpenForm";
import { getUserIdWiseUserDetailsMap } from "@/ikon/utils/actions/users";
import BauTab from "./components/bauTab";
import { getMyInstancesV2 } from "@/ikon/utils/api/processRuntimeService";

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
}

export type TaskFrequency = {
  [taskId: string]: Task;
};

export interface referencedPolicies {
  policyTitle: string;
  policyId: string;
  policyTaskId?: string;
}

export interface EditFormSchema {
  taskId: string;
  task: string;
  details: string;
  objectiveIndex: string[];
  referencedPolicy: string;
  owner?: string;
  assignee?: string;
  startDate?: Date;
  dueDate?: Date;
  status?: string;
  priority?: string;
  tasKType?: string;
  clientId?: string;
  frameworkId?: string;
  referenceTaskId?: string;
}

export async function getUserDetailMap() {
  const allUsers = await getUserIdWiseUserDetailsMap();
  return allUsers;
}

export async function CreateUserMap() {
  const allUsers = await getUserDetailMap();
  const userIdNameMap: { value: string; label: string }[] = Object.values(
    allUsers
  )
    .map((user) => {
      if (user.userActive) {
        return {
          value: user.userId,
          label: user.userName,
        };
      }
      return undefined;
    })
    .filter(
      (user): user is { value: string; label: string } => user !== undefined
    );

  return userIdNameMap;
}

export async function customeControlsData() {
  const customControlsInstances = await getMyInstancesV2({
    processName: "Custom Controls",
    predefinedFilters: { taskName: "View Rules" },
  });

  const customControlDatas =
    customControlsInstances.length > 0
      ? (customControlsInstances.map(
          (customControlsInstance) => customControlsInstance.data
        ) as { customControlId: string; refId: string; title: string }[])
      : [];

  return customControlDatas;
}

export async function processFrameworksForDropdown(frameWorkId: string) {
  const frameworkInstance = await getMyInstancesV2({
    processName: "Framework Processes",
    predefinedFilters: { taskName: "Publish" },
    mongoWhereClause: `this.Data.id == '${frameWorkId}'`,
  });

  const frameworkData =
    frameworkInstance.length > 0 ? frameworkInstance[0].data : {};
  console.log(frameworkData);

  const dropDownControl = [];

  for (const parent of frameworkData?.parentEntries) {
    // Case 1: The parent has children, so it's a "group"
    if (parent.childrenArray && parent.childrenArray.length > 0) {
      dropDownControl.push({
        id: parent.index,
        // label: `${parent.index} - ${parent.title}`,
        label: `${parent.title}`,
        index: parent.index, //optional
        options: parent.childrenArray.map((childId: any) => {
          const childEntry = frameworkData?.entries[childId];
          return {
            id: childEntry.index,
            //   label: `${childEntry.index} ${childEntry.title}`,
            label: `${childEntry.index}`,
            description: childEntry.title,
            actualIndex: childEntry.index, //optional key from here
            actualTitle: childEntry.title,
            actualDescription: childEntry.description,
            parentId: parent.id,
            parentIndex: parent.index,
            parentTitle: parent.title,
          };
        }),
      });
    }
    // Case 2: The parent has no children, so it's a single "ungrouped" item
    else {
      dropDownControl.push({
        options: [
          {
            id: parent.index,
            // label: `${parent.index} ${parent.title}`,
            label: `${parent.index}`,
            description: parent.title,
            actualIndex: parent.index, //optional key from here
            actualTitle: parent.title,
            actualDescription: parent.description,
          },
        ],
      });
    }
  }

  console.log(dropDownControl);

  return dropDownControl;
}

export async function ControlData(frameworkIds: string[]) {
  try {
    // const clause = `this.Data.Frameworks.some(f => f.frameworkId == "${frameworkId}")`;
    const clause = `this.Data.Frameworks.some(f => "${frameworkIds}".includes(f.frameworkId))`;
    console.log(clause);
    const customControlInsData = await getMyInstancesV2({
      processName: "Custom Controls",
      predefinedFilters: { taskName: "Edit Rules" },
      mongoWhereClause: clause,
    });

    const customControlData = Array.isArray(customControlInsData)
      ? customControlInsData.map((e: any) => e.data)
      : [];

    const frameworkWiseData = customControlData.map((control) => {
      return {
        ...control,
        Frameworks: control.Frameworks.filter((framework: any) =>
          frameworkIds.includes(framework.frameworkId)
        ),
      };
    });

    const dropDownControl = [];

    for (const customControlData of frameworkWiseData) {
      dropDownControl.push({
        options: [
          {
            id: customControlData.customControlId,
            label: `${customControlData.refId.toString()}`,
            description: customControlData.title.toString(),
          },
        ],
      });
    }

    console.log(dropDownControl);
    return dropDownControl;
  } catch (error) {
    console.error("Failed to fetch the process:", error);
    throw error;
  }
}

export async function getBauTaskDetailsData(clientId: string) {
  const bauConfigInstances = await getMyInstancesV2({
    processName: "BAU Configurator",
    predefinedFilters: { taskName: "View BAU Configurator" },
  });

  const bauConfigData =
    bauConfigInstances.length > 0
      ? (bauConfigInstances.map(
          (bauInstance) => bauInstance.data
        ) as EditFormSchema[])
      : [];

  const bauInstances = await getMyInstancesV2({
    processName: "BAU",
    predefinedFilters: { taskName: "View BAU" },
    mongoWhereClause: `this.Data.clientId == '${clientId}'`,
  });

  const bauData =
    bauInstances.length > 0
      ? (bauInstances.map(
          (bauInstance) => bauInstance.data
        ) as EditFormSchema[])
      : [];

  const configMap = new Map<string, EditFormSchema>();
  const matchedConfigIds = new Set<string>();
  const joinedResults: any[] = [];

  // Index bauConfigData
  for (const config of bauConfigData) {
    if (config.taskId) {
      configMap.set(config.taskId, config);
    }
  }

  // Merge common fields where referenceTaskId matches
  for (const bau of bauData) {
    const refId = bau.referenceTaskId;
    if (refId && configMap.has(refId)) {
      const config = configMap.get(refId)!;
      matchedConfigIds.add(refId);

      const merged: any = { ...bau };

      for (const key of Object.keys(bau)) {
        if (key in config) {
          merged[key] = config[key]; // override only common fields
        }
      }

      merged.__joined = true;
      joinedResults.push(merged);
    } else {
      joinedResults.push(bau);
    }
  }

  // Add remaining unreferenced config entries
  for (const config of bauConfigData) {
    if (!matchedConfigIds.has(config.taskId)) {
      joinedResults.push(config);
    }
  }

  console.log(joinedResults);

  return joinedResults;
}

export async function getAllReferencedPolicyDetaisl() {
  const addConfigPolicyInstances = await getMyInstancesV2({
    processName: "GRC Policy Management",
    predefinedFilters: { taskName: "View Policy Registry" },
    projections: ["Data.policyTaskId", "Data.policyTitle"],
  });
  const addConfigPolicyDatas =
    addConfigPolicyInstances.length > 0
      ? (addConfigPolicyInstances.map(
          (policyInstace) => policyInstace.data
        ) as referencedPolicies[])
      : null;
  const configReferencedPolicyMap =
    addConfigPolicyDatas?.map((addConfigPolicyData: referencedPolicies) => {
      return {
        value: addConfigPolicyData.policyTaskId,
        label: addConfigPolicyData.policyTitle,
      };
    }) || [];

  const addPolicyInstances = await getMyInstancesV2({
    processName: "Add Policy",
    predefinedFilters: { taskName: "View Policy" },
    projections: ["Data.policyId", "Data.policyTitle"],
    mongoWhereClause: `this.Data.sentForApproval==${true} && this.Data.status=='Approved'`,
  });
  const addPolicyDatas =
    addPolicyInstances.length > 0
      ? (addPolicyInstances.map(
          (policyInstace) => policyInstace.data
        ) as referencedPolicies[])
      : null;
  const referencedPolicyMap =
    addPolicyDatas?.map((addPolicyData: referencedPolicies) => {
      return {
        value: addPolicyData.policyId,
        label: addPolicyData.policyTitle,
      };
    }) || [];

  return [...configReferencedPolicyMap, ...referencedPolicyMap];
}

export async function getReferencedPolicyDetaisl() {
  const addPolicyInstances = await getMyInstancesV2({
    processName: "Add Policy",
    predefinedFilters: { taskName: "View Policy" },
    projections: ["Data.policyId", "Data.policyTitle"],
    mongoWhereClause: `this.Data.sentForApproval==${true} && this.Data.status=='Approved'`,
  });
  const addPolicyDatas =
    addPolicyInstances.length > 0
      ? (addPolicyInstances.map(
          (policyInstace) => policyInstace.data
        ) as referencedPolicies[])
      : null;
  const referencedPolicyMap =
    addPolicyDatas?.map((addPolicyData: referencedPolicies) => {
      return {
        value: addPolicyData.policyId,
        label: addPolicyData.policyTitle,
      };
    }) || [];

  return referencedPolicyMap;
}

export async function getTaskFrequencyType(clientId: string) {
  const taskFrequencyInstance = await getMyInstancesV2({
    processName: "Task Frequency",
    predefinedFilters: { taskName: "View Task Frequency" },
    projections: ["Data.taskFrequency"],
    mongoWhereClause: `this.Data.clientId == "${clientId}"`
  });

  const taskFrequencyDatas =
    taskFrequencyInstance.length > 0
      ? (taskFrequencyInstance[0].data as TaskFrequency)
      : null;

  const bauTaskFrequency = Object.values(
    taskFrequencyDatas?.taskFrequency || {}
  )
    .sort((a, b) => {
      if (a.order !== undefined && b.order !== undefined) {
        return a.order - b.order;
      } else {
        return a.taskId.localeCompare(b.taskId); // fallback sorting by taskId
      }
    })
    .map((item) => item.taskType);

  return bauTaskFrequency;
}

export default async function BAU({
  params,
}: {
  params: { clientId: string };
}) {
  const { clientId } = params;
  console.log("Client ID from query string:", clientId);

  const allUsers = await CreateUserMap();

  const subscribedFrameworkIds = await getMyInstancesV2({
    processName: "Subscribed Frameworks",
    predefinedFilters: { taskName: "View Subscription" },
    mongoWhereClause: `this.Data.clientId == "${clientId}"`,
    projections: ["Data.frameworkId"],
  });
  console.log("clientID--", clientId);

  const frameworkIdsObj =
    subscribedFrameworkIds.length > 0
      ? (subscribedFrameworkIds.map(
          (subscribedFrameworkId) => subscribedFrameworkId.data
        ) as { frameworkId: string }[])
      : [];

  const frameworkIds = frameworkIdsObj.map(
    (frameworkIdsObj) => frameworkIdsObj.frameworkId
  );
  console.log("subsribed framework ids--", frameworkIds);

  const dropDownControl = await ControlData(frameworkIds);
  const customeControls = await customeControlsData();
  const bauData = (await getBauTaskDetailsData(clientId)) as BauTableSchema[];
  const bauTaskFrequencyData = await getTaskFrequencyType(clientId);
  const referencedPolicyMap = await getReferencedPolicyDetaisl();
  const allReferencePolicyMap = await getAllReferencedPolicyDetaisl();
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

  const bauTaskFreqMap =
    bauTaskFrequencyData?.map((frequency: string) => {
      return {
        value: frequency,
        label: frequency,
      };
    }) || [];

  return (
    <>
      <div className="mb-3 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">BAU</h1>
          <p className="text-muted-foreground mt-1">
            Ensuring seamless day-to-day risk and compliance operations through
            BAU in GRC.
          </p>
        </div>
        <BauOpenForm
          allUsers={allUsers}
          dropDownControl={dropDownControl}
          referencedPolicyMap={referencedPolicyMap}
          bauTaskFreqMap={bauTaskFreqMap}
          clientId={clientId}
        />
      </div>
      <BauTab
        allUsers={allUsers}
        groupedByTaskType={groupedByTaskType}
        referencedPolicyMap={allReferencePolicyMap}
        referenceDropDown={referencedPolicyMap}
        bauTaskFrequency={bauTaskFrequencyData}
        bauTaskFreqMap={bauTaskFreqMap}
        customeControls={customeControls}
        dropDownControl={dropDownControl}
        clientId={clientId}
      />
    </>
  );
}
