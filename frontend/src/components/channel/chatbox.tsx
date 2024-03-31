"use client"

import { useEffect } from "react"
import { useSocket } from "@/context/socket"
import { ChannelMessage } from "@/types"
import { useQueryClient } from "@tanstack/react-query"
import { produce } from "immer"
import ScrollToBottom from "react-scroll-to-bottom"

import logger from "@/lib/logger"
import { useGetChannelQuery, useMarkAsRead } from "@/hooks/channel"
import { useGetProfileQuery } from "@/hooks/profile"

import { ChatInput, ChatMessage, Header, Section } from "../chat_app"
import { Icons } from "../icons"

export type ChatboxProps = {
  slug: string
}

export function Chatbox({ slug }: ChatboxProps) {
  const { data } = useGetChannelQuery(slug)
  const { channel, messages } = data
  const queryClient = useQueryClient()

  const { data: user, refetch: refetchProfile } = useGetProfileQuery()
  const { channels } = user

  const currentChannel = channels?.find((ch) => ch.id === channel.id)

  const { mutate } = useMarkAsRead({
    onSuccess: () => {
      const lastMessage = messages.at(-1)
      console.log("lastMessage: ", lastMessage)

      if (lastMessage?.sender.id === user.profile.id) return
      refetchProfile()
    },
    onError: (error) => {
      logger.error("could not mark channel messages as read")
      logger.error(error)
    },
  })

  const { ws } = useSocket()

  function markAsRead() {
    if (!currentChannel || currentChannel.unreadMessages <= 0) return

    mutate(channel.id)
  }

  function sendMessage(content: string) {
    ws?.sendChannelMessage({ slug, content })
  }

  useEffect(() => {
    markAsRead()

    ws?.socket.on("channel:message-received", (message: ChannelMessage) => {
      if (message.channelId !== channel.id) return
      const baseData = queryClient.getQueryData<typeof data>(["channel", slug])
      if (!baseData) return

      queryClient.setQueryData(
        ["channel", slug],
        produce(baseData, (draft) => {
          draft.messages.push(message)
        })
      )

      refetchProfile()
    })

    return () => {
      ws?.socket.off("channel:message-received")
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <Section className="grid h-dvh grid-rows-[1fr,52px]">
      <ScrollToBottom className="overflow-auto pb-4">
        <Header>
          <Icons.hashtag size={18} />
          <h1 className="text-lg font-bold lg:text-xl">{channel.name}</h1>
        </Header>
        {messages.map((message) => (
          <ChatMessage key={message.id} {...message} />
        ))}
      </ScrollToBottom>
      <ChatInput sendMessage={sendMessage} onInputFocus={markAsRead} />
    </Section>
  )
}
