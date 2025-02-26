"use client";
import { useLoading } from "@/contexts/LoadingContext";

export default function useGlobalLoading() {
  const { showLoading, hideLoading } = useLoading();

  const withLoading = async (action: () => Promise<void>) => {
    showLoading();
    try {
      await action();
    } finally {
      hideLoading();
    }
  };

  return { withLoading, showLoading, hideLoading };
}
