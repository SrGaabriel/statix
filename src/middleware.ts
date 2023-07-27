import { match } from '@formatjs/intl-localematcher'
import Negotiator from 'negotiator'
import { NextRequest, NextResponse } from 'next/server'
 
let headers = { 'accept-language': 'en-US,en;q=0.5' }
let locales = ['en', 'pt']
let defaultLocale = 'en-US'

function getLocale(request: NextRequest) {
    const acceptLanguage = request.headers.get('accept-language');
    const languages = new Negotiator({ headers }).languages();
    const locale = acceptLanguage
        ? match(languages, locales, defaultLocale)
        : defaultLocale

    return locale
 }
 
export default function middleware(request: NextRequest) {
  // Check if there is any supported locale in the pathname
  const pathname = request.nextUrl.pathname
  const pathnameIsMissingLocale = locales.every(
    (locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
  )
 
  // Redirect if there is no locale
  if (pathnameIsMissingLocale) {
    const locale = getLocale(request);
 
    // e.g. incoming request is /products
    // The new URL is now /en-US/products
    return NextResponse.redirect(
      new URL(`/${locale}/${pathname}`, request.url)
    )
  }
}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|assets|public|favicon.ico|logo.png|logo.webp|sw.js|flags|icons|leagues|badges).*)']
}