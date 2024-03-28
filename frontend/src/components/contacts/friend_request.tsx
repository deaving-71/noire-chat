"use client"

import Image from "next/image"
import { FriendRequests, FriendsList, User } from "@/types"
import { useQueryClient } from "@tanstack/react-query"

import { appendFriend, popFriendRequest } from "@/lib/actions/friend_requests"
import {
  useAcceptFriendRequest,
  useDeleteFriendRequest,
} from "@/hooks/friend_requests"

import { LoadingSpinner } from "../common"
import { Icons } from "../icons"
import { Button } from "../ui/button"

type ContactUserProps = {
  requestId: number
  user: User
  type: "incoming" | "outgoing"
}

export function FriendRequest({ type, user, requestId }: ContactUserProps) {
  const queryClient = useQueryClient()

  const { mutate: acceptFriendRequest, isPending: isAcceptancePending } =
    useAcceptFriendRequest({
      onSuccess: (newFriend) => {
        const baseData = queryClient.getQueryData<{
          friends: FriendsList
          friend_requests: FriendRequests
        }>(["friends"])

        if (baseData)
          queryClient.setQueryData(["friends"], () => {
            const updatedData = popFriendRequest(baseData, requestId)
            return appendFriend(updatedData, newFriend)
          })
      },
    })

  const { mutate: removeFriendRequest, isPending: isRemovalPending } =
    useDeleteFriendRequest({
      onSuccess: () => {
        const baseData = queryClient.getQueryData<{
          friends: FriendsList
          friend_requests: FriendRequests
        }>(["friends"])

        if (baseData)
          queryClient.setQueryData(
            ["friends"],
            popFriendRequest(baseData, requestId)
          )
      },
    })

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
        <div className="flex items-center gap-1">
          {type === "incoming" && (
            <Button
              className="size-9 rounded-full"
              variant="secondary"
              size="icon"
              onClick={() => acceptFriendRequest(user.id)}
              disabled={isAcceptancePending && isRemovalPending}
            >
              {isAcceptancePending ? (
                <LoadingSpinner />
              ) : (
                <Icons.checkmark size={18} />
              )}
            </Button>
          )}
          <Button
            className="size-9 rounded-full"
            variant="secondary"
            size="icon"
            onClick={() =>
              removeFriendRequest({
                userId: user.id,
                isSender: type === "outgoing",
              })
            }
            disabled={isAcceptancePending && isRemovalPending}
          >
            {isRemovalPending ? <LoadingSpinner /> : <Icons.xmark />}
          </Button>
        </div>
      </div>
    </div>
  )
}
