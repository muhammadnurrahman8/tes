import { Fraunces, Source_Sans_3, IBM_Plex_Mono } from 'next/font/google'
import './globals.css'
import AppShell from './app-shell'
import { getSession } from '../lib/session'

const fraunces = Fraunces({
  subsets: ['latin'],
  weight: ['500', '600', '700', '900'],
  style: ['normal', 'italic'],
  variable: '--font-fraunces',
})

const sourceSans = Source_Sans_3({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-source-sans',
})

const plexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-plex-mono',
})

export const metadata = {
  title: 'Pustaka Indeks — Sistem Manajemen Perpustakaan',
  description: 'Sistem manajemen buku, anggota, dan peminjaman perpustakaan.',
}

export default function RootLayout({ children }) {
  const session = getSession()

  return (
    <html lang="id" className={`${fraunces.variable} ${sourceSans.variable} ${plexMono.variable}`}>
      <body className="font-body text-charcoal">
        <AppShell session={session}>{children}</AppShell>
      </body>
    </html>
  )
}
