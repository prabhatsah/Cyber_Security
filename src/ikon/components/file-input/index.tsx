import React, { useRef } from 'react'
import { IconButtonWithTooltip } from '../buttons'
import { Upload } from 'lucide-react'
import { Input } from '@/shadcn/ui/input'

function FileInput({ tooltipContent, fileNamePlaceholder, fileName, onFileNameChange, ...props }: any) {
    const inputRef = useRef<HTMLInputElement>(null);
    return (
        <>
            <div className='flex'>
                <Input
                    type="file"
                    className="hidden"
                    {...props}
                    ref={inputRef}
                />
                <Input className='rounded-e-none' placeholder={fileNamePlaceholder} onChange={onFileNameChange} value={fileName} />
                <IconButtonWithTooltip tooltipContent={tooltipContent || "Browse File"} onClick={() => inputRef?.current?.click()} className='border-s-0 rounded-s-none'>
                    <Upload />
                </IconButtonWithTooltip>
            </div>
        </>
    )
}

export default FileInput