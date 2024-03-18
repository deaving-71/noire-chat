import Image from "next/image"
import Link from "next/link"
import { useUser } from "@/stores/user"
import { PrivateChatHistory } from "@/types"

import { since } from "@/lib/utils"

import { StatusDot } from "../chat_app/status_dot"

type InboxContactProps = {
  chat: PrivateChatHistory
}

export function InboxContact({ chat }: InboxContactProps) {
  const { profile } = useUser()
  const { last_message } = chat

  const senderIsCurrentUser = chat.sender.id === profile?.id
  const receiver = senderIsCurrentUser ? chat.receiver : chat.sender

  return (
    <Link
      href={`/app/inbox/${chat.id}`}
      className="block p-3 hover:bg-secondary/60"
    >
      <div className="flex gap-3">
        <div className="inline-block basis-12">
          <div className="relative rounded-full bg-secondary">
            <Image
              className="size-12 rounded-full object-contain object-center"
              src={`/assets/${receiver.avatar}`}
              alt={"User Avatar"}
              width={48}
              height={48}
            />
            <StatusDot status={receiver.isOnline} />
          </div>
        </div>

        <div className="flex-1">
          <div className="flex items-center justify-between">
            <span className="font-bold">{receiver.username}</span>{" "}
            <span className="font-medium text-muted-foreground">
              {since(last_message.createdAt)}
            </span>
          </div>
          <div className="table w-full table-fixed">
            <p className="table-cell truncate">
              {senderIsCurrentUser && "You: "} {last_message.content}
            </p>
          </div>
        </div>
      </div>
    </Link>
  )
}
