"use client"

import Image from "next/image"
import { useSocket } from "@/context/socket"
import { useFriends } from "@/stores/friends"
import { User } from "@/types"

import logger from "@/lib/logger"

import { Icons } from "../icons"
import { Button } from "../ui/button"

type ContactUserProps = {
  requestId: number
  user: User
  type: "incoming" | "outgoing"
}

export function FriendRequest({ type, user, requestId }: ContactUserProps) {
  const { ws } = useSocket()
  const { appendFriend, removeRequest } = useFriends()

  return (
    <div className="group p-3 hover:bg-secondary/40">
      <div className="flex items-center justify-between">
        {/* CONTACT INFO */}
        <div className="flex items-center gap-3">
          <div className="flex items-center space-x-4">
            <span className="relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full">
              <Image
                className="aspect-square h-full w-full"
                alt="Image"
                src={`/assets/${user?.avatar}`}
                width={48}
                height={48}
              />
            </span>
            <div>
              <p className="text-sm font-medium leading-none">
                {user.username}
              </p>
              <p className="text-sm text-muted-foreground">{user.email}</p>
            </div>
          </div>
        </div>

        {/* ACTIONS */}
        <div className="hidden items-center gap-1 group-hover:flex">
          {type === "incoming" && (
            <Button
              className="size-9 rounded-full"
              variant="secondary"
              size="icon"
              onClick={() =>
                ws?.acceptFriendRequest(user.id, (payload) => {
                  if (payload.success) {
                    logger.info(payload.data)
                    const { user } = payload.data
                    removeRequest(requestId)
                    appendFriend(user)
                    logger.info("################################")
                  } else {
                    logger.error(payload.message)
                    logger.error(payload.errors)
                    logger.info("################################")
                  }
                })
              }
            >
              <Icons.checkmark size={18} />
            </Button>
          )}
          <Button
            className="size-9 rounded-full"
            variant="secondary"
            size="icon"
            onClick={() =>
              ws?.removeFriendRequest(user.id, (payload) => {
                if (payload.success) {
                  removeRequest(requestId)
                  logger.info(payload.data)
                  logger.info("################################")
                } else {
                  logger.error(payload.message)
                  logger.error(payload.errors)
                  logger.info("################################")
                }
              })
            }
          >
            <Icons.xmark />
          </Button>
        </div>
      </div>
    </div>
  )
}
