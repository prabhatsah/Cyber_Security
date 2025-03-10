'use client'
import { createContext, useContext, useState, ReactNode } from "react"
import CustomAlertDialog from ".";

interface DialogContextProps {
    openDialog: (options: DialogOptions) => void;
    closeDialog: () => void;
}

interface DialogOptions {
    title: string;
    description: string;
    onConfirm?: () => void;
    onCancel?: () => void;
    onThird?: () => void;
    confirmText?: string;
    cancelText?: string;
    thirdOptionText?: string;
    fontSize?: string;
}

const DialogContext = createContext<DialogContextProps | undefined>(undefined);

export const useDialog = () => {
    const context = useContext(DialogContext);
    if (!context) {
        throw new Error("useDialog must be used within a DialogProvider");
    }
    return context;
};

export const DialogProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [dialogOptions, setDialogOptions] = useState<DialogOptions | null>(null);

    const openDialog = (options: DialogOptions) => setDialogOptions(options);
    const closeDialog = () => setDialogOptions(null);

    return (
        <DialogContext.Provider value={{ openDialog, closeDialog }}>
            {children}
            {dialogOptions && (
                <CustomAlertDialog
                    title={dialogOptions.title}
                    description={dialogOptions.description}
                    fontSize={dialogOptions.fontSize || "text-base"}
                    cancelText={dialogOptions.cancelText || ""}
                    confirmText={dialogOptions.confirmText || ""}
                    thirdOptionText={dialogOptions.thirdOptionText || ""}
                    onConfirm={() => {
                        if (dialogOptions.onConfirm) dialogOptions.onConfirm();
                        closeDialog();
                    }}
                    onCancel={() => {
                        if (dialogOptions.onCancel) dialogOptions.onCancel();
                        closeDialog();
                    }}
                    onThird={() => {
                        if (dialogOptions.onThird) dialogOptions.onThird();
                        closeDialog();
                    }}
                />
            )}
        </DialogContext.Provider>
    );
};
