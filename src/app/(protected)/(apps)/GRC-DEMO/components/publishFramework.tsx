import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/shadcn/ui/dialog'
import React, { useState } from 'react'
import { FrameworkData, FrameworkDraftData } from './frameworkCreationForm';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shadcn/ui/card';
import { format } from 'date-fns';
import { SAVE_DATE_FORMAT_GRC } from '@/ikon/utils/config/const';
import { Badge } from '@/shadcn/ui/badge';
import { Search } from 'lucide-react';
import { Input } from '@/shadcn/ui/input';
import { Tabs, TabsList, TabsTrigger } from '@/shadcn/ui/tabs';
import { ScrollArea } from '@/shadcn/ui/scroll-area';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/shadcn/ui/accordion';
import { Button } from '@/shadcn/ui/button';
import { getMyInstancesV2, invokeAction, mapProcessName, startProcessV2 } from '@/ikon/utils/api/processRuntimeService';
import { useRouter } from 'next/navigation';
import { getActiveAccountId } from '@/ikon/utils/actions/account';
import { getProfileData } from '@/ikon/utils/actions/auth';
import { CustomBadge } from '@/shadcn/ui/custom-badge';

export default function PublishFramework({
    openPublishForm,
    setOpenPublishForm,
    frameworkData,
    userMap,
    setOpen
}: {
    openPublishForm: boolean;
    setOpenPublishForm: React.Dispatch<React.SetStateAction<boolean>>;
    frameworkData: FrameworkData | null;
    userMap: { label: string, value: string }[];
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {

    // console.log(frameworkData);
    const router = useRouter();
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedType, setSelectedType] = useState<"all" | "control" | "clause">("all");
    const ownerLabelsArray = frameworkData?.owners?.map(
        (id) => userMap.find((u) => u.value === id)?.label || id
    ) || [];

    const displayedOwner = ownerLabelsArray[0];
    const remainingCount = ownerLabelsArray.length - 1;
    const badgeLabel = remainingCount > 0 ? `Owner: ${displayedOwner} +${remainingCount}` : `Owner: ${displayedOwner}`;
    const fullTitle = ownerLabelsArray.join(', ');

    const saveFramework = async () => {

        // const currentUserAccountId = await getActiveAccountId();
        const profileData = await getProfileData();
        const currentUserAccountId = profileData.USER_ID;

        const draftSavedInstance = await getMyInstancesV2({
            processName: "Framework Draft Save",
            predefinedFilters: { taskName: "Edit Framework Draft" },
            mongoWhereClause: `this.Data.currentAccountId =="${currentUserAccountId}" && this.Data.saveAsDraft ==${true}`,
        })
        const draftInstanceData = draftSavedInstance.length > 0 ? draftSavedInstance[0].data as FrameworkDraftData | null : null;

        if (draftInstanceData) {
            draftInstanceData.saveAsDraft = false;
            const draftInstanceTaskId = draftSavedInstance[0]?.taskId;
            await invokeAction({
                data: draftInstanceData,
                taskId: draftInstanceTaskId,
                transitionName: 'Update Edit',
                processInstanceIdentifierField: "frameworkId"
            })
        }
        const processId = await mapProcessName({ processName: "Control Objectives V2" });
        if (frameworkData) {
            await startProcessV2({
                processId,
                data: frameworkData,
                processIdentifierFields: "frameworkId",
            });
        }
        setOpenPublishForm(false);
        setOpen(false);
        router.refresh();
    }

    return (
        <>
            <Dialog open={openPublishForm} onOpenChange={setOpenPublishForm}>
                <DialogContent className="max-w-[90%] max-h-full">
                    <DialogHeader>
                        <DialogTitle>
                            Framework Preview/ Publish
                        </DialogTitle>
                    </DialogHeader>
                    <Card>
                        <CardHeader>
                            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                                <div>
                                    <CardTitle className="text-2xl">{frameworkData?.frameworkName || 'N/A'}</CardTitle>
                                    <CardDescription className="mt-2">
                                        Version {frameworkData?.version} | Effective: {frameworkData?.effectiveDate ? format(frameworkData?.effectiveDate, SAVE_DATE_FORMAT_GRC) : 'N/A'}
                                    </CardDescription>
                                </div>
                                {/* <Badge variant="outline" className="w-fit">
                                    Owner: {frameworkData && frameworkData?.owners?.map((owner) => owner.find + " ")}
                                </Badge> */}
                                <Badge
                                    variant="outline"
                                    className="max-w-xs truncate"
                                    title={fullTitle} // Tooltip on hover shows full list
                                >
                                    {badgeLabel}
                                </Badge>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-6">
                                <div>
                                    <h3 className="font-semibold mb-2">Description</h3>
                                    <p className="text-sm text-foreground/50">{frameworkData?.description || 'N/A'}</p>
                                </div>

                                <div className="space-y-4">
                                    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                                        <h3 className="font-semibold">
                                            Framework Content ({frameworkData?.controls?.length || 0} items)
                                        </h3>
                                    </div>

                                    <ScrollArea className="h-[600px] pr-4">
                                        <Accordion type="multiple" className="w-full">
                                            {frameworkData && frameworkData?.controls?.map((control, index) => (
                                                <AccordionItem
                                                    key={index}
                                                    value={`control-${index}`}
                                                    className="border rounded-md px-4 mb-4 data-[state=open]:bg-muted/50"
                                                >
                                                    <AccordionTrigger className="hover:no-underline py-4">
                                                        <div className="flex flex-col md:flex-row md:items-center text-left gap-2 w-full">
                                                            <div className="flex items-center gap-2 flex-1">
                                                                <Badge variant="secondary" className="w-[60px] justify-center">
                                                                    {control.policyIndex}
                                                                </Badge>
                                                                <span className="font-medium">{control.controlName}</span>
                                                            </div>
                                                            <div className="flex items-center justify-start gap-2">
                                                                <div className="min-w-[50px]">
                                                                    <CustomBadge
                                                                        label={control.type}
                                                                        bgColor={control.type === "Control" ? "#a4e635" : "#ea8625"}
                                                                    />
                                                                </div>
                                                                <div className="min-w-[100px]">
                                                                    <Badge variant="outline">
                                                                        {control?.controlObjectives?.length || 0} objectives
                                                                    </Badge>
                                                                </div>
                                                            </div>

                                                        </div>
                                                    </AccordionTrigger>
                                                    <AccordionContent className="pb-4 pt-2">
                                                        <div className="space-y-4">
                                                            <div>
                                                                <h4 className="font-semibold mb-1">Description</h4>
                                                                <p className="text-sm text-foreground/50">{control?.controlDescription || 'N/A'}</p>
                                                            </div>

                                                            <div>
                                                                <h4 className="font-semibold mb-2">
                                                                    Objectives ({control?.controlObjectives?.length || 0})
                                                                </h4>

                                                                <div className="space-y-3 pl-4 border-l-2">
                                                                    {control && control?.controlObjectives?.map((objective, objIndex) => (
                                                                        <div key={objIndex} className="bg-background border rounded-md p-3">
                                                                            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                                                                                <div className="flex items-center gap-2">
                                                                                    <Badge variant="outline" className="w-[70px] justify-center">
                                                                                        {objective?.objectiveIndex || 'N/A'}
                                                                                    </Badge>
                                                                                    <h5 className="font-medium text-sm">
                                                                                        {objective?.objectiveName || 'N/A'}
                                                                                    </h5>
                                                                                </div>
                                                                            </div>
                                                                            <p className="text-sm text-muted-foreground mt-2 pl-[82px]">
                                                                                {objective?.objectiveDescription || 'N/A'}
                                                                            </p>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </AccordionContent>
                                                </AccordionItem>
                                            ))}
                                        </Accordion>
                                    </ScrollArea>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <DialogFooter>
                        <Button onClick={saveFramework}>
                            Publish
                        </Button>
                    </DialogFooter>
                </DialogContent>

            </Dialog>
        </>
    )
}
