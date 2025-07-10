import FormComboboxInput from '@/ikon/components/form-fields/combobox-input';
import FormDateInput from '@/ikon/components/form-fields/date-input';
import FormInput from '@/ikon/components/form-fields/input';
import FormTextarea from '@/ikon/components/form-fields/textarea';
import { mapProcessName, startProcessV2 } from '@/ikon/utils/api/processRuntimeService';
import { SAVE_DATE_FORMAT_GRC } from '@/ikon/utils/config/const';
import { Button } from '@/shadcn/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/shadcn/ui/dialog';
import { Form } from '@/shadcn/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import React from 'react'
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod'

const complianceStatus = [
    { label: "Compliant", value: "Compliant" },
    { label: "Non-Compliant", value: "Non-Compliant" }
];

const compliance = [
    { label: "In Progress", value: "In Progress" },
    { label: "No", value: "No" },
    { label: "Yes", value: "Yes" },
];

const riskLevel = [
    { label: "High", value: "High" },
    { label: "Medium", value: "Medium" },
    { label: "Low", value: "Low" },
]

const SupplierRegistryFormSchema = z.object({
    SUPPLIER_NAME: z.string().min(1, { message: 'Supplier Name is Required.' }),
    CONTACT_PERSON: z.string().min(1, { message: 'Person Name is Required.' }),
    CONTACT_EMAIL: z.string().min(1, { message: "Email is required" }).email({ message: "Invalid email address" }),
    CONTACT_PHONE: z.string().min(1, { message: "Phone number is required" }).regex(/^[\d\s()+-]{10,15}$/, { message: "Invalid phone number format" }),
    SERVICE_PROVIDED: z.string().min(1, { message: 'Please Enter the Service Provided.' }),
    CONTRACT_START_DATE: z.date({ required_error: 'Contact Start Date is required.' }),
    CONTRACT_END_DATE: z.date({ required_error: 'Contact End Date is required.' }),
    COMPLIANCE_STATUS: z.string().min(1, { message: 'Compliance Status is Required' }),
    COMPLIANCE: z.string().min(1, { message: 'Compliance is Required' }),
    RISK_ASSESSMENT_DATE: z.date({ required_error: 'Risk Assessment Date is required.' }),
    RISK_LEVEL: z.string().min(1, { message: "Risk Level is Required" }),
    MITIGATION_MEASURE: z.string().min(1, { message: "Mitigation Measure is Required" }),
    REVIEW_DATE: z.date({ required_error: 'Review Date is required.' }),
    NOTES: z.string().optional()
})

