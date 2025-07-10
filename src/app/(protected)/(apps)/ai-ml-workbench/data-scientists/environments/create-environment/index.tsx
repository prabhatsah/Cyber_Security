"use client";
import { useEffect, useState } from "react";
import { Check, ChevronsUpDown, Plus } from "lucide-react";
import { IconButtonWithTooltip } from "@/ikon/components/buttons";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/shadcn/ui/dialog";
import { Input } from "@/shadcn/ui/input";
import { Label } from "@/shadcn/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/shadcn/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/shadcn/ui/command";
import { Button } from "@/shadcn/ui/button";
import { useMlServerData } from "../../../admin/components/data-collection";
import { startEnvironmentData } from "../invoke-environment";
import { useRouter } from "next/navigation";
import moment from "moment";
import { toast } from "sonner";
import { randomUUID } from "crypto";

const languages = [
  {
    value: "R",
    label: "R",
  },
  {
    value: "Python",
    label: "Python",
  },
];

function CreateEnvironmentModal() {
  const [isModalOpen, setModalOpen] = useState(false);
  const [envName, setEnvName] = useState("");
  const [workspaces, setWorkspaces] = useState<any[]>([]);
  const [selectedWorkspace, setSelectedWorkspace] = useState("");
  const [languageValue, setLanguageValue] = useState("");
  const router = useRouter();

  const getWorkSpaceData = async () => {
    const mlServerData = await useMlServerData();
    console.log("mlServerData-------", mlServerData);
    setWorkspaces(mlServerData);
  };
  useEffect(() => {
    getWorkSpaceData();
  }, []);

  const toggleModal = () => {
    setModalOpen((prev) => !prev);
  };

  const resetForm = () => {
    setEnvName("");
    setSelectedWorkspace("");
    setLanguageValue("");
  };

  const handleOnSubmit = async () => {
    const selectedWorkspaceData = workspaces.find(
      (workspace) => workspace.workspaceId === selectedWorkspace
    );

    const fullData = {
      envName: envName,
      assignmentId: new Date().getTime().toString(),
      containerId: selectedWorkspaceData?.workspaceId,
      envStatus: "Not Ready",
      createdOn: moment().format("YYYY-MM-DDTHH:mm:ss.SSSZZ"),
      envId: crypto.randomUUID(),
      language: languageValue,
      probeId: selectedWorkspaceData?.probeId || "",
      workspaceName: selectedWorkspaceData?.workspaceName || "",
    };

    console.log("Submitting data:", fullData);

    try {
      await startEnvironmentData(fullData);
      toast.success("Environment created successfully!");
      setModalOpen(false);
      resetForm();
      router.refresh();
    } catch (error) {
      toast.error("Some error happened while creating environment!");
      console.error("Submission failed:", error);
    }
  };

  return (
    <>
      <Dialog
        open={isModalOpen}
        onOpenChange={(open) => {
          setModalOpen(open);
          if (!open) {
            resetForm();
          }
        }}
      >
        <DialogTrigger asChild>
          <IconButtonWithTooltip
            tooltipContent="Create Environment"
            onClick={toggleModal}
          >
            <Plus />
          </IconButtonWithTooltip>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Create Environment</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Environment Name
              </Label>
              <Input
                id="name"
                value={envName}
                placeholder="Enter the environment name.."
                onChange={(e) => setEnvName(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="w-full">
              <Label className="text-right">Workspace</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    className="w-full justify-between"
                  >
                    {selectedWorkspace
                      ? workspaces.find(
                          (workspace) =>
                            workspace.workspaceId === selectedWorkspace
                        )?.workspaceName
                      : "Select workspace..."}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0">
                  <Command>
                    <CommandInput placeholder="Search Workspace..." />
                    <CommandList>
                      <CommandEmpty>No workspace found.</CommandEmpty>
                      <CommandGroup>
                        {workspaces.map((workspace) => (
                          <CommandItem
                            key={workspace.workspaceId}
                            value={workspace.workspaceId}
                            onSelect={(currentValue) => {
                              setSelectedWorkspace(
                                currentValue === selectedWorkspace
                                  ? ""
                                  : currentValue
                              );
                              document.dispatchEvent(
                                new KeyboardEvent("keydown", { key: "Escape" })
                              );
                            }}
                          >
                            <Check
                              className={`mr-2 h-4 w-4 ${
                                selectedWorkspace === workspace.workspaceId
                                  ? "opacity-100"
                                  : "opacity-0"
                              }`}
                            />
                            {workspace.workspaceName}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>
            <div className="w-full">
              <Label className="text-right">Language</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    className="w-full justify-between"
                  >
                    {languageValue
                      ? languages.find(
                          (language) => language.value === languageValue
                        )?.label
                      : "Select language..."}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0">
                  <Command>
                    <CommandInput placeholder="Search Language..." />
                    <CommandList>
                      <CommandEmpty>No language found.</CommandEmpty>
                      <CommandGroup>
                        {languages.map((language) => (
                          <CommandItem
                            key={language.value}
                            value={language.value}
                            onSelect={(currentValue) => {
                              setLanguageValue(
                                currentValue === languageValue
                                  ? ""
                                  : currentValue
                              );
                              document.dispatchEvent(
                                new KeyboardEvent("keydown", { key: "Escape" })
                              );
                            }}
                          >
                            <Check
                              className={`mr-2 h-4 w-4 ${
                                languageValue === language.value
                                  ? "opacity-100"
                                  : "opacity-0"
                              }`}
                            />
                            {language.label}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" onClick={handleOnSubmit}>
              Proceed
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default CreateEnvironmentModal;
