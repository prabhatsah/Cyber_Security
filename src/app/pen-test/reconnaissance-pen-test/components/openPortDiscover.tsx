'use client';

import { RiComputerLine, RiGlobalLine } from '@remixicon/react';
import { Card, Divider } from '@tremor/react';

const openPortDiscoverData = [
    {
        openPortDiscoverName: 'Open Port Discovered',
        initials: '2',
        href: '#',
    },
];

export default function OpenPortDiscoverWizget() {
    return (
        <>
            <div className=" grid  gap-6">
                {openPortDiscoverData.map((member) => (
                    <Card key={member.openPortDiscoverName} className="group flex items-center space-x-4">
                        <div className=" items-center">
                            <div className="truncate">
                                <p className="truncate text-xl font-medium text-widget-mainHeader ">
                                    <a href={member.href} className="focus:outline-none">
                                        {/* Extend link to entire card */}
                                        <span className="absolute inset-0 " aria-hidden={true} />
                                        {member.openPortDiscoverName}
                                    </a>
                                </p>
                            </div>
                            <span className='text-widget-mainDesc font-medium'>
                                {member.initials}
                            </span>
                        </div>
                        <span>
                            <RiComputerLine
                                className={`size-8 `}
                                aria-hidden={true}
                            />
                        </span>
                    </Card>
                ))}
            </div>
        </>
    );
}