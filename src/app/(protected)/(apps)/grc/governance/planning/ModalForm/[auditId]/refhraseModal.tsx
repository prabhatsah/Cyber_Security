// RephraseModal.tsx
import { useState, useEffect } from "react";
import { Button } from "@/shadcn/ui/button";
import { Textarea } from "@/shadcn/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shadcn/ui/dialog";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
} from "@/shadcn/ui/alert-dialog";

export function RephraseModal({
  open,
  onOpenChange,
  value,
  policyForAI,
  objectiveForAI,
  typeOfField,
  onSubmit,
  observationForAI,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  value: string;
  policyForAI: string;
  objectiveForAI: string;
  typeOfField: string;
  onSubmit: (newText: string) => void;
  observationForAI: string;
}) {
  const [aiResponse, setAiResponse] = useState<string | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [hasAcceptedAI, setHasAcceptedAI] = useState(false);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);

  // Reset state when modal reopens
  useEffect(() => {
    if (open) {
      setAiResponse(null);
      setHasAcceptedAI(false);
    }
  }, [open]);

  const handleAskAI = async () => {
    console.log("policyForAI---", policyForAI);
    console.log("objectiveForAI---", objectiveForAI);
    console.log("typeOfField---", typeOfField);
    if (!value.trim()) return;

    setIsAiLoading(true);
    setAiResponse(null);

    try {
      const response = await fetch(
        "https://ikoncloud-dev.keross.com/aiagent/webhook/aa440ceb-fe68-4954-a0ed-8f043384e4b7",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            chatInput: value,
            policyForAI: policyForAI,
            objectiveForAI: objectiveForAI,
            typeOfField: typeOfField,
            observationForAI: observationForAI,
          }),
        }
      );
      const data = await response.json();
      setAiResponse(data?.output || "No response received.");
    } catch (error) {
      setAiResponse("Failed to get AI response.");
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleKeepAI = () => {
    if (!aiResponse) return;
    setConfirmDialogOpen(true);
  };

  const confirmAIAcceptance = () => {
    if (aiResponse) {
      onSubmit(aiResponse);
      setHasAcceptedAI(true);
      setConfirmDialogOpen(false);
      onOpenChange(false);
    }
  };

  const handleKeepPrevious = () => {
    onOpenChange(false);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Rephrase Sentence</DialogTitle>
          </DialogHeader>

          <Textarea
            defaultValue={value}
            className="min-h-[100px] mb-4"
            onChange={(e) => !hasAcceptedAI && onSubmit(e.target.value)}
            disabled={aiResponse != null}
          />

          {aiResponse && (
            <div className="p-4 rounded-md mb-4 bg-muted/50">
              <h3 className="font-medium mb-2">AI Response:</h3>
              <p>{aiResponse}</p>
            </div>
          )}

          <DialogFooter className="gap-2">
            {!aiResponse ? (
              <>
                <Button
                  variant="outline"
                  onClick={handleAskAI}
                  disabled={isAiLoading}
                >
                  {isAiLoading ? "Asking AI..." : "Ask AI"}
                </Button>
                <Button variant="destructive" onClick={handleKeepPrevious}>
                  Close
                </Button>
              </>
            ) : (
              <>
                <Button variant="outline" onClick={handleKeepPrevious}>
                  Keep Previous
                </Button>
                <Button onClick={handleKeepAI} disabled={hasAcceptedAI}>
                  {hasAcceptedAI ? "Changes Applied" : "Keep AI Suggestion"}
                </Button>
                <Button
                  variant="outline"
                  onClick={handleAskAI}
                  disabled={isAiLoading}
                >
                  {isAiLoading ? "Asking AI..." : "Ask Again"}
                </Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={confirmDialogOpen} onOpenChange={setConfirmDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Accept AI Suggestion</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to replace your text with the AI suggestion?
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <Button onClick={confirmAIAcceptance}>Confirm</Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
