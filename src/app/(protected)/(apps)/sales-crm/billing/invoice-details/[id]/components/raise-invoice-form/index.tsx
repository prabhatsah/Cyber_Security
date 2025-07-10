"use client";
import { Button } from "@/shadcn/ui/button";
import { Checkbox } from "@/shadcn/ui/checkbox";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/shadcn/ui/dialog";
import { Form } from "@/shadcn/ui/form";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
// import { projectManagers } from "./projectManagerMap";
// import CreateDealDataTable from "./CreateDealDataTable";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { v4 } from "uuid";
//import { startDealData } from "../invoke_deal";
import { getProfileData } from "@/ikon/utils/actions/auth";
import { format, parseISO, set } from "date-fns";
//import { dealSchema } from "../deal_form_schema";
import FormComboboxInput from "@/ikon/components/form-fields/combobox-input";
import FormInput from "@/ikon/components/form-fields/input";
import FormDateInput from "@/ikon/components/form-fields/date-input";
import FormTextarea from "@/ikon/components/form-fields/textarea";
import { TextButton } from "@/ikon/components/buttons";
import { RaiseInvoiceFormSchema } from "./RaiseInvoiceFormSchema";
import { RadioGroup, RadioGroupItem } from "@/shadcn/ui/radio-group";
import { Label } from "@/shadcn/ui/label";
import { Input } from "@/shadcn/ui/input";
import { Textarea } from "@/shadcn/ui/textarea";
import ComboboxInput from "@/ikon/components/combobox-input";
// import ReactQuill from 'react-quill';
// import 'react-quill/dist/quill.snow.css';
import { getDateFormat } from "@/ikon/utils/actions/format";
import FormMultiComboboxInput from "@/ikon/components/form-fields/multi-combobox-input";
import { UserIdWiseUserDetailsMapProps } from "@/ikon/utils/actions/users/type";


interface RaiseInvoiceModalProps {
    isOpen: boolean;
    onClose: () => void;
    invoiceIdentifier?: any | undefined;
    userEmails: { label: string; value: string; }[],
    accountData: any,
    invoiceDate: string,
    productInitials: string,
    userIdWiseUserDetailsMap: UserIdWiseUserDetailsMapProps
}



//type DealFormValues = z.infer<typeof dealSchema>;

