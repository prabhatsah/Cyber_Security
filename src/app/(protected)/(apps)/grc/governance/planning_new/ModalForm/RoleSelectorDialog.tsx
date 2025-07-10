import { useState } from "react"
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/shadcn/ui/dialog"
import { Button } from "@/shadcn/ui/button"
import { RadioGroup, RadioGroupItem } from "@/shadcn/ui/radio-group"
import { Label } from "@/shadcn/ui/label"

interface RoleSelectorDialogProps {
  onSelectRole: (role: string) => void;
}

export function RoleSelectorDialog({ onSelectRole }: RoleSelectorDialogProps) {
  const [role, setRole] = useState("");

  const handleSubmit = () => {
    if (role) {
      onSelectRole(role);
    } else {
      alert("Please select a role.");
    }
  };

  return (
    <Dialog open>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Are you an Auditor or Auditee?</DialogTitle>
        </DialogHeader>

        <RadioGroup value={role} onValueChange={setRole} className="space-y-2">
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="auditor" id="auditor" />
            <Label htmlFor="auditor">Auditor</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="auditeeType1" id="auditee1" />
            <Label htmlFor="auditeeType1">Auditee Type 1</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="auditeeType2" id="auditee2" />
            <Label htmlFor="auditeeType2">Auditee Type 2</Label>
          </div>
        </RadioGroup>

        <DialogFooter className="pt-4">
          <Button onClick={handleSubmit}>Submit</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
