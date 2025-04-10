import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@tremor/react";

export default function Loading() {
  const skeletons = Array(6).fill(null);

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-4">
        {skeletons.map((_, index) => (
          <Card
            key={index}
            className="flex flex-col space-y-5 w-full rounded-lg justify-between bg-primary !bg-dark-bgPrimary 
            hover:bg-tremor-background-muted hover:dark:bg-dark-tremor-background-muted p-4"
          >
            {/* Header */}
            <div className="flex items-start space-x-3">
              <Skeleton className="h-10 w-10 rounded-md" />
              <div className="flex flex-col space-y-2">
                <Skeleton className="h-5 w-48" />
                <Skeleton className="h-4 w-40" />
              </div>
            </div>

            {/* Description Section */}
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-11/12" />
              <Skeleton className="h-4 w-10/12" />
            </div>

            {/* Footer */}
            <div className="flex items-center space-x-2">
              <Skeleton className="h-5 w-5 rounded-md" />
              <Skeleton className="h-4 w-32" />
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
