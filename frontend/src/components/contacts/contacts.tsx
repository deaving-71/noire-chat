"use client"

import { useEffect } from "react"
import { useSocket } from "@/context/socket"
import { useFriends } from "@/stores/friends"
import { IncomingFriendRequest, User } from "@/types"

import { Header, Section } from "../chat_app"
import { ContactList } from "./contact_list"

export function Contacts() {
  const { ws } = useSocket()
  const { appendIncomingRequest, removeRequest, appendFriend, reset } =
    useFriends()

  useEffect(() => {
    ws?.socket.on("friend-request:received", (data: IncomingFriendRequest) =>
      appendIncomingRequest(data)
    )

    ws?.socket.on(
      "friend-request:accepted",
      ({ requestId, user }: { user: User; requestId: number }) => {
        appendFriend(user)
        removeRequest(requestId)
      }
    )

    ws?.socket.on("friend-request:removed", (requestId: number) => {
      console.log("requestId: ", requestId)
      return removeRequest(requestId)
    })

    return () => {
      ws?.socket.off("friend-request:received")
      ws?.socket.off("friend-request:accepted")
      ws?.socket.off("friend-request:removed")
      reset()
    }
  }, [])

  return (
    <Section>
      <Header className="sticky top-0 z-10 saturate-150 backdrop-blur-lg">
        <h1 className="text-lg font-bold lg:text-xl">Contacts</h1>
      </Header>

      <ContactList />
    </Section>
  )
}
