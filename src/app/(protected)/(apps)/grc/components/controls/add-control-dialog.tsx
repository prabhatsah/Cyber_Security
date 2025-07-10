// "use client"

// import { useState } from "react"
// import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/shadcn/ui/dialog"
// import { Button } from "@/shadcn/ui/button"
// import { Input } from "@/shadcn/ui/input"
// import { Label } from "@/shadcn/ui/label"
// import { Textarea } from "@/shadcn/ui/textarea"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shadcn/ui/select"
// import { Plus } from "lucide-react"
// import { useToast } from "../../hooks/use-toast"
// import { mapProcessName, startProcessV2 } from "@/ikon/utils/api/processRuntimeService"

// export function AddControlDialog({ onAddControl }: { onAddControl: (control: any) => void }) {
//   const [open, setOpen] = useState(false)
// //   const { toast } = useToast()

//   // Function to start control objective
//   const startControlObjective = async (newControl: Record<string, any>) => {
//     try {
//       const processId = await mapProcessName({ processName: "Control Objective" })
//       console.log("process id = ",processId)
//       await startProcessV2({ processId, data: newControl, processIdentifierFields: "id,name,type,framework" })
//     } catch (error) {
//       console.error("Failed to start the process:", error)
//     }
//   }

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault()
//     const formData = new FormData(e.target as HTMLFormElement)
//     const newControl = {
//       id: Date.now().toString(),
//       name: formData.get("name"),
//       type: formData.get("type"),
//       framework: formData.get("framework"),
//       description: formData.get("description"),
//       status: "Draft",
//       lastReview: new Date().toISOString().split('T')[0],
//       lastUpdatedOn: new Date().toISOString() // Adds date and time
//     }

//     // Call startControlObjective before adding the control
//     await startControlObjective(newControl)

//     console.log("New Control:", newControl) // For debugging purposes

//     onAddControl(newControl)
//     setOpen(false)
//     toast({
//       title: "Control Created",
//       description: "The control has been created and is now in draft status."
//     })
//   }

//   return (
//     <Dialog open={open} onOpenChange={setOpen}>
//       <DialogTrigger asChild>
//         <Button>
//           <Plus className="mr-2 h-4 w-4" />
//           Add Control
//         </Button>
//       </DialogTrigger>
//       <DialogContent className="sm:max-w-[600px]">
//         <DialogHeader>
//           <DialogTitle>Add New Control</DialogTitle>
//         </DialogHeader>
//         <form onSubmit={handleSubmit} className="space-y-4">
//           <div className="space-y-2">
//             <Label htmlFor="name">Control Name</Label>
//             <Input id="name" name="name" required />
//           </div>
//           <div className="grid grid-cols-2 gap-4">
//             <div className="space-y-2">
//               <Label htmlFor="type">Type</Label>
//               <Select name="type" required>
//                 <SelectTrigger>
//                   <SelectValue placeholder="Select type" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   <SelectItem value="Policy">Policy</SelectItem>
//                   <SelectItem value="Process">Process</SelectItem>
//                   <SelectItem value="Procedure">Procedure</SelectItem>
//                   <SelectItem value="Standard">Standard</SelectItem>
//                   <SelectItem value="Guideline">Guideline</SelectItem>
//                 </SelectContent>
//               </Select>
//             </div>
//             <div className="space-y-2">
//               <Label htmlFor="framework">Framework</Label>
//               <Select name="framework" required>
//                 <SelectTrigger>
//                   <SelectValue placeholder="Select framework" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   <SelectItem value="ISO 27001">ISO 27001</SelectItem>
//                   <SelectItem value="NIST">NIST</SelectItem>
//                   <SelectItem value="COBIT">COBIT</SelectItem>
//                   <SelectItem value="PCI DSS">PCI DSS</SelectItem>
//                   <SelectItem value="HIPAA">HIPAA</SelectItem>
//                 </SelectContent>
//               </Select>
//             </div>
//           </div>
//           <div className="space-y-2">
//             <Label htmlFor="description">Description</Label>
//             <Textarea id="description" name="description" required />
//           </div>
//           <div className="flex justify-end space-x-2">
//             <Button type="submit">Create Control</Button>
//           </div>
//         </form>
//       </DialogContent>
//     </Dialog>
//   )
// }

