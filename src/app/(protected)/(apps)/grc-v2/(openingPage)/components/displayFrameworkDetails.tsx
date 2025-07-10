import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/shadcn/ui/dialog'
import React, { useState } from 'react';
import { FrameworkData } from './FrameworkOverview';
import { CheckCircle2, ChevronDown, Users } from 'lucide-react';
import { FrameworkMainContext } from './context/frameworkContext';
import MultiCombobox from '@/ikon/components/multi-combobox';
import { Button } from '@/shadcn/ui/button';
import { toast } from 'sonner';
import { mapProcessName, startProcessV2 } from '@/ikon/utils/api/processRuntimeService';
import { useRouter } from 'next/navigation';
export default function DisplayFrameworkDetails({
    open,
    setOpen,
    showFrameworkDetails
}: {
    open: boolean,
    setOpen: React.Dispatch<React.SetStateAction<boolean>>,
    showFrameworkDetails: FrameworkData | null
}) {
    console.log(showFrameworkDetails);
    console.log(showFrameworkDetails?.id);

    const router = useRouter();

    const { allUsers,userId } = FrameworkMainContext();

    const [owner, setOwner] = useState<string[]>([]);

    async function handleFrameworkSubscribe() {
        if(owner.length===0){
            toast.error("Owner is Required.", { duration: 2000 });
            return;
        }
        if (!showFrameworkDetails?.id) {
            toast.error("Framework ID is missing.", { duration: 2000 });
            return;
        }
        const finalData = {
            frameworkId: showFrameworkDetails?.id,
            clientId: userId,
            owner: owner,
            addedOn: new Date()
        };

        console.log(finalData)

        try {
            const customControlProcessId = await mapProcessName({ processName: "Subscribed Frameworks" });
            await startProcessV2({
                processId: customControlProcessId,
                data: finalData,
                processIdentifierFields: "",
            });
            toast.success("Successfully subscribed to the framework", { duration: 2000 });
            router.refresh();
            setOpen(false);
        } catch (error) {
            console.error("Failed to subscribe to framework:", error);
            toast.error("Failed to subscribe. Please try again.", { duration: 2000 });
        }

    }

    function FrameworkDetails() {
        const features = [
            "List of custom controls linked to the framework",
            "Pre-configured risk assessment methodology",
            "Pre-configured policies linked to the framework",
            "BAU that are part of framework as a basic requirement",
            "Internal audit and management review templates",
            "24/7 Priority Support",
        ];

        return (
            <div className="lg:col-span-2">
                <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white">
                    {/* ISO 27001:2022 ISMS Framework */}
                    {
                        showFrameworkDetails?.title || 'N/A'
                    }
                </h2>
                <p className="mt-4 text-lg text-gray-600 dark:text-gray-300 max-w-3xl">
                    {/* A comprehensive framework for establishing, implementing, maintaining, and continually
                    improving an Information Security Management System (ISMS). Subscribing to this
                    framework gives you access to pre-built control libraries, risk assessment templates, and
                    audit-ready reporting features. */}
                    {
                        showFrameworkDetails?.description || 'N/A'
                    }
                </p>

                <div className="mt-10">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">What's Included?</h3>
                    <ul className="mt-6 space-y-4">
                        {features.map((feature, index) => (
                            <li key={index} className="flex items-center gap-3">
                                <CheckCircle2 className="h-6 w-6 text-green-500 dark:text-green-400 flex-shrink-0" />
                                <span className="text-gray-700 dark:text-gray-200">{feature}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        );
    }


    function SubscriptionCard() {
        return (
            <div className="bg-white dark:bg-gray-800/50 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 lg:p-8 h-fit">
                <div className="border-b border-gray-200 dark:border-gray-700 pb-6">
                    <p className="text-sm font-semibold text-gray-600 dark:text-gray-300">Subscription Plan</p>
                    <div className="mt-2 flex items-baseline gap-2">
                        <span className="text-5xl font-extrabold tracking-tighter text-gray-900 dark:text-white">$1999</span>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">One-Time Purchase</p>
                </div>

                <div className="mt-6 grid grid-cols-1">
                    <label htmlFor="owners" className="text-sm font-semibold text-gray-900 dark:text-white">Assign Framework Owners</label>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 mb-3">Select the primary contacts for this framework.</p>
                    <MultiCombobox items={allUsers} defaultValue={owner} onValueChange={setOwner} placeholder={'Select Onwer'} />
                </div>

                <div className="mt-8 flex flex-col gap-3">
                    <Button
                        className="w-full bg-blue-600 text-white font-semibold py-3 px-4 rounded-lg hover:bg-blue-700 transition-all transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 disabled:bg-blue-400 dark:disabled:bg-blue-800/50 disabled:cursor-not-allowed"
                        onClick={()=> {handleFrameworkSubscribe()}}
                    >
                        Subscribe Now
                    </Button>
                    <Button className="w-full bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 font-semibold py-3 px-4 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                        Subscribe Later
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <>
            <Dialog open={open} onOpenChange={setOpen} >
                <DialogContent
                    onInteractOutside={(e) => e.preventDefault()}
                    className="max-w-[80%] max-h-[80%] p-6 pt-4 flex flex-col"
                >
                    <DialogHeader>
                        <DialogTitle>Framework Details</DialogTitle>
                    </DialogHeader>

                    <main className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <FrameworkDetails />
                        <SubscriptionCard />
                    </main>

                </DialogContent>
            </Dialog>
        </>
    )
}
