"use client"
import { Button } from '@/shadcn/ui/button';
import { Building2, Shield, Users } from 'lucide-react';
import React, { use, useEffect, useState } from 'react'
import ClientDashboard from './ClientDashboard';
import CustomerDashboard from './CustomerDashboard';
import { FrameworkContext, FrameworkMainContext, frameworkProps, subscribeProps } from './context/frameworkContext';

export default function GrcHeader({frameworksData, profileData, subscribesData, availableList, subscribedList, assetsData, allUsers} : { frameworksData: frameworkProps[]; profileData: string; subscribesData: subscribeProps[]; availableList: frameworkProps[];subscribedList: frameworkProps[];assetsData: Record<string, string>[]; allUsers: Record<string, string>[] }) {
    const [activeView, setActiveView] = useState<'client' | 'customer'>('client');
    const {setFrameworks, setUserId, setSubscribeData} = FrameworkMainContext();
    useEffect(() => {
        setFrameworks(frameworksData);
        setUserId(profileData);
        setSubscribeData(subscribesData);
    },[])
    
    return (
        <div className="h-full gradient-bg pr-2">
            {/* Header */}
            <header className='border-b'>
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        {/* <div className="bg-blue-600 p-2 rounded-lg">
                            <Shield className="h-6 w-6 text-white" />
                        </div> */}
                        <div>
                            <h1 className="text-xl font-bold text-white">GRC Platform</h1>
                            <p className="text-sm text-gray-400">Governance, Risk & Compliance</p>
                        </div>
                    </div>
                    <div className="flex items-center space-x-4">
                        <Button
                            variant={activeView === 'client' ? 'default' : 'outline'}
                            onClick={() => setActiveView('client')}
                            className="flex items-center space-x-2"
                        >
                            <Building2 className="h-4 w-4" />
                            <span>Global Admin View</span>
                        </Button>
                        <Button
                            variant={activeView === 'customer' ? 'default' : 'outline'}
                            onClick={() => setActiveView('customer')}
                            className="flex items-center space-x-2"
                        >
                            <Users className="h-4 w-4" />

                            <span>Subscriber View</span>
                        </Button>
                    </div>
                </div>

            </header>

            {/* Main Content */}
            <main className="py-8">
                {activeView === 'client' ? <ClientDashboard /> : <CustomerDashboard availableList={availableList} subscribedList={subscribedList} assetsData={assetsData} allUsers={allUsers} profileData={profileData}/>}
            </main>
        </div>
    );
}
