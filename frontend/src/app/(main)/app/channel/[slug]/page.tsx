import { Suspense } from "react"

import { Chatbox, LoadingSkeleton, Members } from "@/components/channel"

export default function ChannelPage({
  params: { slug },
}: {
  params: { slug: string }
}) {
  return (
    <main className="grid grid-cols-[70%,1fr] divide-x divide-secondary/40 bg-secondary">
      <Suspense fallback={<LoadingSkeleton />}>
        <Chatbox slug={slug} />
        <Members slug={slug} />
      </Suspense>
    </main>
  )
}
