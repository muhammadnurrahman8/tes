import { NextResponse } from 'next/server'

// Padanan pengecekan "config/session.php" pada level routing:
// setiap halaman dashboard wajib sudah login, jika belum -> redirect ke /login.
// Middleware hanya mengecek KEBERADAAN cookie session (verifikasi tanda tangan
// HMAC dilakukan di lib/session.js saat dipakai di server component / API,
// karena modul `crypto` Node penuh tidak tersedia di Edge Runtime middleware).

const COOKIE_NAME = 'sxc_session'

const PUBLIC_PATHS = ['/login', '/register']

export function middleware(request) {
  const { pathname } = request.nextUrl

  const isPublic =
    PUBLIC_PATHS.includes(pathname) ||
    pathname.startsWith('/api/auth') ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/favicon')

  if (isPublic) {
    return NextResponse.next()
  }

  const session = request.cookies.get(COOKIE_NAME)?.value

  if (!session) {
    const loginUrl = new URL('/login', request.url)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
