import Lottie from "lottie-react"

import LoadingAnimation from "@/lib/lottie/loading.json"

export function MainLoader() {
  return (
    <div className="flex h-full min-h-screen items-center justify-center">
      <Lottie
        className="size-52"
        animationData={LoadingAnimation}
        loop={true}
      />
    </div>
  )
}
