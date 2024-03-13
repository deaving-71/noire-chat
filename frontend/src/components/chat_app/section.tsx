import React from "react"

import { cn } from "@/lib/utils"

type SectionProps = React.ComponentPropsWithoutRef<"div">

export function Section({ className, ...props }: SectionProps) {
  return <section {...props} className={cn("bg-background", className)} />
}
