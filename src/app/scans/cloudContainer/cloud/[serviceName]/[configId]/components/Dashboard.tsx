"use client";

import { RenderAppBreadcrumb } from "@/components/app-breadcrumb";
import Header from "./Header";
import PastScans from "@/components/PastScans";
import { useConfiguration } from "@/app/scans/cloudContainer/components/ConfigurationContext";
import ServiceSummary from "./ServiceSummary";
import ServiceBreakdown from "./ServiceBreakdowns";
import { Label } from "@radix-ui/react-label";

const cloudNameMap = {
    "google-cloud-platform": {
        name: "Google Cloud Platform",
        code: "gcp"
    },
    "amazon-web-services": {
        name: "Amazon Web Services",
        code: "aws"
    },
}

export default function Dashboard({ service }) {
    //const fetchedData = useConfiguration();

    return <>
        <RenderAppBreadcrumb
            breadcrumb={{
                level: 4,
                title: "Dashboard",
                href: "/scans/cloudContainer/cloud/google-cloud-platform/dashboard",
            }}
        />
        <div className="w-full">
            <Label className="text-[20px] font-bold text-gray-900 dark:text-gray-50">{cloudNameMap[service].name} Scan</Label>
            <Header />
            <ServiceSummary service={cloudNameMap[service].code} />
            <ServiceBreakdown service={cloudNameMap[service].code} />
            <PastScans />
        </div>
    </>;
}