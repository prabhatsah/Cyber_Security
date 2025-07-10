'use client'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shadcn/ui/tabs";
import { useState } from "react";
import IncidentDataTable from "../incidentDataTable";
import IncidentProgressDataTable from "../incidentProgressDataTable";


export default function IncidentTab({ incidentCreateDatas, incidentProgressDatas, allUsers, userIdNameMap }: any) {
    const [activeTab, setActiveTab] = useState("allIncidentTable");

    return (
        <div className="space-y-4">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full mb-3">
                <TabsList className="flex space-x-2 border-b">
                    <TabsTrigger value="allIncidentTable">
                        All Incidents
                    </TabsTrigger>
                    <TabsTrigger value="inProgressIncidentTable">
                        In Progress Incidents
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="allIncidentTable">
                    <IncidentDataTable incidentCreateDatas={incidentCreateDatas} allUsers={allUsers} userIdNameMap={userIdNameMap} />
                </TabsContent>
                <TabsContent value="inProgressIncidentTable">
                    <IncidentProgressDataTable incidentProgressDatas={incidentProgressDatas} allUsers={allUsers} userIdNameMap={userIdNameMap} />
                </TabsContent>
            </Tabs>
        </div>
    );
}