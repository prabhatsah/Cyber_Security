"use client";

import { Button } from "@/shadcn/ui/button";
import { Input } from "@/shadcn/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shadcn/ui/select";
import { RefreshCw, Search } from "lucide-react";
import { useEffect, useState } from "react";
import { ControlItem } from "./ControlItem";
import { updatePolicy } from "../(backend-calls)";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface ControlsHierarchyProps {
  controls: any[];
}
const practiceAreas = [
  "Audit and Reporting",
  "Governance",
  "Banking Governance",
  "Communications",
  "Content and Records",
  "Governance and Risk Mgmt",
  "Risk Assessment and Management",
  "Compliance Management",
  "IT Security",
  "Operational Risk",
  "Business Continuity",
  "Policy Management",
  "Regulatory Compliance",
  "Cybersecurity",
  "Data Privacy",
  "Vendor Risk Management",
  "Access Control",
  "Incident Response",
  "Third-Party Governance",
  "Enterprise Risk Management",
  "Legal and Regulatory Affairs",
  "Internal Controls",
  "Ethics and Integrity",
  "Physical Security",
  "Training and Awareness",
  "Fraud Detection and Prevention",
  "Health, Safety & Environment (HSE)",
  "Change Management",
  "Cloud Governance",
  "Financial Controls",
];
export function ControlsHierarchy({ editrow, setOpenEditForm, isCentralAdminUser }: any) {
  const router = useRouter();
  const [controls, setControls] = useState(editrow.controls);
  const [editRowPolicy, setEditRowPolicy] = useState(editrow);
  console.log("initial controls in hierarchy----", controls);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | undefined>(
    undefined
  );
  const [practiceFilter, setPracticeFilter] = useState<any | undefined>(
    undefined
  );
  const [proceduralFilter, setProceduralFilter] = useState<any | undefined>(
    undefined
  );

  const handleObjectiveUpdate = (
    controlId: string,
    objectiveId: string,
    updates: Partial<any>
  ) => {
    setControls((prevControls) =>
      prevControls.map((control) => {
        if (control.policyId === controlId) {
          return {
            ...control,
            controlObjectives: control.controlObjectives.map((objective) =>
              objective.controlObjId === objectiveId
                ? {
                  ...objective,
                  ...updates
                }
                : objective
            ),
          };
        }
        return control;
      })
    );
    // console.log("after editing controls----", controls);
    // console.log("updated control----", controls);
    // console.log("updated editRow----", editRowPolicy);
  };

  async function handleUpdate() {
    try {
      await updatePolicy(controls, editRowPolicy);
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

  //   useEffect(() => {

  // }, [controls]); // This will log whenever controls change
  //   Function to filter controls recursively
  const filterControls = (items: any[]): any[] => {
    return items
      .map((control) => {
        // Filter objectives based on criteria
        const filteredObjectives = control.controlObjectives.filter(
          (objective) => {
            const matchesSearch =
              !searchTerm ||
              objective.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
              objective.controlObjId
                .toString()
                .toLowerCase()
                .toString()
                .includes(searchTerm.toLowerCase()) ||
              objective.description
                .toLowerCase()
                .toString()
                .includes(searchTerm.toLowerCase()) ||
              control.controlName
                .toLowerCase()
                .toString()
                .includes(searchTerm.toLowerCase());

            const matchesStatus =
              !statusFilter || objective.status === statusFilter;
            const matchesPractice =
              !practiceFilter || objective.practiceAreas === practiceFilter;
            const matchesProcedural =
              !proceduralFilter ||
              objective.controlObjType === proceduralFilter;

            return (
              matchesSearch &&
              matchesStatus &&
              matchesPractice &&
              matchesProcedural
            );
          }
        );

        // Keep control if it has matching objectives
        if (filteredObjectives.length > 0) {
          return {
            ...control,
            controlObjectives: filteredObjectives,
          };
        }

        // Filter out this control
        return null;
      })
      .filter(Boolean) as any[];
  };

  const filteredControls = filterControls(controls);

  return (
    <>
      <div className="w-full">
        <div className="flex flex-col sm:flex-row gap-2 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search controls..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Select
            value={statusFilter}
            onValueChange={(value) =>
              setStatusFilter(value === "all" ? undefined : value)
            }
          >
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="All statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              <SelectItem value="implemented">Partially Implemented</SelectItem>
              <SelectItem value="partial">Fully Implemented</SelectItem>
              <SelectItem value="not-implemented">Not Implemented</SelectItem>
              <SelectItem value="not-applicable">Not Applicable</SelectItem>
            </SelectContent>
          </Select>
          <Select
            value={practiceFilter}
            onValueChange={(value) =>
              setPracticeFilter(value === "all" ? undefined : (value as any))
            }
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
            onValueChange={(value) =>
              setProceduralFilter(value === "all" ? undefined : (value as any))
            }
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

        <div className="space-y-2">
          {filteredControls.length > 0 ? (
            filteredControls.map((control) => (
              <ControlItem
                key={control.policyId}
                control={control}
                onObjectiveUpdate={handleObjectiveUpdate}
                isCentralAdminUser={isCentralAdminUser}
              />
            ))
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              No controls match your filters
            </div>
          )}
        </div>
      </div>
      {
        isCentralAdminUser &&
        <div className="text-center text-sm text-muted-foreground flex justify-end pt-2">
          <Button onClick={handleUpdate}>Update</Button>
        </div>
      }
    </>
  );
}
