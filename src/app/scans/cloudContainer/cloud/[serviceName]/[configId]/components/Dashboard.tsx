"use client";

import { RenderAppBreadcrumb } from "@/components/app-breadcrumb";
import Header from "./Header";
import PastScans from "@/components/PastScans";
import { useConfiguration } from "@/app/scans/cloudContainer/components/ConfigurationContext";
import ServiceSummary from "./ServiceSummary";
import ServiceBreakdown from "./ServiceBreakdowns";

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
            <p className="font-bold mb-3">Cloud Scan</p>
            <div><Header /></div>
            <div className="space-y-8">
                <ServiceSummary />
            </div>
            <div className="space-y-8">
                <ServiceBreakdown />
            </div>
            <div>
                <PastScans />
            </div>
        </div>
    </>;
}