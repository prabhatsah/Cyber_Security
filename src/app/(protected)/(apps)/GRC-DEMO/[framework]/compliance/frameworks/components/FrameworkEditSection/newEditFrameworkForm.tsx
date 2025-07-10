import { useEffect, useMemo, useState } from "react";
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
import ControlObjectiveNameCard from "./controlObjectiveComponent"; // Ensure this import path is correct
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
import { getMyInstancesV2, invokeAction } from "@/ikon/utils/api/processRuntimeService";
import { Alert, AlertDescription } from "@/shadcn/ui/alert";

// New Interfaces reflecting the data from EditFramework component
interface ControlObjective {
    objectiveName: string;
    objectiveDescription: string;
    objectiveIndex: number; // Corresponds to controlObjId
    controlObjweight?: number;
    // Removed practiceAreas and controlObjType from here as per your request
    status?: string; // Keeping status, but it needs to exist in your actual data to be useful for filtering
}

interface Control {
    controlName: string;
    controlDescription: string;
    policyIndex: number; // Corresponds to policyId
    type: string;
    controlObjectives: ControlObjective[];
    controlWeight?: number;
}

interface Framework {
    frameworkName: string; // Corresponds to policyName
    description: string;
    owners: string[];
    version: string;
    frameworkId: string; // New top-level ID
    lastUpdatedOn: string;
    effectiveDate: string;
    controls: Control[];
}


interface PolicyControlsDialogProps {
    editdata: Framework | null; // Now expects a Framework object
    setOpenEditForm: (open: boolean) => void;
    openEditForm: boolean;
    isCentralAdminUser: boolean; // Keeping this as per your note, though not used here
}

