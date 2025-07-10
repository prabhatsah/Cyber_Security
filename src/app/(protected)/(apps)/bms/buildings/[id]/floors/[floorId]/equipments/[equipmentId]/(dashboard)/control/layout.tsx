import type React from 'react';
import { HvacProvider } from "@/app/(protected)/(apps)/bms/context/HvacContext" // adjust path as needed
import { RenderAppBreadcrumb } from "@/ikon/components/app-breadcrumb";

interface LayoutProps {
    children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children,params, }) => {
    return (
        <>
            <RenderAppBreadcrumb
               breadcrumb={{ level: 5, title: "Alarm & Events", href: `/bms/buildings/${params.id}/floors/${params.floorId}/equipments/${params.equipmentId}/Control` }}
                           />
            
            <HvacProvider>
                {children}
            </HvacProvider>
        </>
    );
};

export default Layout;