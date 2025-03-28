import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@tremor/react";

export default function Loading() {
  const skeletons = Array(2).fill(null);

  return (
    <div className="grid grid-cols-3 gap-4 ">
      {skeletons.map((_, index) => (
        <Card
          className="flex flex-col space-y-5 w-full rounded-lg justify-between !bg-dark-bgPrimary
         hover:bg-tremor-background-muted 
         hover:dark:bg-dark-tremor-background-muted"
        >
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-3">
              <Skeleton className="h-12 w-12 rounded-md" />
              <div className="flex flex-col space-y-2">
                <Skeleton className="h-5 w-48" />
              </div>
            </div>
          </div>
          <div className="space-y-2 ">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-96" />
          </div>
          <div className="flex space-x-4">
            <Skeleton className="h-6 w-6 rounded-md" />
            <Skeleton className="h-6 w-32 rounded-md" />
          </div>
        </Card>
      ))}
    </div>
  );
}
