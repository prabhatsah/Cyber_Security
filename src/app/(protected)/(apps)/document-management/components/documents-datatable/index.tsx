import { DataTable } from "@/ikon/components/data-table";
import { Button } from "@/shadcn/ui/button";
import { ArrowUpDown } from "lucide-react";
import Link from "next/link";
import { DTColumnsProps } from "@/ikon/components/data-table/type";
import FileActionsDropdown from "../dropdown-menu/FileActionsDropdown";
import CreateOrManageDropdown from "../dropdown-menu/CreateOrManageDropdown";
import { FolderIdentifier } from "../../types";
import { Clipboard } from "lucide-react";
import { Tooltip } from "@/ikon/components/tooltip";
import { pasteInSelectedFolder } from "../../actions";
import { redirect } from 'next/navigation';

function getColumnSchema(
  folderIdentifier: FolderIdentifier,
  setOpenRenameFolderDialog: (open: boolean) => void,
  setRenameData?: (data: any) => void,
  setOpenFileDialog?: (open: boolean) => void,
  setFileData?: (data: any) => void,
  setOpenSharedDialog?: (data: any) => void
) {
  //Column Schema
  const columns: DTColumnsProps<any>[] = [
    {
      accessorKey: "documentName",
      // cell: (info: any) => {
      //     return <Link href={"../sales-crm"}>{info.getValue()}</Link>
      // },
      header: ({ column }) => {
        return (
          <Button
            className="px-0"
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Name
            <ArrowUpDown />
          </Button>
        );
      },
      title: "Name",
      accessorFn: (row) => `${row.name}`,
      cell: (info: any) => {
        if (info.row.original.type === "folder") {
          let href = `/document-management/folders/${info.row.original.folder_identifier}`;
          return (
            <div className="flex items-center">
              <Link href={href}>{info.getValue()}</Link>
            </div>
          );
        } else {
          return <div className="flex items-center">{info.getValue()}</div>;
        }
      },
    },
    {
      accessorKey: "documentOwner",
      // cell: (info: any) => {
      //     return <Link href={"../sales-crm"}>{info.getValue()}</Link>
      // },
      header: ({ column }) => {
        return (
          <Button
            className="px-0"
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Owner
            <ArrowUpDown />
          </Button>
        );
      },
      title: "Owner",
      accessorFn: (row) => `${row.owner} `,
    },
    {
      accessorKey: "lastModified",
      // cell: (info: any) => {
      //     return <Link href={"../sales-crm"}>{info.getValue()}</Link>
      // },
      header: ({ column }) => {
        return (
          <Button
            className="px-0"
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Last Modified
            <ArrowUpDown />
          </Button>
        );
      },
      title: "Last Modified",

      accessorFn: (row) => `${row.last_modified}`,
    },
    {
      accessorKey: "fileSize",
      // cell: (info: any) => {
      //     return <Link href={"../sales-crm"} >{info.getValue()}</Link>
      // },
      header: ({ column }) => {
        return (
          <Button
            className="px-0"
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            File Size
            <ArrowUpDown />
          </Button>
        );
      },
      title: "File Size",
      accessorFn: (row) =>
        row.size != null ? `${(row.size / 1024).toFixed(2)} KB` : "---",
    },
    {
      id: "actions",
      header: "Actions",
      enableHiding: false,
      cell: ({ row }) => {
        const rowData = row.original;

        return (
          <FileActionsDropdown
            folderIdentifier={folderIdentifier}
            row={rowData}
            setOpenRenameFolderDialog={setOpenRenameFolderDialog}
            setRenameData={setRenameData}
            setOpenFileDialog={setOpenFileDialog}
            setFileData={setFileData}
            setOpenSharedDialog={setOpenSharedDialog}
          />
        );
      },
    },
  ];
  return columns;
}
function getFilterData(documentData: any) {
  if (!documentData) {
    return [];
  }
  const filterData = [];
  let obj = {};
  for (let i = 0; i < documentData.length; i++) {
    if (documentData[i].type === "folder") {
      // obj = {
      //     name: documentData[i].name,
      //     lastModified: documentData[i].last_modified, // Format the date here
      //     owner: documentData[i].owner,
      //     fileSize: "---",
      // }
      documentData[i].size = "---";
      // filterData.push(obj);
    } else {
      obj = {
        documentName: documentData[i].name,
        lastModified: documentData[i].last_modified, // Format the date here
        documentOwner: documentData[i].owner,
        fileSize: (documentData[i].size / 1024).toFixed(2) + " KB",
      };
      filterData.push(obj);
    }
  }
  return filterData;
}

interface DocumentDatatableProps {
  documentData: any;

  folderIdentifier: FolderIdentifier;

  setOpenUploadDialog: (open: boolean) => void;

  setOpenCreateFolderDialog: (open: boolean) => void;

  setOpenRenameFolderDialog: (open: boolean) => void;

  setRenameData?: (data: any) => void;

  setOpenFileDialog: (open: boolean) => void;

  setFileData?: (data: any) => void;

  setOpenSharedDialog?: (data: any) => void;
}

export default function DocumentDatatable({
  documentData,
  folderIdentifier,
  setOpenUploadDialog,
  setOpenCreateFolderDialog,
  setOpenRenameFolderDialog,
  setRenameData,
  setOpenFileDialog,
  setFileData,
  setOpenSharedDialog
}: DocumentDatatableProps) {
  // let filterData = getFilterData(documentData);
  const columns = getColumnSchema(
    folderIdentifier,
    setOpenRenameFolderDialog,
    setRenameData,
    setOpenFileDialog,
    setFileData,
    setOpenSharedDialog
  );
  const extraParams: any = {
    searching: true,
    filtering: true,
    grouping: true,
    extraTools: [
      <CreateOrManageDropdown
        setOpenUploadDialog={setOpenUploadDialog}
        setOpenCreateFolderDialog={setOpenCreateFolderDialog}
      />,
      <Tooltip tooltipContent="Paste">
        <Button variant="outline" className="p-2 gap-1"
          onClick={async () => { 
            await pasteInSelectedFolder(folderIdentifier.folder_identifier);
            const currentUrl = window.location.href;
            redirect(currentUrl);
          }}>
          <Clipboard />
        </Button>
      </Tooltip>
    ],
  };
  return (
    <>
      <DataTable
        columns={columns}
        data={documentData}
        extraParams={extraParams}
      />
    </>
  );
}
