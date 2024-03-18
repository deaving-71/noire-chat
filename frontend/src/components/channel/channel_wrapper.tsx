"use client"

import { useEffect, useState } from "react"
import { useSocket } from "@/context/socket"
import { ChannelMessage } from "@/types"
import { useSuspenseQuery } from "@tanstack/react-query"

import { getChannel } from "@/lib/actions/client"
import logger from "@/lib/logger"

import { Chatbox } from "./chatbox"
import { Members } from "./members"

export function ChannelWrapper({ slug }: { slug: string }) {
  const { data } = useSuspenseQuery({
    queryKey: ["channel", slug],
    queryFn: () => getChannel(slug),
  })
  const [messages, setMessages] = useState<ChannelMessage[]>(data.messages)
  const { ws } = useSocket()

  function sendMessage(content: string) {
    ws?.sendChannelMessage({ slug, content })
  }

  useEffect(() => {
    ws?.socket.on("channel:message-received", (message: ChannelMessage) => {
      logger.info("message: ", message)

      if (message.channelId !== data.channel.id) return
      setMessages((state) => [...state, message])
    })

    return () => {
      ws?.socket.off("channel:message-received")
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <>
      <Chatbox
        name={data.channel.name}
        messages={messages}
        sendMessage={sendMessage}
      />
      <Members members={data.members} owner={data.channel.owner} />
    </>
  )
}
