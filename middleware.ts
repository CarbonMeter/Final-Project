import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token
    const isAuth = !!token
    const isAuthPage = req.nextUrl.pathname.startsWith("/login")
    const isProtectedPage = ["/dashboard", "/results", "/history", "/profile"].some((path) =>
      req.nextUrl.pathname.startsWith(path),
    )

    if (isAuthPage) {
      if (isAuth) {
        return NextResponse.redirect(new URL("/dashboard", req.url))
      }
      return null
    }

    if (!isAuth && isProtectedPage) {
      let from = req.nextUrl.pathname
      if (req.nextUrl.search) {
        from += req.nextUrl.search
      }

      return NextResponse.redirect(new URL(`/login?from=${encodeURIComponent(from)}`, req.url))
    }
  },
  {
    callbacks: {
      authorized: ({ token }) => true, // Let the middleware function handle the logic
    },
  },
)

export const config = {
  matcher: ["/dashboard/:path*", "/results/:path*", "/history/:path*", "/profile/:path*", "/login"],
}
