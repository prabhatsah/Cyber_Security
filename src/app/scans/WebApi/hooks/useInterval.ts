// hooks/useInterval.ts
import { useEffect, useRef } from "react";

export const useInterval = (
  callback: () => void,
  delay: number,
  shouldRun: boolean
) => {
  const savedCallback = useRef<(() => void) | null>(null);

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    if (!shouldRun || !delay) return;
    const id = setInterval(() => {
      savedCallback.current?.();
    }, delay);
    return () => clearInterval(id);
  }, [delay, shouldRun]);
};
