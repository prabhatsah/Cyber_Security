"use client";

import { useBreadcrumb } from "@/contexts/BreadcrumbContext";
import {
    RiAlibabaCloudFill,
    RiAmazonLine,
    RiCloudLine,
    RiCloudy2Line,
    RiGoogleFill,
    RiWindowsFill,
} from "@remixicon/react";
import { useEffect, useMemo, useState } from "react";
import { useConfiguration } from "../components/ConfigurationContext";
import {
    EachConfigDataFormatted,
    EachConfigDataFromServer,
} from "../components/type";
import CloudWidget from "./EachCloudWidget";
const cloudConfigList = [
    {
        name: "Amazon Web Services",
        description:
            "AWS CloudFormation is a service that enables infrastructure as code, allowing users to define and provision AWS resources using templates.",
        icon: <RiAmazonLine className="size-5" aria-hidden={true} />,
        href: "/scans/cloudContainer/cloud/amazon-web-services",
        configurations: [],
        configurationCount: 0,
    },
    {
        name: "Microsoft Azure",
        description:
            "Azure Resource Manager (ARM) is a service that enables infrastructure as code, allowing users to deploy, manage, and organize Azure resources using declarative templates.",
        icon: <RiWindowsFill className="size-5" aria-hidden={true} />,
        href: "/scans/cloudContainer/cloud/microsoft-azure",
        configurations: [],
        configurationCount: 0,
    },
    {
        name: "Google Cloud Platform",
        description:
            "Google Cloud Deployment Manager is a service that enables infrastructure as code, allowing users to define, deploy, and manage Google Cloud resources using configuration templates.",
        icon: <RiGoogleFill className="size-5" aria-hidden={true} />,
        href: "/scans/cloudContainer/cloud/google-cloud-platform",
        configurations: [],
        configurationCount: 0,
    },
    {
        name: "IBM Cloud",
        description:
            "IBM Cloud Schematics enables infrastructure as code, automating the deployment and management of IBM Cloud resources using Terraform.",
        icon: <RiCloudLine className="size-5" aria-hidden={true} />,
        href: "/scans/cloudContainer/cloud/ibm-cloud",
        configurations: [],
        configurationCount: 0,
    },
    {
        name: "Oracle Cloud Infrastructure",
        description:
            "Oracle Cloud Infrastructure (OCI) Resource Manager enables infrastructure as code, allowing users to automate resource deployment and management using Terraform.",
        icon: <RiCloudy2Line className="size-5" aria-hidden={true} />,
        href: "/scans/cloudContainer/cloud/oracle-cloud-infrastructure",
        configurations: [],
        configurationCount: 0,
    },
    {
        name: "Alibaba Cloud",
        description:
            "Alibaba Cloud Resource Orchestration Service (ROS) enables infrastructure as code, allowing users to define and manage cloud resources using templates.",
        icon: <RiAlibabaCloudFill className="size-5" aria-hidden={true} />,
        href: "/scans/cloudContainer/cloud/alibaba-cloud",
        configurations: [],
        configurationCount: 0,
    },
];

export default function CloudServicesConfig() {
    let currentTime = new Date();
    console.log("Cloud widget starts, Current Time: " + currentTime.toISOString());

    const { setItems } = useBreadcrumb();
    const fetchedData = useConfiguration();
    console.log("configData in cloud service page.tsx - ");
    console.log(fetchedData);
    const [configData, setConfigData] = useState<
        Record<string, EachConfigDataFormatted>
    >({});

    useEffect(() => {
        setItems([
            { label: "Scans", href: "/scans" },
            { label: "Cloud & Container", href: "" },
            { label: "Cloud Security", href: "/scans/cloudContainer/cloud" },
        ]);
    }, []);

    useEffect(() => {
        let formattedData: Record<string, EachConfigDataFormatted> = {};
        if (fetchedData && fetchedData.length > 0) {
            fetchedData.forEach((element: EachConfigDataFromServer) => {
                formattedData[element.name] = {
                    id: element.id,
                    data: element.data,
                };
            });
            setConfigData(formattedData);
            console.log("configData updated", formattedData);
        }
    }, [fetchedData]);

    const updatedCloudConfigList = useMemo(() => {
        return cloudConfigList.map((cloudService) => {
            const cloudServiceName = cloudService.href.split("/")[4];

            if (configData[cloudServiceName]) {
                return {
                    ...cloudService,
                    configurationCount: Object.keys(configData[cloudServiceName].data)
                        .length,
                    configurations: Object.values(configData[cloudServiceName].data),
                };
            }

            return { ...cloudService, configurationCount: 0, configurations: [] };
        });
    }, [configData]);

    currentTime = new Date();
    console.log("Cloud widget ends, Current Time: " + currentTime.toISOString());
    return (
        <>
            <div className=" flex flex-col relative">
                <div className=" grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 h-fit">
                    {updatedCloudConfigList.map((item) => (
                        <CloudWidget key={item.name} item={item} />
                    ))}
                </div>
            </div>
        </>
    );
}
