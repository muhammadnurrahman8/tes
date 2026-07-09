'use client'

import { usePathname } from 'next/navigation'
import NavTabs, { UserMenu } from './nav-tabs'

const AUTH_PATHS = ['/login', '/register']

export default function AppShell({ session, children }) {
  const pathname = usePathname()

  if (AUTH_PATHS.includes(pathname)) {
    // Halaman login/register tampil full-screen tanpa sidebar dashboard.
    return children
  }

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      <aside className="lg:w-64 shrink-0 bg-ink lg:min-h-screen border-b lg:border-b-0 lg:border-r border-brass/20 flex flex-col">
        <div className="px-6 pt-8 pb-6">
          <p className="call-number text-brass-light text-xs tracking-widest uppercase">Katalog No. 000.9</p>
          <h1 className="font-display italic text-parchment text-2xl mt-1 leading-tight">
            Pustaka<br />Indeks
          </h1>
        </div>
        <NavTabs />
        <div className="mt-auto">
          <UserMenu session={session} />
          <div className="hidden lg:block px-6 py-6 text-brass/50 text-xs call-number">
            Kelompok 9 &mdash; Pemrograman Web
          </div>
        </div>
      </aside>
      <main className="flex-1 bg-grain">
        <div className="max-w-5xl mx-auto px-5 sm:px-8 py-10">
          {children}
        </div>
      </main>
    </div>
  )
}