const PolicyControlsDialog: React.FC<PolicyControlsDialogProps> = ({ editdata, setOpenEditForm, openEditForm, isCentralAdminUser }) => {
    const router = useRouter();
    const [data, setData] = useState<Framework | null>(null); // Initialize as null or empty Framework
    const [selectedControl, setSelectedControl] = useState<Control | null>(null);

    // Filter states
    const [searchTerm, setSearchTerm] = useState("");
    // Keeping statusFilter, but it will only work if objective.status is populated
    const [statusFilter, setStatusFilter] = useState<string | undefined>(undefined);
    // Removed practiceFilter and proceduralFilter states
    // const [practiceFilter, setPracticeFilter] = useState<string | undefined>(undefined);
    // const [proceduralFilter, setProceduralFilter] = useState<string | undefined>(undefined);

    // Removed practiceAreas array as it's no longer used for filters or in the objective edit dialog
    // const practiceAreas = [ ... ];


    // Set data when editdata prop changes
    useEffect(() => {
        setData(editdata);
        // Optionally set the first control as selected when the dialog opens
        if (openEditForm && editdata?.controls && editdata.controls.length > 0) {
            setSelectedControl(editdata.controls[0]);
        } else {
            setSelectedControl(null); // Reset if no data or dialog closes
        }
    }, [editdata, openEditForm]);

    // Reset filters and selected control when dialog closes
    useEffect(() => {
        if (!openEditForm) {
            setOpenEditForm(false);
            setSelectedControl(null);
            setSearchTerm("");
            setStatusFilter(undefined);
            // Removed resetting practiceFilter and proceduralFilter
            // setPracticeFilter(undefined);
            // setProceduralFilter(undefined);
        }
    }, [openEditForm, setOpenEditForm]);

    const handleControlClick = (control: Control) => {
        setSelectedControl(control);
    };

    // Function to update an objective's data
    const handleObjectiveUpdate = (
        controlIndex: string | number,
        objectiveIndex: string | number,
        updates: Partial<ControlObjective>,
    ) => {
        if (!data) return;

        const updatedControls = data.controls.map((control) => {
            if (control.policyIndex === controlIndex) {
                const newControlData = {
                    ...control,
                    controlObjectives: control.controlObjectives.map((objective) =>
                        objective.objectiveIndex === objectiveIndex
                            ? { ...objective, ...updates }
                            : objective
                    ),
                };
                if (selectedControl && selectedControl.policyIndex === controlIndex) {
                    setSelectedControl(newControlData);
                }
                return newControlData;
            }
            return control;
        });

        setData((prev) => ({ ...prev!, controls: updatedControls }));
    };


    // Filter objectives based on current filters
    const filteredObjectives = useMemo(() => {
        if (!selectedControl) return [];

        return selectedControl.controlObjectives
            .filter((objective) => {
                const matchesSearch =
                    !searchTerm ||
                    objective.objectiveName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    objective.objectiveIndex.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
                    objective.objectiveDescription.toLowerCase().includes(searchTerm.toLowerCase());

                // Status filter remains, but relies on `objective.status` now
                const matchesStatus = !statusFilter || objective.status === statusFilter;

                // Removed practice and procedural filters as they are no longer in objective data
                // const matchesPractice = !practiceFilter || objective.practiceAreas === practiceFilter;
                // const matchesProcedural = !proceduralFilter || objective.controlObjType === proceduralFilter;

                return matchesSearch && matchesStatus; // Updated return condition
            })
            .map((objective) => ({
                ...objective,
                policyIndex: selectedControl.policyIndex,
            }));
    }, [selectedControl, searchTerm, statusFilter]); // Removed practiceFilter, proceduralFilter from dependencies

    async function handleUpdate() {
        try {
            if (!data || !data.frameworkId) {
                toast.error("No framework data to update or missing frameworkId!", { duration: 2000 });
                return;
            }

            console.log("Updated data:", data);

            const controlPolicyInstances = await getMyInstancesV2({
                processName: "Control Objectives",
                predefinedFilters: { taskName: "edit control objective" },
                mongoWhereClause: `this.Data.frameworkId == "${data.frameworkId}"`,
            });


            console.log("Control Policy Instances:", controlPolicyInstances);
            const taskId = controlPolicyInstances[0]?.taskId;
            console.log("Task ID:", taskId);

            if (!taskId) {
                toast.error("No active task found for updating control objectives.", { duration: 3000 });
                return;
            }

            await invokeAction({
                taskId: taskId,
                data: data,
                transitionName: 'update edit controlObj',
                processInstanceIdentifierField: 'frameworkId',
            });

            setOpenEditForm(false);
            toast.success("Successfully Updated!", { duration: 2000 });
            router.push("/grc/knowledge-base");
            router.refresh();
        } catch (error) {
            toast.error("Failed to Update!", { duration: 2000 });
            console.error("Failed to update policy:", error);
        }
    }


    return (
        <Dialog open={openEditForm} onOpenChange={setOpenEditForm} >
            <DialogContent className="!max-w-none !w-screen !h-screen p-0 overflow-hidden flex flex-col gap-2">
                <DialogHeader className="border-b p-6">
                    <div className="grid grid-cols-[5fr_7fr] items-center">
                        <div className="flex items-center gap-3 ">
                            <Copy className="h-6 w-6" />
                            <div>
                                <DialogTitle className="text-xl">
                                    {data?.frameworkName || "Framework Details"}
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
                                {/* Status filter remains */}
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
                                {/* Removed Practice Area Select */}
                                {/* Removed Procedural Type Select */}
                                <Button
                                    variant="outline"
                                    onClick={() => {
                                        setSearchTerm("");
                                        setStatusFilter(undefined);
                                        // Removed resetting practice and procedural filters
                                        // setPracticeFilter(undefined);
                                        // setProceduralFilter(undefined);
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

                <div className="flex flex-1 overflow-hidden">
                    <div className="w-1/4 p-2 border-r border-gray-700 overflow-y-auto custom-scrollbar">
                        {data?.controls?.map((control) => (
                            <ControlPolicyNameCard
                                key={control.policyIndex}
                                indexNumber={control.policyIndex}
                                title={control.controlName}
                                rightNumber={control.controlObjectives.length}
                                weight={control.controlWeight}
                                onClick={() => handleControlClick(control)}
                                isSelected={selectedControl && selectedControl.policyIndex === control.policyIndex}
                            />
                        ))}
                    </div>

                    <div className="flex-1 p-4 overflow-y-auto custom-scrollbar">
                        {selectedControl ? (
                            <>
                                {filteredObjectives.length > 0 ? (
                                    filteredObjectives.map((objective) => (
                                        <ControlObjectiveNameCard
                                            key={String(objective.objectiveIndex)}
                                            objectiveIndex={String(objective.objectiveIndex)}
                                            title={objective.objectiveName}
                                            status={objective.status || ""} // Keeping status, will be empty if not present
                                            weight={objective.controlObjweight}
                                            description={objective.objectiveDescription}
                                            objective={objective} // Pass the full objective
                                            onObjectiveUpdate={handleObjectiveUpdate}
                                            isCentralAdminUser={isCentralAdminUser}
                                            // Removed practiceAreasOptions as it's no longer needed in this component
                                        />
                                    ))
                                ) : (
                                    <p className="text-gray-400 text-center mt-20">
                                        No objectives match the current filters for this control.
                                    </p>
                                )}
                            </>
                        ) : (
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
                <DialogFooter className="border-t p-4">
                    <Button onClick={handleUpdate}>
                        Update
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default PolicyControlsDialog;