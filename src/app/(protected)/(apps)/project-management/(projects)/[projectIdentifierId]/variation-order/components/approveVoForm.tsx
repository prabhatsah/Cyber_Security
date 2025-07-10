import { TextButton } from '@/ikon/components/buttons';
import FormComboboxInput from '@/ikon/components/form-fields/combobox-input';
import FormDateInput from '@/ikon/components/form-fields/date-input';
import FormInput from '@/ikon/components/form-fields/input';
import FormTextarea from '@/ikon/components/form-fields/textarea';
import { getCurrentUserId, getProfileData } from '@/ikon/utils/actions/auth';
import { getSoftwareIdByNameVersion } from '@/ikon/utils/actions/software';
import { getMyInstancesV2 } from '@/ikon/utils/api/processRuntimeService';
import { Checkbox } from '@/shadcn/ui/checkbox';
import { Form } from '@/shadcn/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { v4 } from 'uuid';
import { z } from "zod";
import { InvokeMyDealData } from './invokeMyDealData';


export const variationApproveSchema = z.object({
    dealNo: z.string().optional(),
    dealName: z.string().nonempty("Deal Name is required"),
    currency: z.string().nonempty("Currency is required"),
    expectedRevenue: z.string().nonempty("Expected Revenue is required"),
    dealStartDate: z.date({
        required_error: "Expected Closing Date is required",
    }),
    accountDetails: z
        .object({
            accountIdentifier: z.string().optional(),
            accountName: z.string().nonempty("Account Name is required"),
            accountManager: z.string().optional(),
            accountCode: z.string().optional(),
        })
        .optional(),
    productDetails: z
        .object({
            productIdentifier: z.string().optional(),
            productType: z.string().optional(),
            projectManager: z.string().optional(),
            productDescription: z.string().optional(),
        })

        .optional(),
    isDebtRevenue: z.boolean().optional(),
    copyDealCheck: z.boolean().optional(),
    dealIdentifier: z.string().optional(),
    olddealIdentifier: z.string().optional(),
    contactDetails: z.record(z.string()).optional(),
    dealStatus: z.string().optional(),
    updatedOn: z.string().optional(),
    createdBy: z.string().optional(),
});

interface Account {
    accountIdentifier: string;
    accountName: string;
    accountManager: string;
    accountCode: string;
}

type DealFormValues = z.infer<typeof variationApproveSchema>;

