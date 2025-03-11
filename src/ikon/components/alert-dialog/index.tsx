import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/shadcn/ui/alert-dialog";

interface CustomAlertDialogProps {
    title: string;
    description?: string;
    fontSize?: string; // Tailwind font size class, e.g., "text-sm", "text-lg"
    cancelText?: string; // Custom text for the cancel button
    confirmText?: string; // Custom text for the confirm button
    thirdOptionText?: string; // Custom text for the third button
    onCancel?: () => void; // Callback function for cancel action
    onConfirm?: () => void; // Callback function for confirm action
    onThird?: () => void;
}

const CustomAlertDialog: React.FC<CustomAlertDialogProps> = ({
    title,
    description,
    fontSize = "text-base",
    cancelText = "", // Default cancel button text
    confirmText = "", // Default confirm button text
    thirdOptionText = "", // Default third button text
    onCancel, // Optional callback for cancel action
    onConfirm, // Optional callback for confirm action
    onThird, // Optional callback for third action
}) => {
    return (
        <AlertDialog open={true}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle className={fontSize}>{title}</AlertDialogTitle>
                    <AlertDialogDescription className={fontSize}>
                        {description}
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    {cancelText != "" &&
                        <AlertDialogCancel
                            onClick={() => {
                                if (onCancel) onCancel(); // Execute cancel callback if provided
                            }}
                        >
                            {cancelText}
                        </AlertDialogCancel>
                    }
                    {thirdOptionText != "" &&
                        <AlertDialogAction className="bg-blue-500" color="black"
                            onClick={() => {
                                if (onThird) onThird(); // Execute confirm callback if provided
                            }}
                        >
                            {thirdOptionText}
                        </AlertDialogAction>
                    }
                    {confirmText != "" &&
                        <AlertDialogAction
                            onClick={() => {
                                if (onConfirm) onConfirm(); // Execute confirm callback if provided
                            }}
                        >
                            {confirmText}
                        </AlertDialogAction>
                    }
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog >
    );
};

export default CustomAlertDialog;
