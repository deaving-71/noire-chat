"use client"

import { ChannelMessage } from "@/types"
import ScrollToBottom from "react-scroll-to-bottom"

import {
  ChatInput,
  ChatMessage,
  Header,
  Section,
  type ChatInputProps,
} from "../chat_app"
import { Icons } from "../icons"

export type ChatboxProps = ChatInputProps & {
  name: string
  messages: ChannelMessage[]
}

export function Chatbox({ name, messages, sendMessage }: ChatboxProps) {
  return (
    <Section className="grid h-dvh grid-rows-[1fr,52px]">
      <ScrollToBottom className="overflow-auto pb-4">
        <Header>
          <Icons.hashtag size={18} />
          <h1 className="text-lg font-bold lg:text-xl">{name}</h1>
        </Header>
        {messages.map((message) => (
          <ChatMessage key={message.id} {...message} />
        ))}
      </ScrollToBottom>
      <ChatInput sendMessage={sendMessage} />
    </Section>
  )
}
