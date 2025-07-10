import React, { ReactNode } from "react";
import { renderContentForSideMenu } from "./actions";
import DocumentSidebar from "@/ikon/components/document-sidebar";
import { RenderAppBreadcrumb } from "@/ikon/components/app-breadcrumb";
import { RenderAppSidebar } from "@/ikon/components/app-sidebar";
export default async function DocumentLayout({ children }: { children: ReactNode }) {
    try {
        const documentData: any = await renderContentForSideMenu(null, 'my-drive');
        return (
            <>
            <RenderAppSidebar menuItems={[]} />
                <RenderAppBreadcrumb breadcrumb={{ level: 1, title: "Document Management", href: "/document-management" }} />
                <div className="flex h-full overflow-hidden">
                    <DocumentSidebar documentData={documentData} />
                    <div className="flex-grow overflow-hidden">
                        {children}
                    </div>
                </div>
            </>
        );
    }
    catch (error) {
        console.error("Error fetching data:", error);
        return <div>Error loading data</div>;
    }
}