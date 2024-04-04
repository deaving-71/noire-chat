"use client"

import { useCallback, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSocket } from "@/context/socket"
import { Notifications, PrivateChatMessage } from "@/types"
import { useQueryClient } from "@tanstack/react-query"
import { produce } from "immer"
import ScrollToBottom from "react-scroll-to-bottom"
import { z } from "zod"

import logger from "@/lib/logger"
import { generateRandomNumber } from "@/lib/utils"
import { allPrivateChatsValidator } from "@/lib/validators/private-chat"
import {
  useGetNotificationsQuery,
  useUpdateNotificationsMutation,
} from "@/hooks/notifications"
import { useGetPrivateChatQuery } from "@/hooks/private_chats"
import { useGetProfileQuery } from "@/hooks/profile"
import { ChatInput, ChatMessage, Header, Section } from "@/components/chat_app/"

import { Icons } from "../icons"
import { ChatSkeleton } from "../skeletons"

type ChatBoxProps = { id: string }

export function ChatBox({ id }: ChatBoxProps) {
  const queryClient = useQueryClient()
  const router = useRouter()

  const { data: chat, isLoading, error } = useGetPrivateChatQuery(id)
  const { data: user } = useGetProfileQuery()
  const { data: notifications } = useGetNotificationsQuery()

  const { mutate: updateNotifications } = useUpdateNotificationsMutation({
    onSuccess: (data) => {
      queryClient.setQueryData<Notifications>(["notifications"], data)
    },
  })
  const { ws } = useSocket()

  const isCurrentUserSender = user.profile.id === chat?.senderId

  const receiverUsername = isCurrentUserSender
    ? chat?.receiver.username
    : chat?.sender.username

  const markMessageAsRead = useCallback(() => {
    if (chat && notifications.privateChats.includes(chat.id))
      updateNotifications(chat.id)
  }, [chat?.id])

  const sendMessage = useCallback(
    (content: string) => {
      if (!chat) return

      const isCurrentUserSender = user.profile.id === chat.senderId
      const receiverId = isCurrentUserSender ? chat.receiverId : chat.senderId

      const messageId = generateRandomNumber()
      ws?.sendPrivateMessage({ receiverId, content, messageId })

      const prevChatData = queryClient.getQueryData<typeof chat>([
        "private_chat",
        id,
      ])

      if (!prevChatData) return

      const message: PrivateChatMessage = {
        id: messageId,
        senderId: isCurrentUserSender ? chat.senderId : chat.receiverId,
        privateChatId: chat.id,
        sender: user.profile,
        content,
        status: "pending",
      }

      queryClient.setQueryData(
        ["private_chat", id],
        produce(prevChatData, (draft) => {
          draft.messages.push(message)
        })
      )
    },
    [chat?.id]
  )

  useEffect(() => {
    if (!chat) return

    ws?.socket.on(
      "private-chat:message-received",
      (message: PrivateChatMessage, messageId: number) => {
        if (message.privateChatId !== chat.id) return

        const prevChat = queryClient.getQueryData<typeof chat>([
          "private_chat",
          id,
        ])
        if (!prevChat) return

        queryClient.setQueryData(
          ["private_chat", id],
          produce(prevChat, (draft) => {
            const msg = draft.messages.find(
              (message) => message.id === messageId
            )

            if (msg) {
              draft.messages.forEach((msg) => {
                if (msg.id !== messageId) return

                msg.id = message.id
                msg.status = "sent"
                msg.createdAt = message.createdAt
              })
            } else {
              draft.messages.push(message)
            }
          })
        )

        const prevAllPrivateChats = queryClient.getQueryData<
          z.infer<typeof allPrivateChatsValidator>
        >(["all_private_chats"])

        queryClient.setQueryData(
          ["all_private_chats"],
          produce(prevAllPrivateChats, (draft) => {
            draft?.forEach((chat) => {
              if (chat.id !== message.privateChatId) return

              chat.last_message = message
            })
          })
        )
      }
    )

    return () => {
      ws?.socket.off("private-chat:message-received")
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chat?.id])

  useEffect(() => {
    markMessageAsRead()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chat?.id])

  useEffect(() => {
    if (error) router.push("/app")
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [error])

  if (isLoading) return <ChatSkeleton />

  if (error) {
    return null
  }

  return (
    <Section className="grid h-dvh grid-rows-[1fr,52px]">
      <ScrollToBottom className="overflow-auto pb-4">
        <Header>
          <Icons.hashtag size={18} />
          <h1 className="text-lg font-bold lg:text-xl">{receiverUsername}</h1>
        </Header>
        {chat?.messages.map((message) => (
          <ChatMessage key={message.id} {...message} />
        ))}
      </ScrollToBottom>
      <ChatInput sendMessage={sendMessage} onInputFocus={markMessageAsRead} />
    </Section>
  )
}
