"use client";

import React, { useEffect, useState } from 'react';
import { Card } from "@tremor/react";
import { AlertCircle, CheckCircle2, Eye, ArrowRight, User, Calendar,Info } from 'lucide-react';
import { getProfileData } from '@/ikon/utils/actions/auth';
import { Badge } from './ui/badge';

const data = [
    {
        titleHeading: 'Europe',
        title: '$10,023',
        noOfIssue: 3,
        totalIssue: 5,
        status: 'warning',
        scanBy: 'John Doe',
        scanOn: '13.03.25 • 14:30',
        href: '#',
    },
    {
        titleHeading: 'Asia',
        title: '$15,789',
        noOfIssue: 2,
        totalIssue: 5,
        status: 'critical',
        scanBy: 'Jane Smith',
        scanOn: '13.03.25 • 15:45',
        href: '#',
    },
    {
        titleHeading: 'Americas',
        title: '$8,456',
        noOfIssue: 5,
        totalIssue: 5,
        status: 'success',
        scanBy: 'Mike Johnson',
        scanOn: '13.03.25 • 16:20',
        href: '#',
    },
];

const statusConfig = {
    success: {
        icon: CheckCircle2,
        bgColor: 'bg-emerald-500',
        textColor: 'text-emerald-800 dark:text-emerald-500',
        label: 'No Issue', // Update the label here
    },
    warning: {
        icon: Eye,
        bgColor: 'bg-yellow-500',
        textColor: 'text-yellow-800 dark:text-yellow-500',
        label: 'Warning', // You can keep the existing label or change it
    },
    critical: {
        icon: AlertCircle,
        bgColor: 'bg-red-500',
        textColor: 'text-red-800 dark:text-red-500',
        label: 'Critical', // Keep or change this label as needed
    },
     unclear: {
        icon: Info,
        bgColor: 'bg-blue-500',
        textColor: 'text-blue-800 dark:text-blue-500',
        label: 'Unclear', // Keep or change this label as needed
    },
};

function cx(...classes: (string | boolean | undefined | null)[]) {
    return classes.filter(Boolean).join(' ');
}

export default function Example({ pastScans, onOpenPastScan }) {

    const [profileData, setProfileData] = useState<any>();
    const [openedScan, setOpenedScan] = useState<any>()

    useEffect(() => {
        const fetchUserProfileData = async () => {
            const profile = await getProfileData();
            setProfileData(profile);
        }
        fetchUserProfileData();
    }, []);

    console.log("profile - ", profileData);
    console.log("Scan history data - ", pastScans);

    function handleClick(key) {
        setOpenedScan(key);
        onOpenPastScan(key);
    }

    return (

        <div className="">
            <h2 className=" font-bold text-widget-title text-widgetHeader mt-4">Scan History</h2>
        
            <dl className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 mt-4">
                {pastScans.map((item, index) => {
                    const StatusIcon = statusConfig[item.status as keyof typeof statusConfig]?.icon;
                    const statusLabel = statusConfig[item.status as keyof typeof statusConfig]?.label;
                    return (
                        <Card key={index} className="relative overflow-hidden hover:shadow-lg transition-shadow duration-300 rounded-lg">
                            <div className="absolute top-0 right-0 w-24 h-24 -mr-8 -mt-8 from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 rounded-full opacity-50"></div>

                            <div className="relative">
                                <dt className="flex items-center space-x-2 text-sm font-medium text-widget-mainHeader">
                                    <span>{item.titleHeading}</span>
                                    {item.key === openedScan && <Badge className='text-white'>opened</Badge>}
                                </dt>
                                <dd className="mt-1 text-lg font-bold text-widget-mainDesc truncate" title={item.title}>

                                    {item.title}
                                </dd>
                            </div>

                            <div className="mt-6 space-y-4">
                                <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg shadow-sm cursor-pointer"  onClick={() => handleClick(item.key)}>
                                    <div className="flex items-center space-x-3" >
                                        <span className={cx(
                                            statusConfig[item.status as keyof typeof statusConfig]?.bgColor,
                                            'flex h-10 w-10 items-center justify-center rounded-lg text-white'
                                        )}>
                                            {StatusIcon && <StatusIcon className="h-5 w-5" />}
                                        </span>
                                        <div>
                                            <p className="text-sm text-widget-secondaryheader">
                                                Issues: {item.noOfIssue}/{item.totalIssue}
                                            </p>
                                            <p className={cx(
                                                statusConfig[item.status as keyof typeof statusConfig]?.textColor,
                                                'text-sm font-medium capitalize'
                                            )}>
                                                {statusLabel} {/* Display the new status label */}
                                            </p>
                                        </div>
                                    </div>
                                    <ArrowRight className="h-5 w-5 text-gray-400" />
                                </div>

                                <div className="flex items-center justify-between text-sm text-widget-secondaryDesc">
                                    <div className="flex items-center space-x-2">
                                        <User className="h-4 w-4" />
                                        <span>{profileData.USER_NAME}</span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <Calendar className="h-4 w-4" />
                                        <span className="font-medium">{item.scanOn}</span>
                                    </div>
                                </div>
                            </div>

                            {/* <a href={item.href} className="absolute inset-0" aria-hidden="true" /> */}
                        </Card>
                    );
                })}
            </dl>
        </div>
    );
}
