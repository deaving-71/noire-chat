import Image, { ImageProps } from "next/image"

import { cn } from "@/lib/utils"

import { StatusDot } from "../chat_app"
import { Badge } from "../ui/badge"

type UserCardProps = React.ComponentPropsWithoutRef<"button"> & {
  isOwner?: boolean
}

function Root({ className, children, isOwner, ...props }: UserCardProps) {
  return (
    <button
      {...props}
      type="button"
      className={cn(
        "flex w-full items-center justify-between rounded-sm p-1 hover:bg-secondary/40",
        className
      )}
    >
      <div className="flex items-center gap-3">{children}</div>
      {isOwner && (
        <Badge
          variant="default"
          className="bg-blue-500 text-foreground hover:bg-blue-500"
        >
          Owner
        </Badge>
      )}
    </button>
  )
}

export type UserAvatarProps = ImageProps & {
  /**
   * default is md
   * sm = size 8
   * md = size 10
   * lg = size 12
   */
  size?: "sm" | "md" | "lg"
  isOnline?: boolean
}

function Avatar({
  className,
  isOnline,
  size = "md",
  ...props
}: UserAvatarProps) {
  let dimensions
  switch (size) {
    case "sm":
      dimensions = { width: 32, height: 32 }
      break
    case "md":
      dimensions = { width: 40, height: 40 }
      break
    case "lg":
      dimensions = { width: 48, height: 48 }
      break
    default:
      dimensions = { width: 40, height: 40 }
      break
  }

  return (
    <div
      className={cn(
        "relative inline-block",
        size === "sm" && "basis-8",
        size === "md" && "basis-10",
        size === "lg" && "basis-12"
      )}
    >
      {/* //? Props are being passes down */}
      {/* eslint-disable-next-line jsx-a11y/alt-text */}
      <Image
        {...props}
        {...dimensions}
        className={cn(
          "aspect-square h-full w-full object-contain object-center rounded-full",
          className
        )}
      />
      {isOnline !== undefined && <StatusDot status={isOnline} />}
    </div>
  )
}

export type UserInfoProps = {
  username?: string
  email?: string
}

function Info({ email, username }: UserInfoProps) {
  return (
    <div className="text-start *:block">
      {username && <p className="truncate text-sm font-medium">{username}</p>}
      {email && <p className="truncate text-muted-foreground">{email}</p>}
    </div>
  )
}
export const UserCard = { Info, Avatar, Root }
