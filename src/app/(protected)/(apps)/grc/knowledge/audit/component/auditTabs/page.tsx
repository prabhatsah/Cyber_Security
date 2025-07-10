"use client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shadcn/ui/tabs";
import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/shadcn/ui/button";
import AuditConfigurationDialog from "../auditConfigurationDialog/page";


export default function AuditTab({}) {
  const [activeTab, setActiveTab] = useState("audits");

  return (
    <div className="space-y-4">
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="w-full mb-3"
      >
        <TabsList className="flex space-x-2 border-b">
          <TabsTrigger value="audits">All Audits</TabsTrigger>
          <TabsTrigger value="publishedAudits">Published Audits</TabsTrigger>
        </TabsList>
        <TabsContent value="audits">
            <AuditConfigurationDialog></AuditConfigurationDialog>
        </TabsContent>
        <TabsContent value="publishedAudits">
        </TabsContent>
      </Tabs>
    </div>
  );
}
