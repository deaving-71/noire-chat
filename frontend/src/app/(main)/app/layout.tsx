import { Suspense } from "react"
import { SocketContextProvider } from "@/context/socket"

import { Sidebar } from "@/components/chat_app"

type AppLayoutProps = React.PropsWithChildren
export default function AppLayout({ children }: AppLayoutProps) {
  return (
    <SocketContextProvider>
      <div className="relative grid grid-cols-[240px,1fr] grid-rows-1 text-md">
        <Suspense fallback={"Loading..."}>
          <Sidebar />
          {children}
        </Suspense>
      </div>
    </SocketContextProvider>
  )
}
