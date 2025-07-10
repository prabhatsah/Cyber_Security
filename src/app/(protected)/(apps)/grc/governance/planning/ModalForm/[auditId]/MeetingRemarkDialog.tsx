'use client';
import React from "react";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/shadcn/ui/dialog";
import { Button } from "@/shadcn/ui/button";
import { Input } from "@/shadcn/ui/input";
import { Label } from "@/shadcn/ui/label";
import { Textarea } from "@/shadcn/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shadcn/ui/select";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  status: string;
  remark: string;
  duration: string;
  onStatusChange: (value: string) => void;
  onRemarkChange: (value: string) => void;
  onDurationChange: (value: string) => void;
  onSubmit: () => void;
};

const MeetingRemarkDialog: React.FC<Props> = ({
  open,
  onOpenChange,
  status,
  remark,
  duration,
  onStatusChange,
  onRemarkChange,
  onDurationChange,
  onSubmit
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Meeting Remarks</DialogTitle>
        </DialogHeader>

        {/* Status Dropdown */}
        <div className="grid gap-2">
          <Label>Status</Label>
          <Select onValueChange={onStatusChange} defaultValue={status}>
            <SelectTrigger>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="In Progress">In Progress</SelectItem>
              <SelectItem value="Completed">Completed</SelectItem>
              <SelectItem value="Pending">Pending</SelectItem>
            </SelectContent>
          </Select>
        </div>
        {/* Remark Field */}
        <div className="grid gap-2 mt-4">
          <Label>Remark</Label>
          <Textarea
            placeholder="Enter remark"
            value={remark}
            onChange={(e) => onRemarkChange(e.target.value)}
          />
        </div>

        {/* Duration Field */}
        <div className="grid gap-2 mt-4">
          <Label>Duration (in hours)</Label>
          <Input
            type="number"
            placeholder="Enter duration"
            value={duration}
            onChange={(e) => onDurationChange(e.target.value)}
          />
        </div>

        <DialogFooter className="mt-6">
          <Button onClick={onSubmit}>Submit</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default MeetingRemarkDialog;
