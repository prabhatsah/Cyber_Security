import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/shadcn/ui/sheet"
import { CustomSheetProps } from "../type"


export default function ChatHistory({
    children,
    sheetTitle,
    sheetDescription,
    side,
    content
    
}:CustomSheetProps){
    return (
        <>
        <Sheet>
                    <SheetTrigger asChild>
                        {children}
                    </SheetTrigger>
                    <SheetContent side={side} className="h-full">
                        <SheetHeader>
                            <SheetTitle>{sheetTitle}</SheetTitle>
                            <SheetDescription>
                              {sheetDescription}
                            </SheetDescription>
                              {content}
                                
                            
                        </SheetHeader>
                       
                    </SheetContent>
                </Sheet></>
    )
}