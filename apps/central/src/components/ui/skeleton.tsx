import { cn } from "cn";

function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("animate-pulse rounded-md bg-primary/10 border", className)} {...props} />
  );
}

export { Skeleton };
