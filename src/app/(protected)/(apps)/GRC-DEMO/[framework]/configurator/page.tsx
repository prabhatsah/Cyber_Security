
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
            processName: "Metadata - Risk Category",
            predefinedFilters: { taskName: "View Config" }
        });
        return metaDataInstance.map((e: any) => e.data);
    } catch (error) {
        console.error("Error fetching Metadata - Risk Category data:", error);
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

async function fetchControlObjectivesData(): Promise<any[]> {
  try {
    const controlObjInstance = await getMyInstancesV2<any>({
      processName: "Control Objectives V2",
      predefinedFilters: { taskName: "view control objecitve" }
    });
    return controlObjInstance.map((e: any) => e.data);
  } catch (error) {
    console.error("Error fetching Control Objectives V2", error);
    return [];
  }
}

async function fetchTaskFrequencyData(): Promise<any[]> {
  try {
    const taskFrquencyInstance = await getMyInstancesV2<any>({
      processName: "Task Frequency",
      predefinedFilters: { taskName: "View Task Frequency" }
    });
    return taskFrquencyInstance.map((e: any) => e.data);
  } catch (error) {
    console.error("Error fetching Task Frequency", error);
    return [];
  }
}




export default async function ConfiguratorPage() {

    const riskCategoryData = await fetchMetadataRiskCategoryData();
    const riskImpactData = await fetchMetadataRiskImpactData();
    const controlObjectivesData = await fetchControlObjectivesData();
    const taskFrequencyData = await fetchTaskFrequencyData();
    const profileData = await getProfileData();

    console.log("Risk Category Data:", riskCategoryData);
    console.log("Risk Impact Data:", riskImpactData);

    return (
       <CardPage riskCategoryData={riskCategoryData || []} riskImpactData={riskImpactData || []} controlObjectivesData={controlObjectivesData || []}
       taskFrequencyData={taskFrequencyData || []} profileData={profileData}></CardPage>
    );
}