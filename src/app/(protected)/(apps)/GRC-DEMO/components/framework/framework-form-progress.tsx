"use client";

import { cn } from "@/shadcn/lib/utils";
import { CheckIcon } from "lucide-react";

interface FrameworkFormProgressProps {
  currentStep: number;
  totalSteps: number;
}

export function FrameworkFormProgress({ 
  currentStep, 
  totalSteps 
}: FrameworkFormProgressProps) {
  const steps = [
    { id: 1, name: "Framework Details" },
    { id: 2, name: "Controls & Clauses" },
    { id: 3, name: "Objectives" },
    { id: 4, name: "Review & Submit" },
  ];

  return (
    <div className="py-4">
      <ol className="flex items-center w-full">
        {steps.map((step, index) => (
          <li key={step.id} className={cn(
            "flex items-center",
            index < steps.length - 1 ? "w-full" : ""
          )}>
            <div className={cn(
              "flex items-center justify-center w-8 h-8 rounded-full shrink-0",
              currentStep > step.id ? "bg-primary" : 
              currentStep === step.id ? "border-2 border-primary text-primary" : 
              "bg-muted text-muted-foreground"
            )}>
              {currentStep > step.id ? (
                <CheckIcon className="w-4 h-4 text-white" />
              ) : (
                <span>{step.id}</span>
              )}
            </div>
            
            <span className={cn(
              "ml-2 text-sm md:text-base hidden sm:inline-block",
              currentStep === step.id ? "font-medium text-primary" : 
              currentStep > step.id ? "font-medium" : 
              "text-muted-foreground"
            )}>
              {step.name}
            </span>

            {index < steps.length - 1 && (
              <div className={cn(
                "w-full flex-1 h-0.5 mx-2 sm:mx-4",
                currentStep > step.id + 1 ? "bg-primary" : "bg-muted"
              )}></div>
            )}
          </li>
        ))}
      </ol>
    </div>
  );
}