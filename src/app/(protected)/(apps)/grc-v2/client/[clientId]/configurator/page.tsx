
import React from 'react';
import { getMyInstancesV2 } from '@/ikon/utils/api/processRuntimeService';
import CardPage from './allCardSection';
import { getProfileData } from '@/ikon/utils/actions/auth';

async function fetchMetadataRiskCategoryData(clientId: string): Promise<any[]> {
  try {
    const metaDataInstance = await getMyInstancesV2<any>({
      processName: "Metadata - Risk Category",
      predefinedFilters: { taskName: "View Config" },
      mongoWhereClause: `this.Data.clientId == "${clientId}"`,
      projections: ["Data.riskCategory"],
    });
    return metaDataInstance.map((e: any) => e.data);

  } catch (error) {
    console.error("Error fetching Metadata - Risk Category data:", error);
    return [];
  }
}

async function fetchMetadataRiskImpactData(clientId: string): Promise<any[]> {
  try {
    const metaDataInstance = await getMyInstancesV2<any>({
      processName: "Metadata - Risk Impact and Weightage",
      predefinedFilters: { taskName: "View Impact" },
      mongoWhereClause: `this.Data.clientId == "${clientId}"`,
      projections: ["Data.riskImpact"],
    });
    return metaDataInstance.map((e: any) => e.data);
  } catch (error) {
    console.error("Error fetching Metadata - Risk Impact data:", error);
    return [];
  }
}

async function fetchTaskFrequencyData(clientId: string): Promise<any[]> {
  try {
    const taskFrquencyInstance = await getMyInstancesV2<any>({
      processName: "Task Frequency",
      predefinedFilters: { taskName: "View Task Frequency" },
      mongoWhereClause: `this.Data.clientId == "${clientId}"`,
      projections: ["Data.taskFrequency"],
    });
    return taskFrquencyInstance.map((e: any) => e.data);
  } catch (error) {
    console.error("Error fetching Task Frequency", error);
    return [];
  }
}

export default async function ConfiguratorPage({
  params,
}: {
  params: { framework: string; clientId: string };
}) {

  const { clientId } = params;
  let riskCategoryData = await fetchMetadataRiskCategoryData(clientId);
  const riskImpactData = await fetchMetadataRiskImpactData(clientId);
  const taskFrequencyData = await fetchTaskFrequencyData(clientId);
  const profileData = await getProfileData();

  console.log('The data of riskCategoryData', riskCategoryData);
  console.log('The data of riskImpactData', riskImpactData);
  console.log('The data of taskFrequencyData', taskFrequencyData);

  // const riskDataObj = riskCategoryData.length > 0 ? riskCategoryData[0]?.riskCategory : {};
  // const taskFrequencyObj = taskFrequencyData.length > 0 ? taskFrequencyData[0]?.taskFrequency : {};
  return (
    <CardPage
      riskCategoryData={riskCategoryData}
      riskImpactData={riskImpactData || []}
      taskFrequencyData={taskFrequencyData}
      profileData={profileData}
      clientId={clientId}
    />
  );
}