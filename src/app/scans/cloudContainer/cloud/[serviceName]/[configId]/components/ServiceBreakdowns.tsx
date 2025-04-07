import { Badge } from '@tremor/react';
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

/// Demo structure for services
// const services = {
//     bigquery: {
//         findings: {
//             "bigquery-dataset-allAuthenticatedUsers": {
//                 checked_items: 0,
//                 compliance: null,
//                 dashboard_name: "Datasets",
//                 description: "Datasets Accessible by \"allAuthenticatedUsers\"",
//                 flagged_items: 0,
//                 level: "danger",
//                 remediation: "Delete any permissions assigned to the <samp>allUsers</samp> and <samp>allAuthenticatedUsers</samp> members."
//             },
//         }
//     }
// };

export default function ServiceBreakdown({ services }: {
    services: Record<string, Record<string, any>>;
}) {

    return (


        <div className="w-full mt-8">
            <Label className="text-lg font-bold text-widget-title">Services Level Breakdown</Label>
            <Accordion type="multiple" className="border px-3 mt-2 rounded">
                {Object.keys(services).map((serviceKey) => {
                    const service = services[serviceKey];
                    const serviceFindings: Record<string, {
                        level: string;
                        dashboard_name: string;
                        description: string;
                        flagged_items: number;
                        remediation: string;
                    }> = service.findings;

                    return (
                        <AccordionItem key={serviceKey} value={serviceKey}>
                            <AccordionTrigger className="text-left text-md font-semibold">
                                <span className="flex items-center gap-2 h-8 capitalize">{serviceKey}</span>
                            </AccordionTrigger>
                            <AccordionContent className="max-h-80 overflow-auto">
                                <TableRoot>
                                    <Table>
                                        <TableHead>
                                            <TableRow className="bg-gray-100 dark:bg-gray-800">
                                                <TableHeaderCell className="w-24">Dashboard</TableHeaderCell>
                                                <TableHeaderCell className="w-64">Finding</TableHeaderCell>
                                                <TableHeaderCell className="w-52 max-w-[200px]">Description</TableHeaderCell>
                                                <TableHeaderCell className="w-12 text-center">Flagged</TableHeaderCell>
                                                <TableHeaderCell className="w-20">Level</TableHeaderCell>
                                                <TableHeaderCell className="w-52 max-w-[200px]">Remediation</TableHeaderCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {Object.entries(serviceFindings).map(([findingKey, finding]) => {
                                                // Determine badge color and display text based on level
                                                let badgeColor = "";
                                                let displayText = "";
                                                switch (finding.level.toLowerCase()) {
                                                    case "danger":
                                                        badgeColor = "bg-red-100 rounded text-red-800 ring-red-600/10 dark:bg-red-400/20 dark:text-red-500 dark:ring-red-400/20";
                                                        displayText = "Danger";
                                                        break;
                                                    case "warning":
                                                        badgeColor = "bg-orange-100 rounded text-orange-800 ring-orange-600/10 dark:bg-orange-400/20 dark:text-orange-500 dark:ring-orange-400/20";
                                                        displayText = "Warning";
                                                        break;
                                                    case "low":
                                                        badgeColor = "bg-green-100 rounded text-green-800 ring-green-600/10 dark:bg-green-400/20 dark:text-green-500 dark:ring-green-400/20";
                                                        displayText = "Low";
                                                        break;
                                                    default:
                                                        badgeColor = "bg-gray-100 rounded text-gray-700 ring-gray-600/10 dark:bg-gray-500/30 dark:text-gray-300 dark:ring-gray-400/20";
                                                        displayText = finding.level.toLowerCase();
                                                }

                                                return (
                                                    <TableRow key={findingKey}>
                                                        <TableCell className="w-24 truncate" title={finding.dashboard_name}>
                                                            {finding.dashboard_name}
                                                        </TableCell>
                                                        <TableCell className="w-64 max-w-[100px] truncate" title={findingKey}>
                                                            {findingKey}
                                                        </TableCell>
                                                        <TableCell className="w-52 max-w-[200px] truncate" title={finding.description}>
                                                            {finding.description}
                                                        </TableCell>
                                                        <TableCell className="w-12 text-center">
                                                            {finding.flagged_items}
                                                        </TableCell>
                                                        <TableCell className="w-20">
                                                            <Badge className={`inline-flex items-center rounded-tremor-small px-2 py-1 text-tremor-label font-semibold ${badgeColor}`}>
                                                                {displayText}
                                                            </Badge>
                                                        </TableCell>
                                                        <TableCell className="w-52 max-w-[200px] truncate" title={finding.remediation}>
                                                            {finding.remediation}
                                                        </TableCell>
                                                    </TableRow>
                                                );
                                            })}
                                        </TableBody>
                                    </Table>
                                </TableRoot>
                            </AccordionContent>
                        </AccordionItem>
                    );
                })}
            </Accordion>
        </div>
    );
}
