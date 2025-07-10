"use client";

import { useEffect, useState } from "react";
import Toast from "./Toast";
import { toast } from "@/lib/toast";

// Helper to generate a unique ID
const generateId = (() => {
    let counter = 0;
    return () => `${Date.now()}-${counter++}`;
})();

type ToastEntry = {
    id: string;
    message: string;
    type: "loading" | "success" | "error";
};

export default function ToastContainer() {
    const [toasts, setToasts] = useState<ToastEntry[]>([]);

    useEffect(() => {
        const unsubscribe = toast.subscribe((message, type) => {
            const id = generateId();
            setToasts((prev) => [...prev, { id, message, type }]);
            setTimeout(() => {
                setToasts((prev) => prev.filter((t) => t.id !== id));
            }, 5000);
        });
        return () => unsubscribe();
    }, []);

    return (
        toasts.length ?
            <div className="fixed bottom-4 right-4 z-50 max-h-64 flex flex-col gap-4 p-3 overflow-y-auto rounded-lg bg-popover border shadow-md">
                {toasts.map(({ id, message, type }) => (
                    <Toast
                        key={id}
                        message={message}
                        type={type}
                        onClose={() => setToasts((prev) => prev.filter((t) => t.id !== id))}
                    />
                ))}
            </div> : ""
    );
}

