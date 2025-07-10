
import { IconTextButton } from "@/ikon/components/buttons"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose
} from "@/shadcn/ui/dialog"
import { Save } from "lucide-react"
import { CustomDialougeProps } from "../type"
import React, { forwardRef } from "react";
import { Button } from "@/shadcn/ui/button";



const DialogDemo = forwardRef<HTMLButtonElement, CustomDialougeProps & { closeRef?: React.RefObject<HTMLButtonElement> }>(
    ({ children, content,title,description,closeRef }, ref) => {
        return (
            <Dialog>
                <DialogTrigger asChild>{children}</DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>{title}</DialogTitle>
                        <DialogDescription>
                            {description}
                        </DialogDescription>
                    </DialogHeader>
                    {content}
                    <DialogFooter>
                        <IconTextButton
                            onClick={() => {
                                debugger
                                if (ref && "current" in ref && ref.current) {
                                    ref.current.click();
                                }
                               
                            }}
                        >
                            <Save />
                            Save
                        </IconTextButton>
                        <DialogClose asChild>
                            <Button type="button" variant="secondary" className="hidden" ref={closeRef}>
                                Close
                            </Button>
                        </DialogClose>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        );
    }
);


export default DialogDemo;

