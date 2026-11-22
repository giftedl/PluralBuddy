import { Skeleton } from "../ui/skeleton";

export function SystemSkeleton() {
  return (
    <>
      <Skeleton className="rounded-none h-[250px] w-full rounded-b-lg " />
      <div className="flex gap-6 p-6 max-lg:flex-col lg:justify-between">
        <div className="flex items-start gap-4">
          <Skeleton className="min-w-20 min-h-20 rounded-full" />
          <div className="flex flex-col gap-2 w-full">
            <h2 className="text-xl font-medium w-full">
              <Skeleton className="h-4 sm:w-[250px]" />
            </h2>
            <p>
              <Skeleton className="h-16 sm:w-[400px]" />
            </p>
          </div>
        </div>
        <Skeleton className="h-[140px] w-[250px] max-lg:w-full" />
      </div>
    </>
  );
}
