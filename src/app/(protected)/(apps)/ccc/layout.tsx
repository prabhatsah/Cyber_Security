import { RenderAppBreadcrumb } from '@/ikon/components/app-breadcrumb'
import { RenderAppSidebar } from '@/ikon/components/app-sidebar'
import React, { ReactNode } from 'react'
import { DiscoveryProvider } from './discovery/actions/context/DiscoveryContext';
import { Toaster } from "@/shadcn/ui/toaster"
import { LowCodeNoCodeContextProvider } from './low-code-no-code/context/LowCodeNoCodeContext';


interface LayoutProps {
    children: ReactNode;
}

const menuitems = [
    {
        title: "Dashboard",
        href: "/ccc",
        iconName: "layout-panel-top",
    },
    {
        title: "Discovery",
        href: "/ccc/discovery",
        iconName: "radio-tower",
    },
    {
        title: "Devices List",
        href: "/ccc/deviceList",
        iconName: "monitor",
    },
    {
        title: "Command Catalog",
        href: "/ccc/command-catalog",
        iconName: "network",
    },
    {
        title: "Low-Code / No-Code",
        href: "/ccc/low-code-no-code",
        iconName: "code",
    },
    {
        title:"Probe Management",
        href:"ccc/probe-management",
        iconName:"monitor-cog"
    },
    {
        title:"Dashboard",
        href:"ccc/dashboard",
        iconName:"layout-dashboard"
    }
];

const Layout = ({ children }: LayoutProps) => {
    return (
        <LowCodeNoCodeContextProvider>
            <Toaster/>
            <DiscoveryProvider>
                <div className='h-full'>
                    <RenderAppBreadcrumb
                        breadcrumb={{ level: 1, title: "CCC", href: "/ccc" }}
                    />
                    <RenderAppSidebar menuItems={menuitems} />
                    {children}
                </div>
            </DiscoveryProvider>
        </LowCodeNoCodeContextProvider>
    );
};

export default Layout