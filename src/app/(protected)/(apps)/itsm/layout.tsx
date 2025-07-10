import { RenderAppBreadcrumb } from '@/ikon/components/app-breadcrumb'
import { RenderAppSidebar } from '@/ikon/components/app-sidebar'
import React, { ReactNode } from 'react'
import { GlobalContextProvider } from './context/GlobalContext';
import { DiscoveryProvider } from './discovery/actions/context/DiscoveryContext';

interface LayoutProps {
    children: ReactNode;
}

const menuitems = [
    {
        title: "Dashboard",
        href: "/itsm",
        iconName: "layout-panel-top",
    },
    {
        title: "Discovery",
        href: "/itsm/discovery",
        iconName: "radio-tower",
    },
    {
        title: "Discovered Devices",
        href: "/itsm/discoveredDevices",
        iconName: "monitor",
    },
];

const Layout = ({ children }: LayoutProps) => {
    return (
      <div className='h-full'>
        <RenderAppBreadcrumb
            breadcrumb={{ level: 1, title: "ITSM", href: "/itsm" }}
        />
        <RenderAppSidebar menuItems={menuitems} />
        <DiscoveryProvider>
            <GlobalContextProvider>
                {children}
            </GlobalContextProvider>
        </DiscoveryProvider>
      </div>
    );
};

export default Layout