"use client"

import { useSuspenseQuery } from "@tanstack/react-query"

import { getPrivateChats } from "@/lib/actions/client"
import logger from "@/lib/logger"

import { Header, Section } from "../chat_app"
import { InboxContact } from "./inbox_contact"

export function Inbox() {
  const { data: chats } = useSuspenseQuery({
    queryKey: ["private_chats"],
    queryFn: getPrivateChats,
  })

  logger.info("inbox:", chats)

  return (
    <Section className="sticky right-0 top-0 grid h-dvh">
      <div className="overflow-auto">
        <Header>
          <h2 className="text-lg font-bold lg:text-xl">Inbox</h2>
        </Header>
        {chats.map((chat: any) => (
          <InboxContact key={chat.id} chat={chat} />
        ))}
      </div>
    </Section>
  )
}
