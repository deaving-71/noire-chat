import { cn } from "@/lib/utils"

type NotificationCountProps = { count: number }

export function NotificationCount({ count }: NotificationCountProps) {
  return (
    <span
      className={cn(
        "inline-flex size-4 items-center justify-center rounded-full  p-1 text-[11px] text-foreground",
        count === 0 && "bg-secondary opacity-50",
        count > 0 && "bg-destructive/80"
      )}
    >
      {count}
    </span>
  )
}
