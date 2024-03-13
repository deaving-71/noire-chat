import { cn } from "@/lib/utils"

type HeaderProps = React.ComponentPropsWithoutRef<"div">

export function Header({ className, ...props }: HeaderProps) {
  return (
    <div
      {...props}
      className={cn(
        "sticky top-0 z-10 flex h-16 items-center gap-2 border-b border-secondary/60 bg-background/40 px-4 text-primary saturate-150 backdrop-blur-lg",
        className
      )}
    />
  )
}
