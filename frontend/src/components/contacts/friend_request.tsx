"use client"

import Image from "next/image"
import { FriendRequests, FriendsList, User } from "@/types"
import { useQueryClient } from "@tanstack/react-query"
import toast from "react-hot-toast"

import { appendFriend, popFriendRequest } from "@/lib/actions/friend_requests"
import { errorHandler } from "@/lib/error_handler"
import {
  useAcceptFriendRequest,
  useDeleteFriendRequest,
} from "@/hooks/friend_requests"
import { useGetFriendsQuery } from "@/hooks/friends"
import { useGetNotificationsQuery } from "@/hooks/notifications"

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
  const { data } = useGetFriendsQuery()
  const notifications = useGetNotificationsQuery()

  const acceptFriendRequest = useAcceptFriendRequest({
    onSuccess: async (newFriend) => {
      queryClient.setQueryData<typeof data>(["friends"], () => {
        const updatedFriendsData = popFriendRequest(data, requestId)
        return appendFriend(updatedFriendsData, newFriend)
      })
      await notifications.refetch()
      toast.success("Friend request accepted")
    },
    onError: (error) => {
      errorHandler(error)
    },
  })

  const removeFriendRequest = useDeleteFriendRequest({
    onSuccess: async () => {
      queryClient.setQueryData<typeof data>(
        ["friends"],
        popFriendRequest(data, requestId)
      )
      await notifications.refetch()
      toast.success("Friend request rejected")
    },
    onError: (error) => {
      errorHandler(error)
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
              onClick={() => acceptFriendRequest.mutate(user.id)}
              disabled={
                acceptFriendRequest.isPending && removeFriendRequest.isPending
              }
            >
              {acceptFriendRequest.isPending ? (
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
              removeFriendRequest.mutate({
                userId: user.id,
                isSender: type === "outgoing",
              })
            }
            disabled={
              acceptFriendRequest.isPending && removeFriendRequest.isPending
            }
          >
            {removeFriendRequest.isPending ? (
              <LoadingSpinner />
            ) : (
              <Icons.xmark />
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}
