import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/shadcn/ui/card'
import { DynamicFieldFrameworkContext } from '../context/dynamicFieldFrameworkContext';
import ReviewSubmitDataTable from './reviewSubmitDataTable';

export default function SubmitFramework() {
    const { frameworkMetaDeta, frameworkFieldConfigData, frameworkEntries } = DynamicFieldFrameworkContext();
    return (
        <>
            <div className="border-l-4 border-purple-500 pl-4">
                <h3 className="text-lg font-semibold my-4">
                    Review & Submit
                </h3>
            </div>
            <Card className='mb-3'>
                <CardHeader>
                    <CardTitle>Framework Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className='flex flex-row gap-3'>
                            <span className="text-lg text-foreground/50">Name:</span>
                            <span className='self-end'>{frameworkMetaDeta?.name}</span>
                        </div>
                        <div className='flex flex-row gap-3'>
                            <span className="text-lg text-foreground/50">Version:</span>
                            <span className='self-end'>{frameworkMetaDeta?.version}</span>
                        </div>
                        <div className='flex flex-row gap-3'>
                            <span className="text-lg text-foreground/50">Type:</span>
                            <span className='self-end'>{frameworkMetaDeta?.type}</span>
                        </div>
                        <div className='flex flex-row gap-3'>
                            <span className="text-lg text-foreground/50">Custom Fields:</span>
                            <span className='self-end'>{frameworkFieldConfigData?.length}</span>
                        </div>
                        <div className='flex flex-row gap-3'>
                            <span className="text-lg text-foreground/50">Structure Items:</span>
                            <span className='self-end'>{frameworkEntries?.length} items added</span>
                        </div>
                        <div className='flex flex-row gap-3'>
                            <span className="text-lg text-foreground/50">Identifier Field:</span>
                            <span className='self-end'>{3}</span>
                        </div>
                    </div>
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle>Framework Structure Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <ReviewSubmitDataTable />
                </CardContent>
            </Card>
        </>
    )
}
