'use client'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shadcn/ui/tabs';
import React, { useState } from 'react'
import ControlsDataTable from '../controlsDataTable';
import { controlsDatas } from '../../controlsData';
import ControlsFailedDataTable from '../controlsFailedDataTable';
import { userMapSchema } from '../../../../components/createUserMap';
import ControlsPassedDataTable from '../controlsPassedDataTable';

export default function ReportingTab({ userMap, auditData, complianceReportDatas, allUsers }: { userMap: userMapSchema, auditData: Record<string, string | string>[], complianceReportDatas: Record<string, string>[], allUsers: any }) {
    const [activeTab, setActiveTab] = useState("allReports");

    return (

        <Tabs value={activeTab} onValueChange={setActiveTab} className='h-full'>
            <TabsList className="flex space-x-2 border-b">
                <TabsTrigger value="allReports">
                    All Reports
                </TabsTrigger>
                <TabsTrigger value="nonComplianceReports">
                    Non Compliance Reports
                </TabsTrigger>
            </TabsList>
            <TabsContent value="allReports">
                <div className='h-[82vh]'>
                    <ControlsDataTable controlsDatas={auditData} userMap={userMap} complianceReportDatas={complianceReportDatas} />
                </div>
            </TabsContent>
            {/* <TabsContent value="failedReports">
                    <ControlsFailedDataTable failedAuditDatas={failedAuditDatas} allUsers={allUsers} userMap={userMap}/>
                </TabsContent>
                <TabsContent value="passedReports">
                    <ControlsPassedDataTable passedAuditDatas={passedAuditDatas} allUsers={allUsers}/>
                </TabsContent> */}
            <TabsContent value="nonComplianceReports">
                <ControlsFailedDataTable complianceReportDatas={complianceReportDatas} allUsers={allUsers} userMap={userMap} />
            </TabsContent>
        </Tabs>
    );
}
