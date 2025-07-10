
import React from 'react';
import { Button } from "@/shadcn/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/shadcn/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/shadcn/ui/dialog';
import CategoryAddSchema from './CategoryAddSchema';
import { getMyInstancesV2 } from '@/ikon/utils/api/processRuntimeService';
import RiskImpactEdit from './RiskImpact/EditImpactModal';
import CardPage from './allCardSection';
import { getProfileData } from '@/ikon/utils/actions/auth';

async function fetchMetadataRiskCategoryData(): Promise<any[]> {
  try {
    const metaDataInstance = await getMyInstancesV2<any>({
      processName: "Metadata - Risk Category - Global Account",
      predefinedFilters: { taskName: "View Risk Category" }
    });
    return metaDataInstance.map((e: any) => e.data);
  } catch (error) {
    console.error("Error fetching Metadata - Risk Category - Global Account data:", error);
    return [];
  }
}

async function fetchMetadataRiskImpactData(): Promise<any[]> {
  try {
    const metaDataInstance = await getMyInstancesV2<any>({
      processName: "Metadata - Risk Impact and Weightage",
      predefinedFilters: { taskName: "View Impact" }
    });
    return metaDataInstance.map((e: any) => e.data);
  } catch (error) {
    console.error("Error fetching Metadata - Risk Impact data:", error);
    return [];
  }
}


async function fetchTaskFrequencyData(): Promise<any[]> {
  try {
    const taskFrquencyInstance = await getMyInstancesV2<any>({
      processName: "Metadata - Task Frequency - Global Account",
      predefinedFilters: { taskName: "View Frequency" }
    });
    return taskFrquencyInstance.map((e: any) => e.data);
  } catch (error) {
    console.error("Error fetching Task Frequency", error);
    return [];
  }
}


async function fetchDomainData(): Promise<any[]> {
  try {
    const domainInstance = await getMyInstancesV2<any>({
      processName: "Metadata - Domain - Global Account",
      predefinedFilters: { taskName: "View Domain" }
    });
    return domainInstance.map((e: any) => e.data);
  } catch (error) {
    console.error("Error fetching domain data:", error);
    return [];
  }
}




export default async function ConfiguratorPage() {

  const riskCategoryData = await fetchMetadataRiskCategoryData();
  const riskImpactData = await fetchMetadataRiskImpactData();
  const taskFrequencyData = await fetchTaskFrequencyData();
  const domainData = await fetchDomainData();
  const profileData = await getProfileData();

  console.log("Risk Category Data:", riskCategoryData);
  console.log("Risk Impact Data:", riskImpactData);

  return (
    <CardPage
      riskCategoryData={riskCategoryData || []}
      riskImpactData={riskImpactData || []}
      controlObjectivesData={[]}
      taskFrequencyData={taskFrequencyData || []}
      domainData={domainData}
      profileData={profileData}>
    </CardPage>
  );
}