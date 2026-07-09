'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'

const links = [
  { href: '/', label: 'Ringkasan', code: '01' },
  { href: '/buku', label: 'Buku', code: '02' },
  { href: '/anggota', label: 'Anggota', code: '03' },
  { href: '/peminjaman', label: 'Peminjaman', code: '04' },
]

export default function NavTabs() {
  const pathname = usePathname()

  return (
    <nav className="px-3 flex lg:flex-col gap-1 overflow-x-auto lg:overflow-visible">
      {links.map((link) => {
        const active = pathname === link.href
        return (
          <Link
            key={link.href}
            href={link.href}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-sm text-sm whitespace-nowrap transition-colors ${
              active
                ? 'bg-parchment text-charcoal font-semibold'
                : 'text-parchment/70 hover:bg-white/5 hover:text-parchment'
            }`}
          >
            <span className="call-number text-xs text-brass">{link.code}</span>
            {link.label}
          </Link>
        )
      })}
    </nav>
  )
}

// Menampilkan nama pengguna yang sedang login beserta tombol Keluar.
// Ditampilkan di sidebar (lihat app/layout.jsx).
export function UserMenu({ session }) {
  const router = useRouter()

  if (!session) return null

  async function keluar() {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/login')
    router.refresh()
  }

  return (
    <div className="px-6 py-4 border-t border-brass/20">
      <p className="call-number text-[11px] text-brass">{session.role === 'admin' ? 'Admin' : 'Anggota'}</p>
      <p className="text-parchment text-sm font-semibold truncate">{session.nama}</p>
      <p className="text-parchment/50 text-xs truncate mb-3">@{session.username}</p>
      <button
        onClick={keluar}
        className="w-full text-xs px-3 py-2 rounded-sm border border-burgundy/40 text-burgundy hover:bg-burgundy/10 transition-colors"
      >
        Keluar
      </button>
    </div>
  )
}
