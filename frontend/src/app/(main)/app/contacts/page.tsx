import { Suspense } from "react"
import { FriendContextProvider } from "@/context/friends_context"

import { Contacts, FriendRequests } from "@/components/contacts"

export default function page() {
  return (
    <main className="grid grid-cols-[70%,1fr] divide-x divide-border/40">
      <Suspense fallback={<div>Loading...</div>}>
        <FriendContextProvider>
          <Contacts />
          <FriendRequests />
        </FriendContextProvider>
      </Suspense>
    </main>
  )
}
