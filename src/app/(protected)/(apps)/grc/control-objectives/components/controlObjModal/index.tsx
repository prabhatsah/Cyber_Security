"use client";

import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/shadcn/ui/dialog";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent, } from "@/shadcn/ui/accordion";
import { Button } from "@/shadcn/ui/button";
import { ScrollArea } from "@/shadcn/ui/scroll-area";
import { Input } from "@/shadcn/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/shadcn/ui/select";

export default function ControlManagerModal({ open, setOpen }:
    { open: boolean; setOpen: (value: boolean) => void; }) {

    const [controls, setControls] = useState([
        { name: "", objectives: [{ name: "", description: "" }] },
    ]);

    const addControl = () => {
        setControls((prev) => [
            ...prev,
            { name: "", objectives: [{ name: "", description: "" }] },
        ]);
    };

    const updateControlName = (index: number, value: string) => {
        const updated = [...controls];
        updated[index].name = value;
        setControls(updated);
    };

    const addObjective = (controlIndex: number) => {
        const updated = [...controls];
        updated[controlIndex].objectives.push({ name: "", description: "" });
        setControls(updated);
    };

    const updateObjectiveName = (
        controlIndex: number,
        objectiveIndex: number,
        value: string
    ) => {
        const updated = [...controls];
        updated[controlIndex].objectives[objectiveIndex].name = value;
        setControls(updated);
    };

    const updateObjectiveDescription = (controlIndex: number, objectiveIndex: number, value: string) => {
        const updated = [...controls];
        updated[controlIndex].objectives[objectiveIndex].description = value;
        setControls(updated);
    };

    const handleSave = () => {
        console.log("Controls:", controls);
        setOpen(false);
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="max-w-4xl h-[90vh] flex flex-col">
                <DialogHeader>
                    <DialogTitle>Control Objectives Manager</DialogTitle>
                </DialogHeader>

                <div className="flex justify-end mb-2">
                    <Button size="sm" onClick={addControl}>
                        + Add Control
                    </Button>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col space-y-1.5">
                        <label className="text-sm font-medium text-muted-foreground">
                            Framework Name
                        </label>
                        <Select>
                            <SelectTrigger>
                                <SelectValue placeholder="Select Framework Name" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="iso27001">ISO 27001</SelectItem>
                                <SelectItem value="nist">NIST</SelectItem>
                                <SelectItem value="gdpr">GDPR</SelectItem>
                                <SelectItem value="cobit">COBIT</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="flex flex-col space-y-1.5">
                        <label className="text-sm font-medium text-muted-foreground">
                            Framework Type
                        </label>
                        <Select>
                            <SelectTrigger>
                                <SelectValue placeholder="Select Framework Type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="mandatory">Mandatory</SelectItem>
                                <SelectItem value="optional">Optional</SelectItem>
                                <SelectItem value="custom">Custom</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <ScrollArea className="flex-1">
                    <Accordion type="multiple" className="space-y-4">
                        {controls.map((control, controlIndex) => (
                            <AccordionItem key={controlIndex} value={`item-${controlIndex}`}>
                                <AccordionTrigger>
                                    <Input
                                        placeholder="Control Name"
                                        value={control.name}
                                        onChange={(e) =>
                                            updateControlName(controlIndex, e.target.value)
                                        }
                                    />
                                </AccordionTrigger>
                                <AccordionContent>
                                    <div className="border rounded-md p-4 space-y-4 max-h-80 overflow-y-auto bg-muted/50">
                                        {control.objectives.map((objective, objIndex) => (
                                            <div
                                                key={objIndex}
                                                className="space-y-2 border p-3 rounded-md bg-white"
                                            >
                                                <Input
                                                    placeholder="Objective Name"
                                                    value={objective.name}
                                                    onChange={(e) =>
                                                        updateObjectiveName(
                                                            controlIndex,
                                                            objIndex,
                                                            e.target.value
                                                        )
                                                    }
                                                />
                                                <Input
                                                    placeholder="Objective Description"
                                                    value={objective.description}
                                                    onChange={(e) =>
                                                        updateObjectiveDescription(
                                                            controlIndex,
                                                            objIndex,
                                                            e.target.value
                                                        )
                                                    }
                                                />
                                            </div>
                                        ))}
                                        <div className="pt-2">
                                            <Button
                                                onClick={() => addObjective(controlIndex)}
                                                size="sm"
                                                variant="secondary"
                                            >
                                                + Add Objective
                                            </Button>
                                        </div>
                                    </div>
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>
                </ScrollArea>

                <DialogFooter className="mt-4">
                    <Button onClick={handleSave}>Save</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}


