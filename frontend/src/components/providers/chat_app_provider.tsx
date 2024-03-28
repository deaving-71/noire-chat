"use client"

import { SocketContextProvider } from "@/context/socket"

type ProviderProps = React.PropsWithChildren

export function ChatAppProvider({ children }: ProviderProps) {
  return <SocketContextProvider>{children}</SocketContextProvider>
}
