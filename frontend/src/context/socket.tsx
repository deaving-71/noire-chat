"use client"

import { createContext, useContext, useEffect, useState } from "react"

import logger from "@/lib/logger"
import { Ws } from "@/lib/ws"

type SocketContext = {
  ws: Ws | null
  isConnected: boolean
}

const socketContext = createContext<SocketContext | null>(null)

function useSocket() {
  const context = useContext(socketContext)
  if (!context) {
    throw new Error("useSocket must be used within a SocketProvider")
  }
  return context
}

type SocketContextProviderProps = React.PropsWithChildren

function SocketContextProvider({ children }: SocketContextProviderProps) {
  const [ws, setWebSocket] = useState<Ws | null>(null)
  const [isConnected, setIsConnected] = useState(false)

  useEffect(() => {
    const _ws = new Ws()
    const socketInstance = _ws.socket

    socketInstance.on("error", (err) => {
      logger.error(err)
    })

    ws?.socket.on("disconnect", () => setIsConnected(false))

    if (!ws) {
      _ws.boot(() => {
        setWebSocket(_ws)
        setIsConnected(socketInstance.connected)
      })
    }

    return () => {
      setIsConnected(false)
      setWebSocket(null)
      socketInstance.close()
    }
  }, [])

  return (
    <socketContext.Provider value={{ ws, isConnected }}>
      {children}
    </socketContext.Provider>
  )
}

export { socketContext, useSocket, SocketContextProvider }
