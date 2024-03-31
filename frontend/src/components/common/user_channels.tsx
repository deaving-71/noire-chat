import { useState } from "react"
import Link from "next/link"

import { useGetProfileQuery } from "@/hooks/profile"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

import { CreateChannelForm, JoinChannelForm } from "../channel"
import { Icons } from "../icons"
import { ScrollArea } from "../ui/scroll-area"
import { NotificationCount } from "./notification_count"

export function UserChannels() {
  const [open, setOpen] = useState(false)
  const { data: user, refetch } = useGetProfileQuery()

  return (
    <div className="grid grid-rows-[auto,calc(100dvh-280px)] space-y-2">
      <div className="flex items-center justify-between">
        <h2 className="px-3 font-normal leading-3 tracking-normal text-muted-foreground">
          Channels
        </h2>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger className="grid size-4 place-content-center rounded-full p-2.5 hover:bg-secondary/40">
            <Icons.plus size={14} />
          </DialogTrigger>
          <DialogContent>
            <Tabs defaultValue="join" className="mt-5">
              <TabsList className="w-full *:basis-1/2">
                <TabsTrigger value="join">Join a channel</TabsTrigger>
                <TabsTrigger value="create">Create a channel</TabsTrigger>
              </TabsList>
              <TabsContent value="join">
                <JoinChannelForm setOpen={setOpen} />
              </TabsContent>
              <TabsContent value="create">
                <CreateChannelForm setOpen={setOpen} />
              </TabsContent>
            </Tabs>
          </DialogContent>
        </Dialog>
      </div>
      <ScrollArea>
        <ul className="overflow-auto">
          {user.channels.map((channel) => (
            <li key={channel.slug}>
              <TooltipProvider delayDuration={400}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    {/* //TODO: fix props from the asChild comp to be passed correctly */}
                    <Link
                      href={`/app/channel/${channel.slug}`}
                      className="grid grid-cols-[1fr,auto] gap-2 rounded-md px-3 py-1 hover:bg-muted aria-[current=true]:text-primary"
                    >
                      <div className="flex items-center gap-[1ch]">
                        <Icons.hashtag size={14} />
                        <span className="block truncate">{channel.name}</span>
                      </div>
                      {channel.unreadMessages !== 0 && (
                        <NotificationCount count={channel.unreadMessages} />
                      )}
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent side="right" className="z-20 bg-background">
                    <p>{channel.name}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </li>
          ))}
        </ul>
      </ScrollArea>
    </div>
  )
}
