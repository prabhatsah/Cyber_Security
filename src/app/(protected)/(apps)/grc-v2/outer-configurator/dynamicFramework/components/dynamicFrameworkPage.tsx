"use client";
import { useState } from "react";
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
    Link2,
} from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/shadcn/ui/avatar";
import { Badge } from "@/shadcn/ui/badge";
import { Progress } from "@/shadcn/ui/progress";
import { redirect, useRouter } from "next/navigation";
import { Label } from "@/shadcn/ui/label";
import KBContextProvider from "../../../[framework]/(context)/KnowledgeBaseContext";

// import FrameworkCreationForm from "../../../[framework]/compliance/frameworks/components/frameworkCreationForm";
import { Framework } from "../page";
import CustomFrameworkCreationForm from "./customFrameworkCreationForm";
import { getMyInstancesV2, invokeAction } from "@/ikon/utils/api/processRuntimeService";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@/shadcn/ui/drawer";
import { format } from "date-fns";
import { SAVE_DATE_FORMAT_GRC, SAVE_DATE_TIME_FORMAT_GRC } from "@/ikon/utils/config/const";
import { CustomBadge } from "@/shadcn/ui/custom-badge";
import { getProfileData } from "@/ikon/utils/actions/auth";
import UploadComponent from "../../../[framework]/[clientId]/policynew/_components/UploadSectionPolicy";
import FrameworkTab from "./frameworkTab";
import PublishTable from "./publishTable";
import MultipleFrameworkMappingInputForm from "../../framework-mapping/MultipleFrameworkMappingInputForm";



