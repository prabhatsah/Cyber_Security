import React from 'react'
import AppCards from '../components/app-cards'
import SubscribedAppData from '../components/data/subscribed-app-data';
import { RenderAppBreadcrumb } from '@/ikon/components/app-breadcrumb/index';


async function page() {
    // const accountId = await getActiveAccountId();
    // const subscribedApps = await getAllSubscribedSoftwaresForClient({ accountId })
    const subscribedApps = await SubscribedAppData();
    return (
        <>
            <RenderAppBreadcrumb breadcrumb={{ level: 2, title: "Subscribed Apps", href: "/app-store/subscribed-apps" }} />
            {/* <AppFilter filterType={['SOFTWARE_ACCESSIBILITY']} softwareData={subscribedApps} /> */}
            {/* <RenderAppData appsData={subscribedApps} />
            <RenderFilterData filtersDataType={['SOFTWARE_STATUS','SOFTWARE_ACCESSIBILITY']} /> */}
            <AppCards items={subscribedApps} />
        </>
    )
}

export default page