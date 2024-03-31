"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

import logger from "@/lib/logger"
import { useCheckAuthentication } from "@/hooks/auth"
import { LoadingSpinner } from "@/components/common"

type AuthLayoutProps = React.PropsWithChildren

export default function AuthLayout({ children }: AuthLayoutProps) {
  const { data, error, isSuccess, isLoading } = useCheckAuthentication()
  const router = useRouter()

  useEffect(() => {
    if (isSuccess && data.isAuthenticated) {
      logger.info("user is authenticated")
      router.push("/app")
    }
  }, [isSuccess, data?.isAuthenticated])

  if (isLoading) {
    return <LoadingSpinner />
  }

  if (error) {
    return <p>Something went wrong</p>
  }

  return (
    <div className="grid h-full min-h-screen place-content-center">
      {children}
    </div>
  )
}