"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/shadcn/ui/dialog";
import { Button } from "@/shadcn/ui/button";
import { Input } from "@/shadcn/ui/input";
import { Label } from "@/shadcn/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shadcn/ui/select";
import { Plus, Trash } from "lucide-react";
import { useToast } from "../../hooks/use-toast";
import {
  mapProcessName,
  startProcessV2,
} from "@/ikon/utils/api/processRuntimeService";
import MultiSelectDropdown from "./MultiSelectDropdown";
import { getMyInstancesV2 } from "@/ikon/utils/api/processRuntimeService";
// const frameworkOptions = [
//   { value: "ISO 27001", label: "ISO 27001" },
//   { value: "NIST", label: "NIST" },
//   { value: "COBIT", label: "COBIT" },
//   { value: "PCI DSS", label: "PCI DSS" },
//   { value: "HIPAA", label: "HIPAA" },
// ];

export function AddControlDialog({
  onAddControl,
  tableData,
}: {
  onAddControl: (control: any) => void;
  tableData: any[]; // Define the type for tableData
}) {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const [loading, setLoading] = useState(false); // Track loading state
  const [frameworkOptions, setFrameworkOptions] = useState<any[]>([]);

  const fetchFrameWorkData = async () => {
    setLoading(true); // Set loading to true before fetching
    try {
      const frameworkInsData = await getMyInstancesV2<any>({
        processName: "Add Framework",
        predefinedFilters: { taskName: "view framework" },
        projections: ["Data"],
      });

      const frameworkdData = frameworkInsData.map((e: any) => e.data);

      console.log("Framework Data: ", frameworkdData);

      const options = frameworkdData.map((item: any) => ({
        value: item.id,
        label: item.name,
      }));
      setFrameworkOptions(options); // Set the options state

    } catch (error) {
      console.error("Error fetching profile data:", error);
    } finally {
      setLoading(false); // Set loading to false after fetching
    }
  };

  useEffect(() => {
    fetchFrameWorkData();
  }, []);

  // Function to start control objective
  const startControlObjective = async (newControl: Record<string, any>) => {
    try {
      const processId = await mapProcessName({
        processName: "Control Objective",
      });
      console.log("process id = ", processId);
      await startProcessV2({
        processId,
        data: newControl,
        processIdentifierFields: "id,name,type,framework",
      });
    } catch (error) {
      console.error("Failed to start the process:", error);
    }
  };

  // State for dynamic fields
  const [objectives, setObjectives] = useState<string[]>([""]);
  const [implementation, setImplementation] = useState<string[]>([""]);
  const [testing, setTesting] = useState<string[]>([""]);
  const [documentation, setDocumentation] = useState<string[]>([""]);
  const [selectedFrameworks, setSelectedFrameworks] = useState<string[]>([]);

  const resetFormState = () => {
    setObjectives([""]);
    setImplementation([""]);
    setTesting([""]);
    setDocumentation([""]);
    setSelectedFrameworks([]);
  };

  const handleAddRow = (
    setter: React.Dispatch<React.SetStateAction<string[]>>
  ) => {
    setter((prev) => [...prev, ""]);
  };

  const handleRemoveRow = (
    index: number,
    setter: React.Dispatch<React.SetStateAction<string[]>>
  ) => {
    setter((prev) => prev.filter((_, i) => i !== index));
  };

  const handleChangeRow = (
    index: number,
    value: string,
    setter: React.Dispatch<React.SetStateAction<string[]>>
  ) => {
    setter((prev) => prev.map((item, i) => (i === index ? value : item)));
  };

  const handleWeightValidation = (frameworkId: string, weight: number) => {
    // Ensure tableData is defined and not empty
    if (!tableData || tableData.length === 0) {
      return true; // If no data, assume the weight is valid
    }
  
    // Calculate the total weight for the selected framework
    const totalWeight = tableData.reduce((total, control) => {
      const framework = control.frameworks.find((fw) => fw.id === frameworkId);
      return total + (framework ? parseInt(framework.weight, 10) : 0);
    }, 0);
  
    const remainingWeight = 100 - totalWeight;
  
    if (weight > remainingWeight) {
      alert(`You can only assign up to ${remainingWeight} weight for this framework.`);
      return false;
    }
  
    return true;
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);

    const newControl = {
      id: Date.now().toString(),
      name: formData.get("name"),
      type: formData.get("type"),
      frameworks: selectedFrameworks.map((framework) => {
        const frameworkOption = frameworkOptions.find((option) => option.value === framework.value);

        // Validate weight before adding the framework
        if (!handleWeightValidation(framework.value, framework.weight)) {
          return null; // Skip invalid frameworks
        }

        return {
          id: frameworkOption?.value || framework.value,
          name: frameworkOption?.label || "Unknown",
          mappingId: `M-${Math.random().toString(36).substr(2, 5)}`,
          weight: framework.weight || 0,
        };
      }).filter(Boolean), // Remove null values
      description: formData.get("description"),
      owner: formData.get("owner"),
      riskLevel: formData.get("riskLevel"),
      objectives: objectives.filter((item) => item.trim() !== ""),
      implementation: implementation.filter((item) => item.trim() !== ""),
      testing: testing.filter((item) => item.trim() !== ""),
      documentation: documentation.filter((item) => item.trim() !== ""),
      status: "Draft",
      lastReview: new Date().toISOString().split("T")[0],
      lastUpdatedOn: new Date().toISOString(),
    };

    console.log("new control", newControl); // For debugging purposes
    // Call startControlObjective before adding the control to the
    await startControlObjective(newControl);

    onAddControl(newControl);
    setOpen(false);
  };

  const renderDynamicTable = (
    label: string,
    items: string[],
    setItems: React.Dispatch<React.SetStateAction<string[]>>
  ) => (
    <div className="space-y-2">
      <Label>{label}</Label>
      <table className="w-full border border-gray-300">
        {/* <thead>
          <tr>
            <th className="border border-gray-300 p-2 text-left">Point</th>
            <th className="border border-gray-300 p-2 text-center">Actions</th>
          </tr>
        </thead> */}
        <tbody>
          {items.map((item, index) => (
            <tr key={index}>
              <td className="border border-gray-300 p-2">
                <Input
                  value={item}
                  onChange={(e) =>
                    handleChangeRow(index, e.target.value, setItems)
                  }
                  placeholder={`Enter ${label.toLowerCase()}`}
                />
              </td>
              <td className="border border-gray-300 p-2 text-center">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRemoveRow(index, setItems)}
                  disabled={items.length === 1}
                >
                  <Trash className="h-4 w-4 text-red-500" />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Button
        variant="outline"
        size="sm"
        onClick={(e) => {
          e.preventDefault(); // Prevent form submission
          handleAddRow(setItems);
        }}
      >
        <Plus className="mr-2 h-4 w-4" />
        Add {label.toLowerCase()}
      </Button>
    </div>
  );

  const handleDialogOpenChange = async (isOpen: boolean) => {
    if (isOpen) {
      await fetchFrameWorkData(); // Fetch data before opening the form
      setOpen(true); // Open the form only after data fetching is complete
      resetFormState(); // Reset form state
    } else {
      setOpen(false);
    }
  };

  return (
    <Dialog
      open={open}
      // onOpenChange={(isOpen) => {
      //   setOpen(isOpen);
      //   if (isOpen) resetFormState(); // Reset form state when opening the dialog
      // }}
      onOpenChange={handleDialogOpenChange}
    >
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Control
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[800px] max-h-[80vh] overflow-y-auto">
        {" "}
        {/* Added scroll */}
        <DialogHeader>
          <DialogTitle>Add New Control</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            {" "}
            {/* Two fields side by side */}
            <div className="space-y-2">
              <Label htmlFor="name">Control Name</Label>
              <Input id="name" name="name" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="type">Type</Label>
              <Select name="type" required>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Policy">Policy</SelectItem>
                  <SelectItem value="Process">Process</SelectItem>
                  <SelectItem value="Procedure">Procedure</SelectItem>
                  <SelectItem value="Standard">Standard</SelectItem>
                  <SelectItem value="Guideline">Guideline</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="owner">Owner</Label>
              <Input
                id="owner"
                name="owner"
                placeholder="Enter owner name"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="riskLevel">Risk Level</Label>
              <Select name="riskLevel" required>
                <SelectTrigger>
                  <SelectValue placeholder="Select risk level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="High">High</SelectItem>
                  <SelectItem value="Moderate">Moderate</SelectItem>
                  <SelectItem value="Low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              {/* <Label htmlFor="framework">Framework</Label> */}
              <MultiSelectDropdown
                items={frameworkOptions}
                label="Framework"
                placeholder="Select frameworks"
                tableData={tableData || []} // Pass tableData here
                onSelect={(selected) => setSelectedFrameworks(selected)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Input id="description" name="description" required />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {renderDynamicTable("Objectives", objectives, setObjectives)}
            {renderDynamicTable(
              "Implementation",
              implementation,
              setImplementation
            )}
          </div>
          <div className="grid grid-cols-2 gap-4">
            {renderDynamicTable("Testing", testing, setTesting)}
            {renderDynamicTable(
              "Documentation",
              documentation,
              setDocumentation
            )}
          </div>
          <div className="flex justify-end space-x-2">
            <Button type="submit">Create Control</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
