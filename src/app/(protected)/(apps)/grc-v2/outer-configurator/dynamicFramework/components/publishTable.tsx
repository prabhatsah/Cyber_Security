import React from 'react'
import { Framework } from '../page'
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/shadcn/ui/dialog";
import { Button } from '@/shadcn/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/shadcn/ui/card'
import PublishTableComp from './publishTableComp';
export default function PublishTable({
    selectedCard,
    openPublishView,
    setOpenPublishView
}:
    {
        selectedCard: Framework;
        openPublishView: boolean;
        setOpenPublishView: React.Dispatch<React.SetStateAction<boolean>>;
    }) {
    console.log(selectedCard);
    const frameworkStructureData = Object.values(selectedCard?.entries || {});
    const frameworkFieldConfigData = selectedCard?.configureData;
    return (
        <>
            <Dialog open={openPublishView} onOpenChange={setOpenPublishView}>
                <DialogContent className="!max-w-none w-[90vw] h-[95vh] p-6 pt-4 flex flex-col">
                    <DialogHeader>
                        <DialogTitle>Custom Framework Builder</DialogTitle>
                    </DialogHeader>
                    <div className="border-l-4 border-purple-500 pl-4">
                        <h3 className="text-lg font-semibold my-4">
                            View Framework
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
                                    <span className='self-end'>{selectedCard?.name}</span>
                                </div>
                                <div className='flex flex-row gap-3'>
                                    <span className="text-lg text-foreground/50">Version:</span>
                                    <span className='self-end'>{selectedCard?.version}</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle>Framework Structure Details</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <PublishTableComp frameworkFieldConfigData={frameworkFieldConfigData} frameworkStructureData={frameworkStructureData} />
                        </CardContent>
                    </Card>
                    <DialogFooter className="w-full flex flex-row">
                        <Button onClick={() => { setOpenPublishView(false) }} variant="default">
                            Close
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    )
}
