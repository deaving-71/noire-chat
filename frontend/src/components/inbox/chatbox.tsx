"use client"

import { useEffect, useState } from "react"
import { useSocket } from "@/context/socket"
import { Notifications, PrivateChatMessage } from "@/types"
import { useQueryClient } from "@tanstack/react-query"
import ScrollToBottom from "react-scroll-to-bottom"

import {
  useGetNotificationsQuery,
  useUpdateNotificationsMutation,
} from "@/hooks/notifications"
import { useGetPrivateChatQuery } from "@/hooks/private_chats"
import { useGetProfileQuery } from "@/hooks/profile"
import { ChatInput, ChatMessage, Header, Section } from "@/components/chat_app/"

import { Icons } from "../icons"

type ChatBoxProps = { id: string }

export function ChatBox({ id }: ChatBoxProps) {
  const { data: chat } = useGetPrivateChatQuery(id)
  const { data: user } = useGetProfileQuery()
  const { data: notifications } = useGetNotificationsQuery()
  const queryClient = useQueryClient()

  const { mutate: updateNotifications } = useUpdateNotificationsMutation({
    onSuccess: (data) => {
      console.log("data: ", data)

      queryClient.setQueryData<Notifications>(["notifications"], data)
    },
  })
  const { ws } = useSocket()

  const [messages, setMessages] = useState<PrivateChatMessage[]>(chat.messages)
  const isCurrentUserSender = user.profile?.id === chat.senderId

  const receiverUsername = isCurrentUserSender
    ? chat.receiver.username
    : chat.sender.username

  useEffect(() => {
    markMessageAsRead()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    ws?.socket.on(
      "private-chat:message-received",
      (message: PrivateChatMessage) => {
        if (message.privateChatId !== chat.id) return
        setMessages((prev) => [...prev, message])
      }
    )

    return () => {
      ws?.socket.off("private-chat:message-received")
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  /**
   *  when a chat is initiated a user is registered in db either as a sender or receiver
   * depending on whether they were the first one to send a message
   */
  function sendMessage(content: string) {
    const isCurrentUserSender = user.profile.id === chat.senderId
    const receiverId = isCurrentUserSender ? chat.receiverId : chat.senderId
    if (!receiverId) return

    ws?.sendPrivateMessage({ receiverId, content })
  }

  function markMessageAsRead() {
    if (notifications.privateChats.includes(chat.id))
      updateNotifications(chat.id)
  }

  return (
    <Section className="grid h-dvh grid-rows-[1fr,52px]">
      <ScrollToBottom className="overflow-auto pb-4">
        <Header>
          <Icons.hashtag size={18} />
          <h1 className="text-lg font-bold lg:text-xl">{receiverUsername}</h1>
        </Header>
        {messages.map((message) => (
          <ChatMessage key={message.id} {...message} />
        ))}
      </ScrollToBottom>
      <ChatInput sendMessage={sendMessage} onInputFocus={markMessageAsRead} />
    </Section>
  )
}
