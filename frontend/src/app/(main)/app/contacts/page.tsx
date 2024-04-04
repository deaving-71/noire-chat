import { Suspense } from "react"

import {
  Contacts,
  FriendRequests,
  LoadingSkeleton,
} from "@/components/contacts"

export default function ContactsPage() {
  return (
    <main className="grid grid-cols-[1fr,400px] divide-x divide-border/40">
      <Suspense fallback={<LoadingSkeleton />}>
        <Contacts />
        <FriendRequests />
      </Suspense>
    </main>
  )
}
