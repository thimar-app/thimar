// import { Skeleton } from "@/components/ui/skeleton";

// export default function GoalSkeleton() {
//   return (
//     <div className="bg-card rounded-lg overflow-hidden shadow-sm border border-border">
//       <div className="relative h-40 w-full">
//         <Skeleton className="h-full w-full" />
//       </div>
//       <div className="p-4">
//         <Skeleton className="h-6 w-3/4 mb-2" />
//         <div className="flex justify-between items-center mt-2">
//           <Skeleton className="h-4 w-1/4" />
//           <Skeleton className="h-4 w-1/4" />
//         </div>
//         <div className="mt-3">
//           <Skeleton className="h-2 w-full mb-1" />
//           <Skeleton className="h-2 w-5/6" />
//         </div>
//       </div>
//     </div>
//   );
// }

// export function GoalSkeletonGrid() {
//   return (
//     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
//       {Array.from({ length: 8 }).map((_, index) => (
//         <GoalSkeleton key={index} />
//       ))}
//     </div>
//   );
// } 

import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

export default function GoalSkeleton() {
  return (
    <Card className="overflow-hidden max-w-md mx-auto w-full !p-0">
      <div className="relative w-full" style={{ aspectRatio: "5/7.2" }}>
        <div className="absolute p-2 flex-col inset-0 bg-muted flex gap-2">
          <Skeleton className="aspect-[5/5.5] rounded-md w-full" />
          <div className="h-full flex items-center">
            <Skeleton className="h-4 w-3/4" />
          </div>
          <div className="w-full flex items-center justify-center gap-2 mt-auto">
            <Skeleton className="w-full h-3 rounded-full" />
            <Skeleton className="h-4 w-8" />
          </div>
        </div>
      </div>
    </Card>
  );
}

export function GoalSkeletonGrid() {
  return (
    <div className="flex flex-col h-full">
      {/* Header with action buttons */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold">Goals</h1>
          <Skeleton className="h-8 w-8 rounded-md" /> {/* Refresh button */}
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-10 w-36 rounded-md" /> {/* Generate with AI button */}
          <Skeleton className="h-10 w-28 rounded-md" /> {/* Add Goal button */}
        </div>
      </div>

      {/* Progress Card */}
      <Card className="p-4 mb-6">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-lg font-medium">Overall Progress</h2>
          <Skeleton className="h-4 w-8" /> {/* Progress percentage */}
        </div>
        <Skeleton className="h-2 w-full rounded-full" /> {/* Progress bar */}
      </Card>

      {/* Goals grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {Array.from({ length: 6 }).map((_, index) => (
          <GoalSkeleton key={index} />
        ))}
      </div>

      {/* Pagination skeleton */}
      <div className="flex justify-center items-center gap-2 mt-6">
        <Skeleton className="h-8 w-8 rounded-md" /> {/* Previous button */}
        <span className="text-sm">Page 1</span>
        <Skeleton className="h-8 w-8 rounded-md" /> {/* Next button */}
      </div>
    </div>
  );
}

export function LoadingSkeletonPage() {
  return (
    <div className="flex flex-col h-full">
      <div className="mx-auto flex items-center justify-center h-full w-full">
        <div className="text-center">
          <Skeleton className="h-16 w-16 rounded-full mx-auto mb-4" />
          <Skeleton className="h-6 w-32 mx-auto mb-2" />
          <Skeleton className="h-4 w-48 mx-auto" />
        </div>
      </div>
    </div>
  );
}