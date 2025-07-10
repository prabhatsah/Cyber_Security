import React, { useEffect } from "react";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/shadcn/ui/dialog";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/shadcn/ui/form";
import FormInput from "@/ikon/components/form-fields/input";
import FormTextarea from "@/ikon/components/form-fields/textarea";
import { Button } from "@/shadcn/ui/button";
import { v4 } from 'uuid';
import { getMyInstancesV2, invokeAction, mapProcessName, startProcessV2 } from "@/ikon/utils/api/processRuntimeService";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import FormComboboxInput from "@/ikon/components/form-fields/combobox-input";
import { RadioGroup, RadioGroupItem } from "@/shadcn/ui/radio-group";
import { Label } from "@/shadcn/ui/label";


// export const AssetsFormSchema = z.object({
//     ASSET_NAME: z.string().min(2, { message: "Asset Name must be at least 2 characters long." }).trim(),
//     ASSET_TAG: z.string().min(2, { message: "Asset Tag is Required" }).trim(),
//     CLASSIFICATION: z.string().min(2, { message: "Classification is Required" }).trim(),
//     OWNER: z.string().min(1, { message: 'Owner Must be Selected.' }).trim(),
//     DESCRIPTION: z.string().trim().optional(),
//     DEVICE_TYPE: z.enum(["yes", "no"]),
//     PROBE_TYPE: z.string().optional(),
//     OS_TYPE: z.string().min(1, { message: 'OS Must be selected' }).trim(),
// });

export const AssetsFormSchema = z.object({
    ASSET_NAME: z.string().min(2, { message: "Asset Name must be at least 2 characters long." }).trim(),
    ASSET_TAG: z.string().min(2, { message: "Asset Tag is Required" }).trim(),
    CLASSIFICATION: z.string().min(2, { message: "Classification is Required" }).trim(),
    OWNER: z.string().min(1, { message: 'Owner Must be Selected.' }).trim(),
    DESCRIPTION: z.string().trim().optional(),
    DEVICE_TYPE: z.enum(["yes", "no"]),
    PROBE_TYPE: z.string().optional(),
    OS_TYPE: z.string().optional(),
}).superRefine((data, ctx) => {
    if (data.DEVICE_TYPE === "yes") {
        if (!data.PROBE_TYPE || data.PROBE_TYPE.trim() === "") {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                path: ["PROBE_TYPE"],
                message: "Probe Type is required when Device Type is Yes",
            });
        }
        if (!data.OS_TYPE || data.OS_TYPE.trim() === "") {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                path: ["OS_TYPE"],
                message: "OS Type is required when Device Type is Yes",
            });
        }
    }
});

export const assetTagType = [
    { value: "storage", label: "Storage" },
    { value: "equipment", label: "Equipment" },
]

export const type = [
    { value: "virtual", label: "Virtual" },
    { value: "physical", label: "Physical" },
]

export const probeType = [
    { value: "Probe 1", lable: "Probe 1" },
    { value: "Probe 2", lable: "Probe 2" },
]

export const osType = [
    { value: "Windows", label: "Windows" },
    { value: "Linux", label: "Linux" },
    { value: "Mac", label: "Mac" },
]

