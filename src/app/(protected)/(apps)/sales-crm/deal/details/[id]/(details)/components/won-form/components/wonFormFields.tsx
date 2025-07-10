import FormComboboxInput from '@/ikon/components/form-fields/combobox-input'
import FormDateInput from '@/ikon/components/form-fields/date-input'
import FormInput from '@/ikon/components/form-fields/input'
import FormTextarea from '@/ikon/components/form-fields/textarea'
import { Button } from '@/shadcn/ui/button'
import { Checkbox } from '@/shadcn/ui/checkbox'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shadcn/ui/form'
import { RadioGroup, RadioGroupItem } from '@/shadcn/ui/radio-group'
import { zodResolver } from '@hookform/resolvers/zod'
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { WonFormSchema } from './wonFormSchema'
import { Label } from '@/shadcn/ui/label'
import { Input } from '@/shadcn/ui/input'
import { getMyInstancesV2, invokeAction } from '@/ikon/utils/api/processRuntimeService'
import { buildScheduleSummaryData } from './getDealData'
import { formattedActualRevenueIncludingVAT } from './getActualRevenueIncludingVat'

type comboBoxOption = {
    value: string;
    label: string;
};

const ServiceLevelManagement = [
    { value: "Service-based", label: "Service-based" },
    { value: "Customer-based", label: "Customer-based" },
    { value: "Multi-level or Hierarchical", label: "Multi-level or Hierarchical" },
]

const taxInfo = [
    { value: "Not Applicable", label: "Not Applicable" },
    { value: "TRN", label: "TRN" },
    { value: "GST", label: "GST" }
]

