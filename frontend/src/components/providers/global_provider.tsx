"use client"

import { QueryClient, QueryClientProvider } from "@tanstack/react-query"

import { ThemeProvider } from "../theme-provider"

type ProviderProps = React.PropsWithChildren

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
})

export function GlobalProvider({ children }: ProviderProps) {
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
