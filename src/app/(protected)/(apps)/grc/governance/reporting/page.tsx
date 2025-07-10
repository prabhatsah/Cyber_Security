import React from 'react'
import { CreateUserMap, getUserDetailMap } from '../../components/createUserMap'
import ReportingTab from './components/reportingTab'
import { getMyInstancesV2 } from '@/ikon/utils/api/processRuntimeService'
import { stat } from 'fs';

type AuditData = {
  auditorMembers: string[];
  frameworkData: any;
  startDate: string;
  frameworkTitle: string;
  auditType: string;
  auditName: string;
  auditeeMembers: string[],
  controls: any
};

export async function complianceReport() {
  // const status = "failed"
  const auditReportStatusInst = await getMyInstancesV2({
    processName: "Add Audit Report",
    predefinedFilters: { taskName: "View Audit Report" },
    // mongoWhereClause: `this.Data.complianceStatus == "${status}"`,
  })
  const failedAuditDatas = auditReportStatusInst.length ? auditReportStatusInst.map((auditDataInstance) => auditDataInstance.data) : []

  console.log(auditReportStatusInst);
  return failedAuditDatas;
}

export async function passedAuditReport() {
  const status = "passed"
  const auditReportStatusInst = await getMyInstancesV2({
    processName: "Add Audit Report",
    predefinedFilters: { taskName: "View Audit Report" },
    mongoWhereClause: `this.Data.complianceStatus == "${status}"`,
  })
  const passedAuditDatas = auditReportStatusInst.length ? auditReportStatusInst.map((auditDataInstance) => auditDataInstance.data) : []

  console.log(auditReportStatusInst);
  return passedAuditDatas;
}


export default async function Reporting() {

  const complianceReportDatas = await complianceReport() as Record<string, string>[];
  console.log(complianceReportDatas);

  const auditDataInstances = await getMyInstancesV2({
    processName: "Add Audit",
    predefinedFilters: { taskName: 'view audit' }
  })
  console.log(auditDataInstances);

  const auditDatas: AuditData[] = auditDataInstances.length
    ? auditDataInstances.map((auditDataInstance) => auditDataInstance.data as AuditData)
    : [];

  const flattenedAuditData = [];

  // for (const auditData of auditDatas) {
  //   const auditorId = auditData?.auditorMembers|| []
  //   const frameworkData = auditData?.frameworkData || '';
  //   const auditStartDate = auditData?.startDate || ''

  //   if (!frameworkData || !frameworkData.controls) continue;

  //   const auditType = frameworkData.auditType;
  //   const frameworkName = frameworkData.name

  //   for (const control of frameworkData.controls) {
  //     const controlName = control.name;
  //     const controlWeight = control.weight;

  //     if (!control.objectives) continue;

  //     for (const objective of control.objectives) {
  //       const auditDate = new Date(auditStartDate);
  //       const todayDate = new Date();
  //       let status = '';
  //       todayDate.setHours(0, 0, 0, 0);
  //       const alreadyExists = complianceReportDatas.some(item =>
  //         item.objectiveName === objective.name &&
  //         item.objectiveWeight === objective.weight && 
  //         item.complianceStatus === "failed"
  //       );
  //       const alreadExistPassed = complianceReportDatas.some(item =>
  //         item.objectiveName === objective.name &&
  //         item.objectiveWeight === objective.weight && 
  //         item.complianceStatus === "passed"
  //       );
  //       console.log(alreadyExists);
  //       if (alreadyExists) {
  //         status = "InProgress";
  //       }else if(alreadExistPassed){
  //         status = "Closed";
  //       } else {
  //         if (todayDate > auditDate) {
  //           status = "Open";
  //         } else {
  //           status = "Upcoming";
  //         }
  //       }
  //       flattenedAuditData.push({
  //         auditorId,
  //         frameworkName,
  //         auditStartDate,
  //         status,
  //         auditType,
  //         controlName,
  //         controlWeight,
  //         objectiveName: objective.name,
  //         objectiveWeight: objective.weight,
  //       });
  //     }
  //   }
  // }

  for (const auditData of auditDatas) {
    const auditorId = auditData?.auditorMembers || [];
    const auditeeId = auditData?.auditeeMembers || [];
    const frameworkName = auditData?.frameworkTitle || '';
    const auditStartDate = auditData?.startDate || '';
    const auditType = auditData?.auditType || '';
    const controlsList = auditData?.controls?.[0]?.controls || [];

    for (const control of controlsList) {
      const controlName = control?.controlName;
      const controlWeight = control?.controlWeight;

      if (!control?.controlObjectives) continue;

      for (const objective of control.controlObjectives) {
        const auditDate = new Date(auditStartDate);
        const todayDate = new Date();
        let status = '';
        todayDate.setHours(0, 0, 0, 0);

        const alreadyExists = complianceReportDatas.some(item =>
          item.objectiveName === objective.name &&
          item.objectiveWeight === objective.controlObjWeight &&
          item.complianceStatus === "failed"
        );
        const alreadyExistPassed = complianceReportDatas.some(item =>
          item.objectiveName === objective.name &&
          item.objectiveWeight === objective.controlObjWeight &&
          item.complianceStatus === "passed"
        );

        if (alreadyExists) {
          status = "InProgress";
        } else if (alreadyExistPassed) {
          status = "Closed";
        } else {
          status = todayDate >= auditDate ? "Open" : "Upcoming";
        }

        flattenedAuditData.push({
          auditId: auditData.auditId,
          auditName: auditData.auditName,
          auditorId,
          auditeeId,
          frameworkName,
          auditStartDate,
          status,
          auditType,
          controlName,
          controlWeight,
          objectiveName: objective.name,
          objectiveWeight: objective.controlObjWeight,
          controlDescription: objective.description
        });
      }
    }
  }

  console.log(flattenedAuditData);

  const userMap = await CreateUserMap()
  // const failedAuditDatas = await failedAuditReport() as Record<string, string>[];
  // const passedAuditDatas = await passedAuditReport() as Record<string, string>[];
  // console.log(failedAuditDatas);
  const allUsers = await getUserDetailMap();
  return (
    <>
      <div className='h-full'>
        <ReportingTab userMap={userMap} auditData={flattenedAuditData} complianceReportDatas={complianceReportDatas} allUsers={allUsers} />
      </div>
    </>
  )
}
