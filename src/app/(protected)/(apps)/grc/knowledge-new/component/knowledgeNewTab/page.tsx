"use client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shadcn/ui/tabs";
import { useState } from "react";
import FrameworkTable from "../complianceRulesTable";
import ControlNewDataTable from "../controlnewDataTable";
import { Plus } from "lucide-react";
import { Button } from "@/shadcn/ui/button";
import UploadComponent from "../UploadComponent/page";

export default function KnowledgeBaseNewTab({
  fragmentData,
  controlObjData,
}: {
  fragmentData: any;
  controlObjData: any;
}) {
  const [activeTab, setActiveTab] = useState("complianceRules");

  return (
    <Tabs
      value={activeTab}
      onValueChange={setActiveTab}
      className="w-full h-full flex flex-col"
    >
      <TabsList className="flex space-x-2 border-b">
        <TabsTrigger value="complianceRules">Compliance Rules</TabsTrigger>
        <TabsTrigger value="controls">Controls</TabsTrigger>
      </TabsList>
      <TabsContent value="complianceRules" className="flex-grow overflow-hidden">
        <FrameworkTable fragmentData={fragmentData} />
      </TabsContent>
      <TabsContent value="controls" className="flex-grow overflow-hidden">
        <ControlNewDataTable
          frameworkData={fragmentData}
          controlObjData={controlObjData}
        />
      </TabsContent>
    </Tabs>
  );
}
