import {
    RiAlibabaCloudFill,
    RiAmazonLine,
    RiCloudLine,
    RiCloudy2Line,
    RiGoogleFill,
    RiWindowsFill,
} from "@remixicon/react";
import CloudWidget from "./EachCloudWidget";
import {
    EachConfigDataFormatted,
    EachConfigDataFromServer,
} from "../components/type";
import { fetchConfigDetails } from "../components/fetchConfigDetails";
import { configDataSetter } from "../components/configDataSaving";

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
        configurationCount: 3,
        icon: <RiGoogleFill className="size-5" aria-hidden={true} />,
        href: "/scans/cloudContainer/cloud/google-cloud-platform",
        configurations: [
            {
                "region": "us-central",
                "configId": "50db2edd-d91b-4f5d-895a-2d50a19baedc",
                "createdBy": {
                    "userId": "be7a0ece-f3d8-4c5b-84dc-52c32c4adff4",
                    "userName": "Sayan Roy",
                    "userEmail": "sayan.roy@keross.com"
                },
                "createdOn": "2025-Mar-11 12:19:30",
                "projectId": "gcp-project-98341",
                "cloudProvider": "gcp",
                "configurationName": "gcp",
                "serviceAccountKey": {}
            },
            {
                "region": "us-central",
                "configId": "d63f63b5-54e4-4723-b631-ac9f318a8afd",
                "createdBy": {
                    "userId": "be7a0ece-f3d8-4c5b-84dc-52c32c4adff4",
                    "userName": "Sayan Roy",
                    "userEmail": "sayan.roy@keross.com"
                },
                "createdOn": "2025-Mar-17 14:11:30",
                "projectId": "gcp-project-333336",
                "cloudProvider": "gcp",
                "configurationName": "gcp",
                "serviceAccountKey": {}
            },
            {
                "region": "europe-west",
                "configId": "fe2fd391-22eb-4c0a-af25-d37825794c83",
                "createdBy": {
                    "userId": "be7a0ece-f3d8-4c5b-84dc-52c32c4adff4",
                    "userName": "Sayan Roy",
                    "userEmail": "sayan.roy@keross.com"
                },
                "createdOn": "2025-Mar-11 12:38:44",
                "projectId": "gcp-project-111111",
                "cloudProvider": "gcp",
                "configurationName": "google test 2",
                "serviceAccountKey": {}
            }
        ],
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

export default async function CloudServicesConfig() {

    const fetchedData = (await fetchConfigDetails()).data;
export default function CloudServicesConfig() {
    const [configData, setConfigData] = useState<
        Record<string, EachConfigDataFormatted>
    >({});

    const fetchedData = useConfiguration();
    console.log("configData in cloud service page.tsx - ");
    console.log(fetchedData);

    let configDataFormatted: Record<string, EachConfigDataFormatted> = {};
    if (fetchedData && fetchedData.length > 0) {
        fetchedData.forEach((element: EachConfigDataFromServer) => {
            configDataFormatted[element.name] = {
                id: element.id,
                data: element.data,
            };
        });
        console.log("configData updated", configDataFormatted);
    }
    configDataSetter(fetchedData);

    const updatedCloudConfigList = cloudConfigList.map((cloudService) => {
        const cloudServiceName = cloudService.href.split("/")[4];

        if (configDataFormatted[cloudServiceName]) {
            return {
                ...cloudService,
                configurationCount: Object.keys(configDataFormatted[cloudServiceName].data)
                    .length,
                configurations: Object.values(configDataFormatted[cloudServiceName].data),
            };
        }

        return { ...cloudService };
    });

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
