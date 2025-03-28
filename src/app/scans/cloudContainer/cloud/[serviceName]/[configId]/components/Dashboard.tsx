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
        code: "GCP"
    },
    "amazon-web-services": {
        name: "Amazon Web Services",
        code: "AWS"
    },
}

export default function Dashboard({ serviceName, serviceNameFromUrl, configId }: {
    serviceName: string;
    serviceNameFromUrl: string;
    configId: string;
}) {
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
        <div className="w-full">
            <Label className="text-[20px] font-bold text-gray-900 dark:text-gray-50">{serviceNameFromUrl} Scan</Label>
            <Header summary={data.last_run.summary} scanTime={data.last_run.time} serviceName={serviceName} serviceCode={cloudNameMap[serviceName].code} />
            <ServiceSummary serviceName={serviceName} />
            <ServiceBreakdown serviceName={serviceName} />
            {/* <PastScans pastScans={[]} onOpenPastScan={() => { console.log("Past Scans"); }} /> */}
        </div>
    </>;
}