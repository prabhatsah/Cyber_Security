import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@tremor/react";

export default function Loading() {
  const skeletons = Array(3).fill(null);

  return (
    <div className=" text-white p-6">
      {/* OSINT & Threat Intelligence Header */}
      <h2 className="text-lg font-bold mb-2"></h2>
      <div className="flex items-center space-x-2 mb-6">
        <Skeleton className="h-10 w-full rounded-md" />
        <Skeleton className="h-10 w-20 rounded-md" />
      </div>

      {/* Scan History */}
      <h3 className="text-xl font-bold mb-4 mt-4">Scan History</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {skeletons.map((_, index) => (
          <Card
            key={index}
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
                  <Skeleton className="h-3 w-32" />
                </div>
              </div>
              <Skeleton className="h-8 w-8 rounded-md" />
            </div>

            {/* Issue section */}
            <div className="space-y-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-64" />
              <Skeleton className="h-4 w-64" />
              <Skeleton className="h-4 w-64" />
            </div>

            {/* Footer */}
            <div className="flex justify-between items-center">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-16" />
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
