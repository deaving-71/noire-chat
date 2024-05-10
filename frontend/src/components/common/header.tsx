"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

import { sourceCodeLink } from "@/config/site"
import { cn } from "@/lib/utils"
import { useCheckAuthentication } from "@/hooks/auth"

import { Icons } from "../icons"
import { Button } from "../ui/button"

const navItems = [
  {
    name: "Home",
    path: "/",
  },
  {
    name: "Github",
    path: sourceCodeLink,
    external: true,
  },
]

export function Header() {
  const pathname = usePathname()
  const { data } = useCheckAuthentication()
  return (
    <header className="pt-6">
      <nav className="mx-auto w-fit rounded-2xl border bg-accent p-1.5 text-sm">
        <ul className="flex items-center gap-2">
          {navItems.map((item) => (
            <li key={item.path}>
              <Link
                href={item.path}
                className={cn(
                  "relative px-2 text-muted-foreground transition-all hover:text-foreground aria-[current=true]:text-foreground",
                  item.external && "mr-2"
                )}
                aria-current={item.path === pathname}
              >
                {item.name}
                {item.external && (
                  <span className="absolute -right-2 -top-1">
                    <Icons.ExternalLink className="size-3" />
                  </span>
                )}
              </Link>
            </li>
          ))}
          <Button
            className="h-auto rounded-xl border border-border bg-background/40 px-4 py-1 hover:bg-background"
            size="sm"
            variant="outline"
            asChild
          >
            {data?.isAuthenticated ? (
              <Link href="/app">Open NoireChat</Link>
            ) : (
              <Link href="/auth/sign-in">Sign in</Link>
            )}
          </Button>
        </ul>
      </nav>
    </header>
  )
}
