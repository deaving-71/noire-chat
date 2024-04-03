import React from "react"
import Link, { LinkProps } from "next/link"

import { cn } from "@/lib/utils"

type NavLinkItemProps = LinkProps & React.ComponentPropsWithoutRef<"a">

export function NavLinkItem({ className, ...props }: NavLinkItemProps) {
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
