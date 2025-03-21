import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/Accordion";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeaderCell,
    TableRoot,
    TableRow,
} from "@/components/Table";
import { Label } from "@radix-ui/react-label";
import { Badge } from "lucide-react";
import FetchGCPData from "./FetchData";
import { useEffect, useState } from "react";

const services = {
    bigquery: {
        findings: {
            "bigquery-dataset-allAuthenticatedUsers": {
                checked_items: 0,
                compliance: null,
                dashboard_name: "Datasets",
                description: "Datasets Accessible by \"allAuthenticatedUsers\"",
                flagged_items: 0,
                level: "danger",
                remediation: "Delete any permissions assigned to the <samp>allUsers</samp> and <samp>allAuthenticatedUsers</samp> members."
            },
            "bigquery-dataset-allUsers": {
                checked_items: 0,
                compliance: null,
                dashboard_name: "Datasets",
                description: "Datasets Accessible by \"allUsers\"",
                flagged_items: 0,
                level: "danger",
                remediation: "Delete any permissions assigned to the <samp>allUsers</samp> and <samp>allAuthenticatedUsers</samp> members."
            },
            "bigquery-encryption-no-cmk": {
                checked_items: 0,
                compliance: null,
                dashboard_name: "Datasets",
                description: "Dataset Not Encrypted with Customer-Managed Keys (CMKs)",
                flagged_items: 0,
                level: "warning",
                remediation: "Encrypt datasets with Cloud KMS Customer-Managed Keys (CMKs)."
            }
        }
    },
    cloudmemorystore: {
        findings: {
            "memorystore-redis-instance-auth-not-enabled": {
                checked_items: 0,
                compliance: [],
                dashboard_name: "Redis Instances",
                description: "Memory Instance Allows Unauthenticated Connections",
                flagged_items: 0,
                level: "warning",
                remediation: "All incoming connections to Cloud Memorystore databases should require the use of authentication and SSL."
            },
            "memorystore-redis-instance-ssl-not-required": {
                checked_items: 0,
                compliance: [],
                dashboard_name: "Redis Instances",
                description: "Memory Instance Not Requiring SSL for Incoming Connections",
                flagged_items: 0,
                level: "warning",
                remediation: "All incoming connections to Cloud Memorystore databases should require the use of SSL."
            }
        }
    },
    cloudsql: {
        findings: {
            "cloudsql-allows-root-login-from-any-host": {
                checked_items: 0,
                compliance: [{ name: "CIS Google Cloud Platform Foundations", reference: "6.4", version: "1.0.0" }],
                dashboard_name: "Instances",
                description: "Instance Allows Root Login from Any Host",
                flagged_items: 0,
                level: "warning",
                remediation: "Root access to MySQL Database Instances should be allowed only through trusted IPs."
            }
        }
    }
};

