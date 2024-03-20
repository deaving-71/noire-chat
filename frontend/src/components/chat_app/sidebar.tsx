"use client"

import Image from "next/image"
import Link, { LinkProps } from "next/link"
import { useSocket } from "@/context/socket"
import { useSuspenseQuery } from "@tanstack/react-query"

import { getUser } from "@/lib/actions/client"
import { cn } from "@/lib/utils"
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

export function Sidebar() {
  const { data, refetch } = useSuspenseQuery({
    queryKey: ["user"],
    queryFn: getUser,
  })
  const { channels } = data

  return (
    <aside className="sticky bottom-0 left-0 top-0 h-dvh space-y-8 border-r border-border/40 bg-background px-2 py-4">
      <UserInfo />
      <ul className="space-y-1">
        <li>
          <NavLinkItem href="/app">
            <Icons.inbox size={16} /> Inbox
          </NavLinkItem>
        </li>
        <li>
          <NavLinkItem href="/app/contacts">
            <Icons.people size={16} /> Contacts
          </NavLinkItem>
        </li>
      </ul>
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h2 className="px-3 font-normal leading-3 tracking-normal text-muted-foreground">
            Channels
          </h2>
          <Dialog>
            <DialogTrigger className="grid size-4 place-content-center rounded-full p-2.5 hover:bg-secondary/40">
              <Icons.plus size={14} />
            </DialogTrigger>
            <DialogContent>
              <Tabs defaultValue="join" className="w-full">
                <TabsList>
                  <TabsTrigger value="join">Join a channel</TabsTrigger>
                  <TabsTrigger value="create">Create a channel</TabsTrigger>
                </TabsList>
                <TabsContent value="join">
                  <JoinChannelForm refetch={refetch} />
                </TabsContent>
                <TabsContent value="create">
                  <CreateChannelForm refetch={refetch} />
                </TabsContent>
              </Tabs>
            </DialogContent>
          </Dialog>
        </div>
        <ul>
          {channels.map((channel) => (
            <li key={channel.slug}>
              <TooltipProvider delayDuration={400}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    {/* //TODO: fix props from the asChild comp to be passed correctly */}
                    <Link
                      href={`/app/channel/${channel.slug}`}
                      className="flex items-center gap-2 rounded-md px-3 py-1 hover:bg-muted aria-[current=true]:text-primary"
                    >
                      <Icons.hashtag size={14} />
                      <span className="block truncate">{channel.name}</span>
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
      </div>
    </aside>
  )
}

function UserInfo() {
  const { isConnected } = useSocket()

  const { data } = useSuspenseQuery({
    queryKey: ["user"],
    queryFn: getUser,
  })
  const { profile } = data

  console.log("data: ", data)
  return (
    <div className="flex gap-3">
      <Image
        className="size-12 rounded-full border-2 border-blue-600 object-contain object-center p-0.5 shadow-[0_0_15px_-6px_rgb(37,99,235)]"
        src={`/assets/${profile.avatar}`}
        alt={"User Avatar"}
        width={40}
        height={40}
      />
      <div className="space-y-2">
        <div className="font-medium">{profile.username}</div>
        <div
          className={cn(
            "inline-flex rounded-3xl px-2 py-0.5 leading-[1]  ring-1",
            isConnected
              ? "text-green-400 shadow-[0_0_15px_-5px_#22c55e] ring-green-400"
              : "text-gray-400 shadow-[0_0_15px_-5px_#9ca3af] ring-gray-400"
          )}
        >
          {isConnected ? "online" : "offline"}
        </div>
      </div>
    </div>
  )
}

type NavLinkItemProps = LinkProps & React.ComponentPropsWithoutRef<"a">

function NavLinkItem({ className, ...props }: NavLinkItemProps) {
  return (
    <Link
      {...props}
      className={cn(
        "flex items-center gap-2 rounded-md px-3 py-1 hover:bg-muted aria-[current=true]:text-primary",
        className
      )}
    />
  )
}
