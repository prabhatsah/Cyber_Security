'use client';
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/shadcn/ui/dialog";
import SharedDatatable from "../../../shared-datatable";
import '../custom-scrollbar.css';
import { Button } from "@/shadcn/ui/button";
import { Share2 } from 'lucide-react';
import { useForm } from "react-hook-form";
import { Form } from "@/shadcn/ui/form";
import { useEffect, useState } from "react";
import { getUserMapForCurrentAccount, sharedFns } from "../../../../actions";
import { LoadingSpinner } from "@/ikon/components/loading-spinner";

type SharedDialogProps = {
    open: boolean;
    rowData: any;
    onClose: () => void;
   
};


export const SharedDialog: React.FC<SharedDialogProps> = ({ open, rowData, onClose }) => {
    const [isLoading, setIsLoading] = useState(true);
    const [userData, setUserData] = useState<any[]>([]);
    // Fetch data only when the dialog opens
    useEffect(() => {
        if (open) {
            setIsLoading(true);
            async function fetchData() {
                const data = await getUserMapForCurrentAccount({ groups: ["Document Management User"] });
                setUserData(data);
                setIsLoading(false);
            }
            fetchData();
        }
    }, [open]);

    const form = useForm({
        defaultValues: {
            folderToggleArray: [],  // Store IDs of toggled users
            folderCheckBoxArray: [], // Store IDs of checked users
        },
    });
    interface FormData {
        folderToggleArray: string[];
        folderCheckBoxArray: string[];
    }
    const onSubmit = async (data: FormData) => {
        console.log("Selected Users:", data.folderCheckBoxArray);
        console.log("Users with Edit Access:", data.folderToggleArray);
        console.log("rowData:", rowData);
        await sharedFns(data,rowData);
        // Send `data.folderCheckBoxArray` & `data.folderToggleArray` to backend or process accordingly
        onClose(); // Close the dialog after sharing
    };
    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="w-4/5 sm:max-w-[425px] md:max-w-[1024px] lg:max-w-[1024px] max-h-[80vh] flex flex-col rounded-lg shadow-lg p-5">
                <DialogHeader>
                    <DialogTitle className="text-lg font-semibold">{rowData?.name}</DialogTitle>
                    {/* <DialogTitle className="text-lg font-semibold">Folder or File name</DialogTitle> */}
                </DialogHeader>

                {/* Separator */}
                {/* <div className="border-t"></div> */}

                {/* Body Section */}
                {/* <div className="flex-grow overflow-y-auto custom-scrollbar">
                    <SharedDatatable />
                </div> */}
                <Form {...form}>
                    <form id="shareForm" onSubmit={form.handleSubmit(onSubmit)} className="flex-grow overflow-y-auto custom-scrollbar">
                        {isLoading ? (
                            <div className="flex justify-center items-center h-48">
                                <LoadingSpinner />
                            </div>
                        ) : (
                            <SharedDatatable control={form.control} userData={userData} />
                        )}
                    </form>
                </Form>

                {/* Separator */}
                {/* <div className="border-t"></div> */}

                {/* Footer Section */}
                <DialogFooter style={{ marginBottom: '-15px' }}>
                    <Button type="submit" form="shareForm" className="w-full sm:w-auto">
                        <Share2 size={20} />
                        Share
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
