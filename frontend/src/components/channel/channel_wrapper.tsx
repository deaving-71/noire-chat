"use client"

import { useEffect, useState } from "react"
import { useSocket } from "@/context/socket"
import { Channel, ChannelMessage, User } from "@/types"
import { useQueryClient } from "@tanstack/react-query"

import logger from "@/lib/logger"
import { useGetChannelQuery, useMarkAsRead } from "@/hooks/channel"

import { Chatbox } from "./chatbox"
import { Members } from "./members"

export function ChannelWrapper({ slug }: { slug: string }) {
  const { data } = useGetChannelQuery(slug)
  const queryClient = useQueryClient()
  const { mutate: markAsRead } = useMarkAsRead({
    onSuccess: () => {
      const channels = queryClient.getQueryData<
        Omit<Channel & { unreadMessages: number }, "owner">[]
      >(["user"])
      if (!channels) return

      queryClient.setQueryData(
        ["user"],
        channels.map((channel) => {
          if (channel.slug === slug) {
            channel.unreadMessages = 0
          }

          return channel
        })
      )
    },
    onError: (error) => {
      logger.error("could not mark channel messages as read")
      logger.error(error)
    },
  })

  const [messages, setMessages] = useState<ChannelMessage[]>(data.messages)
  const [members, setMembers] = useState(data.members)

  const { ws } = useSocket()

  function sendMessage(content: string) {
    ws?.sendChannelMessage({ slug, content })
  }

  useEffect(() => {
    markAsRead(data.channel.id)

    ws?.socket.on("channel:message-received", (message: ChannelMessage) => {
      if (message.channelId !== data.channel.id) return
      setMessages((state) => [...state, message])
    })

    ws?.socket.on("member-joined", (member: User, channelSlug: string) => {
      if (data.channel.slug !== channelSlug) return

      setMembers((state) => {
        const newMembers = { ...state }
        member.isOnline
          ? (newMembers.online = [...newMembers.online, member])
          : (newMembers.offline = [...newMembers.offline, member])

        return newMembers
      })
    })

    ws?.socket.on("member-connected", (newMember: User) => {
      setMembers((members) => {
        const newMembers = { ...members }
        newMembers.offline = newMembers.offline.filter(
          (member) => member.id !== newMember.id
        )
        newMembers.online = [...newMembers.online, newMember]
        return newMembers
      })
    })

    ws?.socket.on("member-disconnected", (newMember: User) => {
      setMembers((members) => {
        const newMembers = { ...members }
        newMembers.online = newMembers.online.filter(
          (member) => member.id !== newMember.id
        )
        newMembers.offline = [...newMembers.offline, newMember]
        return newMembers
      })
    })

    return () => {
      ws?.socket.off("channel:message-received")
      ws?.socket.off("member-joined")
      ws?.socket.off("member-connected")
      ws?.socket.off("member-disconnected")
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
      <Members members={members} owner={data.channel.owner} />
    </>
  )
}
