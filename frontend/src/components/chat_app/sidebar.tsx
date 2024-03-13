"use client"

import { useEffect } from "react"
import Image from "next/image"
import Link, { LinkProps } from "next/link"
import { useSocket } from "@/context/socket"
import { useUser } from "@/stores/user"
import { useSuspenseQuery } from "@tanstack/react-query"

import { getUser } from "@/lib/actions/client"
import logger from "@/lib/logger"
import { cn } from "@/lib/utils"

import { Icons } from "../icons"

const channels = ["channel-1", "channel-2", "channel-3", "channel-4"]

/* 
! Channels are not implemented yet 
*/

export function Sidebar() {
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
        <h2 className="px-3 font-normal leading-3 tracking-normal text-muted-foreground">
          Channels
        </h2>
        <ul>
          {channels.map((channel) => (
            <li key={channel}>
              <NavLinkItem href="#">
                <Icons.hashtag size={14} /> {channel}
              </NavLinkItem>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  )
}

function UserInfo() {
  const { profile } = useUser()
  const { isConnected } = useSocket()

  const { data } = useSuspenseQuery({
    queryKey: ["userProfile"],
    queryFn: getUser,
  })

  const { setUser, setAuthenticated } = useUser()

  useEffect(() => {
    logger.info(data)
    setUser(data.profile)
    setAuthenticated(true)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="flex gap-3">
      <Image
        className="size-12 rounded-full border-2 border-blue-600 object-contain object-center p-0.5 shadow-[0_0_15px_-6px_rgb(37,99,235)]"
        src={`/assets/${profile?.avatar}`}
        alt={"User Avatar"}
        width={40}
        height={40}
      />
      <div className="space-y-2">
        <div className="font-medium">{profile?.username ?? "<NAME>"}</div>
        <div
          className={cn(
            "inline-flex rounded-3xl px-2 py-0.5 leading-[1] shadow-[0_0_15px_-5px_#22c55e] ring-1",
            isConnected
              ? "text-green-400 ring-green-400"
              : "text-gray-400 ring-gray-400"
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
