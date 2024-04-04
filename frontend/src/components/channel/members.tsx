"use client"

import { useEffect } from "react"
import { useSocket } from "@/context/socket"
import { User } from "@/types"
import { produce } from "immer"

import { useGetChannelQuery } from "@/hooks/channel"

import { Header, Section } from "../chat_app"
import { UserCard } from "../common"
import { queryClient } from "../providers/global_provider"
import { ListSkeleton } from "../skeletons"

type MembersProps = {
  slug: string
}

export function Members({ slug }: MembersProps) {
  const { data, isLoading, error } = useGetChannelQuery(slug)
  const { ws } = useSocket()

  useEffect(() => {
    if (!data) return

    ws?.socket.on("member-joined", (member: User, channelSlug: string) => {
      if (data.channel.slug !== channelSlug) return

      const baseData = queryClient.getQueryData<typeof data>(["channel", slug])

      if (!baseData) return

      queryClient.setQueryData(
        ["channel", slug],
        produce(baseData, (draft) => {
          draft.members.push(member)
        })
      )
    })

    ws?.socket.on(
      "member-update-status",
      (memberId: number, status: boolean) => {
        const baseData = queryClient.getQueryData<typeof data>([
          "channel",
          slug,
        ])
        if (!baseData) return
        const { channel } = data

        queryClient.setQueryData(
          ["channel", slug],
          produce(baseData, (draft) => {
            if (channel.owner.id === memberId) {
              draft.channel.owner.isOnline = status
              return
            }

            draft.members.forEach((member) => {
              if (member.id === memberId) {
                member.isOnline = status
              }
            })
          })
        )
      }
    )

    return () => {
      ws?.socket.off("member-joined")
      ws?.socket.off("member-status-updated")
    }
  }, [data?.channel.id])

  if (isLoading) {
    return <ListSkeleton />
  }

  if (error || !data) return

  const { channel, members } = data

  return (
    <Section className="sticky right-0 top-0 grid h-dvh">
      <div className="overflow-auto">
        <Header>
          <h2 className="text-lg font-bold lg:text-xl">Members</h2>
        </Header>
        <div className="p-1">
          <Member {...channel.owner} isOwner={true} />
          {/* ONLINE MEMBERS */}
          {members.map((member) => {
            if (member.isOnline) return <Member key={member.id} {...member} />
          })}
          {/* OFFLINE MEMBERS */}
          {members.map((member) => {
            if (!member.isOnline) return <Member key={member.id} {...member} />
          })}
        </div>
      </div>
    </Section>
  )
}

type MemberProps = Partial<User> & {
  isOwner?: boolean
}

// TODO: add profile preview
function Member({ isOwner = false, ...member }: MemberProps) {
  return (
    <UserCard.Root isOwner={isOwner}>
      <UserCard.Avatar
        src={`/assets/${member.avatar}`}
        alt="Avatar"
        size="sm"
        isOnline={member.isOnline}
      />
      <UserCard.Info username={member.username} />
    </UserCard.Root>
  )
}