interface NewProductDetails {
    [key: string]: {
        productIdentifier: string;
        productType: string;
        projectManager: string;
        productDescription: string;
    };
}
export default function AapproveVoForm({ dealsData, accountData, projectManagers, checkedRows, setOpen, projectInstanceDetails, accountManagerDetails }: any) {

    console.log(accountManagerDetails);

    const params = useParams();

    const removeDuplicates = (data: any[], key: string) => {
        const seen = new Set();
        return data?.filter((item) => {
            const uniqueValue = item[key];
            if (seen.has(uniqueValue)) {
                return false;
            }
            seen.add(uniqueValue);
            return true;
        });
    };

    // const [isNewDeal, setIsNewDeal] = useState(true);
    // const [isCopyDeal, setIsCopyDeal] = useState(false);
    const [isRevenue, setIsRevenue] = useState(true);
    const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);
    // const [selectedProduct, setSelectedProduct] = useState("");
    // const [prjMngrCome, setPrjMngrCome] = useState(false);
    const [dealNo, setDealNo] = useState("");
    const [selectedDeal, setSelectedDeal] = useState<any>([]);
    const [selectedDealDT, setSelectedDealDT] = useState(false);
    // const [selectedAccMngr, setSelectedAccMngr] = useState("");
    const [userId, setUserId] = useState("");
    const [voType, setVoType] = useState<string[]>([]);
    const [notificationIds, setNotificationIds] = useState<string[]>([]);
    const [parentDealId, setParentDealId] = useState<string | string[] | undefined>(undefined);
    const [parentDealNo, setParentDealNo] = useState<Record<string, any> | null>(null)

    useEffect(() => {
        const currentTime = new Date().getTime() + "";
        const generatedDealNo =
            "D" + currentTime.substring(currentTime.length - 6, currentTime.length);
        setDealNo(generatedDealNo);

        const projectIdentifier = params?.projectIdentifierId;
        setParentDealId(projectIdentifier);

        console.log(projectIdentifier);

        console.log(projectInstanceDetails);

        let filterData = dealsData.filter((dealData: Record<string, any>) => dealData.dealIdentifier === projectIdentifier);
        if (filterData.length === 0) {
            filterData = dealsData.filter((dealData: Record<string, any>) => dealData.dealName === projectInstanceDetails[0]?.dealName);
        }
        console.log(filterData);
        setParentDealNo(filterData);
        if (checkedRows.length) {
            setVoType(checkedRows.map((selectedRows: Record<string, any>) => selectedRows.voType))
            setNotificationIds(checkedRows.map((selectedRows: Record<string, any>) => selectedRows.notiIdentifier))
        }

    }, []);

    console.log(voType);
    console.log(notificationIds);
    console.log(parentDealId);

    useEffect(() => {
        if (selectedDeal) {
            form.reset({
                dealName: selectedDeal.dealName || "",
                currency: selectedDeal.currency || "",
                expectedRevenue: selectedDeal.expectedRevenue || 0,
                dealStartDate: selectedDeal.dealStartDate || "",
                accountDetails: {
                    accountIdentifier:
                        selectedDeal?.accountDetails?.accountIdentifier || "",
                    accountName: selectedDeal.accountDetails?.accountName || "",
                    accountManager: selectedDeal.accountDetails?.accountManager || "",
                    accountCode: selectedDeal.accountDetails?.accountCode || "",
                },
                productDetails: selectedDeal.productDetails || {},
                isDebtRevenue: selectedDeal.isDebtRevenue || false,
                copyDealCheck: selectedDeal.copyDealCheck || false,
                dealIdentifier: selectedDeal.dealIdentifier || "",
                olddealIdentifier: selectedDeal.olddealIdentifier || "",
                contactDetails: selectedDeal.contactDetails || {},
                dealStatus: "",
            });
        }
    }, [selectedDeal]);

    dealsData = removeDuplicates(dealsData, "dealIdentifier");

    console.log("Deal Data ", dealsData);

    console.log("Account Data ", accountData);
    const formattedAccount = accountData?.map(
        (account: { accountIdentifier: any; accountName: any }) => ({
            value: account.accountIdentifier,
            label: account.accountName,
        })
    );

    console.log(formattedAccount);

    // console.log("Product Data ", productData);

    const productData = [
        { value: "Professional Service", label: "Professional Service" },
    ];


    // const handleRevenueChange = () => {
    //     setIsRevenue(!isRevenue);
    // };

    const form = useForm<z.infer<typeof variationApproveSchema>>({
        resolver: zodResolver(variationApproveSchema),
        defaultValues: {
            dealName: "",
            currency: "",
            expectedRevenue: "",
            dealStartDate: new Date(),
            accountDetails: {
                accountName: "",
                accountManager: "",
                accountCode: "",
                accountIdentifier: "",
            },
            productDetails: {
                productType: "Professional Service",
                projectManager: ""
            },
            isDebtRevenue: false,
            copyDealCheck: false,
            dealIdentifier: "",
            olddealIdentifier: "",
            contactDetails: {},
            dealStatus: "",
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

    const handleOnSubmit = async (data: z.infer<typeof variationApproveSchema>) => {
        console.log("Form Data Submitted: ", data);

        if (data.dealIdentifier == "") {
            data.dealIdentifier = v4();
        }
        data.isDebtRevenue = isRevenue;
        data.dealStatus = "Deal Created";

        interface NewData extends Omit<DealFormValues, "productDetails"> {
            productDetails: NewProductDetails;
        }
        data.accountDetails = {
            ...data.accountDetails,
            accountCode:
                selectedAccount?.accountCode ||
                selectedDeal?.accountDetails?.accountCode,
            accountIdentifier:
                selectedAccount?.accountIdentifier ||
                selectedDeal?.accountDetails?.accountIdentifier,
            accountName:
                data.accountDetails?.accountName ||
                selectedDeal?.accountDetails?.accountName,
            accountManager:
                selectedAccount?.accountManager ||
                selectedDeal?.accountDetails?.accountManager,
        };

        data.dealNo = dealNo;

        const formattedDate = format(data.dealStartDate, "yyyy-MM-dd");
        console.log(formattedDate);

        data.updatedOn = new Date().toISOString();
        data.createdBy = userId;

        const productIdentifier = v4();

        const newData = {
            ...data,
            dealStartDate: formattedDate,
            parentDealId: parentDealId,
            approvedBy: await getCurrentUserId(),
            voType: voType,
            selectedNotificationIds: notificationIds,
            productDetails: {
                [productIdentifier]: {
                    productIdentifier: productIdentifier,
                    productType: data.productDetails?.productType,
                    projectManager: data.productDetails?.projectManager,
                    productDescription: data.productDetails?.productDescription,
                },
            },
        };
        console.log("Final form data:", newData);

        await InvokeMyDealData(newData);

        form.reset({
            dealName: selectedDeal?.dealName || "",
            currency: selectedDeal?.currency || "",
            expectedRevenue: selectedDeal?.expectedRevenue || 0,
            dealStartDate:
                (selectedDeal?.dealStartDate && new Date(selectedDeal.dealStartDate)) ||
                new Date(),
            accountDetails: {
                accountIdentifier:
                    selectedDeal?.accountDetails?.accountIdentifier || "",
                accountName: selectedDeal?.accountDetails?.accountName || "",
                accountManager: selectedDeal?.accountDetails?.accountManager || "",
                accountCode: selectedDeal?.accountDetails?.accountCode || "",
            },
            productDetails: selectedDeal?.productDetails || {},
            isDebtRevenue: selectedDeal?.isDebtRevenue || false,
            copyDealCheck: selectedDeal?.copyDealCheck || false,
            dealIdentifier: selectedDeal?.dealIdentifier || "",
            olddealIdentifier: selectedDeal?.olddealIdentifier || "",
            contactDetails: selectedDeal?.contactDetails || {},
            dealStatus: "",
        });

        setOpen(false);

    };

    const onError = (errors: any) => {
        console.error("Form Submission Errors: ", errors);
    };

    useEffect(() => {
        if (parentDealNo) {
            if (parentDealNo[0].accountDetails) {
                console.log(parentDealNo[0]?.accountDetails?.accountIdentifier)
                form.setValue('accountDetails.accountName', parentDealNo[0]?.accountDetails?.accountIdentifier);
                form.setValue('accountDetails.accountManager', parentDealNo[0]?.accountDetails?.accountManager);
            }
            form.setValue('productDetails.projectManager', parentDealNo[0]?.projectManager);
        }
    }, [parentDealNo])

    console.log(form.watch('accountDetails.accountName'));
    return (

        <div>
            {
                parentDealNo &&
                <div className='flex flex-row gap-32 mb-3'>
                    <div>
                        Parent Deal No: {parentDealNo[0]?.dealNo}
                    </div>
                    <div>
                        Parent Deal Name: {parentDealNo[0]?.dealName}
                    </div>
                </div>
            }

            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(handleOnSubmit, onError)}
                    id="deal-form"
                >
                    <div className="grid grid-cols-3 gap-4 ">
                        <div className="grid gap-1.5 mt-2">
                            <FormInput
                                formControl={form.control}
                                name={"dealNo"}
                                label="Deal No *"
                                value={dealNo}
                                readOnly
                            />
                        </div>

                        <div className="grid gap-1.5 mt-2">
                            <FormInput
                                formControl={form.control}
                                name={"dealName"}
                                label="Deal Name *"
                                placeholder="Enter Deal Name"
                            />
                        </div>

                        <div className="grid gap-1.5 mt-2">
                            <FormComboboxInput
                                items={[
                                    {
                                        value: "USD",
                                        label: "USD",
                                    },
                                    {
                                        value: "GBP",
                                        label: "GBP",
                                    },
                                    {
                                        value: "INR",
                                        label: "INR",
                                    },
                                    {
                                        value: "QAR",
                                        label: "QAR",
                                    },
                                    {
                                        value: "SAR",
                                        label: "SAR",
                                    },
                                    {
                                        value: "AED",
                                        label: "AED",
                                    },
                                ]}
                                formControl={form.control}
                                name={"currency"}
                                label="Currency *"
                                placeholder={"Choose Currency"}
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-3 gap-4 ">
                        <div className="grid gap-1.5 mt-2">
                            <FormInput
                                formControl={form.control}
                                name={"expectedRevenue"}
                                label="Expected Revenue *"
                                placeholder="Enter Expected Revenue"
                            />
                        </div>

                        <div className="grid gap-1.5 mt-2">
                            <FormDateInput
                                formControl={form.control}
                                name={"dealStartDate"}
                                label="Expected Closing Date *"
                                placeholder="Please Enter Date"
                            />
                        </div>

                        <div className="grid gap-1.5 mt-4">
                            <div className="flex items-center">
                                <Checkbox
                                    id="revenue"
                                    checked={isRevenue}
                                    // onCheckedChange={handleRevenueChange}
                                    disabled
                                />
                                <label
                                    htmlFor="revenue"
                                    className="ml-2 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                >
                                    Revenue in Debt
                                </label>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-1.5 mt-4">
                            <FormComboboxInput
                                items={formattedAccount}
                                formControl={form.control}
                                name={"accountDetails.accountName"}
                                placeholder={"Select Account Name"}
                                label="Account Name *"
                                disabled={parentDealNo && parentDealNo[0]?.accountDetails ? true : false}
                            />
                        </div>

                        <div className="grid gap-1.5 mt-4">
                            <FormComboboxInput
                                items={accountManagerDetails}
                                formControl={form.control}
                                name={"accountDetails.accountManager"}
                                placeholder={"Select Account Manager"}
                                label="Account Manager *"
                                disabled={parentDealNo && parentDealNo[0]?.accountDetails ? true : false}
                            />
                        </div>
                    </div>

                    <div
                        className={`grid grid-cols-2 gap-4 ${selectedDealDT ? "hidden" : "block"
                            }`}
                    >
                        <div className="grid gap-1.5 mt-4">
                            <FormComboboxInput
                                items={productData}
                                formControl={form.control}
                                name={"productDetails.productType"}
                                label="Product Name *"
                                placeholder={"Select Product"}
                                disabled
                            />
                        </div>

                        <div className='grid gap-1.5 mt-4'>
                            <FormComboboxInput
                                items={projectManagers}
                                formControl={form.control}
                                name={"productDetails.projectManager"}
                                label="Project Manager *"
                                placeholder={"Select Project Manager"}
                            />
                        </div>
                    </div>

                    <div
                        className={`grid grid-cols-1 gap-4 ${selectedDealDT ? "hidden" : "block"
                            }`}
                    >
                        <div className="grid gap-1.5 mt-2">
                            <FormTextarea
                                name={"productDetails.productDescription"}
                                formControl={form.control}
                                placeholder="Enter product description here"
                                label="Product Description"
                            />
                        </div>
                    </div>
                    <div className='my-2 flex flex-row-reverse'>
                        <TextButton type="submit" form="deal-form">Submit</TextButton>
                    </div>
                </form>

            </Form>
        </div>


    );

}