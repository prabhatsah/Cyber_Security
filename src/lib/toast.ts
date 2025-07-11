type ToastType = "loading" | "success" | "error";

let listeners: ((message: string, type: ToastType) => void)[] = [];

export const toast = {
  push(message: string, type: ToastType = "success") {
    listeners.forEach((listener) => listener(message, type));
  },
  subscribe(listener: (message: string, type: ToastType) => void) {
    listeners.push(listener);
    return () => {
      listeners = listeners.filter((l) => l !== listener);
    };
  },
};
