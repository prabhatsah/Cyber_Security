import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogCancel,
} from "@/shadcn/ui/alert-dialog"

import { Info } from "lucide-react"

interface ExpressionAlertProps {
  open: boolean;
  onClose: () => void;
}

export const ExpressionAlert: React.FC<ExpressionAlertProps> = ({ open, onClose }) => {
  return (
    <AlertDialog open={open} onOpenChange={onClose}>
      <AlertDialogContent className="text-center">
        <AlertDialogHeader className="flex flex-col items-center">
          <div className="flex justify-center items-center w-12 h-12 rounded-full border-2 border-blue-500 text-blue-500">
            <Info className="w-6 h-6" />
          </div>
          <AlertDialogTitle className="mt-4">Please add an Expression</AlertDialogTitle>
        </AlertDialogHeader>
        <AlertDialogFooter className="justify-center sm:justify-center">
          <AlertDialogCancel className="bg-blue-700 hover:bg-blue-800 text-white rounded px-6 py-2">
            Ok
          </AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
