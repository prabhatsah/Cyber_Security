import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/shadcn/ui/dialog";
import { ControlsHierarchy } from "./ControlsHierarchy";
import { ClipboardList } from "lucide-react";
import { Button } from "@/shadcn/ui/button";

interface EditPolicyProps {
  editrow: {
    policyName: string;
    controls?: any[]; // Replace with proper type if available
  };
  setOpenEditForm: (open: boolean) => void;
  openEditForm: boolean;
  isCentralAdminUser: boolean;
}

export const EditPolicy = ({
  editrow = { policyName: "", controls: [] },
  setOpenEditForm,
  openEditForm,
  isCentralAdminUser
}: EditPolicyProps) => {

  async function handleUpdate(){

  }
  return (
    <Dialog open={openEditForm} onOpenChange={setOpenEditForm}>
      <DialogContent className="max-w-[90vw] h-[90vh] p-0 overflow-hidden flex flex-col">
        <DialogHeader className="border-b p-6">
          <div className="flex items-center gap-3">
            <ClipboardList className="h-6 w-6 text-primary" />
            <div>
              <DialogTitle className="text-xl">
                {editrow.policyName || "Policy Details"}
              </DialogTitle>
              <DialogDescription>
                Review and edit the control objectives
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <div className="rounded-lg border bg-card p-6 shadow-sm">
            <ControlsHierarchy editrow={editrow || []} setOpenEditForm={setOpenEditForm} isCentralAdminUser={isCentralAdminUser}/>
          </div>
        </div>

        <footer className="border-t p-4 bg-muted/10">
          {/* <div className="text-center text-sm text-muted-foreground flex justify-end">
            <Button onClick={handleUpdate}>Update</Button>
          </div> */}
        </footer>
      </DialogContent>
    </Dialog>
  );
};
