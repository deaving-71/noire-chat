import Image from "next/image"
import { PrivateChatMessage, User } from "@/types"
import dayjs from "dayjs"

type ChatMessageProps = {
  id: number
  content: string
  createdAt: string
  sender: User
}

export function ChatMessage(message: ChatMessageProps) {
  return (
    <div className="px-3 py-1.5 hover:bg-secondary/60">
      <div className="flex gap-3">
        <Image
          className="size-12 rounded-full object-contain object-center"
          src={`/assets/${message.sender.avatar}`}
          alt={"User Avatar"}
          width={40}
          height={40}
        />
        <div>
          <div>
            <span className="font-bold">{message.sender.username}</span>{" "}
            <span className="font-medium text-muted-foreground">
              {dayjs(message.createdAt).format("HH:mm")}
            </span>
          </div>
          <pre className="text-pretty font-[inherit]">{message.content}</pre>
        </div>
      </div>
    </div>
  )
}
