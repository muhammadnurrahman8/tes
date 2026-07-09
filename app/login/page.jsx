'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'

export default function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const registered = searchParams.get('registered')

  const [form, setForm] = useState({ identitas: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  function ubah(field, value) {
    setForm((f) => ({ ...f, [field]: value }))
  }

  async function submit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'Login gagal.')
        setLoading(false)
        return
      }
      router.push('/')
      router.refresh()
    } catch {
      setError('Terjadi kesalahan. Coba lagi.')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-ink bg-grain">
      <div className="w-full max-w-sm">
        <p className="call-number text-brass-light text-xs tracking-widest uppercase text-center">
          Kartu Anggota
        </p>
        <h1 className="font-display italic text-parchment text-3xl text-center mt-1 mb-6">
          Masuk ke Pustaka Indeks
        </h1>

        <form onSubmit={submit} className="catalog-card rounded-sm p-6">
          {registered && (
            <p className="mb-4 text-sm rounded-sm border border-ink-light/40 bg-ink-light/10 text-ink-light px-3 py-2">
              Registrasi berhasil. Silakan login.
            </p>
          )}
          {error && (
            <p className="mb-4 text-sm rounded-sm border border-burgundy/40 bg-burgundy/5 text-burgundy px-3 py-2">
              {error}
            </p>
          )}

          <label className="text-sm block mb-4">
            Username atau Email
            <input
              required
              value={form.identitas}
              onChange={(e) => ubah('identitas', e.target.value)}
              className="mt-1 w-full border border-charcoal/20 rounded-sm px-3 py-2 text-sm"
              placeholder="admin"
            />
          </label>

          <label className="text-sm block mb-5">
            Password
            <input
              required
              type="password"
              value={form.password}
              onChange={(e) => ubah('password', e.target.value)}
              className="mt-1 w-full border border-charcoal/20 rounded-sm px-3 py-2 text-sm"
              placeholder="••••••••"
            />
          </label>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-brass hover:bg-brass-light text-ink font-semibold text-sm px-5 py-2.5 rounded-sm transition-colors disabled:opacity-60"
          >
            {loading ? 'Memproses...' : 'Masuk'}
          </button>

          <p className="text-xs text-charcoal/60 mt-5 text-center">
            Belum punya akun?{' '}
            <Link href="/register" className="text-brass font-semibold hover:underline">
              Daftar di sini
            </Link>
          </p>
        </form>

        <p className="text-parchment/40 text-xs text-center mt-6 call-number">
          Demo &mdash; admin/admin123 &middot; user/user12345
        </p>
      </div>
    </div>
  )
}
