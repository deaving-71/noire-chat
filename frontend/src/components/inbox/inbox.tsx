"use client"

import { useGetNotificationsQuery } from "@/hooks/notifications"
import { useInbox } from "@/hooks/useInbox"

import { Header, Section } from "../chat_app"
import { InboxContact } from "./inbox_contact"

export function Inbox() {
  const { data: chats } = useInbox()
  const { data: notifications } = useGetNotificationsQuery()

  return (
    <Section className="sticky right-0 top-0 grid h-dvh">
      <div className="overflow-auto">
        <Header>
          <h2 className="text-lg font-bold lg:text-xl">Inbox</h2>
        </Header>
        {chats.map((chat: any) => (
          <InboxContact
            key={chat.id}
            chat={chat}
            seen={notifications.privateChats.includes(chat.id)}
          />
        ))}
      </div>
    </Section>
  )
}
