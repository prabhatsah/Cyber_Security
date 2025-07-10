import React from 'react'
import AppCards from './components/app-cards';
import AllAppData from './components/data/all-app-data';
import { RenderAppBreadcrumb } from '@/ikon/components/app-breadcrumb/index';


async function page() {
    //const accountId = await getActiveAccountId();
    // const allApps = await getAvailableSoftwaresForAccount({ accountId })
    const allApps = await AllAppData();
    return (
        <>
            <RenderAppBreadcrumb breadcrumb={{ level: 2, title: "All Apps", href: "/app-store/all-apps" }} />
            {/* <AppFilter filterType={['SOFTWARE_STATUS','SOFTWARE_ACCESSIBILITY']} softwareData={allApps}/> */}
            {/* <RenderAppData appsData={allApps} />
            <RenderFilterData filtersDataType={['SOFTWARE_STATUS','SOFTWARE_ACCESSIBILITY']} /> */}
            <AppCards items={allApps} />
        </>
    )
}

export default page