"use client"

import { useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useSocket } from "@/context/socket"
import { useQueryClient } from "@tanstack/react-query"
import { produce } from "immer"
import { z } from "zod"

import logger from "@/lib/logger"
import { cn } from "@/lib/utils"
import { profileValidator } from "@/lib/validators/user"
import { useSignOut } from "@/hooks/auth"
import { useGetProfileQuery } from "@/hooks/profile"

import { Icons } from "../icons"
import { MainNavLinks } from "./main_nav_links"
import { UserChannels } from "./user_channels"

export function Sidebar() {
  const queryClient = useQueryClient()
  const { ws } = useSocket()
  const router = useRouter()

  const { mutate: signOut } = useSignOut({
    onSuccess: () => {
      logger.info("logged out")
      router.push("/")
    },
    onError: (error) => {
      logger.error("failed to log out")
      logger.error(error)
    },
  })

  useEffect(() => {
    ws?.socket.on("notification", (data) =>
      queryClient.setQueryData(["notifications"], data)
    )

    return () => {
      ws?.socket.off("notification")
    }
  }, [])

  return (
    <aside className="sticky bottom-0 left-0 top-0 flex h-dvh flex-col justify-between border-r border-border/40 bg-background px-2 py-4">
      <div className="space-y-8">
        <UserInfo />
        <MainNavLinks />
        <UserChannels />
      </div>
      <div className="flex items-center pb-2 text-muted-foreground *:basis-1/3">
        <Link
          href={"#"}
          className="inline-flex items-center justify-center transition-all hover:text-foreground"
        >
          <Icons.github size={16} />
        </Link>
        <button
          type="button"
          className="inline-flex items-center justify-center transition-all hover:text-foreground"
          onClick={() => signOut()}
        >
          <Icons.logout size={16} />
        </button>
        <Link
          href={"#"}
          className="inline-flex items-center justify-center transition-all hover:text-foreground"
        >
          <Icons.settings size={16} />
        </Link>
      </div>
    </aside>
  )
}

function UserInfo() {
  const { isConnected } = useSocket()

  const { data } = useGetProfileQuery()
  const { profile } = data

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