export default function SupplierRegistryForm({
    openSupplierRegistryForm,
    setOpenSupplierRegistryForm,
    allUsers
}: {
    openSupplierRegistryForm: boolean;
    setOpenSupplierRegistryForm: React.Dispatch<React.SetStateAction<boolean>>;
    allUsers: { value: string, label: string }[]

}) {

    const router = useRouter();
    const form = useForm<z.infer<typeof SupplierRegistryFormSchema>>({
        resolver: zodResolver(SupplierRegistryFormSchema),
        defaultValues: {
            SUPPLIER_NAME: '',
            CONTACT_PERSON: '',
            CONTACT_EMAIL: '',
            CONTACT_PHONE: '',
            SERVICE_PROVIDED: '',
            CONTRACT_START_DATE: undefined,
            CONTRACT_END_DATE: undefined,
            COMPLIANCE_STATUS: '',
            COMPLIANCE: '',
            RISK_ASSESSMENT_DATE: undefined,
            RISK_LEVEL: '',
            MITIGATION_MEASURE: '',
            REVIEW_DATE: undefined,
            NOTES: ''
        },
    });
    async function saveSupplierRegistryFormInfo(data: z.infer<typeof SupplierRegistryFormSchema>) {

        const supplierRegistrySaveFormat = {
            supplierTaskId: crypto.randomUUID(),
            supplierName: data.SUPPLIER_NAME,
            contactPerson: data.CONTACT_PERSON,
            contactEmail: data.CONTACT_EMAIL,
            contactPhone: data.CONTACT_PHONE,
            serviceProvided: data.SERVICE_PROVIDED,
            contractStartDate: data.CONTRACT_START_DATE,
            contractEndDate: data.CONTRACT_END_DATE,
            complianceStatus: data.COMPLIANCE_STATUS,
            compliance: data.COMPLIANCE,
            riskAssessmentDate: data.RISK_ASSESSMENT_DATE,
            riskLevel: data.RISK_LEVEL,
            mitigationMeasure: data.MITIGATION_MEASURE,
            reviewDate: data.REVIEW_DATE,
            notes: data.NOTES
        }

        const supplierRegistryProcessId = await mapProcessName({ processName: "Supplier Registry" })

        await startProcessV2({
            processId: supplierRegistryProcessId,
            data: supplierRegistrySaveFormat,
            processIdentifierFields: "supplierTaskId"
        })

        router.refresh();
        setOpenSupplierRegistryForm(false);
        
        toast.success("Saved Successfully", {
            duration: 4000,
        });
    }
    return (
        <>
            <Dialog open={openSupplierRegistryForm} onOpenChange={setOpenSupplierRegistryForm} >
                <DialogContent
                    onInteractOutside={(e) => e.preventDefault()}
                    className="max-w-[90%] max-h-full overflow-y-auto"
                >
                    <DialogHeader>
                        <DialogTitle>Task Form</DialogTitle>
                    </DialogHeader>
                    <Form {...form} >
                        <form>
                            <div className='grid grid-cols-1 md:grid-cols-3 gap-3 mb-3'>
                                <div className='col-span-1 md:col-span-3'>
                                    <FormInput formControl={form.control} name="SUPPLIER_NAME" label="Supplier Name*" placeholder="Enter Supplier Name" />
                                </div>
                                <FormComboboxInput formControl={form.control} name="CONTACT_PERSON" items={allUsers} label="Contact Person*" placeholder="Select Contact Person" />
                                <FormInput formControl={form.control} name="CONTACT_EMAIL" label="Contact Email*" placeholder="Enter Contact Email" type="email" />
                                <FormInput formControl={form.control} name="CONTACT_PHONE" label="Contact Phone*" placeholder="Enter Contact Phone No." />
                                <FormInput formControl={form.control} name="SERVICE_PROVIDED" label="Service Provider*" placeholder="Enter Service Provider" />
                                <FormDateInput formControl={form.control} name="CONTRACT_START_DATE" label="Contract Start Date*" placeholder="Enter Contract Start Date" dateFormat={SAVE_DATE_FORMAT_GRC} />
                                <FormDateInput formControl={form.control} name="CONTRACT_END_DATE" label="Contract End Date*" placeholder="Enter Contract End Date" dateFormat={SAVE_DATE_FORMAT_GRC} />
                                <FormComboboxInput formControl={form.control} name="COMPLIANCE_STATUS" items={complianceStatus} label="Compliance Status*" placeholder="Select Compliance Status" />
                                <FormComboboxInput formControl={form.control} name="COMPLIANCE" items={compliance} label="Compliance*" placeholder="Select Compliance" />
                                <FormDateInput formControl={form.control} name="RISK_ASSESSMENT_DATE" label="Risk Assessment Date*" placeholder="Enter Risk Assessment Date" dateFormat={SAVE_DATE_FORMAT_GRC} />
                                <FormComboboxInput formControl={form.control} name="RISK_LEVEL" items={riskLevel} label="Risk Level*" placeholder="Select Risk Level" />
                                <FormInput formControl={form.control} name="MITIGATION_MEASURE" label="Mitigation Measure*" placeholder="Enter Mitigation Measure" />
                                <FormDateInput formControl={form.control} name="REVIEW_DATE" label="Review Date*" placeholder="Enter Review Date" dateFormat={SAVE_DATE_FORMAT_GRC} />
                                <div className='col-span-1 md:col-span-3'>
                                    <FormTextarea
                                        formControl={form.control}
                                        name="NOTES"
                                        placeholder="Enter Notes"
                                        label="Notes"
                                        className="resize-y max-h-[100px] w-full"
                                        formItemClass="w-full"
                                    />
                                </div>
                            </div>
                        </form>
                    </Form>
                    <DialogFooter>
                        <Button onClick={form.handleSubmit(saveSupplierRegistryFormInfo)}>
                            Save
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    )
}
