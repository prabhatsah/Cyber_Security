'use client';

import { PenTestWithoutScanModified } from '@/app/pen-test/web-app-pen-test/components/type';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ProgressBar } from '@tremor/react';

import { Globe, Shield, Box, Glasses, Code } from 'lucide-react';
import { parse, formatDistanceToNow } from 'date-fns'

interface SecurityAlertCardProps {
    pentestData: PenTestWithoutScanModified[];
}

const SecurityAlertCard: React.FC<SecurityAlertCardProps> = ({ pentestData }) => {
    const pentests = [
        {
            website: 'target',
            severity: 'critical',
            type: 'scope',
            methodology: 'black box',
            progress: 65,
            daysAgo: 1
        },
    ];
    console.log(pentestData);
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
                    {pentestData.length === 0 ? (
                        <div className="text-center py-6 text-muted-foreground">
                            No active penetration tests found.
                        </div>
                    ) : (
                        pentestData.map((item, idx) => {
                            const pentest = item.basicDetails;
                            return (
                                <div
                                    key={item.pentestId ?? idx}
                                    className="border-b last:border-0 transition-colors"
                                >
                                    <div className="space-y-3 mb-2">
                                        {/* Website and Severity */}
                                        <div className="flex items-center justify-between pt-2 first:pt-0">
                                            <h4 className="font-medium">{pentest.target}</h4>
                                            <span
                                                className={`rounded-full px-2 py-1 text-xs font-medium capitalize ${getSeverityColor(
                                                    pentest.priorityLevel
                                                )}`}
                                            >
                                                {pentest.priorityLevel}
                                            </span>
                                        </div>

                                        {/* Type (External/Internal) */}
                                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                            {pentest.scope === "External" ? (
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
                                            {getMethodologyIcon(pentest.testingType)}
                                            <span className="capitalize">{pentest.testingType} Testing</span>
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
                                            Created{' '}
                                            {formatDistanceToNow(
                                                // parse “2025-Jun-16 17:13:17” into a Date
                                                parse(pentest.createdOn, 'yyyy-MMM-dd HH:mm:ss', new Date()),
                                                { addSuffix: true }
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>


            </CardContent>
        </Card>
    );
}
export default SecurityAlertCard;