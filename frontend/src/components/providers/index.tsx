"use client"

import { SocketContextProvider } from "@/context/socket"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"

import { ThemeProvider } from "../theme-provider"

type ProviderProps = React.PropsWithChildren

export function Provider({ children }: ProviderProps) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
      },
    },
  })

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </ThemeProvider>
  )
}
