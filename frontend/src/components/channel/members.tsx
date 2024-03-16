"use client"

import { useChannel } from "@/stores/channels"
import { User } from "@/types"

import { Header, Section } from "../chat_app"
import { UserCard } from "../common"

export function Members() {
  const { members, channel } = useChannel()
  return (
    <Section className="sticky right-0 top-0 grid h-dvh">
      <div className="overflow-auto">
        <Header>
          <h2 className="text-lg font-bold lg:text-xl">Members</h2>
        </Header>
        <div className="p-1">
          <Member {...channel?.owner} isOwner={true} />
          {members.online.map((member) => (
            <Member key={member.id + "on"} {...member} />
          ))}
          {members.offline.map((member) => (
            <div key={member.id + "off"} className="opacity-70">
              <Member key={member.id + "off"} {...member} />
            </div>
          ))}
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
