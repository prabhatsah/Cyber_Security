"use client";

import { ReactNode, useState } from "react";
import { Button } from "@/shadcn/ui/button";
import { Card, CardContent } from "@/shadcn/ui/card";
import { cn } from "../../lib/utils";

interface Step {
  id: string;
  title: string;
  description: string;
  content: ReactNode;
}

interface MultiStepFormProps {
  steps: Step[];
  onSubmit: () => void;
  onSaveDraft?: () => void;
  className?: string;
}

const MultiStepForm = ({
  steps,
  onSubmit,
  onSaveDraft,
  className,
}: MultiStepFormProps) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);

  const currentStep = steps[currentStepIndex];
  const isFirstStep = currentStepIndex === 0;
  const isLastStep = currentStepIndex === steps.length - 1;

  const handleNext = () => {
    if (isLastStep) {
      onSubmit();
      return;
    }

    // Mark current step as completed
    if (!completedSteps.includes(currentStep.id)) {
      setCompletedSteps([...completedSteps, currentStep.id]);
    }

    setCurrentStepIndex(currentStepIndex + 1);
  };

  const handlePrevious = () => {
    setCurrentStepIndex(currentStepIndex - 1);
  };

  const handleStepClick = (index: number) => {
    // Only allow clicking on completed steps or the next available step
    if (
      completedSteps.includes(steps[index].id) ||
      index === completedSteps.length
    ) {
      setCurrentStepIndex(index);
    }
  };

  return (
    <div className={cn("space-y-8", className)}>
      {/* Step Progress */}
      <nav aria-label="Progress">
        <ol className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-5">
          {steps.map((step, index) => {
            const isActive = index === currentStepIndex;
            const isCompleted = completedSteps.includes(step.id);
            const isClickable = isCompleted || index === completedSteps.length;

            return (
              <li key={step.id} className={index > 0 ? "md:pl-6" : undefined}>
                <button
                  type="button"
                  className={cn(
                    "flex w-full flex-col rounded-lg border p-4 text-left",
                    isActive
                      ? "border-blue-500 bg-[#2c2c2e]"
                      : "border-[#3c3c3e] bg-[#1c1c1e]",
                    isClickable
                      ? "cursor-pointer hover:bg-[#3c3c3e]"
                      : "cursor-not-allowed opacity-60"
                  )}
                  onClick={() => handleStepClick(index)}
                  disabled={!isClickable}
                >
                  <div className="flex items-center">
                    <div
                      className={cn(
                        "flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium",
                        isCompleted
                          ? "bg-blue-600 text-white"
                          : isActive
                          ? "border-2 border-blue-500 text-blue-500"
                          : "border-2 border-gray-600 text-gray-400"
                      )}
                    >
                      {isCompleted ? (
                        <svg
                          className="h-5 w-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      ) : (
                        index + 1
                      )}
                    </div>
                    <span className="ml-3 text-sm font-medium text-white/90">
                      {step.title}
                    </span>
                  </div>
                  <div className="ml-11 mt-1">
                    <p className="text-xs text-white/60">{step.description}</p>
                  </div>
                </button>
              </li>
            );
          })}
        </ol>
      </nav>

      {/* Step Content */}
      <Card className="border border-[#3c3c3e] rounded-xl shadow-lg">
        <CardContent className="p-6">{currentStep.content}</CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between">
        <div>
          {!isFirstStep && (
            <Button onClick={handlePrevious} variant="outline">
              Previous
            </Button>
          )}
        </div>
        <div className="flex space-x-4">
          {onSaveDraft && (
            <Button onClick={onSaveDraft} variant="outline">
              Save Draft
            </Button>
          )}
          <Button onClick={handleNext}>
            {isLastStep ? "Submit" : "Next"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MultiStepForm;