import { useState } from "react";
import { Button } from "@/shadcn/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/shadcn/ui/dialog";
import { Card, CardContent } from "@/shadcn/ui/card";
import { Progress } from "@/shadcn/ui/progress";
import { Input } from "@/shadcn/ui/input";
import { Textarea } from "@/shadcn/ui/textarea";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/shadcn/ui/select";
import MultiSelectDropdown from "./MultiSelectDropdown";
import { cn } from "@/shadcn/lib/utils";

const stages = ["Draft", "Review", "Published", "Approve/Reject"];

export default function ProgressForm({ isOpen, onClose }) {
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState({
    name: "",
    type: "",
    owner: "",
    riskLevel: "",
    framework: [],
    description: "",
    objectives: [],
    implementation: [],
    testing: [],
    documentation: []
  });

  const handleNext = () => {
    if (step < stages.length - 1) setStep(step + 1);
  };

  const handlePrev = () => {
    if (step > 0) setStep(step - 1);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-xl p-6 bg-gray-900 text-white rounded-lg">
        <DialogHeader>
          <DialogTitle className="text-center text-lg font-bold text-red-500">Multi-Step Form</DialogTitle>
        </DialogHeader>

        <div className="flex items-center justify-between mb-4">
          {stages.map((stage, index) => (
            <div key={index} className="flex flex-col items-center w-full">
              <div className={cn(
                "w-8 h-8 flex items-center justify-center rounded-full text-sm font-bold", 
                index <= step ? "bg-red-500 text-white" : "bg-gray-700 text-gray-400"
              )}>
                {index + 1}
              </div>
              <p className={cn("text-xs font-semibold mt-1", index <= step ? "text-red-400" : "text-gray-500")}>{stage}</p>
            </div>
          ))}
        </div>

        <Progress value={(step / (stages.length - 1)) * 100} className="mb-4 bg-gray-700 h-2" />

        <Card className="bg-gray-800 border border-gray-700">
          <CardContent className="p-4 space-y-4">
            {step === 0 && (
              <>
                <label className="text-sm font-semibold">Control Name</label>
                <Input
                  placeholder="Enter control name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="bg-gray-700 border border-gray-600 text-white"
                />
                <label className="text-sm font-semibold">Type</label>
                <Select name="type" value={formData.type} onChange={(e) => setFormData({ ...formData, type: e.target.value })}>
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
                <label className="text-sm font-semibold">Owner</label>
                <Input
                  placeholder="Enter owner name"
                  value={formData.owner}
                  onChange={(e) => setFormData({ ...formData, owner: e.target.value })}
                  className="bg-gray-700 border border-gray-600 text-white"
                />
                <label className="text-sm font-semibold">Risk Level</label>
                <Select name="riskLevel" value={formData.riskLevel} onChange={(e) => setFormData({ ...formData, riskLevel: e.target.value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select risk level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="High">High</SelectItem>
                    <SelectItem value="Moderate">Moderate</SelectItem>
                    <SelectItem value="Low">Low</SelectItem>
                  </SelectContent>
                </Select>
                <label className="text-sm font-semibold">Framework</label>
                <MultiSelectDropdown
                  items={[]}
                  label="Framework"
                  placeholder="Select frameworks"
                  onSelect={(selected) => setFormData({ ...formData, framework: selected })}
                />
                <label className="text-sm font-semibold">Description</label>
                <Textarea
                  placeholder="Enter description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="bg-gray-700 border border-gray-600 text-white"
                />
              </>
            )}
          </CardContent>
        </Card>

        <div className="flex justify-between mt-4">
          <Button variant="outline" onClick={handlePrev} disabled={step === 0} className="bg-red-500 text-white px-4 py-2 rounded">
            Prev
          </Button>
          {step < stages.length - 1 ? (
            <Button onClick={handleNext} disabled={step === 0 && !formData.name} className="bg-red-500 text-white px-4 py-2 rounded">
              Next
            </Button>
          ) : (
            <Button onClick={onClose} variant="success" className="bg-green-500 text-white px-4 py-2 rounded">
              Finish
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
