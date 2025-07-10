import { Skeleton } from "@/components/ui/skeleton";
import { Card, Button } from "@tremor/react";

export default function Loading() {
  return (
    <div className="w-full container mx-auto p-4 space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="p-4 space-y-3 !bg-dark-bgPrimary">
            <Skeleton className="h-6 w-40" />
            <Skeleton className="h-10 w-28" />
            <Skeleton className="h-4 w-20" />
          </Card>
        ))}
      </div>

      {/* Packet Filters */}
      <Card className="p-4 space-y-4 !bg-dark-bgPrimary">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-10 w-full" />
          ))}
        </div>
        <div className="flex justify-between">
          <Skeleton className="h-10 w-24" />
          <Skeleton className="h-10 w-36" />
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Recent Network Activity */}
        <Card className="p-4 space-y-4 col-span-2 !bg-dark-bgPrimary">
          <Skeleton className="h-6 w-48" />
          <div className="grid grid-cols-5 gap-2">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-6 w-full" />
            ))}
          </div>
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-10 w-full" />
          ))}
        </Card>

        {/* Critical Alert */}
        <Card className="p-4 space-y-3 border border-red-500 !bg-dark-bgPrimary">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </Card>
      </div>
    </div>
  );
}
