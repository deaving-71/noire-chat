import { SiteConfig } from "@/types"

import { env } from "@/env.mjs"

export const siteConfig: SiteConfig = {
  name: "Noire Chat",
  author: "deaving-71",
  description:
    "Noire Chat is a chat app that is similar to discord, built with Next.js 14 and Adonis.js V6.",
  keywords: [
    "Next.js",
    "React",
    "Tailwind CSS",
    "Radix UI",
    "shadcn/ui",
    "Chat",
  ],
  url: {
    base: env.NEXT_PUBLIC_APP_URL,
    author: "https://deaving.vercel.app",
  },
  links: {
    github: "https://github.com/deaving-71",
  },
  ogImage: `${env.NEXT_PUBLIC_APP_URL}/og.jpg`,
}
