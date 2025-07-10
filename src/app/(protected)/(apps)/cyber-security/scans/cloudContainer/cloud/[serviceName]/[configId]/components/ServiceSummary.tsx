import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeaderCell,
    TableRoot,
    TableRow,
} from "@/components/Table";
import { Badge } from "@tremor/react";
import { Label } from "@radix-ui/react-label";

export default function ServiceSummary({ summary }: {
    summary: Record<string, {
        checked_items: number;
        flagged_items: number;
        max_level: string;
        resources_count: number;
        rules_count: number;
    }>;
}) {
    return (
        <div className="w-full mt-8">
            <Label className="text-[17px] font-bold text-widget-title">Services Level Summary</Label>
            <div className="border rounded-md mt-2">
                <TableRoot className="">
                    <Table>
                        <TableHead>
                            <TableRow className="bg-gray-100 dark:bg-gray-800">
                                <TableHeaderCell className="w-52">Service</TableHeaderCell>
                                <TableHeaderCell className="w-52">Checked Items</TableHeaderCell>
                                <TableHeaderCell className="w-40">Flagged Items</TableHeaderCell>
                                <TableHeaderCell className="w-56">Level</TableHeaderCell>
                                <TableHeaderCell className="w-32">Resources Count</TableHeaderCell>
                                <TableHeaderCell className="w-52">Rules Count</TableHeaderCell>
                            </TableRow>
                        </TableHead>
                    </Table>
                </TableRoot>
                <TableRoot className="max-h-96">
                    <Table>
                        <TableBody>
                            {Object.keys(summary).length > 0 ? (
                                Object.entries(summary).map(([key, value]) => {
                                    // Determine badge color based on level
                                    let badgeColor = "";
                                    let displayText = "";
                                    switch (value.max_level.toLowerCase()) {
                                        case "danger":
                                            badgeColor = "bg-red-100 text-red-800 rounded ring-red-600/10 dark:bg-red-400/20 dark:text-red-500 dark:ring-red-400/20";
                                            displayText = "Danger";
                                            break;
                                        case "warning":
                                            badgeColor = "bg-orange-100 text-orange-800 rounded ring-orange-600/10 dark:bg-orange-400/20 dark:text-orange-500 dark:ring-orange-400/20";
                                            displayText = "Warning";
                                            break;
                                        case "low":
                                            badgeColor = "bg-green-100 text-green-800 rounded ring-green-600/10 dark:bg-green-400/20 dark:text-green-500 dark:ring-green-400/20";
                                            displayText = "Low";
                                            break;
                                        default:
                                            badgeColor = "bg-gray-100 text-gray-700 rounded ring-gray-600/10 dark:bg-gray-500/30 dark:text-gray-300 dark:ring-gray-400/20";
                                            displayText = value.max_level.toLowerCase();
                                    }

                                    return (
                                        <TableRow key={key}>
                                            <TableCell className="w-52">{key}</TableCell>
                                            <TableCell className="w-52">{value.checked_items}</TableCell>
                                            <TableCell className="w-40">{value.flagged_items}</TableCell>
                                            <TableCell className="w-56">
                                                <Badge className={`inline-flex items-center rounded rounded-tremor-small px-2 py-1 text-tremor-label font-semibold ${badgeColor}`}>
                                                    {displayText}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="w-32">{value.resources_count}</TableCell>
                                            <TableCell className="w-52">{value.rules_count}</TableCell>
                                        </TableRow>
                                    );
                                })
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={9} className="text-center">
                                        No Messages found yet.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableRoot>
            </div>
        </div>

        // <div className="w-full mt-8">
        //     <Label className="text-[17px] font-bold text-gray-900 dark:text-gray-50">Services Level Summary</Label>
        //     <div className="border rounded-md mt-2">
        //         <TableRoot className="mt-3">
        //             <Table>
        //                 <TableHead>
        //                     <TableRow >
        //                         <TableHeaderCell className="w-52 ">Service</TableHeaderCell>
        //                         <TableHeaderCell className="w-52">Checked Items</TableHeaderCell>
        //                         <TableHeaderCell className="w-40">Flagged Items</TableHeaderCell>
        //                         <TableHeaderCell className="w-56">Level</TableHeaderCell>
        //                         <TableHeaderCell className="w-32">Resources Count</TableHeaderCell>
        //                         <TableHeaderCell className="w-52">Rules Count</TableHeaderCell>
        //                     </TableRow>
        //                 </TableHead>
        //             </Table>
        //         </TableRoot>
        //         <TableRoot className="max-h-96">
        //             <Table>
        //                 <TableBody>
        //                     {Object.keys(summary).length > 0 ? (
        //                         Object.entries(summary).map(([key, value]) => (
        //                             < TableRow key={key} >
        //                                 <TableCell className="w-52">{key}</TableCell>
        //                                 <TableCell className="w-52">{value.checked_items}</TableCell>
        //                                 <TableCell className="w-40">{value.flagged_items}</TableCell>
        //                                 <TableCell className="w-56">
        //                                     <Badge variant="default">{value.max_level}</Badge>
        //                                 </TableCell>
        //                                 <TableCell className="w-32">{value.resources_count}</TableCell>
        //                                 <TableCell className="w-52">{value.rules_count}</TableCell>

        //                             </TableRow>
        //                         ))
        //                     ) : (
        //                         <TableRow>
        //                             <TableCell colSpan={9} className="text-center">
        //                                 No Messages found yet.
        //                             </TableCell>
        //                         </TableRow>
        //                     )}
        //                 </TableBody>
        //             </Table>
        //         </TableRoot>
        //     </div>
        // </div >
    )
}