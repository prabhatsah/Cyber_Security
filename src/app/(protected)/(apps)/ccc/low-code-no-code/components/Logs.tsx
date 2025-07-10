import { Card, CardContent, CardHeader } from "@/shadcn/ui/card";
import { useLowCodeNoCodeContext } from "../context/LowCodeNoCodeContext";
import JSONPretty from "react-json-pretty";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/shadcn/ui/accordion";

export default function DryRunLogs() {
    debugger
    const { error, dryRunSuccess } = useLowCodeNoCodeContext()
    return <>
        

            {/* <Card className="w-full">
                
                     <CardHeader className="flex flex-row items-center justify-between">

                        Logs

                    </CardHeader>
                   

                        <CardContent className="h-[35vh] p-2 overflow-y-auto"  > */}

                            {dryRunSuccess === false ?
                                <div className="text-red-500 text-md font-semibold p-2">
                                    {error.map(e=><JSONPretty data={e} />)}

                                </div> :
                                <div className="text-gray-400 text-sm font-semibold p-2">
                                    Error Logs Will be shown here
                                </div>
                            }

                        {/* </CardContent>
                   

            </Card> */}

        
    </>
}