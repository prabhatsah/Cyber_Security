"use client"

import { SAVE_DATE_FORMAT_GRC } from "@/ikon/utils/config/const";
import PolicyTabs from "./policyTab";

import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/shadcn/ui/card";
import { format } from "date-fns";
import { LayoutDashboard, BookOpen, Users, Copy } from "lucide-react";
import { Label } from "@/shadcn/ui/label";
import { Input } from "@/shadcn/ui/input";
import { Badge } from "@/shadcn/ui/badge";
import AuditCard from "./audit/AuditCard";



export default function AuditDetailComponent({

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
}: {

    auditData: any[];
    userIdNameMap: { value: string; label: string }[];
    meetingData: any[];
    findingsData: any[];
    role: string;
    findActionData: any[];
    profileData: any[];
    followUpMeetingData: any[];
    currentUserId: string;
    isAllowedToScheduleMeeting: boolean;
    isAllowedForFindingAndActions: boolean;
}) {
    const auditDetails = auditData[0] || {};
    console.log("Audit Details:", auditDetails);
    // debugger;
    const capitalizeText = (text: string) => {
        if (!text) return "N/A";
        return text
            .replace(/([a-z])([A-Z])/g, "$1 $2")
            .replace(/\b\w/g, (char) => char.toUpperCase());
    };

    // debugger;
    // This is the function to format the memebername as well as the initials
    const getMemberDetails = (id: string, userIdNameMap: { value: string; label: string }[]) => {
        const found = userIdNameMap.find(u => u.value === id);
        if (!found) return { name: "Unknown", initials: "?" };
        const initials = found.label
            .split(" ")
            .map(w => w[0])
            .join("")
            .slice(0, 3)
            .toUpperCase();
        return { name: found.label, initials };
    };


    return (
        <div className="flex flex-col gap-8 h-full">
            {/* Header Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* <Card className="shadow-lg border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 h-80">
                    <CardHeader>
                        <CardTitle className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                            <LayoutDashboard className="w-5 h-5" />
                            Audit Overview
                            <strong className="text-sm font-normal text-green-500 dark:text-green-400">{auditData[0]?.auditProgress===100? '(Completed)': "(IN PROGRESS)"}</strong>
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <div className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600">
                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Audit Name</p>
                            <p className="text-lg font-semibold text-gray-900 dark:text-white">{capitalizeText(auditDetails.auditName)}</p>
                        </div>
                        <div className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600">
                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Audit Period</p>
                            <p className="text-lg font-semibold text-gray-900 dark:text-white">
                                {format(new Date(auditDetails.auditStart), SAVE_DATE_FORMAT_GRC) || "N/A"} - {format(new Date(auditDetails.auditEnd), SAVE_DATE_FORMAT_GRC) || "N/A"}
                            </p>
                        </div>
                        <div className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600">
                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Audit Cycle</p>
                            <p className="text-lg font-semibold text-gray-900 dark:text-white">{capitalizeText(auditDetails.auditCycle)}</p>
                        </div>
                    </CardContent>
                </Card>
                <Card className="shadow-lg border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 h-80">
                    <CardHeader>
                        <CardTitle className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                            <BookOpen className="w-5 h-5" />
                            Policy & Framework
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="p-4 rounded-lg bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600">
                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Framework Name</p>
                            <p className="text-lg font-semibold text-gray-900 dark:text-white">{capitalizeText(auditDetails.policyName)}</p>
                        </div>
                        <div className="p-4 rounded-lg bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600">
                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Framework Type</p>
                            <p className="text-lg font-semibold text-gray-900 dark:text-white">{capitalizeText(auditDetails.framework)}</p>
                        </div>
                    </CardContent>
                </Card>
                <Card className="shadow-lg border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                    <CardHeader>
                        <CardTitle className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                            <Users className="w-5 h-5" />
                            Audit Team
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="flex gap-6 h-64">
                            <div className="min-w-[50%] border border-gray-200 dark:border-gray-600 shadow-sm p-2 rounded-lg">
                                <p className="text-lg font-medium text-gray-900 dark:text-white">Auditor Team</p>
                                <ul className="list-disc list-inside space-y-2 max-h-44 overflow-y-auto">
                                    {auditDetails.auditorTeam?.map((memberId, index) => {
                                        const member = userIdNameMap.find((user) => user.value === memberId);
                                        return (
                                            <li key={index} className="text-gray-700 dark:text-gray-300">
                                                {member ? member.label : "Unknown Member"}
                                            </li>
                                        );
                                    }) || <p className="text-gray-700 dark:text-gray-300">No team members available</p>}
                                </ul>
                            </div>
                            <div className=" border border-gray-200 dark:border-gray-600 shadow-sm p-2 rounded-lg min-w-[45%]">
                                <p className="text-lg font-medium text-gray-900 dark:text-white">Auditee Team</p>
                                <ul className="list-disc list-inside space-y-2 max-h-44 overflow-y-auto">
                                    {auditDetails.auditeeTeam?.map((memberId, index) => {
                                        const member = userIdNameMap.find((user) => user.value === memberId);
                                        return (
                                            <li key={index} className="text-gray-700 dark:text-gray-300">
                                                {member ? member.label : "Unknown Member"}
                                            </li>
                                        );
                                    }) || <p className="text-gray-700 dark:text-gray-300">No team members available</p>}
                                </ul>
                            </div>
                        </div>
                    </CardContent>
                </Card> */}

                <AuditCard
                    title="Audit Overview"
                    label="Audit Name"
                    description={capitalizeText(auditDetails.auditName)}
                    startDate={format(new Date(auditDetails.auditStart), SAVE_DATE_FORMAT_GRC) || "N/A"}
                    endDate={format(new Date(auditDetails.auditEnd), SAVE_DATE_FORMAT_GRC) || "N/A"}
                    frequency={capitalizeText(auditDetails.auditCycle)}
                    icon={Copy}
                    badgeVariant={auditData[0]?.auditProgress === 100 ? "success" : "default"}
                    badgeLabel={auditData[0]?.auditProgress === 100 ? "Completed" : "In Progress"}
                />

                <AuditCard
                    title="Policy & Framework"
                    label="Framework Name"
                    description={capitalizeText(auditDetails.policyName)}
                    dateLabel="Framework Type"
                    dateDescription={capitalizeText(auditDetails.framework)}
                    showBorder={true}
                    icon={Copy}
                />

                <AuditCard
                    title="Audit Team"
                    label="Framework Name"
                    description="This cookie is used to store user consent preferences."
                    peopleGroups={[
                        {
                            title: "Auditor Team",
                            members: auditDetails.auditorTeam.map((id: string) => getMemberDetails(id, userIdNameMap)),
                        },
                        {
                            title: "Auditee Team",
                            members: auditDetails.auditeeTeam.map((id: string) => getMemberDetails(id, userIdNameMap)),
                        },
                    ]}
                    showBorder={false}
                    footerVisible={false}
                />
            </div>


            {/* Tabs Section */}
            <div className="flex-grow overflow-hidden">
                <PolicyTabs auditData={auditData} userIdNameMap={userIdNameMap} meetingData={meetingData} findingsData={findingsData} findActionData={findActionData} role={role} profileData={profileData} followUpMeetingData={followUpMeetingData} currentUserId={currentUserId} isAllowedToScheduleMeeting={isAllowedToScheduleMeeting} isAllowedForFindingAndActions={isAllowedForFindingAndActions} />
            </div>
        </div>
    );
}