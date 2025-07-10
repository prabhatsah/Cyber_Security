import React from 'react'
import AppCards from '../components/app-cards'
import MyAppData from '../components/data/my-app-data';
import { AppFilter } from '../components/app-filter';
import { RenderAppData } from '../components/render-app-data';
import { RenderFilterData } from '../components/render-filter-data/inddex';
import { RenderAppBreadcrumb } from '@/ikon/components/app-breadcrumb/index';


async function page() {
    // const accountId = await getActiveAccountId();
    // const myApps = await getMySoftwares({ accountId })
    const myApps = await MyAppData();
    return (
        <>
            <RenderAppBreadcrumb breadcrumb={{ level: 2, title: "My Apps", href: "/app-store/my-apps" }} />
            {/* <RenderAppData appsData={myApps} /> */}
            {/* <RenderFilterData filtersDataType={['SOFTWARE_STATUS','SOFTWARE_ACCESSIBILITY']} /> */}
            <AppCards items={myApps} />
        </>
    )
}

export default page