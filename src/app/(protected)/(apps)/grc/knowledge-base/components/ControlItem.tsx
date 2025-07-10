"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/shadcn/ui/accordion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shadcn/ui/card";
import { ChevronDown, Edit2 } from "lucide-react";

import { useState } from "react";
import { EditStatusBadge, StatusBadge } from "../../components/status-badge";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/shadcn/ui/dialog";
import { Button } from "@/shadcn/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shadcn/ui/select";
import { Badge } from "@/shadcn/ui/badge";

interface ControlItemProps {
  control: any;
  isCentralAdminUser: boolean;
  onObjectiveUpdate: (
    controlId: string,
    objectiveId: string,
    updates: Partial<any>,
  ) => void;
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
export function ControlItem({ control, onObjectiveUpdate, isCentralAdminUser }: ControlItemProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [openEditForm, setOpenEditForm] = useState(false);
  const [editingObjective, setEditingObjective] = useState<any | null>(null);

  const handleUpdate = (updates: Partial<any>) => {
    if (editingObjective) {
      // Update the local editing state immediately for responsive UI
      setEditingObjective((prev) => ({
        ...prev,
        ...updates,
      }));

      // Then call your update handler with the complete updated objective
      onObjectiveUpdate(control.policyId, editingObjective.controlObjId, {
        ...editingObjective,
        ...updates,
      });
    }
  };

  return (
    <div className="mb-4">
      <Accordion
        type="single"
        collapsible
        className="w-full"
        value={isOpen ? control.id : ""}
        onValueChange={(value) => setIsOpen(!!value)}
      >
        <AccordionItem value={control.policyId} className="border-0">
          <Card className="shadow-sm border-l-4 border-primary p-3">
            <CardHeader className="pb-0">
              <AccordionTrigger className="py-0">
                <div className="flex items-center space-x-2 text-left">
                  <span className="font-mono text-xs bg-muted px-1.5 py-0.5 rounded">
                    {control.policyId}
                  </span>
                  <CardTitle className="text-sm font-medium hover:underline">
                    {control.controlName}
                  </CardTitle>
                  {control.controlObjectives && (
                    <span className="text-xs text-muted-foreground">
                      ({control.controlObjectives.length})
                    </span>
                  )}
                </div>
              </AccordionTrigger>
              <CardDescription className="text-xs mt-2 pl-6 pr-6 line-clamp-2">
                {control.description || ""}
              </CardDescription>
            </CardHeader>
            <AccordionContent>
              <CardContent className="pt-4">
                <div className="space-y-3">
                  {control.controlObjectives.map((objective: any) => (
                    <Card
                      key={objective.controlObjId}
                      className="border-l-4 border-blue-400"
                    >
                      <CardHeader className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            <span className="font-mono text-xs bg-muted px-1.5 py-0.5 rounded">
                              {objective.controlObjId}
                            </span>
                            <CardTitle className="text-sm font-medium">
                              {objective.name}
                            </CardTitle>
                          </div>
                          <div className="flex items-center gap-2">

                            <EditStatusBadge
                              status={
                                objective.status || 'notImplemented'}
                              customColors={{
                                "fullyImplemented": "#70c570",
                                "partiallyImplemented": "#f5f585",
                                "notImplemented": "#ff4545",
                                "Not Applicable": "gray",
                              }}
                            />
                            {
                              isCentralAdminUser &&
                              <Dialog
                                open={openEditForm}
                                onOpenChange={setOpenEditForm}
                              >
                                <DialogTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-8 w-8 p-0"
                                    onClick={() => {
                                      setEditingObjective(objective);
                                      setOpenEditForm(true);
                                    }}
                                  >
                                    <Edit2 className="h-4 w-4" />
                                    <span className="sr-only">
                                      Edit objective
                                    </span>
                                  </Button>
                                </DialogTrigger>
                                <DialogContent>
                                  <DialogHeader>
                                    <DialogTitle>
                                      Edit Control Objective
                                    </DialogTitle>
                                  </DialogHeader>
                                  <div className="space-y-4 py-4">
                                    <div className="space-y-2">
                                      <h4 className="text-sm font-medium">
                                        Practice Type
                                      </h4>
                                      <Select
                                        value={
                                          editingObjective?.practiceAreas || ""
                                        }
                                        onValueChange={(value) => {
                                          handleUpdate({ practiceAreas: value });
                                        }}
                                      >
                                        <SelectTrigger>
                                          <SelectValue placeholder="Select practice type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                          {practiceAreas.map((area) => (
                                            <SelectItem key={area} value={area}>
                                              {area}
                                            </SelectItem>
                                          ))}
                                        </SelectContent>
                                      </Select>
                                    </div>
                                    <div className="space-y-2">
                                      <h4 className="text-sm font-medium">
                                        Procedural Type
                                      </h4>
                                      <Select
                                        value={
                                          editingObjective?.controlObjType || ""
                                        }
                                        onValueChange={(value) => {
                                          handleUpdate({ controlObjType: value });
                                        }}
                                      >
                                        <SelectTrigger>
                                          <SelectValue placeholder="Select procedural type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                          <SelectItem value="Operational">
                                            Operational
                                          </SelectItem>
                                          <SelectItem value="Managerial">
                                            Managerial
                                          </SelectItem>
                                          <SelectItem value="Technical">
                                            Technical
                                          </SelectItem>
                                        </SelectContent>
                                      </Select>
                                    </div>
                                  </div>
                                  <DialogFooter>
                                    <Button
                                      variant="outline"
                                      onClick={() => setOpenEditForm(false)}
                                    >
                                      Cancel
                                    </Button>
                                    <Button
                                      type="submit"
                                      onClick={() => {
                                        setOpenEditForm(false);
                                      }}
                                    >
                                      Save Changes
                                    </Button>
                                  </DialogFooter>
                                </DialogContent>
                              </Dialog>
                            }
                          </div>
                        </div>
                        <CardDescription className="text-xs">
                          {objective.description}
                        </CardDescription>
                        <div className="flex gap-2 mt-2">
                          <Badge variant="outline" className="text-xs">
                            {objective.practiceAreas}
                          </Badge>
                          <Badge variant="secondary" className="text-xs">
                            {objective.controlObjType}
                          </Badge>
                          <Badge variant="info" className="text-xs">
                            Weight - {objective.controlObjweight}
                          </Badge>
                        </div>
                      </CardHeader>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </AccordionContent>
          </Card>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