export default function DynamicFrameworkPage({
    allUsers,
    frameworks,
    frameworkMappingData,
    publishedFrameworkData
}: {
    allUsers: { value: string, label: string }[];
    frameworks: Framework[];
    frameworkMappingData:Record<string,any>[],
    publishedFrameworkData:Record<string,any>[]
}
) {
    console.log(frameworks);
    const [search, setSearch] = useState("");
    const [activeTab, setActiveTab] = useState("all");
    const [selectedFramework, setSelectedFramework] = useState<Framework | null>(null);
    const [editDraftFramework, setEditDraftFramework] = useState<boolean>(false);
    const [activeView, setActiveView] = useState<'client' | 'customer'>('client');
    const [viewPublished, setViewPublished] = useState<boolean>(false);
    const [viewPublishedData, setViewPublishedData] = useState<Framework | null>(null);
    const [viewReview, setViewReivew] = useState<boolean>(false);
    const [viewReviewData, setViewReviewData] = useState<Framework | null>(null);
    const [viewActivityLogData, setViewActivityLogData] = useState<{ createBy: string, createdAt: string, message: string }[]>([]);
    const [openActivityLogs, setOpenActivityLogs] = useState(false);


    const [isMappingOpen, setIsMappingOpen] = useState(false);
    const [selectedMappingId, setSelectedMappingId] = useState<string | null>(null);

    const router = useRouter();
    // Filters
    const filtered = frameworks.filter(
        (f) =>
            f.title.toLowerCase().includes(search.toLowerCase()) ||
            f.category.toLowerCase().includes(search.toLowerCase()) ||
            f.tags.some((tag) => tag.toLowerCase().includes(search.toLowerCase()))
    );

    const publishedFrameworks = frameworks.filter(
        (f) => f.status === "published"
    );
    const draftFrameworks = frameworks.filter((f) => f.status === "draft");
    const favoriteFrameworks = frameworks.filter((f) => f.isFavorite);
    const reviewFrameworks = frameworks.filter((f) => f.status === "review");

    const toggleFavorite = async (id: string) => {
        // setFrameworks(
        //     frameworks.map((f) =>
        //         f.id === id ? { ...f, isFavorite: !f.isFavorite } : f
        //     )
        // );

        const selected = frameworks.find((framework) => framework.id === id) || null;
        if (selected) {
            selected.isFavorite = !selected.isFavorite;
            if (selected.status === 'draft') {
                const frameworkInstance = await getMyInstancesV2({
                    processName: "Framework Processes",
                    predefinedFilters: { taskName: "Saved as Draft" },
                    mongoWhereClause: `this.Data.id == '${selected.id}'`
                })
                const taskId = frameworkInstance[0]?.taskId;
                await invokeAction({
                    taskId: taskId,
                    data: selected,
                    transitionName: "Save Draft",
                    processInstanceIdentifierField: "id"
                })
            } else if (selected.status === 'published') {
                const frameworkInstance = await getMyInstancesV2({
                    processName: "Framework Processes",
                    predefinedFilters: { taskName: "Publish" },
                    mongoWhereClause: `this.Data.id == '${selected.id}'`
                })
                const taskId = frameworkInstance[0]?.taskId;
                await invokeAction({
                    taskId: taskId,
                    data: selected,
                    transitionName: "Save publish",
                    processInstanceIdentifierField: "id"
                })
            }
            router.refresh();
        }

    };

    // const publishFramework = (id) => {
    //     setFrameworks(
    //         frameworks.map((f) =>
    //             f.id === id
    //                 ? {
    //                     ...f,
    //                     status: "published",
    //                     publishedAt: new Date().toISOString(),
    //                 }
    //                 : f
    //         )
    //     );
    // };

    const editFramework = (id: string) => {
        const selected = frameworks.find((framework) => framework.id === id) || null;
        setSelectedFramework(selected);
        setEditDraftFramework(true);
    };

    const reviewFramework = (id: string) => {
        const selected = frameworks.find((framework) => framework.id === id) || null;
        setViewReviewData(selected);
        setViewReivew(true);
    };


    const viewFramework = (id: string) => {
        const selected = frameworks.find((framework) => framework.id === id) || null;
        console.log(selected);
        setViewPublishedData(selected);
        setViewPublished(true);
    }

    const viewActivityLog = (id: string) => {
        const selected = frameworks.find((framework) => framework.id === id)?.activityLog || [] || null;
        console.log(selected)
        setViewActivityLogData(selected);
        setOpenActivityLogs(true);
    }

    const openMapping = (id: string) => {
        console.log(id);
        setSelectedMappingId(id);
        setIsMappingOpen(true);

    }

    const handleSaveMappings = (data: Record<string, any>[]) => {
        // handle the saved mappings here
        console.log("Mappings saved:", data);
        // ...your logic...
    };


    const revertFramework = async (id: string) => {
        const userDetails = await getProfileData();
        const baseLog = {
            createBy: userDetails.USER_NAME,
            createdAt: new Date().toISOString(),
            message: "Update"
        };
        const selected = frameworks.find((framework) => framework.id === id) || null;
        if (selected) {
            const previousLog = selected?.activityLog || [];
            selected.status = 'draft';
            selected.activityLog = [...previousLog, baseLog]
            console.log(selected);

            const frameworkInstance = await getMyInstancesV2({
                processName: "Framework Processes",
                predefinedFilters: { taskName: "Publish" },
                mongoWhereClause: `this.Data.id == '${selected.id}'`
            })

            const taskId = frameworkInstance[0]?.taskId;

            await invokeAction({
                taskId: taskId,
                data: selected,
                transitionName: "Back to Draft",
                processInstanceIdentifierField: "id"
            })

            router.refresh();
        }
    };

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
                            {/* <div className={`p-2 rounded-md bg-zinc-800 ${fw.color}`}>
                                {fw.icon}
                            </div> */}
                            <div>
                                <p className="font-semibold text-xl">{fw.title}</p>
                                <div className="flex">
                                    {/* <p className="text-xs text-muted-foreground mt-2">
                                        {fw.category}
                                    </p> */}
                                    <Badge
                                        variant={fw.status === "published" ? "success" : fw.status === "draft" ? "warning" : "info"}
                                        className="w-fit"
                                    >
                                        {fw.status.charAt(0).toUpperCase() + fw.status.slice(1)}
                                    </Badge>
                                </div>
                            </div>
                            {/* Status Badge */}
                        </div>

                        <div className="flex flex-row gap-3">
                            <button onClick={() => openMapping(fw.id)}>
                                <Link2 className="h-4 w-4" />
                            </button>
                            <button onClick={() => viewActivityLog(fw.id)}>
                                <Clock className="h-4 w-4" />
                            </button>
                            <button onClick={() => toggleFavorite(fw.id)}>
                                <Star
                                    className={`h-4 w-4 ${fw.isFavorite ? "fill-yellow-400 text-yellow-400" : ""
                                        }`}
                                />
                            </button>
                        </div>

                    </div>

                    {/* Description */}
                    <p className="text-xs text-muted-foreground pt-2 line-clamp-2">
                        {fw.description}
                    </p>

                    {/* Stats */}
                    {/* <div className="grid grid-cols-2 gap-x-4 text-xs">
                        <div className="font-semibold text-muted-foreground">Controls</div>
                        <div className="font-semibold text-muted-foreground">Policies</div>
                        <div className="text-white">{fw.controls}</div>
                        <div className="text-white">{fw.policies}</div>
                    </div> */}

                    {/* Compliance Score */}
                    <div className="text-xs flex justify-between">
                        <span>Compliance</span>
                        <span className="font-bold text-white">Score {fw.score}%</span>
                    </div>
                    <Progress
                        value={fw.score}
                        className="h-2"
                        indicatorColor={
                            fw.score >= 90 ? "#42a542" : fw.score >= 80 ? "yellow" : "orange"
                        }
                    />

                    {/* Tags */}
                    {/* <div className="flex flex-wrap gap-1 pt-1">
                        {fw.tags.map((tag, i) => (
                            <Badge variant="secondary" key={i}>
                                {tag}
                            </Badge>
                        ))}
                    </div> */}

                    {/* Owners */}
                    {/* <div className="flex items-center gap-2 pt-2">
                        {fw?.owners.slice(0, 2).map((owner, index) => {
                            const ownerName = owner.length ? allUsers.find(u => u.value === owner)?.label || owner : '';
                            return (
                                <Avatar key={owner?.id || index} className="h-6 w-6" title={ownerName}>
                                    <AvatarImage src={owner.avatar} alt={ownerName} />
                                    <AvatarFallback>
                                        {ownerName
                                            .split(" ")
                                            .map((n) => n[0])
                                            .join("")}
                                    </AvatarFallback>
                                </Avatar>
                            )
                        })}
                    </div> */}

                    {/* Actions */}
                    <div className="flex justify-between items-center text-xs pt-2">
                        <div className="flex items-center gap-2 truncate min-w-0">
                            <Timer className="w-3 h-3 flex-shrink-0" />
                            <span className="truncate">Last used Yesterday</span>
                        </div>
                        {fw.status === "draft" ? (
                            <div className="flex gap-1">
                                {/* <Button
                                    variant="outline"
                                    size="sm"
                                    className="h-7 px-2 text-xs"
                                >
                                    Preview
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="h-7 px-2 text-xs"
                                    onClick={() => publishFramework(fw.id)}
                                >
                                    Publish
                                </Button> */}
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="h-7 px-2 text-xs"
                                    onClick={() => editFramework(fw.id)}
                                >
                                    Edit
                                </Button>
                            </div>
                        ) :
                            fw.status === 'review' ? (
                                <div className="flex gap-1">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="h-7 px-2 text-xs"
                                        onClick={() => reviewFramework(fw.id)}
                                    >
                                        Review
                                    </Button>
                                </div>
                            ) :
                                (
                                    <div className="flex gap-1">
                                        {/* <Button
                                            variant="outline"
                                            size="sm"
                                            className="h-7 px-2 text-xs"
                                            onClick={() => revertFramework(fw.id)}
                                        >
                                            Update
                                        </Button> */}
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="h-7 px-2 text-xs"
                                            onClick={() => viewFramework(fw.id)}
                                        >
                                            View
                                        </Button>
                                    </div>
                                )}
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    );

    const [customAlertVisible, setCustomAlertVisible] = useState<boolean>(false);
    const [openFramework, setOpenFramework] = useState<boolean>(false);
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
            {/* Dashboard Header */}
            {/* <div className="space-y-2">
                <h1 className="text-2xl font-bold">Dashboard</h1>
                <p className="text-muted-foreground">
                    This is a centralized platform for Governance, Risk, and Compliance management.
                </p>
            </div> */}

            {/* Metrics Cards */}
            {/* <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {dashboardMetrics.map((metric, index) => (
                    <Card
                        key={index}
                        className="bg-zinc-900 text-white border border-zinc-800"
                    >
                        <CardContent className="p-4">
                            <div className="flex justify-between">
                                <div className={`p-2 rounded-lg ${metric.iconBg}`}>
                                    {metric.icon}
                                </div>
                                <div
                                    className={`flex items-center text-xs ${metric.isPositive ? "text-green-500" : "text-red-500"
                                        }`}
                                >
                                    {metric.isPositive ? (
                                        <ArrowUp size={14} />
                                    ) : (
                                        <ArrowDown size={14} />
                                    )}
                                    <span className="ml-1">{metric.change}</span>
                                </div>
                            </div>
                            <div className="mt-4">
                                <p className="text-sm text-muted-foreground">{metric.title}</p>
                                <p className="text-2xl font-bold mt-1">{metric.value}</p>
                                <p className="text-xs text-muted-foreground mt-2">
                                    {metric.description}
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div> */}

            {/* Frameworks Section */}
            <div className="space-y-4">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                        <h2 className="text-2xl font-semibold tracking-tight">
                            Frameworks
                        </h2>
                        <p className="text-sm text-muted-foreground">
                            Select a framework to view and configure
                        </p>
                    </div>
                    <div className="flex items-center gap-4 w-full md:w-auto">
                        <Input
                            placeholder="Search frameworks..."
                            className="h-9"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                        {/* <Button onClick={() => setCustomAlertVisible(true)}>
                            Add New Framework
                        </Button> */}
                        <Button onClick={() => setOpenFramework(true)}>
                            Add New Framework
                        </Button>
                        {/* <Button
                            onClick={() =>
                            // router.push(
                            //   /grc-v2/fef2a63e-1c61-4342-a266-e3d983679d61/home
                            // )
                            {
                                redirect('grc-v2/outer-configurator/frameworks');
                            }
                            }
                        >
                            Configurator
                        </Button> */}
                    </div>
                </div>

                {/* Tabs */}
                <Tabs defaultValue="all" onValueChange={setActiveTab}>
                    <TabsList className="grid w-full grid-cols-5 mb-4">
                        <TabsTrigger value="all">All</TabsTrigger>
                        <TabsTrigger value="published">Published</TabsTrigger>
                        <TabsTrigger value="drafts">Drafts</TabsTrigger>
                        <TabsTrigger value="review">Review</TabsTrigger>
                        <TabsTrigger value="favorites">Favorites</TabsTrigger>
                    </TabsList>

                    <div className="h-[65vh] md:h-[75vh] overflow-y-auto">
                        {/* Tab Content - All */}
                        <TabsContent value="all">
                            <motion.div
                                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
                                variants={container}
                                initial="hidden"
                                animate="show"
                            >
                                {filtered.map(renderFrameworkCard)}
                            </motion.div>
                        </TabsContent>

                        {/* Tab Content - Published */}
                        <TabsContent value="published">
                            <motion.div
                                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
                                variants={container}
                                initial="hidden"
                                animate="show"
                            >
                                {publishedFrameworks.map(renderFrameworkCard)}
                            </motion.div>
                        </TabsContent>

                        {/* Tab Content - Drafts */}
                        <TabsContent value="drafts">
                            <motion.div
                                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
                                variants={container}
                                initial="hidden"
                                animate="show"
                            >
                                {draftFrameworks.map(renderFrameworkCard)}
                            </motion.div>
                        </TabsContent>

                        {/* Tab Content - Recent */}
                        <TabsContent value="review">
                            {reviewFrameworks.length > 0 ? (
                                <motion.div
                                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
                                    variants={container}
                                    initial="hidden"
                                    animate="show"
                                >
                                    {reviewFrameworks.map(renderFrameworkCard)}
                                </motion.div>
                            ) : (
                                <div className="flex flex-col items-center justify-center p-8 text-center">
                                    <p className="text-muted-foreground">
                                        You don't have any Reaview Framework as of now.
                                    </p>
                                </div>
                            )}
                        </TabsContent>

                        {/* Tab Content - Favorites */}
                        <TabsContent value="favorites">
                            {favoriteFrameworks.length > 0 ? (
                                <motion.div
                                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
                                    variants={container}
                                    initial="hidden"
                                    animate="show"
                                >
                                    {favoriteFrameworks.map(renderFrameworkCard)}
                                </motion.div>
                            ) : (
                                <div className="flex flex-col items-center justify-center p-8 text-center">
                                    <p className="text-muted-foreground">
                                        You dont have any favorite frameworks yet.
                                    </p>
                                </div>
                            )}
                        </TabsContent>
                    </div>
                </Tabs>
            </div>

            {customAlertVisible && (
                <div className="fixed inset-0 bg-gray-900/70  flex items-center justify-center z-50 p-4">
                    <div className="relative bg-zinc-900 border border-zinc-700 p-10 rounded-2xl w-full max-w-md shadow-2xl shadow-zinc-800/50 text-white transform transition-all duration-500 ease-out scale-100 opacity-100">
                        <div className="mb-10">
                            <h3
                                id="choose-framework-title"
                                className="text-3xl font-extrabold text-center text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-indigo-500 tracking-tight drop-shadow-md"
                            >
                                Choose how to add a new framework
                            </h3>
                            <p className="text-base text-gray-400 text-center mt-3">
                                Select an option to proceed for adding a new framework.
                            </p>
                        </div>

                        <RadioGroup
                            value={selectedOption}
                            onValueChange={setSelectedOption}
                            className="space-y-5 mb-8"
                        >
                            <div
                                className={`
              flex items-center space-x-4 rounded-xl px-6 py-4 border transition-all duration-200 ease-in-out shadow-md cursor-pointer
              bg-zinc-800/70 hover:bg-zinc-700/50
              ${selectedOption === "edit"
                                        ? "border-indigo-500 ring-2 ring-indigo-500/50"
                                        : "border-zinc-700"
                                    }
            `}
                                onClick={() => setSelectedOption("edit")}
                            >
                                <RadioGroupItem value="edit" id="edit" />
                                <Label
                                    htmlFor="edit"
                                    className="cursor-pointer text-lg font-medium text-zinc-100"
                                >
                                    Upload from a file
                                </Label>
                            </div>

                            <div
                                className={`
              flex items-center space-x-4 rounded-xl px-6 py-4 border transition-all duration-200 ease-in-out shadow-md cursor-pointer
              bg-zinc-800/70 hover:bg-zinc-700/50
              ${selectedOption === "scratch"
                                        ? "border-indigo-500 ring-2 ring-indigo-500/50"
                                        : "border-zinc-700"
                                    }
            `}
                                onClick={() => setSelectedOption("scratch")}
                            >
                                <RadioGroupItem value="scratch" id="scratch" />
                                <Label
                                    htmlFor="scratch"
                                    className="cursor-pointer text-lg font-medium text-zinc-100"
                                >
                                    Enter details manually
                                </Label>
                            </div>
                        </RadioGroup>

                        <div className="flex justify-end space-x-4 mt-10">
                            <Button
                                variant="outline"
                                onClick={() => setCustomAlertVisible(false)}
                                className="
              px-5 py-2 rounded-lg font-semibold transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-opacity-50
              bg-gradient-to-r to-indigo-600 text-white shadow-lg hover:from-blue-700 hover:to-indigo-700 transform hover:scale-105
            "
                            >
                                Cancel
                            </Button>
                            <Button
                                onClick={handleContinue}
                                className="
              px-5 py-2 rounded-lg font-semibold transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-opacity-50
              bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg hover:from-blue-700 hover:to-indigo-700 transform hover:scale-105
            "
                            >
                                Proceed
                            </Button>
                        </div>
                    </div>
                </div>
            )}


            {/* <UploadComponent
                uploadDialogOpen={uploadDialogOpen}
                setUploadDialogOpen={setUploadDialogOpen}
                allUsers={null}
            /> */}

            {openFramework && (
                //   <FrameworkCreationForm
                //     open={openFramework}
                //     setOpen={setOpenFramework}
                //     userMap={null}
                //     frameworkDraftData={null}
                //   />

                <FrameworkTab openFrameworkTab={openFramework} setOpenFrameworkTab={setOpenFramework} />
            )}

            {
                viewPublishedData && viewPublished && (
                    <PublishTable selectedCard={viewPublishedData} openPublishView={viewPublished} setOpenPublishView={setViewPublished} />
                )
            }

            {
                editDraftFramework && (
                    <FrameworkTab openFrameworkTab={editDraftFramework} setOpenFrameworkTab={setEditDraftFramework} selectedFramework={selectedFramework} />
                )
            }
            {/* 
            {
                viewPublished && (
                    <CustomFrameworkCreationForm open={viewPublished} setOpen={setViewPublished} allUsers={allUsers} viewselectedFramework={viewPublishedData} />
                )
            }

            {
                viewReview && (
                    <CustomFrameworkCreationForm open={viewReview} setOpen={setViewReivew} allUsers={allUsers} reviewselectedFramework={viewReviewData} />
                )
            } */}


            {
                openActivityLogs && (
                    <Drawer
                        open={openActivityLogs}
                        onOpenChange={setOpenActivityLogs}
                        direction="right"
                    >
                        <DrawerContent className="h-full w-[400px] ml-auto rounded-l-lg">
                            <DrawerHeader className="text-left">
                                <DrawerTitle>Activity Logs</DrawerTitle>
                            </DrawerHeader>
                            <div className="p-4 overflow-y-auto">
                                {viewActivityLogData.length ? (
                                    <div className="space-y-6">
                                        {viewActivityLogData.map((log, index) => (
                                            <div
                                                key={index}
                                                className="border-l-2 border-blue-500 pl-4 py-2"
                                            >
                                                <div className="flex justify-between items-start">
                                                    <div>
                                                        <p className="text-sm text-muted-foreground">
                                                            {format(log.createdAt, SAVE_DATE_TIME_FORMAT_GRC)}
                                                        </p>
                                                    </div>
                                                    <CustomBadge
                                                        label={log.createBy}
                                                        bgColor="#e9d85e"
                                                        txtColor="#100101"
                                                    />
                                                </div>
                                                <div className="mt-2">
                                                    <p className="text-sm">
                                                        <span className="font-medium">Remarks:</span>{" "}
                                                        {log.message}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center text-muted-foreground py-8">
                                        No activity logs available
                                    </div>
                                )}
                            </div>
                        </DrawerContent>
                    </Drawer>
                )

            }

            {isMappingOpen && (
                <MultipleFrameworkMappingInputForm
                    onSaveMappings={handleSaveMappings}
                    isOpen={isMappingOpen}
                    setIsOpen={setIsMappingOpen}
                    frameworkMappingData={frameworkMappingData}
                    frameworkDetailsData={frameworks}
                    selectedIdForMapping={selectedMappingId}
                // You can also pass selectedMappingId as a prop if needed
                />
            )}

        </div>


    );
}
