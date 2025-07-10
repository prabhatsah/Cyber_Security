import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    
    DialogClose
} from "@/shadcn/ui/dialog"
import { AdvanceDialogProps } from "../type";
import { IconTextButton } from "@/ikon/components/buttons";
import { Save } from "lucide-react";
import { Button } from "@/shadcn/ui/button";
import { forwardRef } from "react";


const AdvanceDialog = forwardRef<HTMLButtonElement, AdvanceDialogProps & { closeRef?: React.RefObject<HTMLButtonElement> }>(({
    title,
    description,
    content,
    openState,
    onOpenChange,
    width,
    closeRef
}, ref?) => {
    debugger
    return (
        <Dialog open={openState} onOpenChange={() => {
            onOpenChange((prevState: boolean) => !prevState)
        }}>

            <DialogContent className={`sm:max-w-[${width?width:425}px]`}>
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                    <DialogDescription>
                        {description}
                    </DialogDescription>
                </DialogHeader>
                <div className="overflow-auto max-h-[500px]">
                    {content}
                </div>
                
                <DialogFooter>
                    {ref && <IconTextButton
                        onClick={() => {
                            debugger
                            if (ref && "current" in ref && ref.current) {
                                ref.current.click();
                            }

                        }}
                    >
                        <Save />
                        Save
                    </IconTextButton>}
                    <DialogClose asChild>
                        <Button type="button" variant="secondary" className="hidden" ref={closeRef}>
                            Close
                        </Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
})

export default AdvanceDialog;