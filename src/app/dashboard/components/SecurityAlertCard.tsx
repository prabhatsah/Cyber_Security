'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ProgressBar } from '@tremor/react';

import { Globe, Shield, Box, Glasses, Code } from 'lucide-react';
import { useState } from 'react';

export default function SecurityAlertCard() {
    const pentests = [
        {
            website: 'example.com',
            severity: 'critical',
            type: 'external',
            methodology: 'black box',
            progress: 65,
            daysAgo: 1
        },
        {
            website: 'admin.company.net',
            severity: 'medium',
            type: 'internal',
            methodology: 'grey box',
            progress: 90,
            daysAgo: 2
        },
        {
            website: 'api.service.com',
            severity: 'high',
            type: 'external',
            methodology: 'white box',
            progress: 45,
            daysAgo: 3
        }
    ];

    const getSeverityColor = (severity: string) => {
        const colors = {
            low: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300',
            medium: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300',
            high: 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-300',
            critical: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300'
        };
        return colors[severity as keyof typeof colors] || colors.low;
    };

    const getMethodologyIcon = (methodology: string) => {
        switch (methodology) {
            case 'black box':
                return <Box className="h-4 w-4" />;
            case 'white box':
                return <Code className="h-4 w-4" />;
            case 'grey box':
                return <Glasses className="h-4 w-4" />;
            default:
                return <Box className="h-4 w-4" />;
        }
    };

    return (
        <Card className=" overflow-hidden transition-all hover:shadow-md">
            <CardHeader className="pb-2">
                <CardTitle className="text-xl font-semibold">Active Pentests</CardTitle>
            </CardHeader>
            <CardContent className="px-0 pt-0 ">
                <div className="overflow-auto">
                    {pentests.map((pentest, idx) => (
                        <div
                            key={idx}
                            className="border-b  last:border-0 transition-colors"
                        >
                            <div className="space-y-3 mb-2">
                                {/* Website and Severity */}
                                <div className="flex items-center justify-between pt-2 first:pt-0">
                                    <h4 className="font-medium">{pentest.website}</h4>
                                    <span className={`rounded-full px-2 py-1 text-xs font-medium capitalize ${getSeverityColor(pentest.severity)}`}>
                                        {pentest.severity}
                                    </span>
                                </div>

                                {/* Type (External/Internal) */}
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    {pentest.type === 'external' ? (
                                        <>
                                            <Globe className="h-4 w-4" />
                                            <span>External Assessment</span>
                                        </>
                                    ) : (
                                        <>
                                            <Shield className="h-4 w-4" />
                                            <span>Internal Assessment</span>
                                        </>
                                    )}
                                </div>

                                {/* Methodology */}
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    {getMethodologyIcon(pentest.methodology)}
                                    <span className="capitalize">{pentest.methodology} Testing</span>
                                </div>

                                {/* Progress */}
                                <div>
                                    <div className="flex items-center justify-between text-sm mb-2">
                                        <span className="text-muted-foreground">Progress</span>
                                        <span className="font-medium">{pentest.progress}%</span>
                                    </div>
                                    <ProgressBar value={pentest.progress} className="h-2" />
                                </div>

                                {/* Created Date */}
                                <div className="text-xs text-muted-foreground">
                                    Created {pentest.daysAgo} {pentest.daysAgo === 1 ? 'day' : 'days'} ago
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}