import { AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/shadcn/ui/alert-dialog"

export function AlertBox({ alertBox, setAlertBox, message }: {
    alertBox: boolean;
    setAlertBox: React.Dispatch<React.SetStateAction<boolean>>;
    message: string;
}) {
    return (
        <AlertDialog open={alertBox} onOpenChange={setAlertBox}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Validation Message</AlertDialogTitle>
                    <AlertDialogDescription>
                        {message}
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel onClick={() => {
                        setAlertBox(false)
                        message = ''
                    }}>
                        Cancel
                    </AlertDialogCancel>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}