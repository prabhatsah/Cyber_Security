// 'use client';

import { Card, DonutChart } from '@tremor/react';
import ChartWidget from './ChartWidget';
import BasicInfo from './BasicInfo';

function classNames(...classes) {
    return classes.filter(Boolean).join(' ');
}

export default function Header({ summary, scanTime, serviceName, serviceCode }) {
    return (
        <>
            <div className="grid grid-cols-4 gap-5 mt-3">
                <ChartWidget summary={summary} />
                <BasicInfo scanTime={scanTime} serviceName={serviceName} serviceCode={serviceCode} summary={summary} />
            </div>
        </>
    );
}