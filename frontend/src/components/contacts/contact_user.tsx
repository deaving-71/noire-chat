"use client"

import Image from "next/image"
import { useRouter } from "next/navigation"
import { User } from "@/types"

import { initiateChat } from "@/lib/actions/client"

import { Icons } from "../icons"
import { Button } from "../ui/button"

type ContactUserProps = User

export function ContactUser(user: ContactUserProps) {
  const router = useRouter()

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
