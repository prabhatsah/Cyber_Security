import React from "react";
import { toast } from "sonner";
import {
  MoreHorizontal,
  Folder,
  Scissors,
  Copy,
  Clipboard,
  Edit,
  Share2,
  Star,
  Info,
  Trash,
  Undo,
  Eye,
} from "lucide-react"; // Adjust imports based on your icon library
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from "@/shadcn/ui/dropdown-menu"; // Update this path if necessary
import { Button } from "@/shadcn/ui/button"; // Update this path if necessary
import { redirect } from 'next/navigation';
import { addToStarred, deleteItem, restoreOrPermanentlyDeleteSelectItemType, preview, cutOrCopyDocument, pasteInSelectedFolder } from "../../actions";
import { FolderIdentifier } from "../../types";

interface FileActionsDropdownProps {
  folderIdentifier: FolderIdentifier;
  row: any;
  setOpenRenameFolderDialog: (open: boolean) => void;
  setRenameData?: (data: any) => void;
  setOpenFileDialog?: (open: boolean) => void;
  setFileData?: (data: any) => void;
  setOpenSharedDialog?: (data: any) => void;
}
const FileActionsDropdown: React.FC<FileActionsDropdownProps> = ({
  folderIdentifier,
  row,
  setOpenRenameFolderDialog,
  setRenameData,
  setOpenFileDialog,
  setFileData,
  setOpenSharedDialog
}) => {
  return (
    <>
      {folderIdentifier.parent === "my-drive" ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            {row.type === "folder" ? (
              <DropdownMenuItem
                onClick={() => {
                  let href = `/document-management/folders/${row.folder_identifier}`;
                  redirect(href);
                }}
              >
                <Folder className="h-4 w-4 mr-2" />
                Open Folder
              </DropdownMenuItem>
            ) : null}
            <DropdownMenuItem onClick={() => toast("Cut action executed")}>
              <Scissors className="h-4 w-4 mr-2" />
              Cut
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                console.log(row);
                cutOrCopyDocument(row.folderId, row?.resource_identifier, 'copy', row.type);
                toast.success("Document copied successfully");
              }}
            >
              <Copy className="h-4 w-4 mr-2" />
              Copy
            </DropdownMenuItem>
            {row.type === "folder" ? (
              <DropdownMenuItem
                onClick={async () => {
                  await pasteInSelectedFolder(row.folder_identifier);
                  const currentUrl = window.location.href;
                  redirect(currentUrl);
                }}
              >
                <Clipboard className="h-4 w-4 mr-2" />
                Paste
              </DropdownMenuItem>
            ) : null}
            {row.type === "folder" ? (
              <DropdownMenuItem
                onClick={() => {
                  let obj = {
                    folder_identifier: row.folder_identifier,
                    folderName: row.name,
                  };
                  if (setRenameData) {
                    setRenameData(obj);
                  }
                  setOpenRenameFolderDialog(true);
                }}
              >
                <Edit className="h-4 w-4 mr-2" />
                Rename
              </DropdownMenuItem>
            ) : null}
            <DropdownMenuItem
              onClick={() => {
                if (setOpenSharedDialog) {
                  setOpenSharedDialog({ isOpen: true, rowData: row });
                  // sharedFns(row);
                }
              }}
            >
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={async () => {
                const currentUrl = window.location.href;
                console.log(currentUrl);
                await addToStarred(
                  row.type,
                  row.resource_identifier,
                  row.folderId,
                  "starred",
                  "true"
                );
                redirect(currentUrl);
              }}
            >
              <Star className="h-4 w-4 mr-2" />
              Add to Starred
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                console.log(row);
              }}
            >
              <Info className="h-4 w-4 mr-2" />
              View Details
            </DropdownMenuItem>
            {row.type !== "folder" ? (
              <DropdownMenuItem
                onClick={async () => {
                  const resourceDetails = {
                    resourceId: row.resourceId,
                    resourceName: row.resourceName,
                    resourceType: row.resourceType,
                  };
                  const url: any = await preview(resourceDetails);
                  let obj: any = {
                    url: url,
                    fileName: row.resourceName,
                  };
                  if (setFileData) {
                    setFileData(obj);
                  }
                  if (setOpenFileDialog) {
                    setOpenFileDialog(true);
                  }
                  // const currentUrl = window.location.href;
                  // window.open(url, '_blank');
                }}
              >
                <Eye className="h-4 w-4 mr-2" />
                Priview
              </DropdownMenuItem>
            ) : null}
            <DropdownMenuItem
              onClick={async () => {
                await deleteItem(
                  row.type,
                  row.folder_identifier,
                  row.resource_identifier
                );
                const currentUrl = window.location.href;
                redirect(currentUrl);
              }}
            >
              <Trash className="h-4 w-4 mr-2" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : null}
      {folderIdentifier.parent === 'shared-with-me' ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            {row.type === "folder" ? (
              <DropdownMenuItem
                onClick={() => {
                  let href = `/document-management/folders/${row.folder_identifier}`;
                  redirect(href);
                }}
              >
                <Folder className="h-4 w-4 mr-2" />
                Open Folder
              </DropdownMenuItem>
            ) : null}
            <DropdownMenuItem onClick={() => toast("Cut action executed")}>
              <Scissors className="h-4 w-4 mr-2" />
              Cut
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                console.log(row);
                cutOrCopyDocument(row.folderId, row?.resource_identifier, 'copy', row.type);
                toast.success("Document copied successfully");
              }}
            >
              <Copy className="h-4 w-4 mr-2" />
              Copy
            </DropdownMenuItem>
            {row.type === "folder" ? (
              <DropdownMenuItem
                onClick={async () => {
                  await pasteInSelectedFolder(row.folder_identifier);
                  const currentUrl = window.location.href;
                  redirect(currentUrl);
                }}
              >
                <Clipboard className="h-4 w-4 mr-2" />
                Paste
              </DropdownMenuItem>
            ) : null}
            {row.type === "folder" ? (
              <DropdownMenuItem
                onClick={() => {
                  let obj = {
                    folder_identifier: row.folder_identifier,
                    folderName: row.name,
                  };
                  if (setRenameData) {
                    setRenameData(obj);
                  }
                  setOpenRenameFolderDialog(true);
                }}
              >
                <Edit className="h-4 w-4 mr-2" />
                Rename
              </DropdownMenuItem>
            ) : null}
            <DropdownMenuItem
              onClick={async () => {
                if (setOpenSharedDialog) {
                  setOpenSharedDialog(true);
                }
              }}
            >
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={async () => {
                const currentUrl = window.location.href;
                console.log(currentUrl);
                await addToStarred(
                  row.type,
                  row.resource_identifier,
                  row.folderId,
                  "starred",
                  "true"
                );
                redirect(currentUrl);
              }}
            >
              <Star className="h-4 w-4 mr-2" />
              Add to Starred
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                console.log(row);
              }}
            >
              <Info className="h-4 w-4 mr-2" />
              View Details
            </DropdownMenuItem>
            {row.type !== "folder" ? (
              <DropdownMenuItem
                onClick={async () => {
                  const resourceDetails = {
                    resourceId: row.resourceId,
                    resourceName: row.resourceName,
                    resourceType: row.resourceType,
                  };
                  const url: any = await preview(resourceDetails);
                  let obj: any = {
                    url: url,
                    fileName: row.resourceName,
                  };
                  if (setFileData) {
                    setFileData(obj);
                  }
                  if (setOpenFileDialog) {
                    setOpenFileDialog(true);
                  }
                  // const currentUrl = window.location.href;
                  // window.open(url, '_blank');
                }}
              >
                <Eye className="h-4 w-4 mr-2" />
                Priview
              </DropdownMenuItem>
            ) : null}
            <DropdownMenuItem
              onClick={async () => {
                await deleteItem(
                  row.type,
                  row.folder_identifier,
                  row.resource_identifier
                );
                const currentUrl = window.location.href;
                redirect(currentUrl);
              }}
            >
              <Trash className="h-4 w-4 mr-2" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : null}
      {folderIdentifier.parent === "starred" ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuItem
              onClick={() => {
                let href = `/document-management/folders/${row.folder_identifier}`;
                redirect(href);
              }}
            >
              <Folder className="h-4 w-4 mr-2" />
              Open Folder
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => toast("Cut action executed")}>
              <Scissors className="h-4 w-4 mr-2" />
              Cut
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                console.log(row);
                // redirect(href);
              }}
            >
              <Copy className="h-4 w-4 mr-2" />
              Copy
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => toast("Pasted successfully")}>
              <Clipboard className="h-4 w-4 mr-2" />
              Paste
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => toast("Renaming item")}>
              <Edit className="h-4 w-4 mr-2" />
              Rename
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={async () => {
                await addToStarred(
                  row.type,
                  row.resource_identifier,
                  row.folderId,
                  "starred",
                  "false"
                );
                const currentUrl = window.location.href;
                redirect(currentUrl);
              }}
            >
              <Star className="h-4 w-4 mr-2" />
              Remove from Starred
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => toast("Viewing details")}>
              <Info className="h-4 w-4 mr-2" />
              View Details
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => toast("Item deleted")}>
              <Trash className="h-4 w-4 mr-2" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : null}
      {folderIdentifier.parent === "trash" ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuItem
              onClick={async () => {
                await restoreOrPermanentlyDeleteSelectItemType(
                  row.type,
                  row.resource_identifier,
                  row.folderId,
                  "restore"
                );
                toast.success("Document restore successfully");
                const currentUrl = window.location.href;
                redirect(currentUrl);
              }}
            >
              <Undo className="h-4 w-4 mr-2" />
              Restore
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={async () => {
                await restoreOrPermanentlyDeleteSelectItemType(
                  row.type,
                  row.resource_identifier,
                  row.folderId,
                  "delete"
                );
                toast.success("Document deleted successfully");
                const currentUrl = window.location.href;
                redirect(currentUrl);
              }}
            >
              <Trash className="h-4 w-4 mr-2" />
              Delete Permanently
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : null}
    </>
  );
};

export default FileActionsDropdown;
