import React from "react";
import { getMyInstancesV2 } from "@/ikon/utils/api/processRuntimeService";
import { FullFormData } from "./PolicyForm";
import PolicyView from "./PolicyView";

// This fetch function runs on the server
export async function fetchPolicyData(): Promise<FullFormData[]> {
  try {
    const policyInstance = await getMyInstancesV2<any>({
      processName: "Add Policy",
      predefinedFilters: { taskName: "View Policy" },
    });
    return policyInstance.map((e: any) => e.data as FullFormData);
  } catch (error) {
    console.error("Failed to fetch data:", error);
    return []; // Return an empty array on failure
  }
}

export default async function PolicyPage() {
  const policies = await fetchPolicyData();

  return <PolicyView initialPolicies={policies} />;
}