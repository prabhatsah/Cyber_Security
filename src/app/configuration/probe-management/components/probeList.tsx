"use client";

import React from "react";
import {
    Table,
    TableHeader,
    TableBody,
    TableRow,
    TableHead,
    TableCell,
    TableCaption,
} from "@/components/ui/table"; // adjust path if needed
import { CheckCircle, XCircle } from "lucide-react";

type Probe = {
    PROBE_ID: string;
    PROBE_NAME: string;
    USER_NAME: string;
    ACTIVE: boolean;
    LAST_HEARTBEAT: string;
};

export default function ProbeTable({ probes }: { probes: any[] }) {
    console.log(probes)
    return (
        <div className="p-6 overflow-x-auto">
            <Table className="min-w-[800px] ">
                <TableHeader>
                    <TableRow>
                        <TableHead>Probe ID</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>User</TableHead>
                        <TableHead>Live</TableHead>
                        <TableHead>Active</TableHead>
                        <TableHead>Last Heartbeat</TableHead>
                    </TableRow>
                </TableHeader>

                {/* Table Body */}
                <TableBody>
                    {probes.map((probe) => (
                        <TableRow key={probe.PROBE_ID}>
                            <TableCell>{probe.PROBE_ID}</TableCell>
                            <TableCell>{probe.PROBE_NAME}</TableCell>
                            <TableCell>{probe.USER_NAME}</TableCell>
                            <TableCell>{probe.ALIVE ? (
                                <CheckCircle className="h-5 w-5 text-green-500" />
                            ) : (
                                <XCircle className="h-5 w-5 text-red-500" />
                            )}</TableCell>
                            <TableCell>{probe.ACTIVE ? "Yes" : "No"}</TableCell>
                            <TableCell>{probe.LAST_HEARTBEAT}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}
