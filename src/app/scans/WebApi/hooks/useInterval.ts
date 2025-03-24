import { useEffect, useRef } from "react";

export const useInterval = (callback: () => void, delay: number | null) => {
  const savedCallback = useRef<() => void>(() => {});
  const intervalId = useRef<NodeJS.Timeout | null>(null);

  // Save the latest callback
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Manage the interval lifecycle
  useEffect(() => {
    if (delay == null) {
      if (intervalId.current) clearInterval(intervalId.current);
      return;
    }

    // Clear any existing interval before starting a new one
    if (intervalId.current) {
      clearInterval(intervalId.current);
    }

    intervalId.current = setInterval(() => {
      savedCallback.current();
    }, delay);

    // Cleanup on unmount or delay/shouldRun changes
    return () => {
      if (intervalId.current) {
        clearInterval(intervalId.current);
      }
    };
  }, [delay]);
};
