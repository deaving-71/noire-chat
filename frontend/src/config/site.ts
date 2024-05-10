import { SiteConfig } from "@/types"

import { env } from "@/env.mjs"

export const siteConfig: SiteConfig = {
  name: "Noire Chat",
  author: "deaving-71",
  description:
    "Noire Chat is a real time chat app similar to discord where you can add friends and create channels to chat with others.",
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

export const sourceCodeLink = siteConfig.links.github + "/noire-chat"
