import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shadcn/ui/dialog";
import { Button } from "@/shadcn/ui/button";
import { AlertCircle, Lightbulb, Sparkles, Check } from "lucide-react";
import { Checkbox } from "@/shadcn/ui/checkbox";
import { Label } from "@/shadcn/ui/label";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { HoverBorderGradient } from "@/shadcn/ui/hover-border-gradient";

export function ActionSuggestionModal({
  open,
  setOpen,
  controlPolicy,
  controlObjective,
  observation,
  recommendation,
  onSelectSuggestion,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
  controlPolicy: string;
  controlObjective: string;
  observation: string;
  recommendation: string;
  onSelectSuggestion: (suggestions: string[]) => void;
}) {
  const [aiResponse, setAiResponse] = useState<string[]>([]);
  const [selectedActions, setSelectedActions] = useState<boolean[]>([]);
  const [isAiLoading, setIsAiLoading] = useState(false);

  useEffect(() => {
    if (open) {
      setAiResponse([]);
      setSelectedActions([]);
    }
  }, [open]);

  const handleAskAI = async () => {
    setIsAiLoading(true);
    setAiResponse([]);

    try {
      const response = await fetch(
        "https://ikoncloud-dev.keross.com/aiagent/webhook/41d4d87e-a2bb-41d5-8132-ffba171eb409",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            policyForAI: controlPolicy,
            objectiveForAI: controlObjective,
            observation: observation,
            recommendation: recommendation,
          }),
        }
      );

      const data = await response.json();
      console.log("Raw API response:", data); // Debugging

      // Handle the response format where actions are in data[0].output as string
      let actions = [];

      if (data[0]?.output) {
        try {
          // The output is a string containing JSON array
          const parsedOutput = JSON.parse(data[0].output);
          if (Array.isArray(parsedOutput)) {
            actions = parsedOutput;
          }
        } catch (e) {
          console.error("Failed to parse output string:", e);
          // Try to extract array from malformed string
          const arrayMatch = data[0].output.match(/\[.*\]/);
          if (arrayMatch) {
            try {
              actions = JSON.parse(arrayMatch[0]);
            } catch (parseError) {
              console.error("Failed to parse extracted array:", parseError);
            }
          }
        }
      }

      // Fallback if no actions found
      if (!Array.isArray(actions) || actions.length === 0) {
        actions = [
          "Failed to parse AI suggestions. Please try again or enter manually.",
        ];
      }

      setAiResponse(actions);
      setSelectedActions(new Array(actions.length).fill(true));
    } catch (error) {
      console.error("API request failed:", error);
      toast.error("Failed to get AI suggestions. Please check your connection.",{duration:3000})
      return;
      setSelectedActions([true]);
    } finally {
      setIsAiLoading(false);
    }
  };

  const toggleActionSelection = (index: number) => {
    const newSelected = [...selectedActions];
    newSelected[index] = !newSelected[index];
    setSelectedActions(newSelected);
  };

  const selectAll = (select: boolean) => {
    setSelectedActions(new Array(aiResponse.length).fill(select));
  };

  const handleUseSelected = () => {
    const selected = aiResponse.filter((_, index) => selectedActions[index]);
    onSelectSuggestion(selected);
    setOpen(false);
    toast.success("AI Powered actions added successfully!",{duration:3000})
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[750px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-yellow-500" />
            AI Powered Action Suggestions
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-3 p-4 rounded-lg border">
            <h3 className="font-medium flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-orange-500" />
              Observation
            </h3>
            <p className="text-sm text-muted-foreground">
              {observation || "No observation provided"}
            </p>
          </div>

          <div className="space-y-3 p-4 rounded-lg border">
            <h3 className="font-medium flex items-center gap-2">
              <Lightbulb className="w-4 h-4 text-blue-500" />
              Recommendation
            </h3>
            <p className="text-sm text-muted-foreground">
              {recommendation || "No recommendation provided"}
            </p>
          </div>

          {aiResponse.length > 0 && (
            <div className="space-y-3 p-4 rounded-lg border border-primary/20">
              <div className="flex items-center justify-between">
                <h3 className="font-medium">Suggested Actions</h3>
                {aiResponse.length > 1 && (
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => selectAll(true)}
                      className="h-8 text-xs"
                    >
                      Select all
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => selectAll(false)}
                      className="h-8 text-xs"
                    >
                      Deselect all
                    </Button>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                {aiResponse.map((action, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <Checkbox
                      id={`action-${index}`}
                      checked={selectedActions[index]}
                      onCheckedChange={() => toggleActionSelection(index)}
                      className="mt-1"
                    />
                    <Label htmlFor={`action-${index}`} className="leading-snug">
                      {action}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="gap-2">
          {aiResponse.length === 0 ? (
          <HoverBorderGradient>
            <button
              onClick={handleAskAI}
              disabled={isAiLoading}
              className="gap-2"
            >
              {isAiLoading ? (
                <span className="animate-pulse">Generating...</span>
              ) : (
                <>
                  <div className="flex items-center gap-2"> <Sparkles className="w-4 h-4" />
                   Generate Action Suggestions</div>
                 </>
              )}
            </button>
            </HoverBorderGradient>
          ) : (
            <>
              <Button variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleUseSelected}>
                <Check className="w-4 h-4 mr-2" />
                Create Selected Actions (
                {selectedActions.filter(Boolean).length})
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
