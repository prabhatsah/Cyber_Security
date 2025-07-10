"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/shadcn/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/shadcn/ui/tabs";
import { Button } from "@/shadcn/ui/button";
import { Input } from "@/shadcn/ui/input";
import { RadioGroup, RadioGroupItem } from "@/shadcn/ui/radio-group";
import {
    LayoutGrid,
    FileText,
    AlertTriangle,
    Gauge,
    Shield,
    Lock,
    FileLock2,
    Server,
    Timer,
    ArrowUp,
    ArrowDown,
    Star,
    Building2,
    Users,
    Info,
    BadgeCheckIcon,
    Clock,
} from "lucide-react";

import { Badge } from "@/shadcn/ui/badge";
import { Progress } from "@/shadcn/ui/progress";

import { Framework } from "./page";
import ResponsibilityMatrixTable from "./responsibility-matrix-table";


export default function EligibleMatrixFramework({
    allUsers,
    frameworks
}: {
    allUsers: { value: string, label: string }[];
    frameworks: Framework[];
}
) {
    console.log(frameworks);
    const [matrixDialogOpen, setMatrixDialogOpen] = useState(false);
    const [selectedFramework, setSelectedFramework] = useState<Framework | null>(null);



    const viewFramework = (id: string) => {
        const selected = frameworks.find((framework) => framework.id === id) || null;
        setSelectedFramework(selected);
        setMatrixDialogOpen(true);
    }

    useEffect(() => {
        if (selectedFramework && frameworks) {
            // Find the updated version of the selected framework from the new `frameworks` prop
            const updatedSelected = frameworks.find(fw => fw.id === selectedFramework.id);
            if (updatedSelected) {
                console.log("Updating selectedFramework with latest data.");
                setSelectedFramework(updatedSelected);
            }
        }
    }, [frameworks, selectedFramework]);



    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
            },
        },
    };

    const item = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 },
    };

    const renderFrameworkCard = (fw) => (
        <motion.div key={fw.id} variants={item}>
            <Card className="bg-zinc-900 text-white border border-zinc-800">
                <CardContent className="p-4 space-y-3 h-full flex flex-col justify-between">
                    {/* Header */}
                    <div className="flex justify-between items-start">
                        <div className="flex items-center space-x-3">

                            <div>
                                <p className="font-semibold text-xl">{fw.title}</p>
                                <div className="flex">

                                    <Badge
                                        variant={fw.status === "published" ? "success" : fw.status === "draft" ? "warning" : "info"}
                                        className="w-fit"
                                    >
                                        {fw.status.charAt(0).toUpperCase() + fw.status.slice(1)}
                                    </Badge>
                                </div>
                            </div>

                        </div>


                    </div>

                    {/* Description */}
                    <p className="text-xs text-muted-foreground pt-2 line-clamp-2">
                        {fw.description}
                    </p>



                    {/* Actions */}
                    <div className="flex justify-between items-center text-xs pt-2">
                        <div className="flex items-center gap-2 truncate min-w-0">
                            <Timer className="w-3 h-3 flex-shrink-0" />
                            <span className="truncate">Last used Yesterday</span>
                        </div>

                        <div className="flex gap-1">

                            <Button
                                variant="outline"
                                size="sm"
                                className="h-7 px-2 text-xs"
                                onClick={() => viewFramework(fw.id)}
                            >
                                Edit
                            </Button>
                        </div>

                    </div>
                </CardContent>
            </Card>
        </motion.div>
    );

    const [customAlertVisible, setCustomAlertVisible] = useState<boolean>(false);
    const [openFramework, setOpenFramework] = useState(false);
    const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
    const [selectedOption, setSelectedOption] = useState("edit");
    const handleContinue = () => {
        if (selectedOption === "scratch") {
            setOpenFramework(true);
        } else {
            setUploadDialogOpen(true);
        }
        setCustomAlertVisible(false);
    };
    return (
        <div className="p-2 space-y-6">


            {/* Frameworks Section */}
            <div className="space-y-4">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight mb-2">
                            Responsibilty Matrix Frameworks
                        </h2>
                        <p className="mb-2 text-sm text-muted-foreground">A hierarchical table displaying and editing responsibility matrix entries with detailed fields and parent-child relationships.</p>
                    </div>
                </div>

                <motion.div
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
                    variants={container}
                    initial="hidden"
                    animate="show"
                >
                    {frameworks.map(renderFrameworkCard)}
                </motion.div>

            </div>

            {selectedFramework && (
                <ResponsibilityMatrixTable
                    open={matrixDialogOpen}
                    setOpen={setMatrixDialogOpen}
                    entries={Object.values(selectedFramework.entries)}
                    frameworkId={selectedFramework.id}
                    profileData={[]}
                />
            )}

        </div>
    );
}
