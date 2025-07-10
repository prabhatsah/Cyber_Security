// "use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form } from "@/shadcn/ui/form";
import { InputFormField } from "../../../form-components/InputFormField";
import { Button } from "@/shadcn/ui/button";
import { handleCreateFolder } from "../../../../actions";
import { redirect } from 'next/navigation';

interface CreateFolderFormProps {
    open: boolean;
    onClose: () => void;
    folderIdentifier: any;
}

// export default function CreateFolderForm(onClose: CreateFolderFormProps) {
export const CreateFolderForm: React.FC<CreateFolderFormProps> = ({ onClose, folderIdentifier }) => {

    const FormSchema = z.object({
        folderName: z.string().min(5, {
            message: "Folder name must be at least 5 characters.",
        }),
    })

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            folderName: "",
        },
    });

    async function onSubmit(data: z.infer<typeof FormSchema>) {
        await handleCreateFolder(data.folderName, folderIdentifier.folder_identifier);
        const currentUrl = window.location.href;
        onClose();
        redirect(currentUrl);
    }
    const field = { name: "folderName", placeholder: "Enter folder name" };
    return (
        <Form {...form}>
            <form id="createFolderForm" onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <div className="relative">
                    {/* Input Field */}
                    {/* <div className="pl-10"> */}
                    <InputFormField
                        key={field.name}
                        field={field}
                    />
                    {/* </div> */}
                    {/* Folder Icon */}
                    {/* <Folder className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={20} /> */}
                </div>
                <div className="flex flex-wrap justify-between sm:justify-end sticky">
                    <Button
                        form="createFolderForm"
                        type="submit"
                        // className="bg-blue-500 text-white w-full sm:w-auto"
                        className="w-full sm:w-auto"
                    // onClick={() => { onClose(); }}
                    >
                        {/* <Plus className="h-4 w-4" /> */}
                        Create
                    </Button>
                </div>
            </form>
        </Form>
    );
}
