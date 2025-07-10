"use client";
import React, { useCallback, useState } from 'react';
import { Button } from "@/shadcn/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/shadcn/ui/card";
import { getMyInstancesV2 } from '@/ikon/utils/api/processRuntimeService';
import RiskImpactEdit from './RiskImpact/EditImpactModal';
import RiskCategoryEdit from './RiskCategory/EditRiskCategoryModal';
import RiskImpactViewDataTable from './RiskImpact/ViewImpactModal';
import RiskCategoryViewDataTable from './RiskCategory/ViewRiskCategoryModal';
import TaskFrequncyEdit from './TaskFrequency/EditTaskFrequencyModal';
import TaskFrequencyViewDataTable from './TaskFrequency/ViewTaskFrequencyModal';
import DomainEdit from './Domain/EditDomainModal';
import DomainViewDataTable from './Domain/ViewDomainModal';

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



export default function CardPage({ riskCategoryData, riskImpactData, controlObjectivesData, taskFrequencyData, domainData,profileData }: { riskCategoryData: Record<string, string>[], riskImpactData: Record<string, string>[]; controlObjectivesData: Record<string, string>[]; taskFrequencyData: Record<string, string>[]; domainData: Record<string, string>[]; profileData: Record<string, string>[] }) {
    
    const [impactModalOpen, setImpactModalOpen] = useState(false);
    const [impactViewModalOpen, setImpactViewModalOpen] = useState(false);

    const [categoryModalOpen, setCategoryModalOpen] = useState(false);
    const [categoryViewModalOpen, setCategoryViewModalOpen] = useState(false);

    const [taskFrequencyOpen, setTaskFrequencyOpen] = useState(false);
    const [taskFrequencyViewOpen, setTaskFrequencyViewOpen] = useState(false);

    const [domainOpen,setDomainOpen] = useState(false);
    const [domainViewOpen,setDomainViewOpen] =  useState(false);


    const handleEditTaskFrquency = () => setTaskFrequencyOpen(true);
    const handleViewTaskFrequency = () => setTaskFrequencyViewOpen(true);
    
    
    const handleEditDomain = () => setDomainOpen(true);
    const handleViewDomain = () => setDomainViewOpen(true);

    const handleEditImpact = () => {
        setImpactModalOpen(true);
    };

    const handleViewImpact = () => setImpactViewModalOpen(true);

    const handleEditCategory = () => {
        setCategoryModalOpen(true);
    };

    const handleViewCategory = () => setCategoryViewModalOpen(true);

    return (
        <div className="min-h-screen  bg-background text-foreground dark:text-gray-50">
            {/* <h1 className="text-2xl font-bold  text-foreground">Configurator</h1>
            <p className="mb-8">Organize your modules with their own specific metadata.</p> */}

            <div className="mb-3"> {/* Increased mb and max-w */}
                <h1 className="text-2xl font-bold mb-2 text-foreground"> {/* Changed to text-white */}
                    Configurator
                </h1>
                <p className="mt-1 text-muted-foreground"> {/* Larger text, increased mt, max-w for description */}
                    Organize your modules with their own specific metadata.
                </p>
            </div>
            <div className="flex flex-row gap-8">
                <Card className="
       w-full max-w-sm relative overflow-hidden rounded-xl border border-zinc-700 bg-zinc-900 text-white shadow-xl
    hover:shadow-indigo-500/20 transition-all duration-300 ease-in-out transform hover:-translate-y-1 h-64
    flex flex-col
      ">

                    <div className="absolute inset-0 bg-gradient-to-br from-zinc-800/20 to-transparent pointer-events-none"></div>


                    <CardHeader className="p-6 pb-4 relative z-10">

                        <CardTitle className="text-2xl font-bold leading-tight tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-indigo-500">
                            Risk Category {/* Updated title */}
                        </CardTitle>

                        <CardDescription className="text-sm text-gray-400 mt-2"
                            title="Risk Category refers to the classification of potential risks based on their nature, source, or impact. This helps in organizing and analyzing risks more effectively."
                        >
                            Risk Category refers to the classification of potential risks based on their nature, source, or impact.
                            This helps in organizing and analyzing risks more effectively.
                        </CardDescription>
                    </CardHeader>


                    {/* <CardContent className="p-6 pt-0 relative z-10 flex-1">

                    </CardContent> */}


                    <CardFooter className="flex justify-end space-x-3 p-6 pt-0 relative z-10 mt-auto">

                        <Button
                            onClick={handleViewCategory} // Updated onClick handler
                            variant="outline"
                            className="
              px-5 py-2 rounded-lg font-semibold transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-opacity-50
              border border-zinc-600 text-zinc-300 bg-zinc-800 hover:bg-zinc-700 hover:text-white shadow-sm transform hover:scale-105
            "
                        >
                            View
                        </Button>
                        <Button
                            onClick={handleEditCategory} // Updated onClick handler
                            className="
              px-5 py-2 rounded-lg font-semibold transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-opacity-50
              bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg hover:from-blue-700 hover:to-indigo-700 transform hover:scale-105
            "
                        >
                            Edit
                        </Button>
                    </CardFooter>
                </Card>

                {/* <Card className="
        w-full max-w-sm relative overflow-hidden rounded-xl border border-zinc-700 bg-zinc-900 text-white shadow-xl
        hover:shadow-indigo-500/20 transition-all duration-300 ease-in-out transform hover:-translate-y-1
      ">
                  
                    <div className="absolute inset-0 bg-gradient-to-br from-zinc-800/20 to-transparent pointer-events-none"></div>

                 
                    <CardHeader className="p-6 pb-4 relative z-10">
                      
                        <CardTitle className="text-2xl font-bold leading-tight tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-indigo-500">
                            Risk Impact
                        </CardTitle>
                       
                        <CardDescription className="text-sm text-gray-400 mt-2 line-clamp-3">
                            Risk Category refers to the classification of potential risks based on their nature, source, or impact.
                            This helps in organizing and analyzing risks more effectively.
                        </CardDescription>
                    </CardHeader>

                   
                    <CardContent className="p-6 pt-0 relative z-10">

                    </CardContent>

                   
                    <CardFooter className="flex justify-end space-x-3 p-6 pt-0 relative z-10">
                      
                        <Button
                            onClick={handleViewImpact}
                            variant="outline"
                            className="
              px-5 py-2 rounded-lg font-semibold transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-opacity-50
              border border-zinc-600 text-zinc-300 bg-zinc-800 hover:bg-zinc-700 hover:text-white shadow-sm transform hover:scale-105
            "
                        >
                            View
                        </Button>
                        <Button
                            onClick={handleEditImpact}
                            className="
              px-5 py-2 rounded-lg font-semibold transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-opacity-50
              bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg hover:from-blue-700 hover:to-indigo-700 transform hover:scale-105
            "
                        >
                            Edit
                        </Button>
                    </CardFooter>
                </Card> */}

                <Card className="
        w-full max-w-sm relative overflow-hidden rounded-xl border border-zinc-700 bg-zinc-900 text-white shadow-xl
    hover:shadow-indigo-500/20 transition-all duration-300 ease-in-out transform hover:-translate-y-1 h-64
    flex flex-col
      ">

                    <div className="absolute inset-0 bg-gradient-to-br from-zinc-800/20 to-transparent pointer-events-none"></div>


                    <CardHeader className="p-6 pb-4 relative z-10">

                        <CardTitle className="text-2xl font-bold leading-tight tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-indigo-500">
                            Task Frequency
                        </CardTitle>

                        <CardDescription className="text-sm text-gray-400 mt-2 overflow-y-auto max-h-24 pr-1"
                            title="Add your Task Frequency Anytime">
                            Task Frequency defines how often a specific task or control should be performed within your organization. Setting appropriate frequencies ensures that important activities, such as audits, reviews, or maintenance, are carried out regularly and consistently. This helps maintain compliance, reduce risk, and improve operational efficiency by keeping all processes on track and up to date.
                        </CardDescription>
                    </CardHeader>


                    <CardContent className="p-6 pt-0 relative z-10">

                    </CardContent>


                    <CardFooter className="flex justify-end space-x-3 p-6 pt-0 relative z-10 mt-auto">

                        <Button
                            onClick={handleViewTaskFrequency}
                            variant="outline"
                            className="
              px-5 py-2 rounded-lg font-semibold transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-opacity-50
              border border-zinc-600 text-zinc-300 bg-zinc-800 hover:bg-zinc-700 hover:text-white shadow-sm transform hover:scale-105
            "
                        >
                            View
                        </Button>
                        <Button
                            onClick={handleEditTaskFrquency}
                            className="
              px-5 py-2 rounded-lg font-semibold transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-opacity-50
              bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg hover:from-blue-700 hover:to-indigo-700 transform hover:scale-105
            "
                        >
                            Edit
                        </Button>
                    </CardFooter>
                </Card>



                <Card className="
        w-full max-w-sm relative overflow-hidden rounded-xl border border-zinc-700 bg-zinc-900 text-white shadow-xl
    hover:shadow-indigo-500/20 transition-all duration-300 ease-in-out transform hover:-translate-y-1 h-64
    flex flex-col
      ">

                    <div className="absolute inset-0 bg-gradient-to-br from-zinc-800/20 to-transparent pointer-events-none"></div>


                    <CardHeader className="p-6 pb-4 relative z-10">

                        <CardTitle className="text-2xl font-bold leading-tight tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-indigo-500">
                            Domain
                        </CardTitle>

                        <CardDescription className="text-sm text-gray-400 mt-2 overflow-y-auto max-h-24 pr-1"
                            title="Add your Domain Anytime">
                            Here you can add whatever domain you want for the global organization
                        </CardDescription>
                    </CardHeader>


                    <CardContent className="p-6 pt-0 relative z-10">

                    </CardContent>


                    <CardFooter className="flex justify-end space-x-3 p-6 pt-0 relative z-10 mt-auto">

                        <Button
                            onClick={handleViewDomain}
                            variant="outline"
                            className="
              px-5 py-2 rounded-lg font-semibold transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-opacity-50
              border border-zinc-600 text-zinc-300 bg-zinc-800 hover:bg-zinc-700 hover:text-white shadow-sm transform hover:scale-105
            "
                        >
                            View
                        </Button>
                        <Button
                            onClick={handleEditDomain}
                            className="
              px-5 py-2 rounded-lg font-semibold transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-opacity-50
              bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg hover:from-blue-700 hover:to-indigo-700 transform hover:scale-105
            "
                        >
                            Edit
                        </Button>
                    </CardFooter>
                </Card>


                <RiskImpactEdit
                    open={impactModalOpen}
                    setOpen={setImpactModalOpen}
                    riskImpactData={riskImpactData}
                />

                <RiskImpactViewDataTable
                    open={impactViewModalOpen}
                    setOpen={setImpactViewModalOpen}
                    riskImpactData={riskImpactData}
                />

                <RiskCategoryEdit
                    open={categoryModalOpen}
                    setOpen={setCategoryModalOpen}
                    riskCategoryData={riskCategoryData}
                    profileData={profileData}
                />

                <RiskCategoryViewDataTable
                    open={categoryViewModalOpen}
                    setOpen={setCategoryViewModalOpen}
                    riskCategoryData={riskCategoryData}
                />

                <TaskFrequncyEdit
                    open={taskFrequencyOpen}
                    setOpen={setTaskFrequencyOpen}
                    taskFrquencyData={taskFrequencyData}
                    controlObjectiveData={controlObjectivesData}
                    profileData={profileData}
                />

                <TaskFrequencyViewDataTable
                    open={taskFrequencyViewOpen}
                    setOpen={setTaskFrequencyViewOpen}
                    taskFrquencyData={taskFrequencyData}
                    controlObjectiveData={controlObjectivesData}
                    profileData={profileData}
                />


                <DomainEdit
                    open={domainOpen}
                    setOpen={setDomainOpen}
                    domainData={domainData}
                    profileData={profileData}
                />


                <DomainViewDataTable
                    open={domainViewOpen}
                    setOpen={setDomainViewOpen}
                    domainData={domainData}
                />

            </div>
        </div>
    );
}