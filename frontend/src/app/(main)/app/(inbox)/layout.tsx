import { Suspense } from "react"

import { Inbox } from "@/components/inbox"
import { ListSkeleton } from "@/components/skeletons"

export default function InboxLayout({ children }: React.PropsWithChildren) {
  return (
    <main className="grid grid-cols-[70%,1fr] divide-x divide-secondary/40 bg-secondary">
      {children}
      <Suspense fallback={<ListSkeleton />}>
        <Inbox />
      </Suspense>
    </main>
  )
}
