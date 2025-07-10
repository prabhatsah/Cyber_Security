'use client'
import { IconTextButton } from "@/ikon/components/buttons"
import ComboboxInput from "@/ikon/components/combobox-input"
import { Card, CardContent, CardHeader } from "@/shadcn/ui/card"
import { Bot, Code, Play, Save } from "lucide-react"
import CustomDialog from "./CustomDialog"
import CodeEditor from "./CodeMirror"
import { useRef, useState } from "react"
import ServiceMetricesDryRun from "./ServiceMetricesDryRun"
import SaveMetricesForm from "./SaveServiceMetricesForm"
import CustomSheet from "./CustomSheet"
import HelpFromAITemplate from "./HelpFromAITemplate"
import { useLowCodeNoCodeContext } from "../context/LowCodeNoCodeContext"

export default function Script(){

    //states
    const [scriptType, setScriptType] = useState< 'vbscript'|'shell'|'powershell' |'nashorn' | 'snmp' | ''>('')
    const [theme, setTheme] = useState<'dark'|'light'>('dark')
    const [code, setCode] = useState<string>('')
    //end states

    //refs
    const startDryRunRef = useRef<HTMLButtonElement>(null)
    const submitBtnRef = useRef<HTMLButtonElement>(null)
    const closeRef = useRef<HTMLButtonElement>(null)
    //end refs

    //context
    const { chats } = useLowCodeNoCodeContext()


    const handleCodeChange = (value: string) => {
        setCode(value)
    }

    const HelpFromAISheetTitle = () => {
        return (
            <div className="flex items-center justify-start gap-2">
               <Code />
                Ask AI
            </div>
        )

    }
    return <>
        <Card className="w-1/2 h-full">
                <CardHeader>
                    <div className="w-full flex">
                        <div className="w-1/2 flex justify-start">
                            Script
                        </div>
                        <div className="w-1/2 flex justify-end gap-2">
                            <ComboboxInput items={[
                                { label: 'VBScript', value: 'vbscript' },
                                { label: 'Shell', value: 'shell' },
                                { label: 'PowerShell', value: 'powershell' },
                                { label: 'REST API', value: 'nashorn' },
                                { label: 'SNMP', value: 'snmp' }
                            ]} placeholder="Select Script Type" onSelect={(scriptType_)=>{
                                debugger
                                setScriptType(scriptType_ as 'vbscript'|'shell'|'powershell' |'nashorn' | 'snmp')

                            }} />

                            <ComboboxInput items={[
                                { label: 'Light', value: 'light' },
                                { label: 'Dark', value: 'dark' }
                            ]} placeholder="Select Theme" 
                            onSelect={(theme_)=>{
                                setTheme(theme_ as 'dark'|'light')
                            }
                           
                            }
                            defaultValue={'dark'}
                            />

                            
                            
                            <CustomDialog content={<SaveMetricesForm ref={submitBtnRef} code={code} type={scriptType}/>} ref={submitBtnRef} title="Save service metrices" description="Please provide the details to save the service metrices.">
                                <IconTextButton disabled={code.length === 0 && scriptType.length ===0 }  className="h-full"> <Save />Save </IconTextButton>
                            </CustomDialog>

                            <CustomDialog content={<ServiceMetricesDryRun script={code} ref={startDryRunRef} scriptType={scriptType} closeRef={closeRef} />} closeRef={closeRef} ref={startDryRunRef} title="Dry Run" description="Please provide the details to dry run the service metrices.">
                                <IconTextButton disabled={code.length === 0 || scriptType===''} className="h-full"> <Play/>Dry Run </IconTextButton>
                            </CustomDialog>
                            <CustomSheet sheetTitle={<HelpFromAISheetTitle/>} sheetDescription={`This is Text Based AI Assistant`}
                            content={<HelpFromAITemplate chats={chats}/>} 
                            side="right">
                                <IconTextButton className="h-full"> <Bot /> Help From AI</IconTextButton>   
                             </CustomSheet>
                            
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="h-[80vh] p-2">

                    <CodeEditor height={"79vh"} theme={theme} onChange={handleCodeChange}  />
                </CardContent>
            </Card>
    </>
}