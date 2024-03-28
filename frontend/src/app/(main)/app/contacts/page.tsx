import { Suspense } from "react"

import { Contacts, FriendRequests } from "@/components/contacts"

export default function ContactsPage() {
  return (
    <main className="grid grid-cols-[70%,1fr] divide-x divide-border/40">
      <Suspense fallback={<div>Loading...</div>}>
        <Contacts />
        <FriendRequests />
      </Suspense>
    </main>
  )
}
