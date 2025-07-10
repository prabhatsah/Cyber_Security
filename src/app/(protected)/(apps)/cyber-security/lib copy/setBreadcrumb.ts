"use client";
import { useBreadcrumb } from "@/contexts/BreadcrumbContext";
import { useEffect, useMemo } from "react";

type BreadcrumbItem = {
  label: string;
  href?: string;
};

export default function useSetBreadcrumb(items: BreadcrumbItem[]) {
  const { setItems } = useBreadcrumb();

  // Memoize the breadcrumb items to avoid unnecessary re-renders
  const memoizedItems = useMemo(() => items, [JSON.stringify(items)]);

  useEffect(() => {
    setItems(memoizedItems);
  }, [memoizedItems]);
}
