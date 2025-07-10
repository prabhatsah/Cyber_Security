import type React from "react";
import { Dialog, DialogContent, DialogTitle } from "@/shadcn/ui/dialog";

type AnalyzeDialogProps = {
  open: boolean;
  onClose: () => void;
  analyzeData: any[];
};

const AnalyzeDialog: React.FC<AnalyzeDialogProps> = ({
  open,
  onClose,
  analyzeData,
}) => {
 // console.log("AnalyzeDialog props:", analyzeData);
  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen) onClose();
      }}
    >
      <DialogContent className="w-[1000px] max-w-full">
        <DialogTitle>Insights and Recommendations</DialogTitle>
        <hr className="my-4" />
        <h5 className="text-sm font-semibold">Insights</h5>
        {/* Add your analysis data rendering logic here */}
        <ul className="list-disc pl-6 space-y-2 text-sm">
          {analyzeData.insights}
        </ul>
        <h5 className="text-sm font-semibold mt-4">
        Recommendations
            </h5>
            <ul className="list-disc pl-6 space-y-2 text-sm">
          {analyzeData.recommendations}
        </ul>

      </DialogContent>
    </Dialog>
  );
};

export default AnalyzeDialog;