export default function ServiceBreakdown() {
    const [data, setData] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            const result = await FetchGCPData();
            setData(result);
        };

        fetchData();

    }, []);

    if (!data) {
        return <div>Loading...</div>;
    }

    const services = data.services;

    return (
        <div className="w-full mt-8">
            <Label className="text-[17px] font-bold text-gray-900 dark:text-gray-50">Services Level Breakdown</Label>
            <div className="">
                <Accordion type="multiple" className="">
                    {Object.keys(services).map((serviceKey) => {
                        const service = services[serviceKey];
                        return (
                            <AccordionItem value={serviceKey}>
                                <AccordionTrigger>
                                    <span className="flex items-center gap-2 h-8">
                                        {serviceKey}
                                    </span>
                                </AccordionTrigger>
                                <AccordionContent className="max-h-80 overflow-auto">
                                    <TableRoot className="mt-3">
                                        <Table>
                                            <TableHead>
                                                <TableRow >
                                                    <TableHeaderCell className="w-24">Dashboard</TableHeaderCell>
                                                    <TableHeaderCell className="w-64 ">Finding</TableHeaderCell>
                                                    <TableHeaderCell className="w-52">Description</TableHeaderCell>
                                                    <TableHeaderCell className="w-12">Flagged Items</TableHeaderCell>
                                                    <TableHeaderCell className="w-32">Level</TableHeaderCell>
                                                    <TableHeaderCell className="w-52">Remediation</TableHeaderCell>
                                                </TableRow>
                                            </TableHead>
                                        </Table>
                                    </TableRoot>
                                    <TableRoot className="max-h-96">
                                        <Table>
                                            <TableBody>
                                                {Object.entries(service.findings).map(([findingKey, finding]) => (
                                                    <TableRow >
                                                        <TableCell className="w-24">{finding.dashboard_name}</TableCell>
                                                        <TableCell className="w-64">{findingKey}</TableCell>
                                                        <TableCell className="w-52">{finding.description}</TableCell>
                                                        <TableCell className="w-12">{finding.flagged_items}</TableCell>
                                                        <TableCell className="w-32">
                                                            <Badge >{finding.level}</Badge>
                                                        </TableCell>
                                                        <TableCell className="w-52">{finding.remediation}</TableCell>
                                                    </TableRow>
                                                ))
                                                }

                                            </TableBody>
                                        </Table>
                                    </TableRoot>
                                    {/* <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableHead>Finding Name</TableHead>
                                        <TableHead>Dashboard Name</TableHead>
                                        <TableHead>Description</TableHead>
                                        <TableHead>Flagged Items</TableHead>
                                        <TableHead>Level</TableHead>
                                        <TableHead>Remediation</TableHead>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {Object.entries(service.findings).map(([findingKey, finding]) => (
                                        <TableRow key={findingKey}>
                                            <TableCell>{findingKey}</TableCell>
                                            <TableCell>{finding.dashboard_name}</TableCell>
                                            <TableCell className="truncate max-w-[200px]">{finding.description}</TableCell>
                                            <TableCell>{finding.flagged_items}</TableCell>
                                            <TableCell>{finding.level}</TableCell>
                                            <TableCell className="truncate max-w-[200px]">{finding.remediation}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table> */}
                                </AccordionContent>
                            </AccordionItem>
                        );
                    })}
                </Accordion>
            </div>
        </div>

        // <Accordion>
        //     {Object.keys(services).map((serviceKey) => {
        //         const service = services[serviceKey];
        //         return (
        //             <AccordionItem >
        //                 <AccordionTrigger>{serviceKey}</AccordionTrigger>
        //                 <AccordionContent>
        //                     <h1>Hello</h1>
        //                     <Table>
        //                         <TableHead>
        //                             <TableRow>
        //                                 <TableHead>Finding Name</TableHead>
        //                                 <TableHead>Dashboard Name</TableHead>
        //                                 <TableHead>Description</TableHead>
        //                                 <TableHead>Flagged Items</TableHead>
        //                                 <TableHead>Level</TableHead>
        //                                 <TableHead>Remediation</TableHead>
        //                             </TableRow>
        //                         </TableHead>
        //                         <TableBody>
        //                             {Object.entries(service.findings).map(([findingKey, finding]) => (
        //                                 <TableRow key={findingKey}>
        //                                     <TableCell>{findingKey}</TableCell>
        //                                     <TableCell>{finding.dashboard_name}</TableCell>
        //                                     <TableCell className="truncate max-w-[200px]">{finding.description}</TableCell>
        //                                     <TableCell>{finding.flagged_items}</TableCell>
        //                                     <TableCell>{finding.level}</TableCell>
        //                                     <TableCell className="truncate max-w-[200px]">{finding.remediation}</TableCell>
        //                                 </TableRow>
        //                             ))}
        //                         </TableBody> 
        //                 </Table>
        //                 </AccordionContent>
        //             </AccordionItem>
        //         );
        //     })}
        // </Accordion >
    );
}
