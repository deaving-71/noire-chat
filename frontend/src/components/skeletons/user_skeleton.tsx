import { cn } from "@/lib/utils"

import { Skeleton } from "../ui/skeleton"

type UserSkeletonProps = {
  size?: "md" | "lg"
}

export function UserSekeleton({ size = "md" }: UserSkeletonProps) {
  return (
    <div className="flex items-center gap-4">
      <Skeleton className="size-14 rounded-full" />
      <Skeleton
        className={cn(
          "h-4",
          size === "md" && "w-[250px]",
          size === "lg" && "w-[320px]"
        )}
      />
    </div>
  )
}
