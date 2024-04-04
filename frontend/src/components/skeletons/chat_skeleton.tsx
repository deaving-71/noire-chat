import { cn } from "@/lib/utils"

import { Header, Section } from "../chat_app"
import { Skeleton } from "../ui/skeleton"

export function ChatSkeleton() {
  return (
    <Section>
      <Header>
        <Skeleton className="h-4 w-[250px]" />
      </Header>
      <div>
        <ChatMessageSkeleton size="lg" />
        <ChatMessageSkeleton size="md" />
        <ChatMessageSkeleton size="lg" />
        <ChatMessageSkeleton size="sm" />
        <ChatMessageSkeleton size="md" />
        <ChatMessageSkeleton size="sm" />
        <ChatMessageSkeleton size="lg" />
      </div>
    </Section>
  )
}

type ChatMessageSkeletonProps = {
  size?: "sm" | "md" | "lg"
}
function ChatMessageSkeleton({ size = "md" }: ChatMessageSkeletonProps) {
  return (
    <div className="px-3 py-1.5 hover:bg-secondary/60">
      <div className="flex gap-3">
        <Skeleton className="size-12 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-[150px]" />
          <Skeleton
            className={cn(
              "h-4",
              size === "sm" && "w-[200px]",
              size === "md" && "w-[350px]",
              size === "lg" && "w-[450px]"
            )}
          />
        </div>
      </div>
    </div>
  )
}
