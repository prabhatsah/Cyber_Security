'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CalendarDays, Clock, GlobeLock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { ProgressBar } from '@/components/ui/progress';
import { useState } from 'react';
import { RiAlibabaCloudFill, RiAmazonLine, RiCloudLine, RiCloudy2Line, RiGoogleFill, RiWindowsFill } from '@remixicon/react';
export default function RecentScansCard() {

    const scans = [
        {
            type: 'Amazon Web Services',
            timestamp: '10:45 AM',
            date: 'Today',
            status: 'completed',
            findings: 0,
            icon: <RiAmazonLine className="size-5" aria-hidden={true} />,
        },
        {
            type: 'Microsoft Azure',
            timestamp: '08:30 AM',
            date: 'Today',
            status: 'completed',
            findings: 2,
            icon: <RiWindowsFill className="size-5" aria-hidden={true} />,
        },
        {
            type: 'Google Cloud Platform',
            timestamp: '11:15 PM',
            date: 'Yesterday',
            status: 'completed',
            findings: 1,
            icon: <RiGoogleFill className="size-5" aria-hidden={true} />,
        },
        {
            type: 'IBM Cloud',
            timestamp: '04:20 PM',
            date: 'Yesterday',
            status: 'completed',
            findings: 0,
            icon: <RiCloudLine className="size-5" aria-hidden={true} />,
        },
        {
            type: 'Oracle Cloud Infrastructure',
            timestamp: '04:20 PM',
            date: 'Yesterday',
            status: 'completed',
            findings: 0,
            icon: <RiCloudy2Line className="size-5" aria-hidden={true} />,
        },
        {
            type: 'Alibaba Cloud',
            timestamp: '04:20 PM',
            date: 'Yesterday',
            status: 'completed',
            findings: 0,
            icon: <RiAlibabaCloudFill className="size-5" aria-hidden={true} />,
        }
    ];

    return (
        <Card className=" transition-all hover:shadow-md">
            <CardHeader className="pb-2">
                <CardTitle className="text-xl font-semibold">Configured Cloud Services</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {scans.map((scan, idx) => (
                        <div key={idx} className="flex flex-col space-y-2 rounded-lg border p-6">
                            <div className="flex items-center justify-between">
                                <span className="font-medium gap-2 flex">{scan.icon}{scan.type}</span>
                                <Badge>
                                    {scan.findings}
                                </Badge>
                            </div>

                            {/* <div className="flex items-center justify-between text-xs text-muted-foreground">
                                <div className="flex items-center">
                                    <Clock className="mr-1 h-3 w-3" />
                                    <span>{scan.timestamp}</span>
                                </div>
                                <div className="flex items-center">
                                    <CalendarDays className="mr-1 h-3 w-3" />
                                    <span>{scan.date}</span>
                                </div>
                            </div> */}
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}