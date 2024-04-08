"use client"

import { SocketContextProvider } from "@/context/socket"
import toast, { Toaster } from "react-hot-toast"

type ProviderProps = React.PropsWithChildren

export function ChatAppProvider({ children }: ProviderProps) {
  return (
    <SocketContextProvider>
      {children}
      <Toaster
        toastOptions={{
          className:
            "!bg-secondary/50 !text-foreground backdrop-blur-lg saturate-150",
        }}
      />
    </SocketContextProvider>
  )
}
