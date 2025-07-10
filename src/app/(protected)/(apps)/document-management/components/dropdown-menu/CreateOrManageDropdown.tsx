import React from "react";
import { Plus, Upload, FolderPlus } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "@/shadcn/ui/dropdown-menu";
import { Button } from "@/shadcn/ui/button";
import { Tooltip } from "@/ikon/components/tooltip";

interface CreateOrManageDropdownProps {
  setOpenUploadDialog: (open: boolean) => void;
  setOpenCreateFolderDialog: (open: boolean) => void;
}

const CreateOrManageDropdown: React.FC<CreateOrManageDropdownProps> = ({
  setOpenUploadDialog,
  setOpenCreateFolderDialog,
}) => {
  return (
    <DropdownMenu>
      <Tooltip tooltipContent="Create or Manage">
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="p-2 gap-1">
            <Plus />
          </Button>
        </DropdownMenuTrigger>
      </Tooltip>
      <DropdownMenuContent
        className="w-56"
        align="end"
        side="top"
        sideOffset={4}
      >
        {/* <DropdownMenuLabel>Select Action</DropdownMenuLabel> */}
        {/* <DropdownMenuSeparator /> */}
        <DropdownMenuRadioGroup>
          <Tooltip tooltipContent="Upload File">
            <DropdownMenuRadioItem
              value="upload"
              onClick={() => setOpenUploadDialog(true)}
              className="p-2"
            >
              <div className="flex items-center">
                <Upload className="mr-2 h-4 w-4" />
                <span>Upload File</span>
              </div>
            </DropdownMenuRadioItem>
          </Tooltip>
          <Tooltip tooltipContent="Create New Folder">
            <DropdownMenuRadioItem
              value="create"
              onClick={() => setOpenCreateFolderDialog(true)}
              className="p-2"
            >
              <div className="flex items-center">
                <FolderPlus className="mr-2 h-4 w-4" />
                <span>Create New Folder</span>
              </div>
            </DropdownMenuRadioItem>
          </Tooltip>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default CreateOrManageDropdown;
