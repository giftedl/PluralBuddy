import { NextResponse } from 'next/server'
import type { NextFetchEvent, NextRequest } from 'next/server'
import { createI18nMiddleware } from 'fumadocs-core/i18n/middleware'; 
import { i18n } from '@/lib/i18n';

export default function proxy(request: NextRequest, event: NextFetchEvent) {
  if (request.url === "/oauth2/authorize")
  return NextResponse.redirect(new URL(`/api/auth/oauth2/authorize?${request.nextUrl.searchParams.toString()}`, request.url))

  return createI18nMiddleware(i18n)(request, event);
}
 
export const config = {
  matcher: ['/oauth2/authorize', '/((?!api|image|og|.well_known|font|_next/static|_next/image|favicon.ico).*)'],
}