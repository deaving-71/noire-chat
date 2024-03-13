"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

import { Button } from "../ui/button"

const navItems = [
  {
    name: "Home",
    path: "/",
  },
  {
    name: "About",
    path: "/about",
  },
  {
    name: "Github",
    path: "#",
  },
]

export function Header() {
  const pathname = usePathname()
  return (
    <header className="pt-6">
      <nav className="mx-auto w-fit rounded-2xl border bg-accent p-1.5 text-sm">
        <ul className="flex items-center gap-2">
          {navItems.map((item) => (
            <li key={item.path}>
              <Link
                href={item.path}
                className="px-2 text-muted-foreground transition-all hover:text-foreground aria-[current=true]:text-foreground"
                aria-current={item.path === pathname}
              >
                {item.name}
              </Link>
            </li>
          ))}
          <Button
            className="h-auto rounded-xl border border-border bg-background/40 px-4 py-1 hover:bg-background"
            size="sm"
            variant="outline"
            asChild
          >
            <Link href="/auth/sign-in">Sign in</Link>
          </Button>
        </ul>
      </nav>
    </header>
  )
}
