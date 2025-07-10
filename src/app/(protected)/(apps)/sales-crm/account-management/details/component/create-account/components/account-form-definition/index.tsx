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
import { format, set } from "date-fns";
//import { dealSchema } from "../deal_form_schema";
import FormComboboxInput from "@/ikon/components/form-fields/combobox-input";
import FormInput from "@/ikon/components/form-fields/input";
import FormDateInput from "@/ikon/components/form-fields/date-input";
import FormTextarea from "@/ikon/components/form-fields/textarea";
import { TextButton } from "@/ikon/components/buttons";
import { accountSchema } from "../account-form-schema";
import { countryMap } from "../../../../../country_details";
import { startAccountData } from "../start_account";
import { getGroupNameWiseUserDetailsMap } from "@/ikon/utils/actions/users";

interface AccountModalProps {
    isOpen: boolean;
    onClose: () => void;
    selectedAccount?: any | undefined;
}
interface Account {
    accountIdentifier: string;
    accountName: string;
    accountManager: string;
    accountCode: string;
}


//type DealFormValues = z.infer<typeof dealSchema>;

const CreateAccountModalForm: React.FC<AccountModalProps> = ({
    isOpen,
    onClose,
    selectedAccount
}) => {
    console.log("accountData Modal", selectedAccount);
    
    //   const removeDuplicates = (data: any[], key: string) => {
    //     const seen = new Set();
    //     return data.filter((item) => {
    //       const uniqueValue = item[key];
    //       if (seen.has(uniqueValue)) {
    //         return false;
    //       }
    //       seen.add(uniqueValue);
    //       return true;
    //     });
    //   };

    const [isChannelPartner, setIsChannelPartner] = useState(false);
    const [wasChannelPartner, setWasChannelPartner] = useState("no");
    const [taxinfo, setTaxinfo] = useState(selectedAccount?.taxinfo || "Not Applicable");
    useEffect(() => {
        if (selectedAccount) {
          form.reset({
            accountIdentifier: selectedAccount?.accountIdentifier || "",
            accountName: selectedAccount?.accountName || "",
            accountCode: selectedAccount?.accountCode || "",
            accountManager: selectedAccount?.accountManager || "",
            createdOn: selectedAccount?.createdOn || new Date().toISOString(),
            updatedOn: new Date().toISOString(),
            taxinfo: selectedAccount?.taxinfo || "Not Applicable",
            taxnumber: selectedAccount?.taxnumber || "",
            address: selectedAccount?.address || "",
            city: selectedAccount?.city || "",
            state: selectedAccount?.state || "",
            pinCode: selectedAccount?.pinCode || "",
            country: selectedAccount?.country || "",
            phone: selectedAccount?.phone || "",
            email: selectedAccount?.email || "",
          });
        }
      }, [selectedAccount]);
    // if(selectedAccount){
    //     setTaxinfo
    // }

    //   const [isCopyDeal, setIsCopyDeal] = useState(false);
    //   const [isRevenue, setIsRevenue] = useState(false);
    //   const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);
    //   const [selectedProduct, setSelectedProduct] = useState("");
    //   const [prjMngrCome, setPrjMngrCome] = useState(false);
    //   const [dealNo, setDealNo] = useState("");
    //   const [selectedDeal, setSelectedDeal] = useState<any>([]);
    //   const [selectedDealDT, setSelectedDealDT] = useState(false);
    //   const [selectedAccMngr, setSelectedAccMngr] = useState("");
    const [userId, setUserId] = useState("");

    // useEffect(() => {

    // }, []);











    //   useEffect(() => {
    // //     const currentTime = new Date().getTime() + "";
    // //     const generatedDealNo =
    // //       "D" + currentTime.substring(currentTime.length - 6, currentTime.length);
    // //     setDealNo(generatedDealNo);
    // //   }, []);

    // //   const handleNewDealChange = () => {
    // //     setIsNewDeal(!isNewDeal);
    // //     setSelectedDealDT(false);

    // //     if (!isNewDeal) {
    // //       setIsCopyDeal(false);

    // //       setSelectedAccount(null);
    // //       setSelectedProduct("");
    // //       setPrjMngrCome(false);
    // //       setSelectedDeal({});
    // //       setIsRevenue(false);
    // //     }
    //   }

    //   const handleCopyDealChange = () => {
    //     setIsCopyDeal(!isCopyDeal);
    //     if (selectedDeal.length > 0) {
    //       setSelectedDealDT(true);
    //     }
    //     if (!isCopyDeal) {
    //       setIsNewDeal(false);

    //       setSelectedAccount(null);
    //       setSelectedProduct("");
    //       setPrjMngrCome(false);
    //       setSelectedDeal({});
    //       setIsRevenue(false);
    //     }
    //   };

    //   const handleRevenueChange = () => {
    //     setIsRevenue(!isRevenue);
    //   };

    //   const handleDealSelection = (selectedIdentifier: string) => {
    //     setSelectedDealDT(true);
    //     const selectedDeal = dealsData.find(
    //       (deal: { dealIdentifier: string }) =>
    //         deal.dealIdentifier === selectedIdentifier
    //     );
    //     setSelectedDeal(selectedDeal || null);
    //   };

    //   const handleAccountChange = (accountIdentifier: string | string[]) => {
    //     const account = accountData.find(
    //       (acc: { accountIdentifier: string }) =>
    //         acc.accountIdentifier === accountIdentifier
    //     );
    //     setSelectedAccount(account || null);
    //   };

    //   const handleProductChange = (value: any) => {
    //     setSelectedProduct(value);
    //     if (value == "Professional Service") {
    //       setPrjMngrCome(true);
    //     } else {
    //       setPrjMngrCome(false);
    //     }
    //   };

    const form = useForm<z.infer<typeof accountSchema>>({
        resolver: zodResolver(accountSchema),
        defaultValues: {
            accountIdentifier: selectedAccount?.accountIdentifier || "",
            accountName: selectedAccount?.accountName || "",
            accountCode: selectedAccount?.accountCode || "",
            accountManager: selectedAccount?.accountManager || "",
            createdOn: selectedAccount?.createdOn || new Date().toISOString(),
            updatedOn: new Date().toISOString(),
            taxinfo: selectedAccount?.taxinfo || "Not Applicable",
            taxnumber: selectedAccount?.taxnumber || "",
            address: selectedAccount?.address || "",
            city: selectedAccount?.city || "",
            state: selectedAccount?.state || "",
            pinCode: selectedAccount?.pinCode || "",
            country: selectedAccount?.country || "",
            phone: selectedAccount?.phone || "",
            email: selectedAccount?.email || "",
            //   accountDetails: {
            //     accountName: "",
            //     accountManager: "",
            //     accountCode: "",
            //     accountIdentifier: "",
            //   },
            //   productDetails: {},
            //   isDebtRevenue: false,
            //   copyDealCheck: false,
            //   dealIdentifier: "",
            //   olddealIdentifier: "",
            //   contactDetails: {},
            //   dealStatus: "",
        },
    });

    const fetchProfileData = async () => {
        try {
            const profileData = await getProfileData();
            setUserId(profileData.USER_ID);
        } catch (error) {
            console.error("Error fetching profile data:", error);
        }
    };

    useEffect(() => {
        fetchProfileData();
    }, []);

    const handleOnSubmit = async (data: z.infer<typeof accountSchema>) => {
        console.log("Form Data Submitted: ", data);
        console.log("Account Identifier", data.accountIdentifier);
        if (data.accountIdentifier == "") {
           data.accountIdentifier = v4();
        }
        await startAccountData(data);
        form.reset({
            accountIdentifier: selectedAccount?.accountIdentifier || "",
            accountName: selectedAccount?.accountName || "",
            accountCode: selectedAccount?.accountCode || "",
            accountManager: selectedAccount?.accountManager || "",
            createdOn: selectedAccount?.createdOn || new Date().toISOString(),
            updatedOn: new Date().toISOString(),
            taxinfo: selectedAccount?.taxinfo || "Not Applicable",
            taxnumber: selectedAccount?.taxnumber || "",
            address: selectedAccount?.address || "",
            city: selectedAccount?.city || "",
            state: selectedAccount?.state || "",
            pinCode: selectedAccount?.pinCode || "",
            country: selectedAccount?.country || "",
            phone: selectedAccount?.phone || "",
            email: selectedAccount?.email || "",
        });
        // data.isDebtRevenue = isRevenue;
        // data.dealStatus = "Deal Created";

        // interface NewData extends Omit<DealFormValues, "productDetails"> {
        //   productDetails: NewProductDetails;
        // }
        // if (isNewDeal) {
        //   data.accountDetails = {
        //     ...data.accountDetails,
        //     accountCode:
        //       selectedAccount?.accountCode ||
        //       selectedDeal?.accountDetails?.accountCode,
        //     accountIdentifier:
        //       selectedAccount?.accountIdentifier ||
        //       selectedDeal?.accountDetails?.accountIdentifier,
        //     accountName:
        //       data.accountDetails?.accountName ||
        //       selectedDeal?.accountDetails?.accountName,
        //     accountManager:
        //       selectedAccount?.accountManager ||
        //       selectedDeal?.accountDetails?.accountManager,
        //   };

        //   data.dealNo = dealNo;

        //   const formattedDate = format(data.dealStartDate, "yyyy-MM-dd");
        //   console.log(formattedDate);

        //   data.updatedOn = new Date().toISOString();
        //   data.createdBy = userId;

        //   const productIdentifier = v4();

        //   const newData = {
        //     ...data,
        //     dealStartDate: formattedDate,
        //     productDetails: {
        //       [productIdentifier]: {
        //         productIdentifier: productIdentifier,
        //         productType: data.productDetails?.productType,
        //         projectManager: data.productDetails?.projectManager,
        //         productDescription: data.productDetails?.productDescription,
        //       },
        //     },
        //   };
        //   console.log("Final form data:", newData);

        //   await startDealData(newData);
        // }

        // if (isCopyDeal) {
        //   data.productDetails = selectedDeal?.productDetails || {};
        //   data.dealNo = selectedDeal.dealNo;

        //   const formattedDate = format(data.dealStartDate, "yyyy-MM-dd");
        //   console.log(formattedDate);

        //   const newData = {
        //     ...data,
        //     dealStartDate: formattedDate,
        //     productDetails: selectedDeal?.productDetails,
        //   };
        //   console.log("Final form data:", newData);

        //   await startDealData(newData);
        // }

        // form.reset({
        //   dealName: selectedDeal?.dealName || "",
        //   currency: selectedDeal?.currency || "",
        //   expectedRevenue: selectedDeal?.expectedRevenue || 0,
        //   dealStartDate:
        //     (selectedDeal?.dealStartDate && new Date(selectedDeal.dealStartDate)) ||
        //     new Date(),
        //   accountDetails: {
        //     accountIdentifier:
        //       selectedDeal?.accountDetails?.accountIdentifier || "",
        //     accountName: selectedDeal?.accountDetails?.accountName || "",
        //     accountManager: selectedDeal?.accountDetails?.accountManager || "",
        //     accountCode: selectedDeal?.accountDetails?.accountCode || "",
        //   },
        //   productDetails: selectedDeal?.productDetails || {},
        //   isDebtRevenue: selectedDeal?.isDebtRevenue || false,
        //   copyDealCheck: selectedDeal?.copyDealCheck || false,
        //   dealIdentifier: selectedDeal?.dealIdentifier || "",
        //   olddealIdentifier: selectedDeal?.olddealIdentifier || "",
        //   contactDetails: selectedDeal?.contactDetails || {},
        //   dealStatus: "",
        // });

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
                    <DialogTitle>Add Account</DialogTitle>
                </DialogHeader>
                <div>
                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(handleOnSubmit, onError)}
                            id="account-form"
                        >
                            <div className="grid grid-cols-2 gap-4" id="account_checkbox">
                                <div className="grid gap-1.5">
                                    <div className="flex items-center">
                                        <Checkbox
                                            id="checkchannelPartner"
                                            checked={isChannelPartner}
                                            onCheckedChange={() => setIsChannelPartner(!isChannelPartner)}
                                        />
                                        <label
                                            htmlFor="checkchannelPartner"
                                            className="ml-2 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                        >
                                            Is channel partner
                                        </label>
                                    </div>
                                </div>
                                <div className="grid gap-1.5">
                                    <label className="">
                                        Was the account created through a channel partner?
                                    </label>
                                    <div className="flex gap-4">
                                        <Checkbox
                                            id="wasChannelPartnerYes"
                                            name="wasChannelPartner"
                                            checked={wasChannelPartner === "yes"}
                                            onCheckedChange={() => setWasChannelPartner("yes")}
                                        
                                        />
                                        <label
                                            htmlFor="wasChannelPartnerYes"
                                            className="ml-2 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                        >
                                            Yes
                                        </label>
                                        <Checkbox
                                            id="wasChannelPartnerNo"
                                            name="wasChannelPartner"
                                            checked={wasChannelPartner === "no"}
                                            onCheckedChange={() => setWasChannelPartner("no")}
                                        />
                                        <label
                                            htmlFor="wasChannelPartnerYes"
                                            className="ml-2 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                        >
                                            No
                                        </label>
                                </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-3 gap-4">
                                <div className="grid gap-1.5 mt-2">
                                    <FormInput
                                        formControl={form.control}
                                        name={"accountName"}
                                        label="Account Name *"
                                        placeholder="Enter Account Name"
                                       // value={selectedAccount?.accountName || ""}
                                    />
                                </div>
                                <div className="grid gap-1.5 mt-2">
                                    <FormInput
                                        formControl={form.control}
                                        name={"accountCode"}
                                        label="Account Code *"
                                        placeholder="Enter Account Code"
                                      //  value={selectedAccount?.accountCode || ""}
                                        
                                    />
                                </div>
                                <div className="grid gap-1.5 mt-2">
                                    <FormComboboxInput
                                        items={[
                                            {
                                                value: "e30576c6-9b46-423c-966e-a9ec8d76ac02",
                                                label: "Ankita Saha",
                                            },
                                            {
                                                value: "94707127-8639-4d4f-901c-aee7dbca1d0d",
                                                label: "Anushri Dutta",
                                            },
                                        ]}
                                        formControl={form.control}
                                        name={"accountManager"}
                                        placeholder={"Select Account Manager"}
                                        label="Account Manager *"
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-1.5 mt-2">
                                    <FormComboboxInput
                                        items={[
                                            {
                                                value: "Not Applicable",
                                                label: "Not Applicable",
                                            },
                                            {
                                                value: "TRN",
                                                label: "TRN",
                                            },
                                            {
                                                value: "GST",
                                                label: "GST",
                                            },
                                        ]}
                                        formControl={form.control}
                                        name={"taxinfo"}
                                        placeholder={"Select Tax Information"}
                                        label="Tax Information *"
                                        onSelect={(e: any) => setTaxinfo(e)}
                                        
                                    />
                                </div>
                                <div className="grid gap-1.5 mt-2">
                                    <FormInput
                                        formControl={form.control}
                                        name={"taxnumber"}
                                        label="Tax Number *"
                                        placeholder="Enter Tax Number"
                                        disabled={taxinfo === "Not Applicable"}
                                    //    value={selectedAccount?.taxnumber || ""}
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-1 gap-4">
                                <div className="grid gap-1.5 mt-2">
                                    <FormTextarea
                                        formControl={form.control}
                                        name={"address"}
                                        label="Address *"
                                        placeholder="Enter Address"
                                    //    value={selectedAccount?.address || ""}
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-4 gap-4">
                                <div className="grid gap-1.5 mt-2">
                                    <FormInput
                                        formControl={form.control}
                                        name={"city"}
                                        label="City"
                                        placeholder="Enter City"
                                    //    value={selectedAccount?.city || ""}
                                    />
                                </div>
                                <div className="grid gap-1.5 mt-2">
                                    <FormInput
                                        formControl={form.control}
                                        name={"state"}
                                        label="State"
                                        placeholder="Enter State"
                                    //    value={selectedAccount?.state || ""}
                                    />
                                </div>
                                <div className="grid gap-1.5 mt-2">
                                    <FormInput
                                        formControl={form.control}
                                        name={"pinCode"}
                                        label="Pincode"
                                        placeholder="Enter Pincode"
                                    //    value={selectedAccount?.pinCode || ""}
                                    />
                                </div>
                                <div className="grid gap-1.5 mt-2">
                                    <FormComboboxInput
                                        items={countryMap}
                                        formControl={form.control}
                                        name={"country"}
                                        placeholder={"Choose Country"}
                                        label="Country"
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-1.5 mt-2">
                                    <FormInput
                                        formControl={form.control}
                                        name={"phone"}
                                        label="Phone"
                                        placeholder="Enter Phone Number"
                                     //   value={selectedAccount?.phone || ""}
                                    />
                                </div>
                                <div className="grid gap-1.5 mt-2">
                                    <FormInput
                                        formControl={form.control}
                                        name={"email"}
                                        label="Email"
                                        placeholder="Enter Email"
                                     //   value={selectedAccount?.email || ""}
                                    />
                                </div>
                            </div>

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

export default CreateAccountModalForm;
