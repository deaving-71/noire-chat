"use client"

import Image from "next/image"
import { useRouter } from "next/navigation"
import { User } from "@/types"

import { initiateChat } from "@/lib/actions/client"

import { UserCard } from "../common"
import { Icons } from "../icons"
import { Button } from "../ui/button"

type ContactUserProps = User

export function ContactUser(user: ContactUserProps) {
  const router = useRouter()

  return (
    <div className="group p-3 hover:bg-secondary/40">
      <div className="flex items-center justify-between">
        {/* CONTACT INFO */}
        <UserCard.Root className="hover:bg-transparent">
          <UserCard.Avatar
            src={`/assets/${user.avatar}`}
            alt="User Avatar"
            isOnline={user.isOnline}
          ></UserCard.Avatar>
          <UserCard.Info username={user.username} email={user.email} />
        </UserCard.Root>

        {/* ACTIONS */}
        <div className="hidden items-center gap-1 group-hover:flex">
          <Button
            className="size-9 rounded-full"
            variant="secondary"
            size="icon"
            onClick={async () => {
              const chatId = await initiateChat(user.id)
              router.push(`/app/inbox/${chatId}`)
            }}
          >
            <Icons.message size={18} />
          </Button>
          <Button
            className="size-9 rounded-full"
            variant="secondary"
            size="icon"
          >
            <Icons.tripleDot />
          </Button>
        </div>
      </div>
    </div>
  )
}
