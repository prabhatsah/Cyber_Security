import { RenderAppBreadcrumb } from "@/ikon/components/app-breadcrumb";
import ToggleVariationOrder from "./components/toggleVariationOrder";
import { getMyInstancesV2 } from "@/ikon/utils/api/processRuntimeService";
import { getUserIdWiseUserDetailsMap } from "@/ikon/utils/actions/users";
import { getSoftwareIdByNameVersion } from "@/ikon/utils/actions/software";

export default async function VariationOrderTab({ params }: { params: { projectIdentifierId: string } }) {
    const projectIdentifier = params?.projectIdentifierId || "";

    const userIdWiseUserDetailsMap = await getUserIdWiseUserDetailsMap();

    const changeNotificationInstances: Record<string, any> = await getMyInstancesV2({
        processName: "Change Notification",
        predefinedFilters: { "taskName": 'Notification' },
        processVariableFilters: { "projectIdentifier": projectIdentifier },
    });

    console.log(changeNotificationInstances);

    const changeNotificationDatas = changeNotificationInstances.map((changeNotificationInstance: any) => {
        const changeNotificationData = changeNotificationInstance.data;
        const submitedBy = changeNotificationData?.submittedBy;
        const submitedByName = submitedBy ? userIdWiseUserDetailsMap[changeNotificationData?.submittedBy].userName : "";
        changeNotificationData.submittedBy = submitedByName;

        const notiPriorityInNum = changeNotificationData?.notiPriority;
        const notiPriorityInWord = notiPriorityInNum
            ? notiPriorityInNum === '1'
                ? 'Low'
                : notiPriorityInNum === '2'
                    ? 'Medium'
                    : 'High'
            : '';
        changeNotificationData.notiPriority = notiPriorityInWord
        return changeNotificationData
    })

    console.log(changeNotificationDatas);

    const dealInstances: Record<string, any>[] = await getMyInstancesV2({
        processName: "Deal",
        softwareId: await getSoftwareIdByNameVersion("Sales CRM", "1.0"),
        predefinedFilters: { taskName: "View State" },
    })
    console.log(dealInstances)

    let subDealData: Record<string, any>[] = [];
    const userDetailsMap = await getUserIdWiseUserDetailsMap();
    console.log(userDetailsMap);

    const accountInstance = await getMyInstancesV2({
        processName: "Account",
        softwareId: await getSoftwareIdByNameVersion("Base App", "1.0"),
        predefinedFilters: { "taskName": "View State" },
    })

    const accountInstanceDatas = accountInstance.map((instanceData) => instanceData.data);
    console.log(accountInstanceDatas);

    if (dealInstances.length) {
        dealInstances.map((dealInstance) => {
            if (dealInstance.data.parentDealId === projectIdentifier) {
                if (dealInstance.data.accountIdentifier) {
                    const filterData = accountInstanceDatas.filter((accountInstanceData: any) => {
                        console.log(accountInstanceData.accountIdentifier);
                        return accountInstanceData.accountIdentifier === dealInstance.data.accountIdentifier
                    });
                    dealInstance.data.accountName = filterData?.accountName
                } else if (dealInstance.data.accountDetails) {
                    console.log(dealInstance.data.accountDetails.accountName);
                    dealInstance.data.accountName = userDetailsMap[dealInstance.data.accountDetails.accountName]?.userName || 'n/a'
                } else {
                    dealInstance.data.accountName = "n/a";
                }

                dealInstance.data.approvedBy = userDetailsMap[dealInstance.data.approvedBy].userName || 'n/a';

                subDealData.push(dealInstance.data)
            }
        })
    }

    console.log(subDealData)


    const accountInsData = await getMyInstancesV2({
        processName: "Account",
        softwareId: await getSoftwareIdByNameVersion("Sales CRM", "1.0"),
        predefinedFilters: { taskName: "View State" },
    });
    const accountDataSubDeal = accountInsData.map((e: any) => e.data);
    console.log(accountDataSubDeal)
  
    const accountDataSubDealObj = accountDataSubDeal?.reduce(
        (acc: { [key: string]: any }, account: { accountIdentifier: any; accountName: any }) => {
            acc[account.accountIdentifier] = account.accountName;
            return acc;
        },
        {}
    );

    return (
        <>
            <RenderAppBreadcrumb
                breadcrumb={{
                    level: 5,
                    title: 'Variation Order',
                    href: `/variation-order`,
                }}
            />
            <ToggleVariationOrder notificationData={changeNotificationDatas} subDealData={subDealData} accountDataSubDeal={accountDataSubDealObj}/>
        </>

    );
}