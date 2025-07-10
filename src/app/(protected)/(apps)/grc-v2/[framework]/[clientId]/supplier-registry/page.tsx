import { getUserIdWiseUserDetailsMap } from '@/ikon/utils/actions/users';
import React from 'react'
import SupplierRegistryTable from './components/supplierRegistryTable';
import { all } from 'axios';
import { getMyInstancesV2 } from '@/ikon/utils/api/processRuntimeService';

export interface SupplierRegistrySchema{
    supplierName: string;
    contactPerson: string;
    contactEmail: string;
    contactPhone: string;
    serviceProvided: string;
    contractStartDate: string;
    contractEndDate: string;
    complianceStatus: string;
    compliance: string;
    riskAssessmentDate: string;
    riskLevel: string;
    mitigationMeasure: string;
    reviewDate: string;
    notes: string;
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

export async function getSupplierRegistryDatas() {
  const supplierRegistryInstances = await getMyInstancesV2({
    processName: 'Supplier Registry',
    predefinedFilters: { taskName: "View Supplier Registry" }
  });
  const supllierRegistryDatas = supplierRegistryInstances.length > 0 ? supplierRegistryInstances.map((supplierRegistryInstance) => (supplierRegistryInstance.data)) : null;
  return supllierRegistryDatas;
}

export default async function SupplierRegistry() {
    const allUsers = await CreateUserMap();
    const supllierRegistryDatas = await getSupplierRegistryDatas() as SupplierRegistrySchema[];
    return (
        <>
            <div className="mb-3 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-semibold">Supplier Registry</h1>
                    <p className="text-muted-foreground mt-1">
                        Maintain a single source of truth for supplier compliance, onboarding, and risk evaluation.
                    </p>
                </div>
            </div>
            <SupplierRegistryTable allUsers={allUsers} supllierRegistryDatas={supllierRegistryDatas}/>
        </>
    )
}
