import { Button } from "@/shadcn/ui/button"
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/shadcn/ui/sheet"

export function SheetComponent({ 
    buttonText, 
    buttonIcon, 
    sheetContent,
    sheetDescription, 
    sheetTitle, 
    closeButton
  }: { 
    buttonText?: React.ReactNode, 
    buttonIcon?: React.ReactNode, 
    sheetTitle?: React.ReactNode, 
    sheetDescription?: React.ReactNode, 
    sheetContent?: React.ReactNode, 
    closeButton?: boolean

  }) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant='link' size={"icon"}>{buttonText}{buttonIcon}</Button> 
      </SheetTrigger> 
      <SheetContent>
        <SheetTitle>{sheetTitle}</SheetTitle> 
        {sheetContent}
      </SheetContent>
    </Sheet>
  )
}