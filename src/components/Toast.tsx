// components/Toast.tsx
import { Card } from "@tremor/react";
import { X, Loader2, CheckCircle, AlertTriangle } from "lucide-react";
import { useEffect } from "react";
import clsx from "clsx";

interface ToastProps {
    message: string;
    type?: "loading" | "success" | "error";
    onClose: () => void;
    duration?: number; // in ms
}

export default function Toast({
    message,
    type = "success",
    onClose,
    duration = 5000,
}: ToastProps) {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, duration);
        return () => clearTimeout(timer);
    }, [duration, onClose]);

    const getIcon = () => {
        switch (type) {
            case "loading":
                return <Loader2 className="animate-spin text-blue-500" size={20} />;
            case "success":
                return <CheckCircle className="text-green-500" size={20} />;
            case "error":
                return <AlertTriangle className="text-red-500" size={20} />;
            default:
                return null;
        }
    };

    return (
        <Card
            className={clsx(
                "w-full max-w-sm border-l-4 shadow-lg rounded-xl transition-all duration-300",
                "dark:bg-slate-800 dark:text-white bg-white text-gray-800",
                {
                    "border-blue-500 dark:border-blue-500": type === "loading",
                    "border-green-500 dark:border-green-500": type === "success",
                    "border-red-500 dark:border-red-500": type === "error",
                }
            )}
        >
            <div className="flex items-start gap-4">
                {getIcon()}
                <div className="text-sm font-medium flex-1">{message}</div>
                <button onClick={onClose} className="text-sm hover:opacity-80">
                    <X size={16} />
                </button>
            </div>
        </Card>
    );
}














// import { Card } from "@tremor/react";
// import { X } from "lucide-react";

// interface ToastProps {
//     message: string;
//     type?: "success" | "error" | "info";
//     onClose: () => void;
// }

// const toastColors = {
//     success: "bg-green-100 border-green-500 text-green-800",
//     error: "bg-red-100 border-red-500 text-red-800",
//     info: "bg-blue-100 border-blue-500 text-blue-800",
// };

// export default function Toast({ message, type = "info", onClose }: ToastProps) {
//     return (
//         <Card
//             className={`fixed top-4 right-4 z-50 border-l-4 p-4 max-w-sm shadow-lg rounded-xl transition-all duration-300 ${toastColors[type]}`}
//         >
//             <div className="flex justify-between items-start gap-4">
//                 <div className="text-sm font-medium">{message}</div>
//                 <button onClick={onClose} className="text-sm hover:text-gray-700">
//                     <X size={16} />
//                 </button>
//             </div>
//         </Card>
//     );
// }
