import Image from "next/image"
import Link from "next/link"
import { PrivateChatHistory } from "@/types"

import { cn, since } from "@/lib/utils"
import { useGetProfileQuery } from "@/hooks/profile"

import { StatusDot } from "../chat_app/status_dot"

type InboxContactProps = {
  chat: PrivateChatHistory
  seen: boolean
}

export function InboxContact({ chat, seen }: InboxContactProps) {
  const { data: user } = useGetProfileQuery()
  const { last_message } = chat

  const isCurrentUserSender = chat.senderId === user.profile.id
  const receiver = isCurrentUserSender ? chat.receiver : chat.sender

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
            <span
              className={cn(
                "font-bold",
                seen ? "text-foreground" : "text-foreground/50"
              )}
            >
              {receiver.username}
            </span>
            <span className="font-medium text-muted-foreground">
              {since(last_message.createdAt)}
            </span>
          </div>
          <div className="table w-full table-fixed">
            <p
              className={cn(
                "table-cell truncate",
                seen ? "text-foreground" : "text-foreground/50"
              )}
            >
              {last_message.sender.id === user.profile.id && "You: "}{" "}
              {last_message.content}
            </p>
          </div>
        </div>
      </div>
    </Link>
  )
}
