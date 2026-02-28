import { NextResponse } from 'next/server'
import { auth } from '@/auth'

export default auth((request) => {
  const { nextUrl } = request

  if (nextUrl.pathname === '/ryong/denied') {
    return NextResponse.next()
  }

  if (request.auth?.user?.isAdmin) {
    return NextResponse.next()
  }

  const signInUrl = new URL('/api/auth/signin', nextUrl.origin)
  signInUrl.searchParams.set('callbackUrl', nextUrl.href)
  return NextResponse.redirect(signInUrl)
})

export const config = {
  matcher: ['/ryong/:path*'],
}

