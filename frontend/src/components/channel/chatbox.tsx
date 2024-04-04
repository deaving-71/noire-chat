"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
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
import { ChatSkeleton } from "../skeletons"

export type ChatboxProps = {
  slug: string
}

export function Chatbox({ slug }: ChatboxProps) {
  const { data, isLoading, error, isError } = useGetChannelQuery(slug)

  const queryClient = useQueryClient()
  const router = useRouter()

  const { data: user, refetch: refetchProfile } = useGetProfileQuery()
  const { channels } = user

  const { mutate } = useMarkAsRead({
    onSuccess: () => {
      const lastMessage = data?.messages.at(-1)

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
    if (!data) return

    const currentChannel = channels?.find((ch) => ch.id === data?.channel.id)

    if (!currentChannel || currentChannel.unreadMessages <= 0) return

    mutate(data.channel.id)
  }

  function sendMessage(content: string) {
    ws?.sendChannelMessage({ slug, content })
  }

  useEffect(() => {
    if (!data) return

    markAsRead()

    ws?.socket.on("channel:message-received", (message: ChannelMessage) => {
      if (message.channelId !== data.channel.id) return
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
  }, [data?.channel.id])

  useEffect(() => {
    if (isError) {
      logger.error(error)
      router.push("/app")
    }
  }, [isError])

  if (isLoading) {
    return <ChatSkeleton />
  }

  if (error || !data) return

  const { channel, messages } = data!

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
