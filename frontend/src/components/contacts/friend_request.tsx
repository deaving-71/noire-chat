"use client"

import Image from "next/image"
import { useFriendsContext } from "@/context/friends_context"
import { User } from "@/types"
import { useMutation } from "@tanstack/react-query"

import { acceptFriendRequest, removeFriendRequest } from "@/lib/actions/client"

import { LoadingSpinner } from "../common"
import { Icons } from "../icons"
import { Button } from "../ui/button"

type ContactUserProps = {
  requestId: number
  user: User
  type: "incoming" | "outgoing"
}

export function FriendRequest({ type, user, requestId }: ContactUserProps) {
  const { removeRequest, appendFriend } = useFriendsContext()

  const { mutate: accept, isPending: isAcceptancePending } = useMutation({
    mutationKey: ["friend_request", "accept"],
    mutationFn: acceptFriendRequest,
    onSuccess: (user) => {
      appendFriend(user)
      removeRequest(requestId)
    },
  })

  const { mutate: remove, isPending: isRemovalPending } = useMutation({
    mutationKey: ["friend_request", "destroy"],
    mutationFn: removeFriendRequest,
    onSuccess: () => removeRequest(requestId),
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
              onClick={() => accept(user.id)}
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
            onClick={() => remove(user.id)}
            disabled={isAcceptancePending && isRemovalPending}
          >
            {isRemovalPending ? <LoadingSpinner /> : <Icons.xmark />}
          </Button>
        </div>
      </div>
    </div>
  )
}
