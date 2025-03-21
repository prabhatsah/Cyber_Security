"use client";

import { RenderAppBreadcrumb } from "@/components/app-breadcrumb";
import Header from "./Header";
import PastScans from "@/components/PastScans";
import { useConfiguration } from "@/app/scans/cloudContainer/components/ConfigurationContext";
import ServiceSummary from "./ServiceSummary";
import ServiceBreakdown from "./ServiceBreakdowns";
import { Label } from "@radix-ui/react-label";

export default function Dashboard() {
    const fetchedData = useConfiguration();

    return <>
        <RenderAppBreadcrumb
            breadcrumb={{
                level: 4,
                title: "Dashboard",
                href: "/scans/cloudContainer/cloud/google-cloud-platform/dashboard",
            }}
        />
        <div className="w-full">
            <Label className="text-[20px] font-bold text-gray-900 dark:text-gray-50">Cloud Scan</Label>
            <Header />
            <ServiceSummary />
            <ServiceBreakdown />
            <PastScans />
        </div>
    </>;
}