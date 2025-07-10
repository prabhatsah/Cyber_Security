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
import { PaidInvoiceFormSchema } from "./UpdatePaymentStatusFormSchema";
import InvokePaymentStatus from "./invokeInvoice";



interface PaidInvoiceModalProps {
    isOpen: boolean;
    onClose: () => void;
    invoiceIdentifier?: any | undefined;
    accountNoWiseDetails: Record<string, any>;
    thisInvoiceData: any;
}



//type DealFormValues = z.infer<typeof dealSchema>;

const PaidInvoiceModalForm: React.FC<PaidInvoiceModalProps> = ({
    isOpen,
    onClose,
    invoiceIdentifier,
    accountNoWiseDetails,
    thisInvoiceData

}) => {
    const [paymentMode, setPaymentMode] = useState(thisInvoiceData.PaymentMode);
    const [isDiscount, setIsDiscount] = useState(false);
    const [accountId, setAccountId] = useState("");
    const [BankName, setBankName] = useState("");
    const [BranchName, setBranchName] = useState("");
    const [AEDNumber, setAEDNumber] = useState("");
    const [AccountName, setAccountName] = useState("");
    const [IBANCode, setIBANCode] = useState("");
    const handleDiscountChange = (checked: boolean) => {
        setIsDiscount(checked);
    }
    const bankDetailsList = []
    for (const key in accountNoWiseDetails) {
        bankDetailsList.push({ label: accountNoWiseDetails[key].Account_Nickname, value: accountNoWiseDetails[key].AED_Number })
    }
    useEffect(() => {
        //setPaymentMode(thisInvoiceData.PaymentMode);
        if(paymentMode === "online"){
            for (var key in accountNoWiseDetails) {
                if (thisInvoiceData.AEDNumber == accountNoWiseDetails[key].AED_Number) {
                    setAccountId(accountNoWiseDetails[key].accountId);
                    setBankName(accountNoWiseDetails[key].Bank_Name);
                    setBranchName(accountNoWiseDetails[key].Branch_Name);
                    setAEDNumber(accountNoWiseDetails[key].AED_Number);
                    setAccountName(accountNoWiseDetails[key].Account_Name);
                    setIBANCode(accountNoWiseDetails[key].IBAN_Code);
                    break;
                }
            }
            form.reset({
                "PaymentMode": thisInvoiceData?.PaymentMode || "online",
                "Account_Nickname_Online": thisInvoiceData.AEDNumber || "",
                "BankName": BankName,
                "BranchName": BranchName,
                "AEDNumber": AEDNumber,
                "AccountName": AccountName,
                "IBANCode": IBANCode,
                "PaidAmount": thisInvoiceData.revenue - thisInvoiceData.PaidAmount,
                "PaymentDate": "",
                "DiscountedAmount": ""
            })
        }
        else{
            form.reset({
                "PaymentMode": thisInvoiceData?.PaymentMode || "cheque",
                "Account_Nickname_Cheque": thisInvoiceData.AEDNumber || "",
                "ChequeNo": "",
                "PaidAmount": thisInvoiceData.revenue - thisInvoiceData.PaidAmount,
                "PaymentDate": "",
                "DiscountedAmount": "",
            })
        }
        // if (thisInvoiceData.PaymentMode === "online") {
        //    // setPaymentMode("online");
        //     form.reset({
        //        // "PaymentMode": "online",
        //         "BankName": thisInvoiceData["BankName"] ? thisInvoiceData["BankName"] : accountNoWiseDetails[accountId]?.Bank_Name || "",
        //         "BranchName": thisInvoiceData["BranchName"] ? thisInvoiceData["BranchName"] : accountNoWiseDetails[accountId]?.Branch_Name || "",
        //         "AEDNumber": thisInvoiceData["AEDNumber"] ? thisInvoiceData["AEDNumber"] : accountNoWiseDetails[accountId]?.AED_Number || "",
        //         "AccountName": thisInvoiceData["AccountName"] ? thisInvoiceData["AccountName"] : accountNoWiseDetails[accountId]?.Account_Name || "",
        //         "IBANCode": thisInvoiceData["IBANCode"] ? thisInvoiceData["IBANCode"] : accountNoWiseDetails[accountId]?.IBAN_Code || "",
        //         "PaidAmount": thisInvoiceData.invoicedAmount - thisInvoiceData.PaidAmount,
        //         "PaymentDate": "",
        //         "DiscountedAmount": "",
        //     });
        // }
        // else {
        //    // setPaymentMode("cheque");
        //     form.reset({
        //       //  "PaymentMode": "cheque",
        //         "ChequeNo": "",
        //         "PaidAmount": thisInvoiceData.invoicedAmount - thisInvoiceData.PaidAmount,
        //         "PaymentDate": "",
        //         "DiscountedAmount": "",
        //     });
        // }

    }, [isOpen,paymentMode]);

    const form = useForm<z.infer<typeof PaidInvoiceFormSchema>>({
        resolver: zodResolver(PaidInvoiceFormSchema),
        defaultValues: {
            PaymentMode: thisInvoiceData?.PaymentMode || "online",  // Ensure it's set
            PaidAmount: thisInvoiceData?.revenue - thisInvoiceData?.PaidAmount || 0,
            PaymentDate: "",
            DiscountedAmount: "",
            Account_Nickname_Online: "",
            BankName: "",
            BranchName: "",
            AEDNumber: "",
            AccountName: "",
            IBANCode: "",
            Account_Nickname_Cheque: "",
            ChequeNo: "",
        },
    });
    



    const handleOnSubmit = async (data: z.infer<typeof PaidInvoiceFormSchema>) => {
        console.log("Form Data Submitted: ", data);
        
        await InvokePaymentStatus({invoiceData: data,invoiceIdentifier:invoiceIdentifier})


        if(paymentMode === "online"){
            for (var key in accountNoWiseDetails) {
                if (thisInvoiceData.AEDNumber == accountNoWiseDetails[key].AED_Number) {
                    setAccountId(accountNoWiseDetails[key].accountId);
                    setBankName(accountNoWiseDetails[key].Bank_Name);
                    setBranchName(accountNoWiseDetails[key].Branch_Name);
                    setAEDNumber(accountNoWiseDetails[key].AED_Number);
                    setAccountName(accountNoWiseDetails[key].Account_Name);
                    setIBANCode(accountNoWiseDetails[key].IBAN_Code);
                    break;
                }
            }
            form.reset({
                "Account_Nickname_Online": thisInvoiceData.AEDNumber || "",
                "BankName": BankName,
                "BranchName": BranchName,
                "AEDNumber": AEDNumber,
                "AccountName": AccountName,
                "IBANCode": IBANCode,
                "PaidAmount": thisInvoiceData.revenue - thisInvoiceData.PaidAmount,
                "PaymentDate": "",
                "DiscountedAmount": ""
            })
        }
        else{
            form.reset({
                "Account_Nickname_Cheque": thisInvoiceData.AEDNumber || "",
                "PaidAmount": thisInvoiceData.revenue - thisInvoiceData.PaidAmount,
                "PaymentDate": "",
                "DiscountedAmount": "",
            })
        }

        onClose();
    };

    const onError = (errors: any) => {
        console.error("Form Submission Errors: ", errors);
    };

    const handleAccountForOnlineChange = (selectedItem: any) => {
        console.log("selectedItem", selectedItem);
        for (var key in accountNoWiseDetails) {
            if (selectedItem == accountNoWiseDetails[key].AED_Number) {
                setAccountId(accountNoWiseDetails[key].accountId);
                setBankName(accountNoWiseDetails[key].Bank_Name);
                setBranchName(accountNoWiseDetails[key].Branch_Name);
                setAEDNumber(accountNoWiseDetails[key].AED_Number);
                setAccountName(accountNoWiseDetails[key].Account_Name);
                setIBANCode(accountNoWiseDetails[key].IBAN_Code);
                break;
            }
        }
    }


    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-3xl" onClick={(e) => e.stopPropagation()}>
                <DialogHeader>
                    <DialogTitle>Paid Invoice</DialogTitle>
                </DialogHeader>
                <div>
                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(handleOnSubmit, onError)}
                            id="paid-invoice-form"
                        >
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="md:col-span-2">
                                    <div className="">Payment Mode</div>

                                    <div className="my-3">
                                        <RadioGroup defaultValue="online" onValueChange={setPaymentMode} className="flex gap-40 mx-6">
                                            <div className="flex items-center gap-2">
                                                <RadioGroupItem value="online" id="online-mode" />
                                                <Label htmlFor="online_mode">Online</Label>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <RadioGroupItem value="cheque" id="cheque_mode" />
                                                <Label htmlFor="cheque_mode">Cheque</Label>
                                            </div>
                                        </RadioGroup>
                                    </div>
                                </div>
                                {paymentMode === "online" && (
                                    <div className="md:col-span-1">
                                        <FormComboboxInput
                                            formControl={form.control}
                                            name="Account_Nickname_Online"
                                            label="Account Nickname"
                                            items={bankDetailsList}
                                            onSelect={(selectedItem) => { handleAccountForOnlineChange(selectedItem) }}
                                            
                                        />
                                    </div>
                                )}
                                {paymentMode === "cheque" && (
                                    <div className="md:col-span-1">
                                        <FormComboboxInput
                                            formControl={form.control}
                                            name="Account_Nickname_Cheque"
                                            label="Account Nickname"
                                            items={bankDetailsList}
                                        />
                                    </div>
                                )}
                            </div>

                            {paymentMode === "online" && (
                                <>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div className="md:col-span-1">
                                            <FormInput
                                                formControl={form.control}
                                                name="BankName"
                                                label="Bank Name"
                                                value={BankName}
                                                disabled={true}
                                            />
                                        </div>
                                        <div className="md:col-span-1">
                                            <FormInput
                                                formControl={form.control}
                                                name="BranchName"
                                                label="Branch Name"
                                                value={BranchName}
                                                disabled={true}
                                            />
                                        </div>
                                        <div className="md:col-span-1">
                                            <FormInput
                                                formControl={form.control}
                                                name="AEDNumber"
                                                label="AED Number"
                                                value={AEDNumber}
                                                disabled={true}
                                            />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div className="md:col-span-1">
                                            <FormInput
                                                formControl={form.control}
                                                name="AccountName"
                                                label="Account Name"
                                                value={AccountName}
                                                disabled={true}
                                            />
                                        </div>
                                        <div className="md:col-span-1">
                                            <FormInput
                                                formControl={form.control}
                                                name="IBANCode"
                                                label="IBAN Code"
                                                value={IBANCode}
                                                disabled={true}
                                            />
                                        </div>
                                    </div>

                                </>
                            )}
                            {paymentMode === "cheque" && (
                                <>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div className="md:col-span-1">
                                            <FormInput
                                                formControl={form.control}
                                                name="ChequeNo"
                                                label="Cheque No"
                                            />
                                        </div>

                                    </div>
                                </>
                            )}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="md:col-span-1">
                                    <FormInput
                                        formControl={form.control}
                                        name="PaidAmount"
                                        label="Amount Paid"
                                        type="number"
                                        disabled={true}
                                    />
                                </div>
                                <div className="md:col-span-1">
                                    <FormInput
                                        formControl={form.control}
                                        name="PaymentDate"
                                        label="Payment Date"
                                        type="date"
                                    />
                                </div>
                                <div className="md:col-span-1 mt-10">
                                    <Checkbox
                                        id="discount"
                                        checked={isDiscount}
                                        onCheckedChange={handleDiscountChange}
                                    />
                                    <label
                                        htmlFor="discount"
                                        className="ml-2 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                    >
                                        Discount
                                    </label>
                                </div>
                            </div>
                            {isDiscount && (
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div className="md:col-span-1">
                                        <FormInput
                                            formControl={form.control}
                                            name="DiscountedAmount"
                                            label="Discounted Amount"
                                            type="number"
                                        />
                                    </div>
                                </div>
                            )}

                        </form>
                    </Form>
                </div>
                <DialogFooter>

                    <TextButton type="submit" form="paid-invoice-form">Submit</TextButton>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default PaidInvoiceModalForm;
