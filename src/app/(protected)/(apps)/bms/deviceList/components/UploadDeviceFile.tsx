import { FC } from "react";
import { UploadDeviceFileProps, UploadedFileType } from "../types";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/shadcn/ui/dialog";
import { Separator } from "@/shadcn/ui/separator";
import { DialogFooter, DialogHeader } from "@/shadcn/ui/dialog";
//import FormFileInput from "@/ikon/components/form-fields/file-input";
import { TextButtonWithTooltip } from "@/ikon/components/buttons";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Label } from "@/shadcn/ui/label";
import { Input } from "@/shadcn/ui/input";
import { getMyInstancesV2, invokeAction } from "@/ikon/utils/api/processRuntimeService";
import { downloadResource } from "@/ikon/utils/actions/common/utils";
import { singleFileUpload } from "@/ikon/utils/api/file-upload";

const fileSchema = z.object({
    file: z
      .custom<FileList>((val) => val instanceof FileList && val.length > 0, "File is required") // Ensures file is selected
      .refine((files) => files[0]?.size < 5 * 1024 * 1024, "File must be smaller than 5MB") // File size check
      .refine(
        (files) => ["application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "application/vnd.ms-excel"].includes(files[0]?.type),
        "Only Excel files (.xlsx, .xls) are allowed"
      ),
});

type fileType = {
    resourceId: string,
    inputControl: string,
    resourceName: string,
    resourceSize: number,
    resourceType: string
}

const donwloadTemplateFile = async function(close: () => void){
    try{
        const fileDetails = await getMyInstancesV2<UploadedFileType>({
            processName: 'File Upload For CCC',
            predefinedFilters: {
                taskName: "CCC Uploaded File"
            }
        });

        if(fileDetails.length < 1){
            console.log('No file upload for CCC instance found: ');
            
            throw ('No file upload for CCC instance found');
        }

        console.log('fileDetails: ', fileDetails);

        //const file = fileDetails[0].data['Uploaded Resource'];

        // @ts-expect-error : ignore
        const file : fileType = fileDetails[0].data["Uploaded Resource"];

        await downloadResource({
            resourceId: file.resourceId,
            resourceName: file.resourceName,
            resourceType: file.resourceType,
            resourceSize: file.resourceSize
        })

        close();

    }
    catch(err){
        console.error('Error in donwloadTemplateFile: ', err);
    }
}

 const uploadTemplateFile = async function(file: File){
    try{
        const fileDetails = await getMyInstancesV2<UploadedFileType[]>({
            processName: 'File Upload For CCC',
            predefinedFilters: {
                taskName: "CCC File Upload"
            }
        });

        if(fileDetails.length < 1){
            console.log('No file upload for CCC instance found: ');
            
            throw ('No file upload for CCC instance found');
        }

        const taskId = fileDetails[0].taskId;

        const uploadedFileDetails = await singleFileUpload(file);

        //console.log('uploaded file details: ', uploadedFileDetails);

        const fileObj = {
            "Uploaded Resource" : {
                resourceId: uploadedFileDetails.resourceId,
                resourceName: uploadedFileDetails.resourceName,
                resourceType: uploadedFileDetails.resourceType,
                resourceSize: uploadedFileDetails.resourceType
            }
        }

        //console.log('Uploaded file: ', fileObj)

        await invokeAction({
            taskId: taskId,
            transitionName: 'reassign File Upload',
            data: fileObj,
            processInstanceIdentifierField: ''
        })

    }
    catch(err){
        console.error('Error in uploadTemplateFile: ', err);
    }    
}

const UploadDeviceFile : FC<UploadDeviceFileProps> = ({open, close}) => {
    const  { 
                register,
                handleSubmit,
                formState: { errors , isValid },
                //watch

            } = useForm(
                {
                    resolver: zodResolver(fileSchema),
                    mode:'onChange'
                }
            );

    //const fileDetails = watch("file");
    

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const onSubmit = async (data: any, close: () => void) => {
        console.log("Uploaded File:", data.file[0]); // Handle the uploaded file
        await uploadTemplateFile(data.file[0])

        close();
    };    
    
    return (
        <>
             <Dialog open={open} onOpenChange={close}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>File Upload</DialogTitle>
                    </DialogHeader>
                    <Separator />
                    <DialogDescription>Only `.xlsx` or `.xls` files up to 5MB are allowed.</DialogDescription>

                    <form onSubmit={handleSubmit((val)=>{onSubmit(val, close)})} className="space-y-4">
                        <Label htmlFor="file">Select Excel File</Label>
                        <Input type="file" {...register("file")} accept=".xlsx,.xls" />
                        {
                            errors.file?.message && <p className="text-red-500 text-sm">{String(errors.file.message)}</p>
                        }

                        <Separator />

                        <DialogFooter>
                            <TextButtonWithTooltip tooltipContent="Download template" type="button" variant="outline" onClick={() => { donwloadTemplateFile(close) }}>Download Template</TextButtonWithTooltip>
                            <TextButtonWithTooltip tooltipContent="Submit" type="submit" disabled={!isValid}>Upload</TextButtonWithTooltip>
                        </DialogFooter>
                    </form>

                </DialogContent> 
            </Dialog>    

            
        </>
    )
}

export default UploadDeviceFile;