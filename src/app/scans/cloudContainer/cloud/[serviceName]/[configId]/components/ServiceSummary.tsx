"use client";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeaderCell,
    TableRoot,
    TableRow,
} from "@/components/Table";
import FetchGCPData from "./FetchData";
import { Badge } from "@tremor/react";
import { Label } from "@radix-ui/react-label";
import { useEffect, useState } from "react";

export default function ServiceSummary() {
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

    const serviceSummary = data.last_run.summary;

    return (
        <div className="w-full mt-8">
            <Label className="text-[17px] font-bold text-gray-900 dark:text-gray-50">Services Level Summary</Label>
            <div className="border rounded-md mt-2">
                <TableRoot className="mt-3">
                    <Table>
                        <TableHead>
                            <TableRow >
                                <TableHeaderCell className="w-52 ">Service</TableHeaderCell>
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
                            {Object.keys(serviceSummary).length > 0 ? (
                                Object.entries(serviceSummary).map(([key, value]) => (
                                    < TableRow key={key} >
                                        <TableCell className="w-52">{key}</TableCell>
                                        <TableCell className="w-52">{value.checked_items}</TableCell>
                                        <TableCell className="w-40">{value.flagged_items}</TableCell>
                                        <TableCell className="w-56">
                                            <Badge variant="default">{value.max_level}</Badge>
                                        </TableCell>
                                        <TableCell className="w-32">{value.resources_count}</TableCell>
                                        <TableCell className="w-52">{value.rules_count}</TableCell>

                                    </TableRow>
                                ))
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
        </div >
    )
}