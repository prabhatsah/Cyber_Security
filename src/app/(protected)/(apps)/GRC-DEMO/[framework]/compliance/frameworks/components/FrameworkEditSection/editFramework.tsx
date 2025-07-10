"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shadcn/ui/card";
import { Button } from "@/shadcn/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/shadcn/ui/dialog";
import React, { useState } from 'react'
import { Eye, SquarePen } from "lucide-react";
import PolicyControlsDialog from "./newEditFrameworkForm";
import FrameworkCreationForm from "../frameworkCreationForm";

interface ControlObjective {

    objectiveDescription: string;
    objectiveIndex: string;
    objectiveName: string;
    objectiveId: string
}

interface PolicyControl {
    indexName: string;
    controlObjectives: ControlObjective[];
    controlName: string;
    isEditingName: boolean;
    policyId: string;
    type: string;
    controlDescription: string;
}


interface Objective {
    objectiveName: string;
    objectiveDescription: string;
    objectiveIndex: string;
}

interface Control {
    controlName: string;
    policyIndex: string;
    type: string;
    controlDescription: string;
    controlObjectives: Objective[];
}

interface FrameworkData {
    controls: Control[];
    frameworkName: string;
    description: string;
    owners: string[];
    frameworkId: string;
    lastUpdatedOn: Date | undefined;
    effectiveDate: Date | undefined;
    version: string;

}

interface FrameworkDraftData {
    controls: PolicyControl[];
    frameworkName: string;
    description: string;
    owners: string[];
    frameworkId: string;
    lastUpdatedOn: Date | undefined;
    effectiveDate: Date | undefined;
    version: string;
    currentAccountId: string;
    saveAsDraft: boolean;
}

type UserOption = {
    value: string;
    label: string;
};






