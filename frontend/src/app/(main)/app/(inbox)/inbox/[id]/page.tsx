import { Suspense } from "react"

import { ChatBox } from "@/components/inbox/"

export default function ChatPage({ params }: { params: { id: string } }) {
  return (
    <Suspense fallback={"Loading..."}>
      <ChatBox id={params.id} />
    </Suspense>
  )
}
