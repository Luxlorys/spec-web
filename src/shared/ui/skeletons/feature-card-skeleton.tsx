import { Card } from '../card';
import { Skeleton } from '../skeleton';

export const FeatureCardSkeleton = () => {
  return (
    <Card className="flex h-full flex-col border" padding="md">
      {/* Header with badge skeleton */}
      <div className="mb-3">
        <Skeleton className="h-6 w-16 rounded-full" />
      </div>

      {/* Title and description skeleton */}
      <div className="mb-4 flex-1">
        <Skeleton className="mb-2 h-5 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="mt-1 h-4 w-2/3" />
      </div>

      {/* Footer skeleton */}
      <div className="flex items-center justify-between border-t pt-3">
        <div className="flex items-center gap-1.5">
          <Skeleton className="h-6 w-6 rounded-full" />
          <Skeleton className="h-3 w-20" />
        </div>
        <div className="flex items-center gap-1.5">
          <Skeleton className="h-3 w-3" />
          <Skeleton className="h-3 w-14" />
        </div>
      </div>
    </Card>
  );
};
