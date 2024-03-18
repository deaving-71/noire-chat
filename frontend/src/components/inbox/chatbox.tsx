"use client"

import { useCallback, useEffect, useState } from "react"
import { useSocket } from "@/context/socket"
import { useUser } from "@/stores/user"
import { PrivateChatMessage } from "@/types"
import { useSuspenseQuery } from "@tanstack/react-query"
import ScrollToBottom from "react-scroll-to-bottom"

import { getPrivateChat } from "@/lib/actions/client"
import logger from "@/lib/logger"
import { ChatInput, ChatMessage, Header, Section } from "@/components/chat_app/"

import { Icons } from "../icons"

type ChatBoxProps = { id: string }

export function ChatBox({ id }: ChatBoxProps) {
  const { data: chat } = useSuspenseQuery({
    queryKey: ["private_chat", id],
    queryFn: () => getPrivateChat(id),
  })

  const [messages, setMessages] = useState<PrivateChatMessage[]>(chat.messages)

  const { ws } = useSocket()
  const { profile } = useUser()

  const isCurrentUserSender = profile?.id === chat.senderId

  console.log(chat)
  const receiverUsername = isCurrentUserSender
    ? chat.receiver.username
    : chat.sender.username

  useEffect(() => {
    ws?.socket.on(
      "private-chat:message-received",
      (message: PrivateChatMessage) => {
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
  const sendMessage = useCallback((content: string) => {
    const isCurrentUserSender = profile?.id === chat?.senderId
    const receiverId = isCurrentUserSender ? chat?.receiverId : chat?.senderId
    if (!receiverId) return

    ws?.sendPrivateMessage({ receiverId, content }, (payload) => {
      if (payload.success) {
        console.log(chat)
        logger.info(payload.data)
        setMessages((prev) => [...prev, payload.data])
      } else {
        logger.error(payload.message)
        logger.error(payload?.errors)
      }
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

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
      <ChatInput sendMessage={sendMessage} />
    </Section>
  )
}
