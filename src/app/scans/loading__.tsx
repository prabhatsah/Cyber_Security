import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@tremor/react";
import { LuRefreshCw } from "react-icons/lu";

export default function Loading() {
  return (
    <div className="">
      <LuRefreshCw className="animate-spin" />
    </div>
  );
}
