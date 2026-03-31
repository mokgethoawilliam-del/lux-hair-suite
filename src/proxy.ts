import { type NextRequest, NextResponse } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'

const MAIN_DOMAIN = 'kasivault.com'
const LOCALHOST = 'localhost:3000'

export async function proxy(request: NextRequest) {
  const { user, response } = await updateSession(request)
  const host = request.headers.get('host') || ''
  const url = request.nextUrl.clone()
  
  // 1. Static Asset/Protected Route Bypass
  if (
    url.pathname.startsWith('/_next') || 
    url.pathname.includes('.') || 
    url.pathname.startsWith('/admin') ||
    url.pathname.startsWith('/login')
  ) {
    // Standard Protected Logic
    if (url.pathname.startsWith('/admin') && !user) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
    return response
  }

  // 2. Routing Logic (Shopify Style)
  // If host is NOT the main domain or localhost, it's a tenant
  const isMainDomain = host === MAIN_DOMAIN || host === LOCALHOST || host.endsWith(MAIN_DOMAIN);
  
  if (!isMainDomain) {
    // Custom Domain Routing
    // In production, we'd lookup the site by host in Supabase
    // For now, we'll rewrite based on subdomains or paths
    if (host.includes('.')) {
      const parts = host.split('.')
      if (parts.length > 2) {
        // Subdomain (brand.kasivault.com)
        const slug = parts[0]
        url.pathname = `/s/${slug}${url.pathname}`
        return NextResponse.rewrite(url)
      }
    }
  }

  return response
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|public|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
