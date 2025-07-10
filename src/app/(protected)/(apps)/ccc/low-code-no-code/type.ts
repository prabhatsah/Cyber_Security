import React from "react";

export interface CustomDialougeProps {
    children:React.ReactNode,
    content:React.ReactNode | React.ReactElement,
    title?:string,
    description?:string,
}
export interface CodeMirrorProps{
    code?:string,
    theme?:'light'|'dark',
    height?:string,
    editable?:boolean,
    onChange:Function

}

export interface CustomSheetProps {
    children:React.ReactNode,
    sheetTitle?:string | React.ReactElement ,
    sheetDescription?:string | React.ReactElement,
    side:"top" | "bottom" | "left" | "right" | null ,
    content?:React.ReactNode | React.ReactElement,
    
}
export interface StartDryRunProps  {
    script:string,
    scriptType:'vbscript'|'shell'|'powershell' |'nashorn' | 'snmp',

}
export interface chatPropTypes {
    query:string,
    response:string,
    gotReponse:boolean,
    conversationId:string,
}

export interface helpFromAIProps {
    chats:chatPropTypes[],
}