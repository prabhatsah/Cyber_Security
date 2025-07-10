import React, { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/shadcn/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shadcn/ui/select";
import { Input } from "@/shadcn/ui/input";
import { Textarea } from "@/shadcn/ui/textarea";
import { Button } from "@/shadcn/ui/button";
import { Label } from "@/shadcn/ui/label";
import { getMyInstancesV2 } from "@/ikon/utils/api/processRuntimeService";
import { v4 } from "uuid"
import { invokeAssessment } from "./invokeRiskAssessment";
import { startAssessmentProcess } from "./startRiskAssessment";

interface EditContactModalProps {
    isOpen: boolean;
    onClose: () => void;
    selectedRiskId: string | null;  // Make it nullable to allow adding new assessments
}

const AssessmentModal: React.FC<EditContactModalProps> = ({ isOpen, onClose, selectedRiskId }) => {
    const [taskId, setTaskId] = useState<string | null>(null);
    const [assessmentDetails, setAssessmentDetails] = useState({
        riskId: "",
        riskTitle: "",
        riskDescription: "",
        riskCategory: "",
        riskLevel: "",
        riskOwner: "",
        riskTimeline: "",
        riskImpact: "",
        riskMitigation: "",
    });

    useEffect(() => {
        if (selectedRiskId) {
            // Fetch existing data if we are editing
            (async () => {
                try {
                    const assessmentData = await getMyInstancesV2<any>({
                        processName: "Add Risk Assessment",
                        predefinedFilters: { taskName: "Edit Risk" },
                        mongoWhereClause: `this.Data.riskId == "${selectedRiskId}"`,
                    });

                    if (assessmentData?.length > 0) {
                        const assessmentObj = assessmentData[0].data || {};
                        setTaskId(assessmentData[0].taskId || null); // Set task ID if editing
                        setAssessmentDetails({
                            riskId: assessmentObj.riskId || "",
                            riskTitle: assessmentObj.riskTitle || "",
                            riskDescription: assessmentObj.riskDescription || "",
                            riskCategory: assessmentObj.riskCategory || "",
                            riskLevel: assessmentObj.riskLevel || "",
                            riskOwner: assessmentObj.riskOwner || "",
                            riskTimeline: assessmentObj.riskTimeline || "",
                            riskImpact: assessmentObj.riskImpact || "",
                            riskMitigation: assessmentObj.riskMitigation || "",
                        });
                    }
                } catch (error) {
                    console.error("Error fetching assessment data:", error);
                }
            })();
        } else {
            // If adding a new assessment, reset the form
            setTaskId(null);
            setAssessmentDetails({
                riskId: v4(),
                riskTitle: "",
                riskDescription: "",
                riskCategory: "",
                riskLevel: "",
                riskOwner: "",
                riskTimeline: "",
                riskImpact: "",
                riskMitigation: "",
            });
        }
    }, [selectedRiskId]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setAssessmentDetails({
            ...assessmentDetails,
            [e.target.name]: e.target.value,
        });
    };

    const handleSelectChange = (name: string, value: string) => {
        setAssessmentDetails({
            ...assessmentDetails,
            [name]: value,
        });
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            if (selectedRiskId && taskId) {
                await invokeAssessment(taskId, assessmentDetails);
            }
            else {
                await startAssessmentProcess(assessmentDetails);
            }
            console.log(assessmentDetails)
            onClose();
        } catch (error) {
            console.error("Error saving assessment:", error);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>{selectedRiskId ? "Edit" : "Add"} Risk Assessment</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* <Input name="riskId" type="hidden" value={assessmentDetails.riskId} /> */}

                    <div className="space-y-2">
                        <Label>Risk Title</Label>
                        <Input name="riskTitle" value={assessmentDetails.riskTitle} onChange={handleChange} required />
                    </div>

                    <div className="space-y-2">
                        <Label>Description</Label>
                        <Textarea name="riskDescription" value={assessmentDetails.riskDescription} onChange={handleChange} required />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Category</Label>
                            <Select name="riskCategory" onValueChange={(value) => handleSelectChange("riskCategory", value)} required>
                                <SelectTrigger>
                                    <SelectValue placeholder={assessmentDetails.riskCategory || "Select category"} />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Strategic">Strategic</SelectItem>
                                    <SelectItem value="Operational">Operational</SelectItem>
                                    <SelectItem value="Financial">Financial</SelectItem>
                                    <SelectItem value="Compliance">Compliance</SelectItem>
                                    <SelectItem value="Reputational">Reputational</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label>Risk Level</Label>
                            <Select name="riskLevel" onValueChange={(value) => handleSelectChange("riskLevel", value)} required>
                                <SelectTrigger>
                                    <SelectValue placeholder={assessmentDetails.riskLevel || "Select risk level"} />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Critical">Critical</SelectItem>
                                    <SelectItem value="High">High</SelectItem>
                                    <SelectItem value="Medium">Medium</SelectItem>
                                    <SelectItem value="Low">Low</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Risk Owner</Label>
                            <Input name="riskOwner" value={assessmentDetails.riskOwner} onChange={handleChange} required />
                        </div>

                        <div className="space-y-2">
                            <Label>Timeline</Label>
                            <Input name="riskTimeline" type="date" value={assessmentDetails.riskTimeline} onChange={handleChange} required />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label>Potential Impact</Label>
                        <Textarea name="riskImpact" value={assessmentDetails.riskImpact} onChange={handleChange} required />
                    </div>

                    <div className="space-y-2">
                        <Label>Mitigation Strategy</Label>
                        <Textarea name="riskMitigation" value={assessmentDetails.riskMitigation} onChange={handleChange} required />
                    </div>

                    <Button type="submit" className="w-full">{selectedRiskId ? "Update" : "Add"} Assessment</Button>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default AssessmentModal;

