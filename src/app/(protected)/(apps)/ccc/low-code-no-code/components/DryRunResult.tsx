'use client'
import { Card, CardContent, CardHeader } from "@/shadcn/ui/card";
import { useLowCodeNoCodeContext } from "../context/LowCodeNoCodeContext";
import JSONPretty from 'react-json-pretty';
import { Icon, Logs } from "lucide-react";
import { IconTextButton } from "@/ikon/components/buttons";
import ErrorLogs from "./Logs";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/shadcn/ui/resizable";

export default function DryRunResult() {
    const { dryRunResult, dryRunSuccess } = useLowCodeNoCodeContext()
    return <>

        <Card className="w-1/2">
            <CardHeader className="flex flex-row items-center justify-between">
                <div className="w-1/2 flex justify-start">
                    Dry Run Result
                </div>
                {/* <div className="w-1/2 flex justify-end gap-2">
                    <IconTextButton> <Logs />Logs </IconTextButton>
                </div> */}
            </CardHeader>
            <CardContent className="h-[82vh] p-2 overflow-y-auto">
                <ResizablePanelGroup
                    direction="vertical"
                    className="w-rounded-lg border w-full h-full"
                >
                    <ResizablePanel defaultSize={75}>

                        {dryRunSuccess ?
                            <div className="text-md font-semibold p-2 overflow-y-auto h-full text-nowrap">
                                <JSONPretty data={dryRunResult} className="text-nowrap" />

                            </div> :
                            <div className="text-gray-400 text-sm font-semibold p-2">
                                Start Dry Run to see the result
                            </div>
                        }
                    </ResizablePanel>

                    <ResizableHandle />

                    <ResizablePanel defaultSize={25} maxSize={75} minSize={25}>
                        <ErrorLogs />
                    </ResizablePanel>
                </ResizablePanelGroup>

            </CardContent>
        </Card >

    </>
}