export default function AssetsForm({
    open,
    setOpen,
    editAssetData,
    userIdNameMap
}: {
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
    editAssetData: Record<string, string> | null;
    userIdNameMap: { value: string, label: string }[]
}) {
    const form = useForm<z.infer<typeof AssetsFormSchema>>({
        resolver: zodResolver(AssetsFormSchema),
        defaultValues: {
            ASSET_NAME: editAssetData ? editAssetData.assetName : "",
            ASSET_TAG: editAssetData ? editAssetData.assetTag : "",
            CLASSIFICATION: editAssetData ? editAssetData.classification : "",
            OWNER: editAssetData ? editAssetData.assetOwner : "",
            DESCRIPTION: editAssetData ? editAssetData.description : "",
            DEVICE_TYPE: editAssetData
                ? (editAssetData.deviceType === "yes" ? "yes" : "no")
                : "no", // Defaults to "no"
            PROBE_TYPE:
                editAssetData && editAssetData.deviceType === "yes"
                    ? editAssetData.probeType
                    : '',
            OS_TYPE:
                editAssetData && editAssetData.deviceType === "yes"
                    ? editAssetData.osType
                    : '',
        },
    });

    useEffect(() => {
        const deviceType = editAssetData?.deviceType === "yes" ? "yes" : "no";
        form.reset({
            ASSET_NAME: editAssetData?.assetName || "",
            ASSET_TAG: editAssetData?.assetTag || "",
            CLASSIFICATION: editAssetData?.classification || "",
            OWNER: editAssetData?.assetOwner || "",
            DESCRIPTION: editAssetData?.description || "",
            DEVICE_TYPE: deviceType,
            PROBE_TYPE: deviceType === "yes" ? editAssetData?.probeType || "" : '',
            OS_TYPE: deviceType === "yes" ? editAssetData?.osType || "" : '',
        });
    }, [editAssetData, form]);



    const router = useRouter();

    async function handleRiskSubmission(data: z.infer<typeof AssetsFormSchema>) {
        console.log("Submit API here", data); // Add API logic here

        const assetData = {
            assetId: editAssetData ? editAssetData.assetId : v4(),
            assetName: data.ASSET_NAME,
            assetTag: data.ASSET_TAG,
            classification: data.CLASSIFICATION,
            assetOwner: data.OWNER,
            description: data.DESCRIPTION,
            deviceType: data.DEVICE_TYPE,
            probeType: data.DEVICE_TYPE === "yes" ? data.PROBE_TYPE : '',
            osType: data.DEVICE_TYPE === "yes" ? data.OS_TYPE : '',
        };
        console.log(assetData);
        if (editAssetData) {
            const assetId = assetData.assetId;
            const assetInstances = await getMyInstancesV2({
                processName: "Assets",
                predefinedFilters: { taskName: "Edit Asset" },
                mongoWhereClause: `this.Data.assetId == "${assetId}"`,
            })
            console.log(assetInstances);
            const taskId = assetInstances[0]?.taskId;
            console.log(taskId);

            await invokeAction({
                taskId: taskId,
                data: assetData,
                transitionName: 'update edit asset',
                processInstanceIdentifierField: 'assetId'
            })

        }
        else {
            try {
                const assetsProcessId = await mapProcessName({ processName: "Assets" });
                console.log(assetsProcessId);
                await startProcessV2({
                    processId: assetsProcessId,
                    data: assetData,
                    processIdentifierFields: "assetId"
                })

                toast.success("Asset Added Successfully!!!", { duration: 2000 });
            } catch (error) {
                console.error("Error starting Risk Library process:", error);
                toast.error("Failed to Add Asset. Please try again.", { duration: 2000 });
            }

        }

        form.reset();
        router.refresh();
        setOpen(false);
    }

    return (
        <Dialog open={open} onOpenChange={(isOpen) => {
            if (!isOpen) form.reset();
            setOpen(isOpen);
        }}>

            <DialogContent className="max-w-[50%]">
                <DialogHeader>
                    <DialogTitle>{editAssetData ? "Edit Asset" : "Add Asset"}</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    {/* <Form {...form}>
                        <form>
                            <div className="grid grid-cols-1 gap-3">
                                <FormInput formControl={form.control} name="ASSET_NAME" label={<>Asset Name<span className="text-red-500 font-bold"> *</span></>} placeholder="Enter Asset Name" />
                                <FormComboboxInput items={assetTagType} formControl={form.control} name={"ASSET_TAG"} placeholder={"Select Asset Tag"} label={<>Asset Tag<span className="text-red-500 font-bold"> *</span></>} />
                                <FormComboboxInput items={type} formControl={form.control} name={"TYPE"} placeholder={"Select Type"} label={<>Type<span className="text-red-500 font-bold"> *</span></>} />
                                <FormComboboxInput items={userIdNameMap} formControl={form.control} name={"OWNER"} placeholder={"Choose Owner"} label={<>Asset Owner<span className="text-red-500 font-bold"> *</span></>} />
                                <FormComboboxInput items={probeType} formControl={form.control} name={"PROBE TYPE"} placeholder={"Choose Probe"} label={<>Probe<span className="text-red-500 font-bold"> *</span></>} />
                                <FormComboboxInput items={osType} formControl={form.control} name={"OS"} placeholder={"Choose OS"} label={<>OS<span className="text-red-500 font-bold"> *</span></>} />

                                <FormTextarea formControl={form.control} name="DESCRIPTION" label={<>Description<span className="text-red-500 font-bold"> *</span></>} placeholder="Enter Description" />
                            </div>
                        </form>
                    </Form> */}


                    <Form {...form}>
                        <div className="grid grid-cols-1 gap-3">
                            <FormInput formControl={form.control} name="ASSET_NAME" label={<>Asset Name<span className="text-red-500 font-bold"> *</span></>} placeholder="Enter Asset Name" />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <FormComboboxInput items={assetTagType} formControl={form.control} name="ASSET_TAG" placeholder="Select Asset Tag" label={<>Asset Tag<span className="text-red-500 font-bold"> *</span></>} />
                            <FormComboboxInput items={type} formControl={form.control} name="CLASSIFICATION" placeholder="Select Type" label={<>Classification<span className="text-red-500 font-bold"> *</span></>} />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <FormComboboxInput items={userIdNameMap} formControl={form.control} name="OWNER" placeholder="Choose Owner" label={<>Asset Ownder<span className="text-red-500 font-bold"> *</span></>} />
                            <div>
                                <Label>Device Type</Label>
                                <RadioGroup
                                    onValueChange={(value) => form.setValue("DEVICE_TYPE", value)}
                                    value={form.watch("DEVICE_TYPE")}
                                    className="flex gap-4 mt-3"
                                >
                                    <div className="flex items-center gap-2">
                                        <RadioGroupItem id="device-type-yes" value="yes" />
                                        <Label htmlFor="device-type-yes">Yes</Label>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <RadioGroupItem id="device-type-no" value="no" />
                                        <Label htmlFor="device-type-no">No</Label>
                                    </div>
                                </RadioGroup>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            {form.watch("DEVICE_TYPE") === "yes" && (
                                <>
                                    <FormComboboxInput items={probeType} formControl={form.control} name="PROBE_TYPE" placeholder="Choose Probe" label={<>Probe<span className="text-red-500 font-bold"> *</span></>}/>
                                    <FormComboboxInput items={osType} formControl={form.control} name="OS_TYPE" placeholder="Choose OS" label={<>OS<span className="text-red-500 font-bold"> *</span></>} />
                                </>
                            )}

                        </div>
                        <div className="grid grid-cols-1 gap-3">
                            <FormTextarea formControl={form.control} name="DESCRIPTION" label="Description" placeholder="Enter Description" />
                        </div>
                    </Form>

                </div>
                <DialogFooter>
                    <Button type="submit" onClick={form.handleSubmit(handleRiskSubmission)} className="mt-3">
                        {editAssetData ? "Update" : "Save"}
                    </Button>
                </DialogFooter>
            </DialogContent >
        </Dialog >
    );
}