export default function WonFormFields({ accountManagerName, projectManagerName, dealData, leadData, partnerData, exisitngAccountName, parentProjectNum, setOpen }:
    { accountManagerName: comboBoxOption[], projectManagerName: comboBoxOption[], dealData: any, leadData: any, partnerData: any, exisitngAccountName: any, parentProjectNum: any, setOpen: any }) {

    console.log(dealData);
    console.log(leadData);
    console.log(partnerData)
    console.log(exisitngAccountName);
    console.log(parentProjectNum);



    async function saveWonFormData(data: z.infer<typeof WonFormSchema>) {

        let mongoWhereClause = '';
        if (dealData?.leadIdentifier) {
            mongoWhereClause = `this.Data.accountIdentifier == "${dealData?.accountDetails?.accountIdentifier}"`;
        } else {
            if (dealData?.accountDetails?.accountIdentifier != "") {
                mongoWhereClause = `this.Data.dealIdentifier=="${dealData?.dealIdentifier}" || this.Data.leadIdentifier=="${dealData?.leadIdentifier}" || this.Data.accountIdentifier == "${dealData?.accountDetails?.accountIdentifier}" `;
            } else {
                mongoWhereClause = `this.Data.dealIdentifier=="${dealData?.dealIdentifier}" || this.Data.leadIdentifier=="${dealData?.leadIdentifier}" `;
            }
        }
        let procInsts = await getMyInstancesV2({
            processName: "Contact",
            predefinedFilters: { taskName: "View Contact" },
            mongoWhereClause: mongoWhereClause,
        })

        const procInstsData = procInsts[0]?.data;
        const procInstsTaskId = procInsts[0]?.taskId;

        if (dealData.leadIdentifier != undefined) {
            procInstsData['accountIdentifier'] = dealData?.accountDetails?.accountIdentifier || "";
        }

        if (!procInstsData["associatedDeals"]) {
            procInstsData["associatedDeals"] = {};
            procInstsData["associatedDeals"][dealData?.dealIdentifier] = procInstsData["isDefault"] ? procInstsData["isDefault"] : false;
        } else {
            procInstsData["associatedDeals"][dealData?.dealIdentifier] = procInstsData["isDefault"] ? procInstsData["isDefault"] : false;
        }

        console.log(procInstsData);


        await invokeAction({
            taskId: procInstsTaskId,
            transitionName: "Reassign in View Contact",
            data: procInstsData,
            processInstanceIdentifierField: 'email,phoneNo,type,source,leadIdentifier,dealIdentifier,contactIdentifier,accountIdentifier'
        })

        console.log(data)

        let accountDetails = {
            isChannelPartner: data.isChannelPartner,
            channelPartnerAccount: data.EXISTING_ACCOUNT_NAME,
            accountType: data?.ACCOUNT_TYPE,
            accountName: data?.ACCOUNT_NAME,
            accountManager: data?.ACCOUNT_MANAGER,
            accountCode: data?.ACCOUNT_CODE,
            taxinfo: data?.TAX_INFORMATION,
            address: data?.ADDRESS,
            city: data?.CITY,
            state: data?.STATE,
            poBox: data?.PO_BOX,
            country: data?.COUNTRY,
        }

        const {startDate,endDate} = await buildScheduleSummaryData(dealData);

        console.log(startDate);
        console.log(endDate);

        const revenueIncludingVat = await formattedActualRevenueIncludingVAT(dealData);

        console.log(revenueIncludingVat);

        let WonFormData = {
            "updatedOn": new Date(),
            "accountDetails": accountDetails,
            "dealStatus": "Won",
            "contractUpload": data?.UPLOAD_CONTRACT_DOCUMENT,
            "contractNumber": data?.CONTRACT_REFERENCE_NO,
            "dealWonDate": data?.DEAL_WON_DATE,
            "formattedActualRevenueIncludingVAT_contracted": /*ModuleLandingPage1721106955333.formattedActualRevenueIncludingVAT*/ revenueIncludingVat,
            "contractedStartDate": /*ref.contractedStartDate*/ startDate,
            "contractedEndDate": /*ref.contractedEndDate*/ endDate,
            ...(data?.PROJECT_NAME && { projectName: data?.PROJECT_NAME }),
            ...(data?.PROJECT_MANAGER && { projectManager: data?.PROJECT_MANAGER }),
            ...(data?.START_DATE && { startDate: data?.START_DATE }),
            ...(data?.PARENT_PROJECT_NUMBER && { parentProjectNo: data?.PARENT_PROJECT_NUMBER }),
        };

        console.log(WonFormData);

        const getDataClientReview = await getMyInstancesV2({
            processName: "Deal",
            predefinedFilters: { "taskName": "Client Review" }
        })

        console.log(getDataClientReview[0]?.taskId);
        const taskIdForInvokeAction = getDataClientReview[0]?.taskId

        await invokeAction({
            taskId: taskIdForInvokeAction,
            transitionName: "Transition to Won Activity",
            data: WonFormData,
            processInstanceIdentifierField: "dealIdentifier,dealStatus,dealName,leadIdentifier,productIdentifier,productType,projectManager,productStatus,accountIdentifier"
        })

        setOpen(false);
    }

    function getAddressInformation(addressType: string) {
        console.log(exisitngAccountName);
        const exisitingAccountAddressInfo = exisitngAccountName?.filter((accountValue: string) => accountValue.value === dealData?.accountDetails?.accountIdentifier);
        if (addressType === "address") {
            return exisitingAccountAddressInfo.address
        } else if (addressType === 'city') {
            return exisitingAccountAddressInfo.city
        } else if (addressType === 'country') {
            return exisitingAccountAddressInfo.country
        } else if (addressType === 'poBox') {
            return exisitingAccountAddressInfo.poBox
        } else if (addressType === 'state') {
            return exisitingAccountAddressInfo.state
        }
        return "Wrong Entry";

    }

    function getProductDetails(details: string) {
        for (let key in dealData) {
            if (key === "productDetails") {
                const productInfo = Object.values(dealData[key]);
                if (productInfo && details === "managerDetails") {
                    return Object.values(productInfo)[0]?.projectManager;
                } else if (productInfo && details === "productType") {
                    return Object.values(productInfo)[0]?.productType;
                }
                break;
            }
        }
        return undefined;
    }

    const form = useForm<z.infer<typeof WonFormSchema>>({
        resolver: zodResolver(WonFormSchema),
        defaultValues: {
            channelPartnerCreation: "no",
            isChannelPartner: false,
            partnerAccount: "",
            ACCOUNT_TYPE: "newAccount",
            ACCOUNT_NAME: leadData?.organisationDetails?.organisationName || dealData?.accountDetails?.accountName || "",
            EXISTING_ACCOUNT_NAME: dealData?.accountDetails?.accountIdentifier || "",
            ACCOUNT_CODE: dealData?.accountDetails?.accountCode || "",
            ACCOUNT_MANAGER: dealData?.accountDetails?.accountManager || "",
            SERVICE_LEVEL_MANAGEMENT: ServiceLevelManagement[0].value || "",
            DEAL_WON_DATE: undefined,
            PROJECT_NAME: dealData?.dealName || "",
            PROJECT_NUMBER: dealData?.dealNo || "",
            PARENT_PROJECT_NUMBER: dealData?.dealNo || "",
            START_DATE: dealData?.dealStartDate || undefined,
            PROJECT_MANAGER: getProductDetails("managerDetails") || "",
            TAX_INFORMATION: taxInfo[0].value || "",
            TAX_NUMBER: "",
            CONTRACT_REFERENCE_NO: "",
            UPLOAD_CONTRACT_DOCUMENT: undefined,
            ADDRESS: getAddressInformation("address") || "",
            CITY: getAddressInformation("city") || "",
            STATE: getAddressInformation("country") || "",
            PO_BOX: getAddressInformation("poBox") || "",
            COUNTRY: getAddressInformation("state") || ""
        }
    })
    const channelPartnerCreationValue = form.watch("channelPartnerCreation");
    const accountTypeValue = form.watch("ACCOUNT_TYPE");

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0] || null;
        form.setValue("UPLOAD_CONTRACT_DOCUMENT", file, { shouldValidate: true }); // Manually set file in form state
    };


    return (
        <>
            <div className='h-[60vh] overflow-auto p-4'>
                <Form {...form}>
                    <form>
                        <div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
                            <div>
                                <FormField
                                    control={form.control}
                                    name="isChannelPartner"
                                    render={({ field }) => (
                                        <FormItem className="space-x-3 ">
                                            <div className="flex flex-col space-y-3">
                                                <FormLabel>
                                                    Channel Partner Information
                                                </FormLabel>
                                                <div className='flex flex-row items-start space-x-3'>
                                                    <FormControl>
                                                        <Checkbox
                                                            checked={field.value}
                                                            onCheckedChange={field.onChange}
                                                        />
                                                    </FormControl>
                                                    <div className="space-y-1 leading-none">
                                                        <FormLabel>
                                                            Is channel partner
                                                        </FormLabel>
                                                    </div>
                                                </div>
                                            </div>
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <div>
                                <FormField
                                    control={form.control}
                                    name="channelPartnerCreation"
                                    render={({ field }) => (
                                        <FormItem className="space-x-3">
                                            <div className="flex flex-col space-y-3">
                                                <FormLabel>Was the account created through a channel partner?</FormLabel>
                                                <FormControl>
                                                    <RadioGroup
                                                        onValueChange={field.onChange}
                                                        defaultValue='no'
                                                        className="flex flex-row space-y-1"
                                                    >
                                                        <FormItem className="flex items-center space-x-3 space-y-0">
                                                            <FormControl>
                                                                <RadioGroupItem value="yes" />
                                                            </FormControl>
                                                            <FormLabel className="font-normal">
                                                                Yes
                                                            </FormLabel>
                                                        </FormItem>
                                                        <FormItem className="flex items-center space-x-3 space-y-0">
                                                            <FormControl>
                                                                <RadioGroupItem value="no" />
                                                            </FormControl>
                                                            <FormLabel className="font-normal">
                                                                No
                                                            </FormLabel>
                                                        </FormItem>
                                                    </RadioGroup>
                                                </FormControl>
                                                <FormMessage />
                                            </div>
                                        </FormItem>
                                    )}
                                />
                            </div>

                            {
                                channelPartnerCreationValue === 'yes' &&
                                <div>
                                    <FormComboboxInput items={partnerData} formControl={form.control} name={"partnerAccount"} label={"Partner Account"} placeholder={"Choose Partner Account"} />
                                </div>
                            }

                        </div>

                        <div className='grid grid-cols-1 md:grid-cols-3 gap-3 mt-3'>
                            <FormLabel className='col-span-3 font-semibold text-md'>Account Information</FormLabel>
                            <div className='self-center'>
                                <FormField
                                    control={form.control}
                                    name="ACCOUNT_TYPE"
                                    render={({ field }) => (
                                        <FormItem className="space-y-3">
                                            <FormControl>
                                                <RadioGroup
                                                    onValueChange={field.onChange}
                                                    defaultValue='newAccount'
                                                    className="flex flex-row space-y-1"
                                                >
                                                    <FormItem className="flex items-center space-x-3 space-y-0">
                                                        <FormControl>
                                                            <RadioGroupItem value="newAccount" />
                                                        </FormControl>
                                                        <FormLabel className="font-normal">
                                                            New Account
                                                        </FormLabel>
                                                    </FormItem>
                                                    <FormItem className="flex items-center space-x-3 space-y-0">
                                                        <FormControl>
                                                            <RadioGroupItem value="existingAccount" />
                                                        </FormControl>
                                                        <FormLabel className="font-normal">
                                                            Exisiting Account
                                                        </FormLabel>
                                                    </FormItem>
                                                </RadioGroup>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            {
                                accountTypeValue === 'existingAccount' ?
                                    <FormComboboxInput items={exisitngAccountName} formControl={form.control} name={"EXISTING_ACCOUNT_NAME"} label={"Account Name"} placeholder={"Choose Account Name"} /> :
                                    <FormInput formControl={form.control} name={"ACCOUNT_NAME"} label={"Account Name"} placeholder={"Enter Account Name"} />
                            }
                            <FormInput formControl={form.control} name={"ACCOUNT_CODE"} label={"Account Code"} placeholder={"Enter Account Code"} />
                            <FormComboboxInput items={accountManagerName} formControl={form.control} name={"ACCOUNT_MANAGER"} label={"Account Manager"} placeholder={"Choose Account Manager"} />
                            <FormComboboxInput items={ServiceLevelManagement} formControl={form.control} name={"SERVICE_LEVEL_MANAGEMENT"} label={"Service Level Management"} placeholder={"Choose Service Level Management"} />
                            <FormDateInput formControl={form.control} name={"DEAL_WON_DATE"} label={"Deal Won Date"} placeholder={"Enter Deal Won Date"} />

                            {
                                getProductDetails("productType") === "Professional Service" &&
                                <>
                                    <FormLabel className='col-span-3 font-semibold text-md'>Project Information</FormLabel>
                                    <FormInput formControl={form.control} name={"PROJECT_NAME"} label={"Project Name"} placeholder={"Enter Project Name"} />
                                    <FormInput formControl={form.control} name={"PROJECT_NUMBER"} label={"Project Number"} placeholder={"Enter Project Number"} />
                                    <FormComboboxInput items={parentProjectNum} formControl={form.control} name={"PARENT_PROJECT_NUMBER"} label={"Parent Project Numbe"} placeholder={"Choose Parent Project Number"} />
                                    <FormDateInput formControl={form.control} name={"START_DATE"} label={"Start Date"} placeholder={"Enter Start Date"} />
                                    <FormComboboxInput items={projectManagerName} formControl={form.control} name={"PROJECT_MANAGER"} label={"Project Manager"} placeholder={"Choose Project Manager"} />
                                </>
                            }
                        </div>

                        <div className='grid grid-cols-1 md:grid-cols-3 gap-3 mt-3'>
                            <FormLabel className='col-span-3 font-semibold text-md'>Tax Information</FormLabel>
                            <FormComboboxInput items={taxInfo} formControl={form.control} name={"TAX_INFORMATION"} label={"Tax Information"} placeholder={"Choose Tax Type"} />
                            <div className='col-span-1 md:col-span-2'>
                                <FormInput formControl={form.control} name={"TAX_NUMBER"} label={"Tax Number"} placeholder={"Enter Tax Number"} disabled />
                            </div>
                        </div>

                        <div className='grid grid-cols-1 gap-3 mt-3'>
                            <FormLabel className='font-semibold text-md'>Contract Information</FormLabel>
                            <FormInput formControl={form.control} name={"CONTRACT_REFERENCE_NO"} label={"Contact Reference Number"} placeholder={"Enter Contact Reference Number"} />
                            {/* <FormInput formControl={form.control} name={"UPLOAD_CONTACT_DOCUMENT"} label={"Upload Contact Document"} placeholder={"Enter Upload Contact Document"} type="file" /> */}
                            <FormField
                                control={form.control}
                                name="UPLOAD_CONTRACT_DOCUMENT"
                                render={() => (
                                    <FormItem>
                                        <Label htmlFor="upload">Upload Document</Label>
                                        <FormControl>
                                            <Input
                                                type="file"
                                                id="upload"
                                                onChange={handleFileChange}
                                                className="cursor-pointer"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className='grid grid-cols-1 md:grid-cols-4 mt-3 gap-3'>
                            <FormLabel className='font-semibold text-md col-span-1 md:col-span-4'>Contact Information</FormLabel>
                            <div className='col-span-1 md:col-span-4 '>
                                <FormTextarea formControl={form.control} name={"ADDRESS"} label={"Address"} placeholder={"Address"} disabled={getProductDetails("productType") === "User License"} />
                            </div>
                            <FormInput formControl={form.control} name={getProductDetails("productType") === "Professional Service" ? "CITY" : "city"} label={"City"} placeholder={"Enter City Name"} disabled={getProductDetails("productType") === "User License"} />
                            <FormInput formControl={form.control} name={getProductDetails("productType") === "Professional Service" ? "STATE" : "state"} label={"State"} placeholder={"Enter State Name"} disabled={getProductDetails("productType") === "User License"} />
                            <FormInput formControl={form.control} name={getProductDetails("productType")==="Professional Service"?"PO_BOX":"po_box"} label={"PO BOX"} placeholder={"Enter PO BOX"} disabled={getProductDetails("productType") === "User License"} />
                            <FormComboboxInput items={[{ value: "India", label: "India" }]} formControl={form.control} name={getProductDetails("productType")==="Professional Service"? "COUNTRY":"country"} label={"Country"} placeholder={"Choose Country Name"} disabled={getProductDetails("productType") === "User License"} />
                        </div>

                    </form>
                </Form>
            </div>
            <div className='flex flex-row-reverse'>
                <Button type="button" onClick={form.handleSubmit(saveWonFormData)}>Save</Button>
            </div>
        </>
    )
}
