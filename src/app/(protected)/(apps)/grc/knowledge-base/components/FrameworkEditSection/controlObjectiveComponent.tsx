import React, { useEffect, useState } from 'react';
import { Pencil, X, ClipboardList, Search, RefreshCw, Edit2 } from 'lucide-react';
import { StatusBadge } from '../../../components/status-badge';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shadcn/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shadcn/ui/select';
import { Button } from '@/shadcn/ui/button';

// --- Component 1: ControlObjectiveNameCard ---
interface ControlObjectiveNameCardProps {
  title: string;
  status: string;
  weight: number | string;
  description: string;
  controlObjType?: string;
  practiceAreas?: string;
  objective: any; // Pass the full objective data for editing
  onObjectiveUpdate: (controlId: string | number, objectiveId: string | number, updates: Partial<any>) => void;
  isCentralAdminUser: boolean;
  // Pass practiceAreasOptions from parent for the Select component in the dialog
  practiceAreasOptions: string[];
}

const ControlObjectiveNameCard: React.FC<ControlObjectiveNameCardProps> = ({
  title,
  status,
  weight,
  description,
  controlObjType,
  practiceAreas,
  objective, // Destructure objective
  onObjectiveUpdate,
  isCentralAdminUser,
  practiceAreasOptions, // Received as prop
}) => {
  // const statusColorClass = status === 'notImplemented' ? 'bg-red-700 text-white' : 'bg-gray-700 text-gray-300';
  const statusCustomColors = {
    "Fully Implemented": "#05A234",
    "Partially Implemented": "#766a12",
    "Not Implemented": "#FF6B6B5C",
    "Not Applicable": "gray",
  };

  const [isHovered, setIsHovered] = useState(false);
  const [openEditForm, setOpenEditForm] = useState(false); // State for the edit dialog
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
    if (editingObjective) {
      // Call parent update handler with the potentially modified editingObjective
      onObjectiveUpdate(objective.policyId, objective.controlObjId, editingObjective);
    }
    setOpenEditForm(false); // Close the dialog
  };
  return (
    // <div className="w-full text-gray-100 rounded-sm shadow-md overflow-hidden mb-4" style={{ backgroundColor: '#232323' }}>
    <div
      className="w-full text-gray-100 rounded-lg shadow-md overflow-hidden mb-4
                 border border-[#232323] hover:bg-[#232323] transition-colors duration-200"
      onMouseEnter={() => setIsHovered(true)} // Set hover state to true on mouse enter
      onMouseLeave={() => setIsHovered(false)} // Set hover state to false on mouse leave
    >
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3  border-gray-700">
        <h3 className="text-lg sm:text-xl mb-2 sm:mb-0">
          {title}
        </h3>
        <div className="flex flex-wrap items-center gap-2">
          <StatusBadge status={status.charAt(0).toUpperCase() + status.slice(1).replace(/([A-Z])/g, ' $1')} customColors={statusCustomColors} textcolor={"white"} className=" font-normal" />
          <span className="bg-gray-700/40 border font-medium px-3 py-1 rounded-sm text-xs">
            {controlObjType}
          </span>
          <span className="bg-gray-700/40 border font-medium px-3 py-1 rounded-sm text-xs">
            {practiceAreas}
          </span>
          <span className="bg-black border font-medium px-3 py-1 rounded-sm text-xs">
            Weight - {weight}
          </span>
        </div>
      </div>
      <div className="relative p-3">
        {/* <p className="text-sm leading-relaxed text-gray-300 pr-8">
          {description}
        </p> */}
        <p className="text-sm leading-relaxed text-gray-300 pr-8 overflow-hidden text-ellipsis whitespace-nowrap" title={description}>
          {description}
        </p>
        {isHovered && isCentralAdminUser && ( // Show button only on hover AND if user is admin
          <button
            className="absolute bottom-4 right-4 text-gray-400 hover:text-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:ring-offset-800 rounded-full p-1"
            aria-label="Edit objective"
            onClick={() => {
              setEditingObjective(objective); // Ensure editingObjective is set from the current objective prop
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
                Make changes to this control objective.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-gray-200">Practice Type</h4>
                <Select
                  value={editingObjective?.practiceAreas || ""}
                  onValueChange={(value) => {
                    handleUpdate({ practiceAreas: value });
                  }}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select practice type" />
                  </SelectTrigger>
                  <SelectContent>
                    {practiceAreasOptions.map((area) => (
                      <SelectItem key={area} value={area}>
                        {area}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-gray-200">Procedural Type</h4>
                <Select
                  value={editingObjective?.controlObjType || ""}
                  onValueChange={(value) => {
                    handleUpdate({ controlObjType: value });
                  }}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select procedural type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Operational">Operational</SelectItem>
                    <SelectItem value="Managerial">Managerial</SelectItem>
                    <SelectItem value="Technical">Technical</SelectItem>
                  </SelectContent>
                </Select>
              </div>
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