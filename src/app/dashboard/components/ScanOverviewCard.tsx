'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CirclePlus, Search, Shield, AlertTriangle } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ProgressBar } from '@tremor/react';


export default function ScanOverviewCard() {
    const [progress, setProgress] = useState(78);

    return (
        <Card className=" transition-all hover:shadow-md">
            <CardHeader className="flex flex-row items-center gap-4 pb-2">
                <CardTitle className="text-xl font-semibold">Scanned Website Overview</CardTitle>

                <span className="inline-flex size-7 items-center justify-center rounded-full bg-tremor-background-subtle text-tremor-label font-medium text-tremor-content-strong dark:bg-dark-tremor-background-subtle dark:text-dark-tremor-content-strong">
                    3
                </span>

            </CardHeader>
            <CardContent>
                <div className="mt-2 grid grid-cols-1 gap-4 sm:grid-cols-2">
                    {/* <div className="flex flex-col space-y-2 rounded-lg border p-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <Shield className="mr-2 h-5 w-5 text-green-500" />
                                <span className="font-medium">Protected Assets</span>
                            </div>
                            <span className="text-xl font-bold">14</span>
                        </div>
                        <ProgressBar value={progress} className="h-2" />
                        <p className="text-xs text-muted-foreground">
                            Last scan completed 2 hours ago
                        </p>
                    </div>

                    <div className="flex flex-col space-y-2 rounded-lg border p-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <AlertTriangle className="mr-2 h-5 w-5 text-amber-500" />
                                <span className="font-medium">Vulnerabilities</span>
                            </div>
                            <span className="text-xl font-bold">3</span>
                        </div>
                        <div className="grid grid-cols-3 gap-2">
                            <div className="rounded-md bg-red-100 p-2 text-center dark:bg-red-900/20">
                                <span className="block text-xs font-medium text-muted-foreground">High</span>
                                <span className="text-sm font-bold">1</span>
                            </div>
                            <div className="rounded-md bg-amber-100 p-2 text-center dark:bg-amber-900/20">
                                <span className="block text-xs font-medium text-muted-foreground">Medium</span>
                                <span className="text-sm font-bold">1</span>
                            </div>
                            <div className="rounded-md bg-blue-100 p-2 text-center dark:bg-blue-900/20">
                                <span className="block text-xs font-medium text-muted-foreground">Low</span>
                                <span className="text-sm font-bold">1</span>
                            </div>
                        </div>
                    </div> */}

                    <div className="flex flex-col space-y-2 rounded-lg border p-4 sm:col-span-2">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <Search className="mr-2 h-5 w-5 text-blue-500" />
                                <span className="font-medium">Scan Activity</span>
                            </div>
                        </div>
                        <div className="space-y-2">
                            {[
                                { date: '2023-06-10', target: 'keross.com', threats: 0 },
                                { date: '2023-06-09', target: 'ikon-dev.com', threats: 3 },
                                { date: '2023-06-08', target: 'https://ikoncloud.keross.com/', threats: 1 },
                            ].map((scan, idx) => (
                                <div key={idx} className="flex items-center justify-between rounded-md border-b px-3 py-2 text-sm">
                                    <span>{scan.date}</span>

                                    <span>{scan.target}</span>
                                    <span className={`font-medium ${scan.threats > 0 ? 'text-red-500' : 'text-green-500'}`}>
                                        {scan.threats} {scan.threats === 1 ? 'threat' : 'threats'}
                                    </span>

                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}