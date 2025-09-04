import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface CustomAlertDialogProps {
    title: string;
    description?: string;
    fontSize?: string;
    cancelText?: string;
    confirmText?: string;
    thirdOptionText?: string;
    onCancel?: () => void;
    onConfirm?: () => void;
    onThird?: () => void;
    confirmVariant?: "red" | "blue" | "green" | "default";
    cancelVariant?: "red" | "blue" | "green" | "default";
    thirdVariant?: "red" | "blue" | "green" | "default";
}

const variantClasses: Record<string, string> = {
    red: "bg-red-600 hover:bg-red-700 text-white",
    blue: "bg-blue-600 hover:bg-blue-700 text-white",
    green: "bg-green-600 hover:bg-green-700 text-white",
    default: "bg-gray-500 hover:bg-gray-600 text-white",
};

const CustomAlertDialog: React.FC<CustomAlertDialogProps> = ({
    title,
    description,
    fontSize = "text-base",
    cancelText = "",
    confirmText = "",
    thirdOptionText = "",
    onCancel,
    onConfirm,
    onThird,
    confirmVariant = "default",
    cancelVariant = "default",
    thirdVariant = "default",
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
                    {cancelText !== "" && (
                        <AlertDialogCancel
                            className={variantClasses[cancelVariant]}
                            onClick={() => {
                                onCancel?.();
                            }}
                        >
                            {cancelText}
                        </AlertDialogCancel>
                    )}
                    {thirdOptionText !== "" && (
                        <AlertDialogAction
                            className={variantClasses[thirdVariant]}
                            onClick={() => {
                                onThird?.();
                            }}
                        >
                            {thirdOptionText}
                        </AlertDialogAction>
                    )}
                    {confirmText !== "" && (
                        <AlertDialogAction
                            className={variantClasses[confirmVariant]}
                            onClick={() => {
                                onConfirm?.();
                            }}
                        >
                            {confirmText}
                        </AlertDialogAction>
                    )}
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};

export default CustomAlertDialog;
