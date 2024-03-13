import { Suspense } from "react"

import { Inbox } from "@/components/inbox"

export default function InboxLayout({ children }: React.PropsWithChildren) {
  return (
    <main className="grid grid-cols-[70%,1fr] divide-x divide-secondary/40 bg-secondary">
      <Suspense fallback={<div>Loading Chat box...</div>}>
        {children}
        <Inbox />
      </Suspense>
    </main>
  )
}
