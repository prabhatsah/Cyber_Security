'use client';
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/shadcn/ui/dialog";
import {CreateFolderForm} from "./index";


type LogoutDialogProps = {
    open: boolean;
    onClose: () => void;
    folderIdentifier: any; // Add this line
  };
  

export const CreateFolderDialog: React.FC<LogoutDialogProps> = ({ open, onClose, folderIdentifier }) => {
    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="w-4/5 sm:max-w-[425px] md:max-w-[1024px] lg:max-w-[1024px] max-h-[80vh] flex flex-col rounded-lg shadow-lg p-5">
                <DialogHeader>
                    <DialogTitle className="text-lg font-semibold">Create New Folder</DialogTitle>
                </DialogHeader>

                {/* Separator */}
                {/* <div className="border-t"></div> */}

                {/* Body Section */}
                <div className="flex-1 overflow-y-auto">
                    <CreateFolderForm open={open} onClose={() => onClose()} folderIdentifier={folderIdentifier}/>
                </div>

                {/* Separator */}
                {/* <div className="border-t"></div> */}

                {/* Footer Section */}
                <DialogFooter style={{ marginBottom: '-15px' }}></DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
