"use client"

import { useEffect } from "react"
import { useSocket } from "@/context/socket"
import {
  FriendRequests,
  FriendsList,
  IncomingFriendRequest,
  User,
} from "@/types"
import { useQueryClient } from "@tanstack/react-query"
import { produce } from "immer"

import {
  appendFriend,
  appendIncomingFriendRequest,
  popFriendRequest,
} from "@/lib/actions/friend_requests"

import { Header, Section } from "../chat_app"
import { ContactList } from "./contact_list"

export function Contacts() {
  const { ws } = useSocket()
  const queryClient = useQueryClient()

  useEffect(() => {
    ws?.socket.on("friend-connected", (user: User) => {
      const baseData = queryClient.getQueryData<{
        friends: FriendsList
        friend_requests: FriendRequests
      }>(["friends"])

      if (baseData) {
        queryClient.setQueryData(["friends"], () => {
          const updatedData = produce(baseData, (draft) => {
            draft.friends.offline = draft.friends.offline.filter(
              (u) => u.id !== user.id
            )
          })
          return produce(updatedData, (draft) => {
            draft.friends.online = [...draft.friends.online, user]
          })
        })
      }
    })

    ws?.socket.on("friend-disconnected", (user: User) => {
      const baseData = queryClient.getQueryData<{
        friends: FriendsList
        friend_requests: FriendRequests
      }>(["friends"])

      if (baseData) {
        queryClient.setQueryData(["friends"], () => {
          const updatedData = produce(baseData, (draft) => {
            draft.friends.online = draft.friends.online.filter(
              (u) => u.id !== user.id
            )
          })
          return produce(updatedData, (draft) => {
            draft.friends.offline = [...draft.friends.offline, user]
          })
        })
      }
    })

    ws?.socket.on(
      "friend-request:received",
      (request: IncomingFriendRequest) => {
        const baseData = queryClient.getQueryData<{
          friends: FriendsList
          friend_requests: FriendRequests
        }>(["friends"])

        if (baseData) {
          queryClient.setQueryData(
            ["friends"],
            appendIncomingFriendRequest(baseData, request)
          )
        }
      }
    )

    ws?.socket.on(
      "friend-request:accepted",
      ({ requestId, newFriend }: { newFriend: User; requestId: number }) => {
        const baseData = queryClient.getQueryData<{
          friends: FriendsList
          friend_requests: FriendRequests
        }>(["friends"])

        if (baseData) {
          queryClient.setQueryData(["friends"], () => {
            const updatedData = popFriendRequest(baseData, requestId)
            return appendFriend(updatedData, newFriend)
          })
        }
      }
    )

    ws?.socket.on("friend-request:removed", (requestId: number) => {
      const baseData = queryClient.getQueryData<{
        friends: FriendsList
        friend_requests: FriendRequests
      }>(["friends"])

      if (baseData) {
        queryClient.setQueryData(
          ["friends"],
          popFriendRequest(baseData, requestId)
        )
      }
    })

    return () => {
      ws?.socket.off("friend-request:accepted")
      ws?.socket.off("friend-request:removed")
      ws?.socket.off("friend-request:received")
      ws?.socket.off("friend-connected")
      ws?.socket.off("friend-disconnected")
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
