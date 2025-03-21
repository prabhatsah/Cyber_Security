"use client";

import {
    RiAlibabaCloudFill,
    RiAmazonLine,
    RiCloudLine,
    RiCloudy2Line,
    RiGoogleFill,
    RiWindowsFill,
} from "@remixicon/react";
import CloudWidget from "./EachCloudWidget";
import { useEffect, useMemo, useState } from "react";
import { useConfiguration } from "../components/ConfigurationContext";
import {
    EachConfigDataFormatted,
    EachConfigDataFromServer,
} from "../components/type";

const cloudConfigList = [
    {
        name: "Amazon Web Services",
        description:
            "AWS CloudFormation is a service that enables infrastructure as code, allowing users to define and provision AWS resources using templates.",
        configurationCount: 0,
        icon: <RiAmazonLine className="size-5" aria-hidden={true} />,
        href: "/scans/cloudContainer/cloud/amazon-web-services",
        configurations: [],
    },
    {
        name: "Microsoft Azure",
        description:
            "Azure Resource Manager (ARM) is a service that enables infrastructure as code, allowing users to deploy, manage, and organize Azure resources using declarative templates.",
        configurationCount: 0,
        icon: <RiWindowsFill className="size-5" aria-hidden={true} />,
        href: "/scans/cloudContainer/cloud/microsoft-azure",
        configurations: [],
    },
    {
        name: "Google Cloud Platform",
        description:
            "Google Cloud Deployment Manager is a service that enables infrastructure as code, allowing users to define, deploy, and manage Google Cloud resources using configuration templates.",
        configurationCount: 0,
        icon: <RiGoogleFill className="size-5" aria-hidden={true} />,
        href: "/scans/cloudContainer/cloud/google-cloud-platform",
        configurations: [],
    },
    {
        name: "IBM Cloud",
        description:
            "IBM Cloud Schematics enables infrastructure as code, automating the deployment and management of IBM Cloud resources using Terraform.",
        configurationCount: 0,
        icon: <RiCloudLine className="size-5" aria-hidden={true} />,
        href: "/scans/cloudContainer/cloud/ibm-cloud",
        configurations: [],
    },
    {
        name: "Oracle Cloud Infrastructure",
        description:
            "Oracle Cloud Infrastructure (OCI) Resource Manager enables infrastructure as code, allowing users to automate resource deployment and management using Terraform.",
        configurationCount: 0,
        icon: <RiCloudy2Line className="size-5" aria-hidden={true} />,
        href: "/scans/cloudContainer/cloud/oracle-cloud-infrastructure",
        configurations: [],
    },
    {
        name: "Alibaba Cloud",
        description:
            "Alibaba Cloud Resource Orchestration Service (ROS) enables infrastructure as code, allowing users to define and manage cloud resources using templates.",
        configurationCount: 0,
        icon: <RiAlibabaCloudFill className="size-5" aria-hidden={true} />,
        href: "/scans/cloudContainer/cloud/alibaba-cloud",
        configurations: [],
    },
];

export default function CloudServicesConfig() {
<<<<<<< HEAD
    // const { setItems } = useBreadcrumb();
    const fetchedData = useConfiguration();
    console.log("configData in cloud service page.tsx - ");
    console.log(fetchedData);
    const [configData, setConfigData] = useState<
        Record<string, EachConfigDataFormatted>
    >({});
=======
    const [configData, setConfigData] = useState<
        Record<string, EachConfigDataFormatted>
    >({});

    const fetchedData = useConfiguration();
    console.log("configData in cloud service page.tsx - ");
    console.log(fetchedData);
>>>>>>> e17f880f188189eed3785bd6cc37a99a9e27cd46

    useEffect(() => {
        let configDataFormatted: Record<string, EachConfigDataFormatted> = {};
        if (fetchedData && fetchedData.length > 0) {
            fetchedData.forEach((element: EachConfigDataFromServer) => {
                configDataFormatted[element.name] = {
                    id: element.id,
                    data: element.data,
                };
            });
            setConfigData(configDataFormatted);
            console.log("configData updated", configDataFormatted);
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
