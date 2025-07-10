import { use, useEffect, useMemo, useState } from "react";
import { X, ClipboardList, Copy } from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/shadcn/ui/dialog";
import ControlPolicyNameCard from "./controlPolicyNameComponent";
import ControlObjectiveNameCard from "./controlObjectiveComponent";
import { Button } from "@/shadcn/ui/button";
import { RefreshCw, Search } from "lucide-react";
import { Input } from "@/shadcn/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/shadcn/ui/select";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { updatePolicy } from "../../(backend-calls)";
import router from "next/router";
import { getMyInstancesV2, invokeAction } from "@/ikon/utils/api/processRuntimeService";
import { Alert, AlertDescription } from "@/shadcn/ui/alert";




interface PolicyControlsDialogProps {
    editdata: {
        policyName?: string;
        compliant?: string;
        controls: Array<{
            policyId: string | number;
            controlName: string;
            controlWeight: string | number;
            controlObjectives: Array<{
                controlObjId: string | number;
                name: string;
                controlObjweight: string | number;
                description: string;
            }>;
        }>;
    };
    setOpenEditForm: (open: boolean) => void;
    openEditForm: boolean;
    isCentralAdminUser: boolean;

}

const PolicyControlsDialog: React.FC<PolicyControlsDialogProps> = ({ editdata, setOpenEditForm, openEditForm, isCentralAdminUser, onPolicyDataUpdate }) => {
    // const [openEditForm, setOpenEditForm] = useState(false);
    const router = useRouter();
    const [data, setData] = useState([]);
    const [selectedControl, setSelectedControl] = useState(null);

    // Filter states
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState<string | undefined>(undefined);
    const [practiceFilter, setPracticeFilter] = useState<string | undefined>(undefined);
    const [proceduralFilter, setProceduralFilter] = useState<string | undefined>(undefined);

    const practiceAreas = [
        "Audit and Reporting", "Governance", "Banking Governance", "Communications",
        "Content and Records", "Governance and Risk Mgmt", "Risk Assessment and Management",
        "Compliance Management", "IT Security", "Operational Risk", "Business Continuity",
        "Policy Management", "Regulatory Compliance", "Cybersecurity", "Data Privacy",
        "Vendor Risk Management", "Access Control", "Incident Response",
        "Third-Party Governance", "Enterprise Risk Management", "Legal and Regulatory Affairs",
        "Internal Controls", "Ethics and Integrity", "Physical Security",
        "Training and Awareness", "Fraud Detection and Prevention", "Health, Safety & Environment (HSE)",
        "Change Management", "Cloud Governance", "Financial Controls",
    ];

    // Set the first control as selected when the dialog opens
    // useEffect(() => {
    //     if (openEditForm && data.controls && data.controls.length > 0) {
    //         setSelectedControl(data.controls[0]);
    //     }
    // }, [openEditForm, data.controls]);

    // useEffect(() => {

    // }, []);
    useEffect(() => {
        setData(editdata);
    }, [editdata]);

    useEffect(() => {
        if (!openEditForm) {
            setOpenEditForm(false);
            setSelectedControl(null);
            setSearchTerm("");
            setStatusFilter(undefined);
            setPracticeFilter(undefined);
            setProceduralFilter(undefined);
        }
    }, [openEditForm]);

    const openDialog = () => setOpenEditForm(true);
    const closeDialog = () => {
        setOpenEditForm(false);
        setSelectedControl(null);
        // Reset filters when closing the dialog
        setSearchTerm("");
        setStatusFilter(undefined);
        setPracticeFilter(undefined);
        setProceduralFilter(undefined);
    };

    const handleControlClick = (control) => {
        setSelectedControl(control);
    };

    // Function to update an objective's data
    const handleObjectiveUpdate = (
        controlId: string | number,
        objectiveId: string | number,
        updates: Partial<any>,
    ) => {
        console.log(data);
        const updatedControls = data.controls.map((control) => {
            if (control.policyId === controlId) {
                const newControlData = {
                    ...control,
                    controlObjectives: control.controlObjectives.map((objective) =>
                        objective.controlObjId === objectiveId
                            ? { ...objective, ...updates }
                            : objective
                    ),
                };


                setSelectedControl(newControlData)
                return newControlData;


            }
            return control;
        });

        // In a real application, you'd update your data source here (e.g., API call)
        // For this simulation, we'll just log and assume data is immutable
        // If 'data' was a state variable, you'd update it here.
        console.log("Updated objective:", { controlId, objectiveId, updates });
        setData((prev) => ({ ...prev, controls: updatedControls }));
        // If data was mutable state: setData(prevData => ({ ...prevData, controls: updatedControls }));
    };


    // Filter objectives based on current filters
    const filteredObjectives = useMemo(() => {
        if (!selectedControl) return [];

        return selectedControl.controlObjectives
            .filter((objective) => {
                const matchesSearch =
                    !searchTerm ||
                    objective.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    objective.controlObjId.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
                    objective.description.toLowerCase().includes(searchTerm.toLowerCase());

                const matchesStatus = !statusFilter || editdata.compliant === statusFilter;
                const matchesPractice = !practiceFilter || objective.practiceAreas === practiceFilter;
                const matchesProcedural = !proceduralFilter || objective.controlObjType === proceduralFilter;

                return matchesSearch && matchesStatus && matchesPractice && matchesProcedural;
            })
            .map((objective) => ({
                ...objective,
                policyId: selectedControl.policyId, // Attach policyId to each objective
            }));
    }, [selectedControl, searchTerm, statusFilter, practiceFilter, proceduralFilter, editdata.compliant]);

    async function handleUpdate() {
        try {
            console.log("Updated data:", data);

            const controlPolicyInstances = await getMyInstancesV2({
                processName: "Control Objectives",
                predefinedFilters: { taskName: "edit control objective" },
                mongoWhereClause: `this.Data.frameworkId == "${data.frameworkId}"`,
            });


            console.log("Control Policy Instances:", controlPolicyInstances);
            const taskId = controlPolicyInstances[0]?.taskId;
            console.log("Task ID:", taskId);

            await invokeAction({
                taskId: taskId,
                data: data,
                transitionName: 'update edit controlObj',
                processInstanceIdentifierField: 'frameworkId',
            });

            setOpenEditForm(false);
            toast.success("Successfully Updated!", { duration: 2000 });
            router.push("/grc/knowledge-base");
            router.refresh(); // optional: can be removed if `push` reloads everything already
        } catch (error) {
            toast.error("Failed to Update!", { duration: 2000 });
            console.error("Failed to update policy:", error);
            // Optionally show a toast or alert here
        }
    }



    return (
        <Dialog open={openEditForm} onOpenChange={setOpenEditForm} >
            <DialogContent className="!max-w-none !w-screen !h-screen p-0 overflow-hidden flex flex-col gap-2">
                <DialogHeader className="border-b p-6">
                    <div className="grid grid-cols-[5fr_7fr] items-center">
                        <div className="flex items-center gap-3 "> {/* Added mb-4 for spacing */}
                            <Copy className="h-6 w-6" />
                            <div>
                                <DialogTitle className="text-xl">
                                    {data.policyName || "Policy Details"}
                                </DialogTitle>
                                <DialogDescription>Review and edit the control objectives</DialogDescription>
                            </div>
                        </div>

                        <div className="ml-11">
                            <div className="flex flex-col sm:flex-row gap-2">
                                <div className="relative">
                                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
                                    <Input
                                        type="text"
                                        placeholder="Filter lines..."
                                        className="pl-8"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </div>
                                <Select
                                    value={statusFilter}
                                    onValueChange={(value) => setStatusFilter(value === "all" ? undefined : value)}
                                >
                                    <SelectTrigger className="w-full sm:w-[180px]">
                                        <SelectValue placeholder="All statuses" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All statuses</SelectItem>
                                        <SelectItem value="implemented">Implemented</SelectItem>
                                        <SelectItem value="partial">Partially Implemented</SelectItem>
                                        <SelectItem value="notImplemented">Not Implemented</SelectItem>
                                        <SelectItem value="not-applicable">Not Applicable</SelectItem>
                                    </SelectContent>
                                </Select>
                                <Select
                                    value={practiceFilter}
                                    onValueChange={(value) => setPracticeFilter(value === "all" ? undefined : value)}
                                >
                                    <SelectTrigger className="w-full sm:w-[180px]">
                                        <SelectValue placeholder="All practices" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Practices</SelectItem>
                                        {practiceAreas.map((area) => (
                                            <SelectItem key={area} value={area}>
                                                {area}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <Select
                                    value={proceduralFilter}
                                    onValueChange={(value) => setProceduralFilter(value === "all" ? undefined : value)}
                                >
                                    <SelectTrigger className="w-full sm:w-[190px]">
                                        <SelectValue placeholder="All Procedural Types" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Procedural Types</SelectItem>
                                        <SelectItem value="Operational">Operational</SelectItem>
                                        <SelectItem value="Managerial">Managerial</SelectItem>
                                        <SelectItem value="Technical">Technical</SelectItem>
                                    </SelectContent>
                                </Select>
                                <Button
                                    variant="outline"
                                    onClick={() => {
                                        setSearchTerm("");
                                        setStatusFilter(undefined);
                                        setPracticeFilter(undefined);
                                        setProceduralFilter(undefined);
                                    }}
                                    className="sm:w-auto"
                                >
                                    <RefreshCw className="h-4 w-4 mr-2" />
                                    Reset
                                </Button>
                            </div>
                        </div>
                    </div>
                </DialogHeader>

                {/* Dialog Body: Two-column layout */}
                <div className="flex flex-1 overflow-hidden">
                    {/* Left Column: Control Policies (Sidebar) */}
                    <div className="w-1/4 p-2 border-r border-gray-700 overflow-y-auto custom-scrollbar">
                        {/* Removed the "Controls" heading as it's now visually part of the filter section */}
                        {editdata?.controls?.map((control) => (
                            <ControlPolicyNameCard
                                key={control.policyId}
                                indexNumber={control.policyId}
                                title={control.controlName}
                                rightNumber={control.controlObjectives.length}
                                weight={control.controlWeight}
                                onClick={() => handleControlClick(control)}
                                isSelected={selectedControl && selectedControl.policyId === control.policyId}
                            />
                        ))}
                    </div>

                    {/* Right Column: Control Objectives */}
                    <div className="flex-1 p-4 overflow-y-auto custom-scrollbar">
                        {selectedControl ? (
                            <>
                                {filteredObjectives.length > 0 ? (
                                    filteredObjectives.map((objective) => (
                                        <ControlObjectiveNameCard
                                            key={objective.controlObjId}
                                            title={objective.name}
                                            status={data.compliant || ""} // Use the top-level compliant status
                                            weight={objective.controlObjweight}
                                            description={objective.description}
                                            controlObjType={objective.controlObjType}
                                            practiceAreas={objective.practiceAreas}
                                            objective={objective}
                                            onObjectiveUpdate={handleObjectiveUpdate} // Pass the update handler
                                            isCentralAdminUser={isCentralAdminUser}
                                            practiceAreasOptions={practiceAreas} // Pass the options to the child
                                        />
                                    ))
                                ) : (
                                    <p className="text-gray-400 text-center mt-20">
                                        No objectives match the current filters for this control.
                                    </p>
                                )}
                            </>
                        ) : (
                            // <p className="text-gray-400 text-center mt-20">
                            //     Select a control from the left to view its objectives.
                            // </p>

                            <div className="h-full flex items-center justify-center">
                                <Alert
                                    variant="default"
                                    className="w-1/2 border-l-4 border-green-500 bg-green-500/10 text-green-400 dark:bg-green-900/50 dark:text-green-300 p-2 rounded-md shadow-md text-center"
                                >
                                    <AlertDescription className="text-center text-xl">
                                        Select a control from the left to view its objectives.
                                    </AlertDescription>
                                </Alert>
                            </div>
                        )}
                    </div>
                </div>
                <DialogFooter className="border-t p-4"> {/* Adjusted background */}
                    <Button onClick={handleUpdate}>
                        Update
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default PolicyControlsDialog;