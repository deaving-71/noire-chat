import { cn } from "@/lib/utils"

export type TypographyH1 = React.ComponentPropsWithoutRef<"h1">

function H1({ children, className, ...props }: TypographyH1) {
  return (
    <h1
      {...props}
      className={cn(
        "scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl",
        className
      )}
    >
      {children}
    </h1>
  )
}

export type TypographyH2 = React.ComponentPropsWithoutRef<"h2">

function H2({ children, className, ...props }: TypographyH2) {
  return (
    <h2
      {...props}
      className={cn(
        "scroll-m-20 text-3xl font-semibold tracking-tight",
        className
      )}
    >
      {children}
    </h2>
  )
}

export type TypographyP = React.ComponentPropsWithoutRef<"p">

function P({ children, className, ...props }: TypographyP) {
  return (
    <p {...props} className={cn("leading-7", className)}>
      {children}
    </p>
  )
}

export { H1, H2, P }
