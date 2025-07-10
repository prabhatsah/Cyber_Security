// 'use client';
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/shadcn/ui/dialog";


type RenameFolderDialogProps = {
    open: boolean;
    onClose: () => void;
    fileData: any;
};


export const FilePreviewDialog: React.FC<RenameFolderDialogProps> = ({ open, onClose, fileData }) => {
    let fileUrl = fileData.url;
    let fileName = fileData.fileName;
    const getPreviewContent = () => {
        if (fileName.endsWith(".pdf")) {
            // PDF preview
            return (
                <iframe
                    src={fileUrl}
                    className="w-full h-full border rounded"
                    title="PDF Preview"
                ></iframe>
            );
        } else if(fileName.endsWith(".txt")) {
            // Text file preview
            return (
                <iframe
                    src={fileUrl}
                    className="w-full h-full border rounded"
                    title="Text File Preview"
                ></iframe>
            );
        }
        else if (fileName.match(/\.(jpeg|jpg|png|gif)$/i)) {
            // Image preview
            return (
                <img
                    src={fileUrl}
                    alt="Image Preview"
                    className="w-full h-full object-contain"
                />
            );
        } else if (fileName.match(/\.(doc|docx|xls|xlsx|ppt|pptx)$/i)) {
            // Office file preview (using Google Docs Viewer or Microsoft Office Viewer)
            // const googleViewerUrl = `https://docs.google.com/gview?url=${encodeURIComponent(fileUrl)}&embedded=true`;
            return (
                <iframe
                    // src={googleViewerUrl}
                    src={fileUrl}
                    className="w-full h-full border rounded"
                    title="Office File Preview"
                ></iframe>
            );
        } else {
            // Fallback for unsupported types
            return <p>Preview not supported for this file type.</p>;
        }
    };
    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="w-4/5 sm:max-w-[425px] md:max-w-[1024px] lg:max-w-[1024px] max-h-[96%] h-full flex flex-col rounded-lg shadow-lg p-5">
                <DialogHeader>
                    <DialogTitle className="text-lg font-semibold">{fileData.fileName}</DialogTitle>
                </DialogHeader>

                {/* Separator */}
                {/* <div className="border-t"></div> */}

                {/* Body Section */}
                <div className="flex-1 overflow-y-auto">
                    {/* <RenameFolderForm open={open} onClose={() => onClose()} folder_Identifier={folder_Identifier}
                        folderName={folderName} /> */}
                    {getPreviewContent()}
                </div>

                {/* Separator */}
                {/* <div className="border-t"></div> */}

                {/* Footer Section */}
                <DialogFooter style={{ marginBottom: '-15px' }}></DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
