'use client';

import { useState } from "react";
import { CreateFolderDialog } from "./components/form/Modal-Form/create-folder-form/modal";
import { UploadFileModal } from "./components/form/Modal-Form/upload-file-form/modal";
import { RenameFolderDialog } from "./components/form/Modal-Form/rename-folder-form/modal";
import { FilePreviewDialog } from "./components/form/Modal-Form/file-preview-dialog/modal";
import { SharedDialog } from "./components/form/Modal-Form/shared-form/modal";
import DocumentDatatable from './components/documents-datatable/index';
import { FolderIdentifier } from "./types";

type ChildProps = {
  documentData: any;
  folderIdentifier: FolderIdentifier;
};

export default function ClientPage({ documentData, folderIdentifier }: ChildProps) {
  const [openCreateFolderDialog, setOpenCreateFolderDialog] = useState(false);
  const [openUploadDialog, setOpenUploadDialog] = useState(false);
  const [openRenameFolderDialog, setOpenRenameFolderDialog] = useState(false);
  // const [openSharedDialog, setOpenSharedDialog] = useState(false);
  const [renameData, setRenameData] = useState({
    folder_identifier: null,
    folderName: "",
  });
  const [fileData, setFileData] = useState({
    url: "",
    fileName: "",
  });
  const [openFileDialog, setOpenFileDialog] = useState(false);

  const [openSharedDialog, setOpenSharedDialog] = useState<{ isOpen: boolean; rowData?: any }>({
    isOpen: false,
    rowData: null,
  });
  

  return (
    <div className="p-4 h-full overflow-hidden">
      <DocumentDatatable
        documentData={documentData}
        folderIdentifier={folderIdentifier}
        setOpenUploadDialog={setOpenUploadDialog}
        setOpenCreateFolderDialog={setOpenCreateFolderDialog}
        setOpenRenameFolderDialog={setOpenRenameFolderDialog}
        setRenameData={setRenameData}
        setOpenFileDialog={setOpenFileDialog}
        setFileData={setFileData}
        setOpenSharedDialog={setOpenSharedDialog}
      />
      <CreateFolderDialog open={openCreateFolderDialog} onClose={() => setOpenCreateFolderDialog(false)} folderIdentifier={folderIdentifier} />
      <UploadFileModal open={openUploadDialog} onClose={() => setOpenUploadDialog(false)} folderIdentifier={folderIdentifier}/>
      <RenameFolderDialog open={openRenameFolderDialog} onClose={() => setOpenRenameFolderDialog(false)} folder_Identifier={renameData.folder_identifier}
        folderName={renameData.folderName} />
      <FilePreviewDialog open={openFileDialog} onClose={() => setOpenFileDialog(false)} fileData={fileData} />
      <SharedDialog open={openSharedDialog.isOpen} rowData={openSharedDialog.rowData} onClose={() => setOpenSharedDialog({ isOpen: false, rowData: {} })} />
    </div>
  );
}