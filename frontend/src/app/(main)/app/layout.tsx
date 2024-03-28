import { Suspense } from "react"

import { Sidebar } from "@/components/common"
import { ChatAppProvider } from "@/components/providers/chat_app_provider"

type AppLayoutProps = React.PropsWithChildren

export default function AppLayout({ children }: AppLayoutProps) {
  return (
    <ChatAppProvider>
      <div className="relative grid grid-cols-[240px,1fr] grid-rows-1 text-md">
        <Suspense fallback={"Loading..."}>
          <Sidebar />
          {children}
        </Suspense>
      </div>
    </ChatAppProvider>
  )
}
