"use client"

import { useEffect } from "react"
import { useSocket } from "@/context/socket"
import { User } from "@/types"
import { useQueryClient } from "@tanstack/react-query"
import { produce } from "immer"

import { useGetNotificationsQuery } from "@/hooks/notifications"
import { useGetAllPrivateChats } from "@/hooks/private_chats"

import { Header, Section } from "../chat_app"
import { InboxContact } from "./inbox_contact"

export function Inbox() {
  const { data: chats, refetch: refetchAllPrivateChats } =
    useGetAllPrivateChats()
  const { data: notifications } = useGetNotificationsQuery()
  const queryClient = useQueryClient()
  const { ws } = useSocket()

  useEffect(() => {
    ws?.socket.on("friend-connected", (user: User) => {
      const baseData = queryClient.getQueryData<typeof chats>([
        "all_private_chats",
      ])

      if (!baseData) return

      queryClient.setQueryData(
        ["all_private_chats"],
        produce(baseData, (draft) => {
          draft.forEach((chat) => {
            if (chat.receiver.id === user.id) {
              chat.receiver.isOnline = true
            }

            if (chat.sender.id === user.id) {
              chat.sender.isOnline = true
            }
          })
        })
      )
    })

    ws?.socket.on("friend-disconnected", (user: User) => {
      const baseData = queryClient.getQueryData<typeof chats>([
        "all_private_chats",
      ])

      if (!baseData) return

      queryClient.setQueryData(
        ["all_private_chats"],
        produce(baseData, (draft) => {
          draft.forEach((chat) => {
            if (chat.receiver.id === user.id) {
              chat.receiver.isOnline = false
            }

            if (chat.sender.id === user.id) {
              chat.sender.isOnline = false
            }
          })
        })
      )
    })

    return () => {
      ws?.socket.off("friend-connected")
      ws?.socket.off("friend-disconnected")
    }
  }, [])

  useEffect(() => {
    refetchAllPrivateChats()
  }, [notifications.privateChats])

  return (
    <Section className="sticky right-0 top-0 grid h-dvh">
      <div className="overflow-auto">
        <Header>
          <h2 className="text-lg font-bold lg:text-xl">Inbox</h2>
        </Header>
        {chats.map((chat: any) => (
          <InboxContact
            key={chat.id}
            chat={chat}
            seen={notifications.privateChats.includes(chat.id)}
          />
        ))}
      </div>
    </Section>
  )
}
