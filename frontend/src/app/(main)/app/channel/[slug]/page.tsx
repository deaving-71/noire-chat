import { Suspense } from "react"

import { ChannelWrapper } from "@/components/channel/channel_wrapper"

export default function ChannelPage({
  params: { slug },
}: {
  params: { slug: string }
}) {
  return (
    <main className="grid grid-cols-[1fr,300px] divide-x divide-secondary/40 bg-secondary">
      <Suspense fallback={"Loading..."}>
        <ChannelWrapper slug={slug} />
      </Suspense>
    </main>
  )
}
