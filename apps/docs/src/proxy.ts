import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
 
export default function proxy(request: NextRequest) {
  return NextResponse.redirect(new URL(`/api/auth/oauth2/authorize?${request.nextUrl.searchParams.toString()}`, request.url))
}
 
export const config = {
  matcher: '/oauth2/authorize',
}