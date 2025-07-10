import type React from 'react';
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from '@/shadcn/ui/dialog';
import { Button } from '@/shadcn/ui/button';
import ThreeTest from './load-hvac';

type LabelDialogProps = {
  open: boolean;
  message: string;
  onClose: () => void;
};

const LabelDialog: React.FC<LabelDialogProps> = ({ open, message, onClose }) => {
  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
      if (!isOpen) onClose();
    }}>
      <DialogContent className="w-[1000px] max-w-full">
        <DialogTitle>Label Info</DialogTitle>
        <p>{message}</p>
        <ThreeTest />
      </DialogContent>
    </Dialog>
  );
};

export default LabelDialog;
