"use client";
import { TextButton } from "@/ikon/components/buttons";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { UploadFileComponentV2 } from "./index";
import { UploadIcon } from "lucide-react";
import { Input } from "@/shadcn/ui/input";

interface LogoutDialogProps {
  open: boolean;
  onClose: () => void;
}

export const UploadFileModalV2: React.FC<LogoutDialogProps> = ({
  open,
  onClose,
}) => {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="w-4/5 sm:max-w-[425px] md:max-w-[1024px] lg:max-w-[1024px] max-h-[80vh] flex flex-col rounded-lg shadow-lg p-5">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">
            Upload File
          </DialogTitle>
        </DialogHeader>

        {/* Separator */}
        {/* <div className="border-t"></div> */}

        {/* Body Section */}
        <div className="flex-1 overflow-y-auto">
          <UploadFileComponentV2 onClose={() => onClose()} />
        </div>
        {/* Footer Section */}
        <DialogFooter style={{ marginBottom: "-15px" }}></DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
