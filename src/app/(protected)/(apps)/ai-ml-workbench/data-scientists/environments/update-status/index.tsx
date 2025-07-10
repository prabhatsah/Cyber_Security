import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/shadcn/ui/dialog";
import { Button } from "@/shadcn/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/shadcn/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/shadcn/ui/command";
import { Check, ChevronsUpDown } from "lucide-react";

interface UpdateStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (status: string, envId: string) => void;
  envName?: string;
  envId?: string;
}

const statuses = [
  { value: "Online", label: "Online" },
  { value: "Offline", label: "Offline" },
];

const UpdateStatusModal: React.FC<UpdateStatusModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  envName,
  envId,
}) => {
  const [selectedStatus, setSelectedStatus] = useState<string>("");

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update Status</DialogTitle>
        </DialogHeader>
        <p>
          Select the new status for <strong>{envName}</strong>:
        </p>

        <div className="mt-4">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full justify-between">
                {selectedStatus || "Select status..."}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0">
              <Command>
                <CommandInput placeholder="Search Status..." />
                <CommandList>
                  <CommandEmpty>No status found...</CommandEmpty>
                  <CommandGroup>
                    {statuses.map((status) => (
                      <CommandItem
                        key={status.value}
                        value={status.value}
                        onSelect={() => setSelectedStatus(status.value)}
                      >
                        <Check
                          className={`mr-2 h-4 w-4 ${
                            selectedStatus === status.value
                              ? "opacity-100"
                              : "opacity-0"
                          }`}
                        />
                        {status.label}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>

        <div className="flex justify-end gap-2 mt-6">
          <DialogClose asChild>
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
          </DialogClose>
          <Button
            onClick={() =>
              selectedStatus && envId && onConfirm(selectedStatus, envId)
            }
            disabled={!selectedStatus}
          >
            Confirm
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateStatusModal;
