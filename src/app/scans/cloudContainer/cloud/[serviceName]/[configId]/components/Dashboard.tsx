"use client";

import { RenderAppBreadcrumb } from "@/components/app-breadcrumb";
import Header from "./Header";
import PastScans from "@/components/PastScans";
import { useConfiguration } from "@/app/scans/cloudContainer/components/ConfigurationContext";
import ServiceSummary from "./ServiceSummary";
import ServiceBreakdown from "./ServiceBreakdowns";
import { Label } from "@radix-ui/react-label";
import { useEffect, useState } from "react";
import FetchCloudScanData from "./FetchCloudScanData";

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

export default function Dashboard({ serviceName }) {
    const [data, setData] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            const result = await FetchCloudScanData(serviceName);
            setData(result);
        };

        fetchData();

    }, []);

    if (!data) {
        return <div>Loading...</div>;
    }

    return <>
        <RenderAppBreadcrumb
            breadcrumb={{
                level: 4,
                title: "Dashboard",
                href: "/scans/cloudContainer/cloud/google-cloud-platform/dashboard",
            }}
        />
        <div className="w-full">
            <Label className="text-[20px] font-bold text-gray-900 dark:text-gray-50">{cloudNameMap[serviceName].name} Scan</Label>
            <Header summary={data.last_run.summary} scanTime={data.last_run.time} serviceName={serviceName} />
            <ServiceSummary serviceName={serviceName} />
            <ServiceBreakdown serviceName={serviceName} />
            <PastScans />
        </div>
    </>;
}