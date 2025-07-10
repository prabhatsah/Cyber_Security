"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shadcn/ui/dialog";
import { Textarea } from "@/shadcn/ui/textarea";
import { Button } from "@/shadcn/ui/button";
import { ChatSection } from "../../../my-templates/template-form/ChatSection";
import { toast } from "sonner";
import { getProjectDetailsData } from "../../../../../_utils/common/get-particular-project-details-data";
import { saveDraftFinalizeData } from "../../../../../_utils/buyer/my-rfps/rfp-details-page/draft-editor-ai-functions";
import { Label } from "@/shadcn/ui/label";
import { Input } from "@/shadcn/ui/input";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  draftId: string;
}

type FileValidation = File | null;

const ChatWithTextareaModal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  draftId,
}) => {
  const [textareaValue, setTextareaValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [file, setFile] = useState<FileValidation>(null);
  const [existingFileName, setexistingFileName] = useState("");

  const handleSubmit = async () => {
    console.log("Textarea Value:", textareaValue);
    console.log("File:", file);
    if (!textareaValue && !file) {
      toast.error("Please enter text or upload a file");
      return;
    }
    try {
      await saveDraftFinalizeData(textareaValue, draftId, file);
      toast.success("Draft Saved");
      console.log("success");
    } catch (error) {
      console.log("error");
      toast.error("Failed to perform action");
    }
    onClose();
  };

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success("Copied to clipboard!");
    } catch (err) {
      console.error("Failed to copy:", err);
      toast.error("Failed to copy to clipboard!");
    }
  };

  useEffect(() => {
    if (!isOpen) return;

    const fetchDraftData = async () => {
      setLoading(true);
      setError("");
      try {
        const draftData: any = await getProjectDetailsData(
          draftId ? draftId : ""
        );
        if (draftData.selectedTemplate) {
          setTextareaValue(draftData.draftContent);
        }
        if (draftData.draftResource) {
          setexistingFileName(draftData.draftResource.resourceName);
        }
      } catch (err) {
        setError("Failed to fetch data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchDraftData();
  }, [draftId, isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[1200px] h-[800px] overflow-hidden">
        <DialogHeader>
          <DialogTitle>Chat Modal</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-4 h-full">
          {/* Left - Chat Section */}
          <div className="h-full border border-gray-200 p-4 rounded-md">
            <ChatSection onCopy={handleCopy} />
          </div>

          {/* Right - Textarea */}

          <div className="h-full flex flex-col gap-4">
            {/* File Upload */}
            <div>
              <Label htmlFor="file">
                Upload RFP Document <b className="text-danger">&nbsp;*</b>
              </Label>
              <Input
                id="file"
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    setFile(file);
                  }
                }}
                className="file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
              />
              {existingFileName && (
                <p className="text-sm text-gray-500">
                  Selected file: {existingFileName}
                </p>
              )}
            </div>

            <div className="flex items-center justify-center">
              <p className="text-center">OR</p>
            </div>

            {/* Textarea */}
            <div className="flex-1 flex flex-col">
              <Label htmlFor="file">
                Edit RFP Document <b className="text-danger">&nbsp;*</b>
              </Label>
              <Textarea
                className="h-full resize-none"
                placeholder="Enter text..."
                value={textareaValue}
                onChange={(e) => setTextareaValue(e.target.value)}
              />
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button type="submit" onClick={handleSubmit}>
            Save Draft
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ChatWithTextareaModal;
