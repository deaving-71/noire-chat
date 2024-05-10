"use client"

import Image from "next/image"
import Link from "next/link"

import { sourceCodeLink } from "@/config/site"
import { Button } from "@/components/ui/button"
import { Icons } from "@/components/icons"

export default function Home() {
  return (
    <main>
      <section
        aria-labelledby="hero"
        className="flex flex-col items-center justify-center pb-8"
      >
        <div className="space-y-8 pt-32 text-center md:pt-48 lg:pt-52">
          <div className="space-y-4">
            <h1
              id="hero"
              className="text-4xl font-bold text-primary lg:text-5xl"
            >
              Connect Now with Noire Chat
            </h1>
            <p className="text-muted-foreground md:text-lg lg:text-xl">
              Dive into the shadows
            </p>
          </div>
          <div className="flex items-center justify-center gap-2">
            <Button asChild>
              <Link href="/app">
                Get Started&nbsp;&nbsp;
                <Icons.ArrowRight className="size-5" />
              </Link>
            </Button>
            <Button variant="secondary" asChild>
              <Link href={sourceCodeLink} target="_blank">
                <Icons.github className="size-4" />
                &nbsp;&nbsp;Source Code
              </Link>
            </Button>
          </div>
        </div>
        <div className="m-5 mt-32 max-w-[1280px] rounded-xl bg-muted/40 p-5">
          <Image
            src="/assets/noire_chat_screenshot.png"
            alt="A screenshot of noire chat"
            width={1708}
            height={888}
            quality={100}
            loading="lazy"
            className="rounded-xl border object-fill object-center"
          />
        </div>
      </section>
    </main>
  )
}
