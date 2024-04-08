import { Channel } from "@/types"
import dayjs from "dayjs"
import toast from "react-hot-toast"

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

import { Icons } from "../icons"

type ChannelInfoProps = {
  channel: Channel
  membersCount: number
}
export function ChannelInfo({ channel, membersCount }: ChannelInfoProps) {
  return (
    <Popover>
      <PopoverTrigger>
        <Icons.info
          className="rounded-full bg-secondary/40 text-muted-foreground transition-all hover:text-foreground"
          size={24}
        />
      </PopoverTrigger>
      <PopoverContent className="p-0">
        <h2 className="border-b py-1 text-center">{channel.name}</h2>
        <div className="space-y-1 p-4 text-sm text-muted-foreground">
          <p>Owner: {channel.owner.username}</p>
          <p>
            Channel ID:&nbsp;
            <code>{channel.slug}</code>&nbsp;
            <button
              onClick={() => {
                navigator.clipboard.writeText(channel.slug)
                toast.success("Coppied to clipboard")
              }}
            >
              {<Icons.copy className="inline align-middle" size={14} />}
            </button>
          </p>
          <p>Members: {membersCount}</p>
          <p>
            Created At:&nbsp;
            <span className="tracking-tight">
              {dayjs(channel.createdAt).format("MMM DD, YYYY")}
            </span>
          </p>
        </div>
      </PopoverContent>
    </Popover>
  )
}
