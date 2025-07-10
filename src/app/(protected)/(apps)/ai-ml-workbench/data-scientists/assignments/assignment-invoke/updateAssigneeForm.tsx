import { Button } from "@/shadcn/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/shadcn/ui/dialog";
import { Label } from "@/shadcn/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shadcn/ui/select"; // ✅ Correct import
import { useForm } from "react-hook-form";
import { invokeUpdateAssignee } from "./index";
import { useToast } from "@/shadcn/hooks/use-toast";
// Shadcn toast

interface AssigneeModalProps {
  show: boolean;
  onClose: () => void;
  assignmentId: string;
  assignmentName: string;
  assignees: { id: string; name: string }[];
  onAssign: (assignmentId: string, assigneeId: string) => void;
  assignmentData: any;
}

const AssigneeModal = ({
  show,
  onClose,
  assignmentId,
  assignmentName,
  assignees,
  onAssign,
}: AssigneeModalProps) => {
  const { register, handleSubmit, setValue, watch, reset } = useForm<{
    assignee: string;
  }>({
    defaultValues: { assignee: "" },
  });
  console.log("assignees-----------------", assignees);
  const selectedAssignee = watch("assignee");
  const { toast } = useToast();
  const handleAssign = () => {
    if (!selectedAssignee) {
      toast({
        title: "Error",
        description: "Please select an assignee!",
        variant: "destructive",
      });
      return;
    }

    invokeUpdateAssignee(assignmentId, selectedAssignee);
    onAssign(assignmentId, selectedAssignee);
    toast({
      title: "Success",
      description: "Assignee updated successfully!",
    });

    reset();
    onClose();
  };

  return (
    <Dialog open={show} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Assign</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleAssign)} className="space-y-4">
          <div>
            <Label>Select Assignee</Label>
            <Select
              value={selectedAssignee} // ✅ Bind value to react-hook-form watch state
              onValueChange={(value) => setValue("assignee", value)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select Assignee" />{" "}
                {/* ✅ Ensure inside SelectTrigger */}
              </SelectTrigger>
              <SelectContent>
                {assignees.map((assignee) => (
                  <SelectItem key={assignee.id} value={assignee.id}>
                    {assignee.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={!selectedAssignee}>
              Assign
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AssigneeModal;