export default function EditFramework({ frameworks, FrameworkAndControlAndObjjData, allUsers }: { frameworks: FrameworkDraftData[]; FrameworkAndControlAndObjjData: any[]; allUsers: UserOption[]; }) {
    const [openEditForm, setOpenEditForm] = useState(false);
    console.log("FrameworkAndControlAndObjjData=========>>>>")
    console.log(FrameworkAndControlAndObjjData);
    console.log(frameworks);
    const [particularFrameworkDraftData, setParticularFrameworkDraftData] = useState<FrameworkDraftData | null>(null);
    const [openFramework, setOpenFramework] = useState(false);

    const handleEditClick = (frameworkDraftData: FrameworkDraftData) => {
        setOpenFramework(true);
        setParticularFrameworkDraftData(frameworkDraftData);
        console.log("framework draft data from  edit ====================>>>>>>")
        console.log(frameworkDraftData)
    };

    const existingFrameworkIds = new Set(
        FrameworkAndControlAndObjjData.map((fw: any) => fw.frameworkId)
    );

    // Get all frameworkIds from FrameworkAndControlAndObjjData
    const objjFrameworkIds = new Set(FrameworkAndControlAndObjjData.map((fw: any) => fw.frameworkId));

    // Frameworks only in `frameworks` (not in objj data)
    const onlyDraftFrameworks = frameworks.filter(fw => !objjFrameworkIds.has(fw.frameworkId));

    // Frameworks in both, but use data from FrameworkAndControlAndObjjData
    const publishedFrameworks = FrameworkAndControlAndObjjData.filter((fw: any) =>
        frameworks.some(draft => draft.frameworkId === fw.frameworkId)
    );

    return (
        <>
            {/* <div className="container">
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {frameworks.map((framework) => (
                        <Card key={framework.frameworkId} className="cursor-pointer hover:bg-muted/50 transition-colors">
                            <CardHeader>
                                <CardTitle>
                                    {framework.frameworkName}
                                    {framework.version && (
                                        <span className="ml-2 text-xs text-muted-foreground font-normal">
                                            v{framework.version}
                                        </span>
                                    )}
                                </CardTitle>
                                <CardDescription>{framework.description}</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Button variant="link" className="mt-2 h-auto p-0 mr-5">
                                    View details <Eye className="ml-0 h-4 w-4" />
                                </Button>
                                <Button
                                    variant="link"
                                    className="mt-2 h-auto p-0"
                                    onClick={() => handleEditClick(framework)}
                                >
                                    Edit Details <SquarePen />
                                </Button>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div> */}



            <div className="container  bg-gray-950 font-inter">
                <div className="grid gap-10 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {/* Show draft frameworks (with Edit) */}
                    {onlyDraftFrameworks.map((framework) => (
                        <Card
                            key={framework.frameworkId}
                            className="relative overflow-hidden rounded-2xl border border-gray-700 bg-gray-900 text-white shadow-2xl
                          hover:shadow-purple-500/20 transition-all duration-300 ease-in-out transform hover:-translate-y-1
                          cursor-pointer"
                        >
                            <div className="absolute inset-0 bg-gradient-to-br from-gray-800/20 to-transparent pointer-events-none"></div>
                            <CardHeader className="p-8 pb-4 relative z-10">
                                <CardTitle className="text-2xl font-bold leading-tight tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">
                                    {framework.frameworkName}
                                    {framework.version && (
                                        <span className="ml-3 px-3 py-1 bg-gray-700/50 rounded-full text-xs text-gray-400 font-medium border border-gray-600">
                                            v{framework.version}
                                        </span>
                                    )}
                                </CardTitle>
                                <CardDescription className="text-base text-gray-300 mt-2 line-clamp-2">
                                    {framework.description}
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="p-8 pt-0 relative z-10 flex flex-wrap gap-x-6 gap-y-2">
                                <Button
                                    variant="link"
                                    className="h-auto p-0 text-purple-300 hover:text-purple-200 hover:underline"
                                    onClick={() => handleEditClick(framework)}
                                >
                                    Edit Details <SquarePen className="ml-2 h-4 w-4" />
                                </Button>
                            </CardContent>
                        </Card>
                    ))}

                    {/* Show published frameworks (view only) */}
                    {publishedFrameworks.map((framework: any) => (
                        <Card
                            key={framework.frameworkId}
                            className="relative overflow-hidden rounded-2xl border border-gray-700 bg-gray-900 text-white shadow-2xl
                          hover:shadow-purple-500/20 transition-all duration-300 ease-in-out transform hover:-translate-y-1
                          cursor-pointer"
                        >
                            <div className="absolute inset-0 bg-gradient-to-br from-gray-800/20 to-transparent pointer-events-none"></div>
                            <CardHeader className="p-8 pb-4 relative z-10">
                                <CardTitle className="text-2xl font-bold leading-tight tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">
                                    {framework.frameworkName}
                                    {framework.version && (
                                        <span className="ml-3 px-3 py-1 bg-gray-700/50 rounded-full text-xs text-gray-400 font-medium border border-gray-600">
                                            v{framework.version}
                                        </span>
                                    )}
                                </CardTitle>
                                <CardDescription className="text-base text-gray-300 mt-2 line-clamp-2">
                                    {framework.description}
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="p-8 pt-0 relative z-10 flex flex-wrap gap-x-6 gap-y-2">
                                <Button
                                    variant="link"
                                    className="h-auto p-0 text-purple-300 hover:text-purple-200 hover:underline"
                                    onClick={() => handleEditClick(framework)}
                                >
                                    View Details <Eye className="ml-2 h-4 w-4" />
                                </Button>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>

            {/* <PolicyControlsDialog editdata={editRow} openEditForm={openEditForm} setOpenEditForm={setOpenEditForm}  isCentralAdminUser={true}/> */}
            <FrameworkCreationForm
                open={openFramework}
                setOpen={setOpenFramework}
                userMap={allUsers}
                frameworkDraftData={particularFrameworkDraftData}
            />

        </>
    );
}
