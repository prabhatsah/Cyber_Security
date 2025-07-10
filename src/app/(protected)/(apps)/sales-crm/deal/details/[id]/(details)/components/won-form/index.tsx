'use client'

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/shadcn/ui/dialog'
import React, { useEffect, useState } from 'react'
import { getAccountManagerDetails, getProjectManagerDetails } from './components/fetchGroupData'
import { useParams } from "next/navigation";
import getDealData, { getChannelPartnerData, getExistingAccountTypeAccountName, getLeadData, getParentProjectNumber, SubscribedSoftwareNameMaps } from './components/getDealData'
import WonFormFields from './components/wonFormFields'
import { LoadingSpinner } from '@/ikon/components/loading-spinner'

type comboBoxOption = {
    value: string;
    label: string;
};


export function WorkForm({setOpen}:any) {

    const params = useParams();
    const dealIdentifier = params?.id;

    console.log(dealIdentifier);

    const [projectManagerDetails, setProjectManagerDetails] = useState<Record<string, any>>({});
    const [projectManagerName, setProjectManagerName] = useState<comboBoxOption[]>([]);

    const [accountManagerDetails, setAccountManagerDetails] = useState<Record<string, any>>({});
    const [accountManagerName, setAccountManagerName] = useState<comboBoxOption[]>([]);

    const [dealDataInfo, setDealDataInfo] = useState<Record<string, any>>({});
    const [leadDataInfo, setLeadDataInfo] = useState<Record<string, any>>({});
    const [partnerData, setPartnerData] = useState<Record<string, string>>({});
    const [exisitngAccountName, setExistingAccountName] = useState<Record<string, string>[]>([]);
    const [parentProjectNum, setParentProjectNum] = useState<Record<string, string>[]>([]);

    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        async function getProjectManagerUserDetails() {
            setLoading(true);
            try {
                const projectManagerDetailsData = await getProjectManagerDetails();
                setProjectManagerDetails(projectManagerDetailsData);

                const accountManagerDetailsData = await getAccountManagerDetails();
                setAccountManagerDetails(accountManagerDetailsData);

                const dealsData = await getDealData({ dealIdentifier: dealIdentifier })
                setDealDataInfo(dealsData); 


                const leadsData = await getLeadData({ dealIdentifier: dealIdentifier })
                setLeadDataInfo(leadsData);


                const SubscribedSoftwareInfo = await SubscribedSoftwareNameMaps()

                const salesCrmInfo = SubscribedSoftwareInfo.filter((appData:any)=> {
                    return appData.SOFTWARE_NAME==='Sales CRM'
                })

                const partnerInfo = await getChannelPartnerData(salesCrmInfo);

                const partnerInfoData = partnerInfo.map((partnerData) => {
                    return {
                        value: partnerData?.data?.accountIdentifier,
                        label: partnerData?.data?.accountName
                    }
                })
                setPartnerData(partnerInfoData);

                const existingTypeAccoutNameDetails = await getExistingAccountTypeAccountName(salesCrmInfo);

                const existingTypeAccountNamesData = existingTypeAccoutNameDetails.map((exisitingAccountName) => {
                    const { accountIdentifier, accountName, address, city, country, poBox, state } = exisitingAccountName?.data || {};
                    return {
                        value: accountIdentifier,
                        label: accountName,
                        address: address,
                        city: city,
                        country: country,
                        poBox: poBox,
                        state: state
                    }
                }
                )
                setExistingAccountName(existingTypeAccountNamesData);

                const projectManagementInfo = SubscribedSoftwareInfo.filter((appData:any)=> {
                    return appData.SOFTWARE_NAME==='Project Management'
                })

                const parentProjectNoInfo = await getParentProjectNumber(projectManagementInfo);

                let parentProjectNoData = parentProjectNoInfo
                .filter(parentProjectNo => parentProjectNo?.data?.projectNumber)
                .map((parentProjectNo) => {
                    const { projectNumber } = parentProjectNo?.data || {};
                    if (projectNumber) {
                        return {
                            value: projectNumber,
                            label: projectNumber
                        }
                    }
                });

                parentProjectNoData = [...parentProjectNoData, { value: dealsData?.dealNo, label: dealsData?.dealNo }];
                setParentProjectNum(parentProjectNoData);

            } catch (error) {
                console.log(error);
            } finally {
                setLoading(false);
            }

        }

        getProjectManagerUserDetails();
    }, []);

    useEffect(() => {
        const projectManagerUsers = projectManagerDetails?.users;
        let projectManagerValueLabel = [];
        for (let key in projectManagerUsers) {
            projectManagerValueLabel.push({ value: key, label: projectManagerUsers[key]?.userName })
        }
        setProjectManagerName(projectManagerValueLabel);

    }, [projectManagerDetails]);

    useEffect(() => {
        const accounttManagerUsers = accountManagerDetails?.users;
        let accounttManagerValueLabel = [];
        for (let key in accounttManagerUsers) {
            accounttManagerValueLabel.push({ value: key, label: accounttManagerUsers[key]?.userName })
        }
        setAccountManagerName(accounttManagerValueLabel);

    }, [accountManagerDetails]);

    return (
        <>
            {
                loading ? <div className='h-[60vh]'><LoadingSpinner size={60} /></div> :
                    <WonFormFields
                        projectManagerName={projectManagerName}
                        accountManagerName={accountManagerName}
                        dealData={dealDataInfo}
                        leadData={leadDataInfo}
                        partnerData={partnerData}
                        exisitngAccountName={exisitngAccountName}
                        parentProjectNum={parentProjectNum}
                        setOpen={setOpen}
                    />
            }
        </>
    )
}

export default function WonFormDiablogBox({ open, setOpen }: any) {
    return (
        <>
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="max-w-[60vw] ">
                    <DialogHeader>
                        <DialogTitle>Create Account</DialogTitle>
                    </DialogHeader>
                    {/* <div className="h-[60vh] overflow-auto"> */}
                    <WorkForm setOpen={setOpen}/>
                    {/* </div> */}
                </DialogContent>
            </Dialog>
        </>
    )
}
