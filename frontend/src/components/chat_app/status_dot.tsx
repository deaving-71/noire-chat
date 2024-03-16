import { cn } from "@/lib/utils"

type StatusDotProps = {
  status: boolean
}

export function StatusDot({ status }: StatusDotProps) {
  return (
    <span
      className={cn(
        "absolute bottom-0 right-1 z-[2] block size-2 rounded-full",
        status ? "bg-green-500" : "bg-gray-500"
      )}
    ></span>
  )
}