const RaiseInvoiceModalForm: React.FC<RaiseInvoiceModalProps> = ({
    isOpen,
    onClose,
    invoiceIdentifier,
    userEmails,
    accountData,
    invoiceDate,
    productInitials,
    userIdWiseUserDetailsMap
}) => {
    console.log(" Modal", invoiceIdentifier);
    const invoiceNo = invoiceIdentifier.substr(0, 2) + "-" + accountData.accountCode + "-" + format(parseISO(invoiceDate), 'ddMMyyyy') + "-" + productInitials;
     
    const [mailStatus, setMailStatus] = useState("system");
    useEffect(() => {
        console.log("mailStatus - "+mailStatus)
        if (mailStatus == "system") {
            const invoiceNum = invoiceIdentifier.substr(0, 2) + "-" + accountData.accountCode + "-" + format(parseISO(invoiceDate), 'ddMMyyyy') + "-" + productInitials;
            console.log("invoiceNum - "+invoiceNum)
            form.reset({
                "type": "system",
                "mailTo": [],
                "mailCc": [],
                "subject": "" + invoiceNum + ":  " + getDateFormat(invoiceDate),
                "remarks": 'Hi,' + '\n' +'I hope you are well. Please see attached invoice ' + invoiceNo+' due on ' + getDateFormat(invoiceDate)
                +'. Do not hesitate to reach out if you have any questions.' +
                '\n' +
               '\n' +
              'Kind regards, ' +
                '\n' +
                userIdWiseUserDetailsMap[accountData.accountManager].userName ,
                "fileInfoArray2": [],
                "invoiceNumber": invoiceNum,
                "invoiceDate": "",
                "invoiceStatus": 'invoiced',
                "accountManager": "",
                "accountManagerEmail": "",
                "guestEmail": [],
                "encodedPdf": "",
                "pdfName": "",
                "accountId": ""
            })
        }
        else {
            form.reset({
                "type": "manual",
                "remarks": "",
                "fileInfoArray1": [],
                "invoiceStatus": 'invoiced',
                "mailDate": ""
            })
        }

    }, [])
    // const [wasChannelPartner, setWasChannelPartner] = useState("no");
    // const [taxinfo, setTaxinfo] = useState(selectedAccount?.taxinfo || "Not Applicable");
    // useEffect(() => {
    //     if (selectedAccount) {
    //       form.reset({
    //         accountIdentifier: selectedAccount?.accountIdentifier || "",
    //         accountName: selectedAccount?.accountName || "",
    //         accountCode: selectedAccount?.accountCode || "",
    //         accountManager: selectedAccount?.accountManager || "",
    //         createdOn: selectedAccount?.createdOn || new Date().toISOString(),
    //         updatedOn: new Date().toISOString(),
    //         taxinfo: selectedAccount?.taxinfo || "Not Applicable",
    //         taxnumber: selectedAccount?.taxnumber || "",
    //         address: selectedAccount?.address || "",
    //         city: selectedAccount?.city || "",
    //         state: selectedAccount?.state || "",
    //         pinCode: selectedAccount?.pinCode || "",
    //         country: selectedAccount?.country || "",
    //         phone: selectedAccount?.phone || "",
    //         email: selectedAccount?.email || "",
    //       });
    //     }
    //   }, [selectedAccount]);

    const [userId, setUserId] = useState("");

    // useEffect(() => {

    // }, []);











    if (mailStatus == "system") {
        var form = useForm<z.infer<typeof RaiseInvoiceFormSchema>>({
            resolver: zodResolver(RaiseInvoiceFormSchema),

            defaultValues: {
                "type": "system",
                "mailTo": [],
                "mailCc": [],
                "subject": "" + invoiceNo + ": " + getDateFormat(invoiceDate),
                "remarks": 'Hi,' + '\n' +'I hope you are well. Please see attached invoice ' + invoiceNo+' due on ' + getDateFormat(invoiceDate)
                +'. Do not hesitate to reach out if you have any questions.' +
                '\n' +
               '\n' +
              'Kind regards, ' +
                '\n' +
                userIdWiseUserDetailsMap[accountData.accountManager].userName ,
                "fileInfoArray2": [],
                "invoiceNumber": "",
                "invoiceDate": "",
                "invoiceStatus": 'invoiced',
                "accountManager": "",
                "accountManagerEmail": "",
                "guestEmail": [],
                "encodedPdf": "",
                "pdfName": "",
                "accountId": ""

            },
        });
    }
    else {
        var form = useForm<z.infer<typeof RaiseInvoiceFormSchema>>({
            resolver: zodResolver(RaiseInvoiceFormSchema),

            defaultValues: {
                "type": "manual",
                "remarks": "",
                "fileInfoArray1": [],
                "invoiceStatus": 'invoiced',
                "mailDate": ""

            },
        });
    }


    const fetchProfileData = async () => {
        try {
            const profileData = await getProfileData();
            setUserId(profileData.USER_ID);
        } catch (error) {
            console.error("Error fetching profile data:", error);
        }
    };

    // useEffect(() => {
    //     fetchProfileData();
    // }, []);

    const handleOnSubmit = async (data: z.infer<typeof RaiseInvoiceFormSchema>) => {
        console.log("Form Data Submitted: ", data);
        // console.log("Account Identifier", data.accountIdentifier);
        // if (data.accountIdentifier == "") {
        //     data.accountIdentifier = v4();
        // }
        // await startAccountData(data);
        form.reset({
            "type": "",
            "mailTo": [],
            "mailCc": [],
            "subject": "",
            "remarks": "",
            "fileInfoArray2": [],
            "invoiceNumber": "",
            "invoiceDate": "",
            "invoiceStatus": 'invoiced',
            "accountManager": "",
            "accountManagerEmail": "",
            "guestEmail": [],
            "encodedPdf": "",
            "pdfName": "",
            "accountId": ""
        });


        onClose();
    };

    const onError = (errors: any) => {
        console.error("Form Submission Errors: ", errors);
    };

    // console.log("Selected Deal ", selectedDeal);

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-3xl" onClick={(e) => e.stopPropagation()}>
                <DialogHeader>
                    <DialogTitle>Raise Invoice</DialogTitle>
                </DialogHeader>
                <div>
                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(handleOnSubmit, onError)}
                            id="raise-invoice-form"
                        >
                            <div className="my-3">
                                <RadioGroup defaultValue="system" onValueChange={setMailStatus} className="flex gap-4">
                                    <div className="flex items-center gap-2">
                                        <RadioGroupItem value="system" id="status_system" />
                                        <Label htmlFor="status_system">Mail Invoice To Client</Label>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <RadioGroupItem value="manual" id="status_manual" />
                                        <Label htmlFor="status_manual">Update Invoice Mail Information</Label>
                                    </div>
                                </RadioGroup>
                            </div>
                            {mailStatus === "manual" && (
                                <div className="space-y-4">
                                    <FormInput
                                        formControl={form.control}
                                        type="date"
                                        name={"mailDate"}
                                        label="Mail Send Date *"
                                        placeholder="Enter Mail Send Date"
                                    />
                                     <FormTextarea
                                        formControl={form.control}
                                        name={"remarks"}
                                        label="Mail Body *"
                                        placeholder="Enter Remarks"
                                    />
                                    <FormInput
                                        formControl={form.control}
                                        type="file"
                                        name={"fileUpload1"}
                                        label="File "
                                        placeholder="Enter File"
                                    />
                                    {/* <div className="space-y-2">
                                        <Label htmlFor="mail_date">Mail Send Date</Label>
                                        <Input type="date" id="mail_date" className="w-full" />
                                    </div> */}
                                    {/* <div className="space-y-2">
                                        <Label htmlFor="remarks1">Remarks</Label>
                                        <Textarea id="remarks1" placeholder="Enter Remarks..." className="h-20" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="fileUpload1">Upload File</Label>
                                        <Input type="file" id="fileUpload1" className="w-full" />
                                    </div> */}
                                </div>
                            )}

                            {mailStatus === "system" && (
                                <div className="space-y-4">
                                    <FormInput
                                        formControl={form.control}
                                        name={"subject"}
                                        label="Subject *"
                                        placeholder="Enter Subject"
                                    />
                                    <FormMultiComboboxInput
                                        items={userEmails || []}
                                        formControl={form.control}
                                        name={"mailTo"}
                                        placeholder={"Select Mail To"}
                                        label="Mail To *"
                                    />
                                    <FormMultiComboboxInput
                                        items={userEmails || []}
                                        formControl={form.control}
                                        name={"mailCc"}
                                        placeholder={"Select Mail CC"}
                                        label="Mail CC *"
                                    />
                                    <FormTextarea
                                        formControl={form.control}
                                        name={"remarks"}
                                        label="Mail Body *"
                                        placeholder="Enter Mail Body"
                                    />
                                     <FormInput
                                        formControl={form.control}
                                        type="file"
                                        name={"fileUpload2"}
                                        label="File Upload"
                                        placeholder="Enter File"
                                    />
                                    {/* <ComboboxInput 
                                    placeholder={"Mail To"} 
                                    items={userEmails || []}
                                    />
                                    <ComboboxInput 
                                    placeholder={"Mail CC"} 
                                    items={userEmails || []}
                                    /> */}
                                    {/* <div className="space-y-2">
                                        <Label htmlFor="mailSub">Subject</Label>
                                        <Input id="mailSub" type="text" placeholder="Enter Subject" />
                                    </div> */}
                                    {/* <div className="space-y-2">
                                        <Label htmlFor="mailTo">Mail To</Label>
                                        <ComboboxInput placeholder={"Mail List"} items={userEmails || []}></ComboboxInput>
                                    </div> */}
                                    {/* <div className="space-y-2">
                                        <Label htmlFor="mailCc">Mail CC</Label>
                                        <ComboboxInput placeholder={"Mail List"} items={userEmails || []}></ComboboxInput>
                                    </div> */}
                                    {/* <div className="space-y-2">
                                        <Label htmlFor="remarks2">Mail Body</Label>
                                        <Textarea id="remarks2" placeholder="Enter Mail Body..." className="h-40" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="fileUpload2">Upload Invoice PDF</Label>
                                        <Input type="file" id="fileUpload2" className="w-full" />
                                    </div> */}
                                    <Button variant="outline" className="flex items-center gap-2" id="viewInvoiceBtn">
                                        View Invoice
                                    </Button>
                                </div>
                            )}
                        </form>
                    </Form>
                </div>
                <DialogFooter>

                    <TextButton type="submit" form="account-form">Submit</TextButton>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default RaiseInvoiceModalForm;
