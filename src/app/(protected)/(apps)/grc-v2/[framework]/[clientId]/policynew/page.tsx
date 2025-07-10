import { getUserIdWiseUserDetailsMap } from "@/ikon/utils/actions/users";
import React from "react";
import { getMyInstancesV2 } from "@/ikon/utils/api/processRuntimeService";
import PolicyTable from "./_components/PolicyTable";
// import { PolicyTable } from "./_components/PolicyTable";

export interface PolicySchema {
  policyTaskId: string;
  policyTitle: string;
  policyOwner: string;
  processIncluded: string;
  dateCreated: string;
  lastReviewed?: string;
  nextReview?: string;
  // revisions?: Array<{
  //   rev?: string;
  //   date?: string;
  //   summaryOfChanges?: string;
  //   author?: string;
  //   approvedBy?: string;
  // }>;
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

export async function getPolicyDatas() {
  const policyInstances = await getMyInstancesV2({
    processName: "GRC Policy Management",
    predefinedFilters: { taskName: "View Policy Registry" },
  });
  const policyDatas =
    policyInstances.length > 0
      ? policyInstances.map((policyInstance) => policyInstance.data)
      : null;
  return policyDatas;
}

export default async function PolicyManagement() {
  const allUsers = await CreateUserMap();
  const policyDatas = (await getPolicyDatas()) || [];
  const updatedPolicyDatas = policyDatas.map((policy) => {
    // Create a new object with all existing policy properties
    const updatedPolicy = { ...policy };

    // If there's an attachment, flatten its properties
    if (policy.attachment) {
      updatedPolicy.attachment_name = policy.attachment.name;
      updatedPolicy.attachment_size = policy.attachment.size;
      updatedPolicy.attachment_type = policy.attachment.type;
      updatedPolicy.attachment_lastModified = policy.attachment.lastModified;

      // Remove the original attachment object if you don't need it anymore
      delete updatedPolicy.attachment;
    }

    return updatedPolicy;
  });
  return (
    <>
      <div className="mb-3 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">GRC Policy Management</h1>
          <p className="text-muted-foreground mt-1">
            Centralized repository for all organizational policies with version
            control and review tracking.
          </p>
        </div>
      </div>
      <PolicyTable allUsers={allUsers} policyDatas={policyDatas} />
    </>
  );
}
