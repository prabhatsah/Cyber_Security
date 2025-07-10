import { Skeleton } from "@/shadcn/ui/skeleton";

export function AlertTabSkeleton() {
  return (
    <div className="space-y-4">
      {/* Alert Type */}
      <Skeleton className="h-5 w-32 bg-gray-400" />
      <Skeleton className="h-10 w-full bg-gray-400" />

      {/* Act upon event? */}
      <Skeleton className="h-5 w-40 bg-gray-400" />
      <Skeleton className="h-10 w-full bg-gray-400" />

      {/* Command related fields (conditionally shown) */}
      <Skeleton className="h-5 w-48 bg-gray-400" />
      <Skeleton className="h-10 w-full bg-gray-400" />
      <Skeleton className="h-5 w-40 bg-gray-400" />
      <Skeleton className="h-10 w-full bg-gray-400" />

      {/* Subject */}
      <Skeleton className="h-5 w-24 bg-gray-400" />
      <Skeleton className="h-10 w-full bg-gray-400" />

      {/* User + Recipient Group Select */}
      <div className="grid grid-cols-2 gap-4 bg-gray-400">
        <div>
          <Skeleton className="h-5 w-36 bg-gray-400" />
          <Skeleton className="h-10 w-full bg-gray-400" />
        </div>
        <div>
          <Skeleton className="h-5 w-44 bg-gray-400" />
          <Skeleton className="h-10 w-full bg-gray-400" />
        </div>
      </div>

      {/* Email Address */}
      <Skeleton className="h-5 w-32 bg-gray-400" />
      <Skeleton className="h-10 w-full bg-gray-400" />

      {/* Email Body */}
      <Skeleton className="h-5 w-28 bg-gray-400" />
      <Skeleton className="h-32 w-full bg-gray-400" />
    </div>
  );
}
