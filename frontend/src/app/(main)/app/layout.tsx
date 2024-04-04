"use client"

import { Suspense, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Toaster } from "react-hot-toast"

import { useCheckAuthentication } from "@/hooks/auth"
import { MainLoader, Sidebar } from "@/components/common"
import { ChatAppProvider } from "@/components/providers/chat_app_provider"

type AppLayoutProps = React.PropsWithChildren
export default function AppLayout({ children }: AppLayoutProps) {
  const { data, isLoading, isSuccess } = useCheckAuthentication()
  const router = useRouter()

  useEffect(() => {
    if (data && !data.isAuthenticated) {
      router.push("/auth/sign-in")
    }
  }, [isSuccess])

  if (isLoading || !data?.isAuthenticated) {
    return <MainLoader />
  }

  return (
    <ChatAppProvider>
      <Suspense fallback={<MainLoader />}>
        <div className="relative grid grid-cols-[240px,1fr] grid-rows-1 text-md">
          <Sidebar />
          {children}
        </div>
      </Suspense>
      <Toaster />
    </ChatAppProvider>
  )
}
