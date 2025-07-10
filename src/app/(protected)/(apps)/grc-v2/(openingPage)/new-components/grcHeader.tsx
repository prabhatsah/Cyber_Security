"use client"
import { Button } from '@/shadcn/ui/button';
import { Building2, Shield, Users } from 'lucide-react';
import React, { use, useEffect, useState } from 'react'
// import CustomerDashboard from './CustomerDashboard';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shadcn/ui/select';
import { clientDetails } from '../page';
import { frameworkProps, NewFrameworkContext, NewFrameworkMainContext, subscribeProps } from './context/newFrameworkContext';
import ClientDashboard from './components/ClientDashboard';
import { useRouter } from 'next/navigation';

// export default function GrcHeader({frameworksData, profileData, subscribesData, availableList, subscribedList, assetsData, allUsers} : { frameworksData: frameworkProps[]; profileData: string; subscribesData: subscribeProps[]; availableList: frameworkProps[];subscribedList: frameworkProps[];assetsData: Record<string, string>[]; allUsers: Record<string, string>[] }) {
export default function GrcHeader({profileData} : { profileData: string; }) {
    const router = useRouter(); 
    
    const [activeView, setActiveView] = useState<'client' | 'customer'>('client');
    const [selectedClient, setSelectedClient] = useState(profileData || '');
    // const {userId, setFrameworks, setUserId, setSubscribeData} = NewFrameworkMainContext();
    // useEffect(() => {
    //     setFrameworks(frameworksData);
    //     setUserId(profileData);
    //     setSubscribeData(subscribesData);
    // },[])

    const handleClientChange = async (newClientId: string) => {
        if (!newClientId) return;
    
        console.log(`Switching view to client: ${newClientId}`);
        setSelectedClient(newClientId);
        // // Use the imported utility with data from the context
        // const { subscribedList, availableList } = filterFrameworksForClient(
        //   newClientId,
        //   frameworks,
        //   subscribeData
        // );
    
        // // Update the state, which will re-render the FrameworkOverview component
        // setCurrentSubscribed(subscribedList);
        // setCurrentAvailable(availableList);
    
        // const assetData = await fetchAssetsData(newClientId);
        // setCurrentAssetData(assetData);
    };

    function subscriberView(clientId: string) {
        router.push(`/grc-v2/client/${clientId}/home`);
    }
    
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
                        <div className="flex items-center space-x-4">
                            <Select value={selectedClient} onValueChange={handleClientChange}>
                                <SelectTrigger className="w-48 bg-gray-900 border-gray-700">
                                    <SelectValue placeholder="Select Client" />
                                </SelectTrigger>
                                <SelectContent className="bg-gray-900 border-gray-700">
                                    {clientDetails.map((client) => (
                                        <SelectItem key={client.id} value={client.id}>
                                          {client.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <Button
                            variant={activeView === 'customer' ? 'default' : 'outline'}
                            // onClick={() => setActiveView('customer')}
                            onClick={() => subscriberView(selectedClient)}
                            className="flex items-center space-x-2"
                        >
                            <Users className="h-4 w-4" />

                            <span>Subscriber View</span>
                        </Button>
                    </div>
                </div>

            </header>

            {/* Main Content */}
            {/* <main className="py-8">
                {activeView === 'client' ? <ClientDashboard /> : <CustomerDashboard availableList={availableList} subscribedList={subscribedList} assetsData={assetsData} allUsers={allUsers} profileData={profileData}/>}
            </main> */}
            <main className="py-8">
                {activeView === 'client' ? <ClientDashboard /> : 'nothing necessary here'}
            </main>
        </div>
    );
}
