"use client"

import { Suspense } from "react"
import { useRouter } from "next/navigation"

import { useCheckAuthentication } from "@/hooks/auth"

import { LoadingSpinner } from "../common/loading_spinner"
import { Sidebar } from "../common/sidebar"
import { ChatAppProvider } from "../providers/chat_app_provider"

export function App({ children }: React.PropsWithChildren) {
  const { data, isLoading } = useCheckAuthentication()
  const router = useRouter()

  if (isLoading) {
    return <LoadingSpinner />
  }

  if (!data?.isAuthenticated) {
    router.push("/auth/sign-in")
  }

  return (
    <Suspense fallback={"Loading..."}>
      <ChatAppProvider>
        <Sidebar />
        {children}
      </ChatAppProvider>
    </Suspense>
  )
}
