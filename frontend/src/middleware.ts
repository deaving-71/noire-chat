import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

import { checkAuthentication } from "./lib/actions/server"

export async function middleware(request: NextRequest) {
  const isAuthenticated = await checkAuthentication(request.headers)

  if (!isAuthenticated) {
    const currentPath = request.nextUrl.pathname

    if (request.nextUrl.pathname === "/") return NextResponse.next()

    if (currentPath.startsWith("/auth")) {
      return NextResponse.next()
    }

    return NextResponse.redirect(new URL("/auth/sign-in", request.url))
  }

  if (isAuthenticated && request.nextUrl.pathname.startsWith("/auth")) {
    return NextResponse.redirect(new URL("/", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
}
