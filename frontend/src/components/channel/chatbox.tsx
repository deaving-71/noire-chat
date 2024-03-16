"use client"

import { useEffect } from "react"
import { useSocket } from "@/context/socket"
import { useChannel } from "@/stores/channels"
import { ChannelMessage } from "@/types"
import { useSuspenseQuery } from "@tanstack/react-query"
import ScrollToBottom from "react-scroll-to-bottom"

import { getChannel } from "@/lib/actions/client"

import { ChatInput, ChatMessage, Header, Section } from "../chat_app"
import { Icons } from "../icons"

export type ChatboxProps = {
  slug: string
}

export function Chatbox({ slug }: ChatboxProps) {
  const { data } = useSuspenseQuery({
    queryKey: ["channel", slug],
    queryFn: () => getChannel(slug),
  })
  const { setData, appendMessage, reset, messages } = useChannel()
  const { ws } = useSocket()

  function sendMessage(content: string) {
    ws?.sendChannelMessage({ slug, content })
  }

  useEffect(() => {
    setData(data)

    ws?.socket.on("channel:message-received", (message: ChannelMessage) => {
      console.log("message: ", message)

      if (message.channelId !== data.channel.id) return
      appendMessage(message)
    })

    return () => {
      ws?.socket.off("channel:message-received")
      reset()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <Section className="grid h-dvh grid-rows-[1fr,52px]">
      <ScrollToBottom className="overflow-auto pb-4">
        <Header>
          <Icons.hashtag size={18} />
          <h1 className="text-lg font-bold lg:text-xl">{data.channel.name}</h1>
        </Header>
        {messages.map((message) => (
          <ChatMessage key={message.id} {...message} />
        ))}
      </ScrollToBottom>
      <ChatInput sendMessage={sendMessage} />
    </Section>
  )
}
