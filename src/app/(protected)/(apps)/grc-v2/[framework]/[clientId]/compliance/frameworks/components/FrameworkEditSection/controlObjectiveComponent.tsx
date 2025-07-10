import React, { useEffect, useState } from 'react';
import { Pencil, X } from 'lucide-react'; // Removed unused imports
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/shadcn/ui/dialog";
import { Button } from '@/shadcn/ui/button';
import { Input } from "@/shadcn/ui/input"; // Import Input for title/description
import { Textarea } from "@/shadcn/ui/textarea"; // Import Textarea for description

// --- Component 1: ControlObjectiveNameCard ---
interface ControlObjectiveNameCardProps {
    objectiveIndex: string | number; // Updated type to allow number as per Framework structure
    title: string;
    status: string; // Keeping status prop, but it will likely be empty if not in objective data
    weight: number | string;
    description: string;
    // Removed controlObjType and practiceAreas as they are no longer in objective data
    objective: any; // Using 'any' for objective for now, will infer later
    onObjectiveUpdate: (controlIndex: string | number, objectiveIndex: string | number, updates: Partial<any>) => void; // Updated parameter names
    isCentralAdminUser: boolean;
    // Removed practiceAreasOptions as it's no longer used in this dialog
}

const ControlObjectiveNameCard: React.FC<ControlObjectiveNameCardProps> = ({
    objectiveIndex,
    title,
    weight,
    description,
    objective, // Destructure objective
    onObjectiveUpdate,
    isCentralAdminUser,
}) => {
    const [isHovered, setIsHovered] = useState(false);
    const [openEditForm, setOpenEditForm] = useState(false); // State for the edit dialog
    // Initialize editingObjective with the passed objective data
    const [editingObjective, setEditingObjective] = useState<any>(objective);

    // Update editingObjective when the original objective prop changes (e.g., parent re-renders with new data)
    useEffect(() => {
        setEditingObjective(objective);
    }, [objective]);


    const handleUpdate = (updates: Partial<any>) => {
        // Update local editing state immediately
        setEditingObjective((prev) => ({
            ...prev,
            ...updates,
        }));
    };

    const handleSaveChanges = () => {
        if (editingObjective && objective) { // Ensure both are available
            // Call parent update handler with the modified objectiveName and objectiveDescription
            // Assuming objective.policyIndex is available from the parent's mapping or the original objective object
            onObjectiveUpdate(
                objective.policyIndex, // Use policyIndex from the original objective
                objective.objectiveIndex, // Use objectiveIndex from the original objective
                {
                    objectiveName: editingObjective.objectiveName,
                    objectiveDescription: editingObjective.objectiveDescription,
                    // Keep other fields if they are editable, e.g., controlObjweight
                    controlObjweight: editingObjective.controlObjweight,
                    // If status, practiceAreas, controlObjType were part of the data before, and we now modify them
                    // but they are no longer in the objective interface, this is where it gets tricky.
                    // For now, only sending what you asked to update (title/description)
                    // If practiceAreas and controlObjType are *removed* from the objective data,
                    // then trying to update them here won't make sense.
                }
            );
        }
        setOpenEditForm(false); // Close the dialog
    };

    return (
        <div
            className="w-full text-gray-100 rounded-lg shadow-md overflow-hidden mb-4
                       border border-[#232323] hover:bg-[#232323] transition-colors duration-200"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 border-gray-700">
                <h3 className="text-lg sm:text-xl mb-2 sm:mb-0">
                    {objectiveIndex} {title}
                </h3>
                <div className="flex flex-wrap items-center gap-2">
                    <span className="bg-black border font-medium px-3 py-1 rounded-sm text-xs">
                        Weight - {weight}
                    </span>
                </div>
            </div>
            <div className="relative p-3">
                <p className="text-sm leading-relaxed text-gray-300 pr-8 overflow-hidden text-ellipsis whitespace-nowrap" title={description}>
                    {description}
                </p>
                {isHovered && isCentralAdminUser && (
                    <button
                        className="absolute bottom-4 right-4 text-gray-400 hover:text-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:ring-offset-800 rounded-full p-1"
                        aria-label="Edit objective"
                        onClick={() => {
                            setEditingObjective(objective); // Set initial state from current objective prop
                            setOpenEditForm(true); // Open the dialog
                        }}
                    >
                        <Pencil className="h-4 w-4" />
                    </button>
                )}
            </div>

            {isCentralAdminUser && ( // Only render dialog if user is admin
                <Dialog open={openEditForm} onOpenChange={setOpenEditForm}>
                    <DialogContent className="max-w-md p-6">
                        <DialogHeader>
                            <DialogTitle>Edit Control Objective</DialogTitle>
                            <DialogDescription>
                                Make changes to this control objective's title and description.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                            <div className="space-y-2">
                                <h4 className="text-sm font-medium text-gray-200">Objective Title</h4>
                                <Input
                                    value={editingObjective?.objectiveName || ""}
                                    onChange={(e) => handleUpdate({ objectiveName: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <h4 className="text-sm font-medium text-gray-200">Objective Description</h4>
                                <Textarea
                                    value={editingObjective?.objectiveDescription || ""}
                                    onChange={(e) => handleUpdate({ objectiveDescription: e.target.value })}
                                    rows={4}
                                />
                            </div>
                            {/* Removed Practice Type and Procedural Type selects as per your request */}
                        </div>
                        <DialogFooter className="flex justify-end gap-2">
                            <Button variant="outline" onClick={() => setOpenEditForm(false)}>
                                Cancel
                            </Button>
                            <Button onClick={handleSaveChanges}>
                                Save Changes
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            )}
        </div>
    );
};

export default ControlObjectiveNameCard;