import FormTextarea from '@/ikon/components/form-fields/textarea';
import { getResourceUrl, openFileInNewTab } from '@/ikon/utils/actions/common/utils';
import { multipleFileUpload } from '@/ikon/utils/api/file-upload';
import { FileinfoProps } from '@/ikon/utils/api/file-upload/type';
import { Button } from '@/shadcn/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/shadcn/ui/dialog';
import { Form } from '@/shadcn/ui/form';
import { Input } from '@/shadcn/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import React, { SetStateAction, useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form';
import { z } from 'zod';

interface CorrectionProps {
    description: string;
    resourceData: FileinfoProps[] | null;
}

interface AddActionSolnFormProps {
    solutionForm: boolean;
    setSolutioinForm: React.Dispatch<SetStateAction<boolean>>;
    setCorrections: React.Dispatch<React.SetStateAction<CorrectionProps[]>>;
    type: string;
    editSolution?: CorrectionProps;
    editSolnIndex?: number;
}


const SolutionFormSchema = z.object({
    SOLUTION_DESCRIPTION: z.string().min(2, { message: 'Action Description must be at least 2 characters long.' }),
})

export default function AddActionSolnForm({
    solutionForm,
    setSolutioinForm,
    setCorrections,
    type,
    editSolution,
    editSolnIndex
}: AddActionSolnFormProps) {

    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const [fileUploads, setFileUploads] = useState<FileinfoProps[]>([]);

    useEffect(() => {
        if (type === 'existing') {
            setFileUploads(editSolution?.resourceData ?? []);
        }
    }, []);

    const form = useForm<z.infer<typeof SolutionFormSchema>>({
        resolver: zodResolver(SolutionFormSchema),
        defaultValues: {
            SOLUTION_DESCRIPTION: type === 'new' ? '' : editSolution?.description || '',
        },
    });

    function saveSolutionFormInfo(data: z.infer<typeof SolutionFormSchema>) {
        const saveCorrectionData = {
            description: data.SOLUTION_DESCRIPTION,
            resourceData: fileUploads,
        };

        if (type === 'existing') {
            setCorrections(prev =>
                prev.map((item, index) =>
                    index === editSolnIndex ? saveCorrectionData : item
                )
            );
        } else {
            setCorrections(prev => [...prev, saveCorrectionData]);
        }

        setSolutioinForm(false);
    }

    const handleDivClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileUpload = async (value: File[]) => {
        const resourceData = await multipleFileUpload(value);
        setFileUploads((prev) => [...prev, ...resourceData]);
    }

    const donwloadFile = async function (fileInfo: FileinfoProps) {
        try {
            const resourceLink = await getResourceUrl({
                resourceId: fileInfo.resourceId,
                resourceName: fileInfo.resourceName,
                resourceType: fileInfo.resourceType,
                resourceSize: fileInfo.resourceSize
            });
            openFileInNewTab(resourceLink);
        } catch (err) {
            console.error('Error in donwloadTemplateFile: ', err);
        }
    };

    console.log(fileUploads);

    return (
        <>
            <Dialog open={solutionForm} onOpenChange={setSolutioinForm} >
                <DialogContent
                    onInteractOutside={(e) => e.preventDefault()}
                    className="max-w-[60%]"
                >
                    <DialogHeader>
                        <DialogTitle>Enter Your Solution</DialogTitle>
                    </DialogHeader>

                    <Form {...form} >
                        <form>
                            <div className='flex flex-col gap-3'>
                                <FormTextarea
                                    formControl={form.control}
                                    name="SOLUTION_DESCRIPTION"
                                    placeholder="Enter Solution"
                                    label="Add a new Solution*"
                                    className="resize-y max-h-[100px] w-full"
                                    formItemClass="w-full"
                                />

                                <div
                                    onClick={handleDivClick}
                                    className="border hover:border-primary text-black dark:text-white p-2 rounded cursor-pointer"
                                >
                                    {fileUploads.length > 0 ? (
                                        <ul className="list-disc list-inside space-y-1">
                                            {fileUploads.map((file, index) => (
                                                <li key={index}>
                                                    <Button
                                                        variant="link"
                                                        type="button"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            donwloadFile(file);
                                                        }}
                                                        className="z-10"
                                                    >
                                                        {file?.resourceName || 'N/A'}
                                                    </Button>
                                                </li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <span>Click to upload files</span>
                                    )}
                                </div>

                                <Input
                                    ref={fileInputRef}
                                    type="file"
                                    multiple
                                    onChange={(e) =>
                                        handleFileUpload(Array.from(e.target.files || []))
                                    }
                                    className="hidden"
                                />
                            </div>

                        </form>
                    </Form>
                    <DialogFooter>
                        <Button onClick={form.handleSubmit(saveSolutionFormInfo)}>Add Solution</Button>
                    </DialogFooter>

                </DialogContent>

            </Dialog>
        </>
    )
}
