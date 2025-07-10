"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shadcn/ui/tabs";
import { Button } from "@/shadcn/ui/button";
import { Plus } from "lucide-react";
import PlanningObjectiveDataTable from "./policyObjDataTable";
import MeetingDataTable from "./meetingDataTable";
import ActionsDataTable from "./actionsDataTable";
import FindingsDataTable from "./FindingsDataTable";
import FollowUpDataTable from "./FollowUpDataTable";

type PolicyTabsProps = {
  auditData: any[]; // Replace 'any' with your actual type
  userIdNameMap: { value: string; label: string }[]; // Add this prop
  meetingData: any[]; // Replace 'any' with your actual type
  findingsData: any[]; // Replace 'any' with your actual type
  role: string; // Add this prop
  findActionData: any[];
  profileData: any[]; // Add this prop
  followUpMeetingData: any[]; // Add this prop
  currentUserId: string;
  isAllowedToScheduleMeeting: boolean;
  isAllowedForFindingAndActions: boolean;
};

export default function PolicyTabs({
  auditData,
  userIdNameMap,
  meetingData,
  findingsData,
  role,
  findActionData,
  profileData,
  followUpMeetingData,
  currentUserId,
  isAllowedToScheduleMeeting,
  isAllowedForFindingAndActions,
}: PolicyTabsProps) {
  console.log("ROLE------------------->", role);
  console.log("Policy Data:", auditData);
  console.log("User ID Name Map:", userIdNameMap);
  console.log(
    "profileData: in POLICYYYYY TABBBBBB _______====================>   ",
    profileData
  );
  console.log("Finding Actions Data From Policy Tab", findActionData);

  console.log(
    "followUpMeetingData Data from policyTab.tsx",
    followUpMeetingData
  );

  if (role === "auditor") {
    const [activeTab, setActiveTab] = useState("framework");
    return (
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="w-full h-full flex flex-col"
      >
        <TabsList className="flex space-x-2 border-b">
          <TabsTrigger value="framework">Framework</TabsTrigger>

          {/* <TabsTrigger value="evaluation">Evaluation</TabsTrigger> */}
          <TabsTrigger value="meetings">Meetings</TabsTrigger>
          <TabsTrigger value="findings">Findings</TabsTrigger>
          <TabsTrigger value="actions">Actions</TabsTrigger>
          <TabsTrigger value="followups">Follow Ups</TabsTrigger>
        </TabsList>

        <TabsContent value="framework" className="flex-grow overflow-hidden">
          <PlanningObjectiveDataTable
            userIdNameMap={userIdNameMap}
            tableData={auditData}
          />
        </TabsContent>

        {/* <TabsContent value="evaluation" className="flex-grow overflow-hidden">
          <h1 className="text-lg font-semibold mb-4">Evaluation</h1>
        </TabsContent> */}

        <TabsContent value="meetings" className="flex-grow overflow-hidden">
          <MeetingDataTable
            userIdNameMap={userIdNameMap}
            tableData={meetingData}
            auditData={auditData}
            isAllowedToScheduleMeeting={isAllowedToScheduleMeeting}
          />
        </TabsContent>

        <TabsContent value="findings" className="flex-grow overflow-hidden">
          <FindingsDataTable
            auditData={auditData}
            userIdNameMap={userIdNameMap}
            findingsData={findingsData}
            frameworkId={auditData[0]?.frameworkId}
            currentUserId={currentUserId}
            isAllowedForFindingAndActions={isAllowedForFindingAndActions}
          />
        </TabsContent>

        <TabsContent value="actions" className="flex-grow overflow-hidden">
          <ActionsDataTable
            findActionData={findActionData}
            userIdNameMap={userIdNameMap}
            profileData={profileData}
            role={role}
            currentUserId={currentUserId}
            isAllowedForFindingAndActions={isAllowedForFindingAndActions}
          />
        </TabsContent>

        <TabsContent value="followups" className="flex-grow overflow-hidden">
          <FollowUpDataTable
            findActionData={findActionData}
            userIdNameMap={userIdNameMap}
            followUpMeetingData={followUpMeetingData}
          />
        </TabsContent>
      </Tabs>
    );
  } else if (role === "auditeeType1") {
    const [activeTab, setActiveTab] = useState("findings");
    return (
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="w-full h-full flex flex-col"
      >
        <TabsList className="flex space-x-2 border-b">
          {/* <TabsTrigger value="framework">Framework</TabsTrigger> */}
          {/* <TabsTrigger value="meetings">Meetings</TabsTrigger> */}
          <TabsTrigger value="findings">Findings</TabsTrigger>
          <TabsTrigger value="actions">Actions</TabsTrigger>
          {/* <TabsTrigger value="followups">Follow Ups</TabsTrigger> */}
        </TabsList>

        {/* <TabsContent value="framework" className="flex-grow overflow-hidden">
          <PlanningObjectiveDataTable userIdNameMap={userIdNameMap} tableData={auditData} />
        </TabsContent> */}

        {/* <TabsContent value="meetings" className="flex-grow overflow-hidden">
          <MeetingDataTable userIdNameMap={userIdNameMap} tableData={meetingData} auditData={auditData}/>
        </TabsContent>
   */}
        <TabsContent value="findings" className="flex-grow overflow-hidden">
          <FindingsDataTable
            auditData={auditData}
            userIdNameMap={userIdNameMap}
            findingsData={findingsData}
          />
        </TabsContent>

        <TabsContent value="actions" className="flex-grow overflow-hidden">
          <ActionsDataTable
            findActionData={findActionData}
            userIdNameMap={userIdNameMap}
            profileData={profileData}
            role={role}
            currentUserId={currentUserId}
          />
        </TabsContent>

        {/* <TabsContent value="followups" className="flex-grow overflow-hidden">
          <h1 className="text-lg font-semibold mb-4">Follow Ups</h1>
        </TabsContent> */}
      </Tabs>
    );
  } else if (role === "auditeeType2") {
    const [activeTab, setActiveTab] = useState("actions");
    return (
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="w-full h-full flex flex-col"
      >
        <TabsList className="flex space-x-2 border-b">
          <TabsTrigger value="actions">Actions</TabsTrigger>
        </TabsList>
        <TabsContent value="actions" className="flex-grow overflow-hidden">
          <ActionsDataTable
            findActionData={findActionData}
            userIdNameMap={userIdNameMap}
            profileData={profileData}
            role={role}
          />
        </TabsContent>
      </Tabs>
    );
  }
}
