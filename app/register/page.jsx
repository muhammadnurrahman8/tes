'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

const KOSONG = { nama: '', username: '', email: '', password: '', konfirmasiPassword: '' }

export default function RegisterPage() {
  const router = useRouter()
  const [form, setForm] = useState(KOSONG)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  function ubah(field, value) {
    setForm((f) => ({ ...f, [field]: value }))
  }

  function validasiClient() {
    if (!form.nama || !form.username || !form.email || !form.password || !form.konfirmasiPassword) {
      return 'Semua field wajib diisi.'
    }
    if (form.password.length < 8) {
      return 'Password minimal 8 karakter.'
    }
    if (form.password !== form.konfirmasiPassword) {
      return 'Konfirmasi password tidak cocok.'
    }
    return ''
  }

  async function submit(e) {
    e.preventDefault()
    const pesan = validasiClient()
    if (pesan) {
      setError(pesan)
      return
    }
    setError('')
    setLoading(true)
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'Registrasi gagal.')
        setLoading(false)
        return
      }
      router.push('/login?registered=1')
    } catch {
      setError('Terjadi kesalahan. Coba lagi.')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-10 bg-ink bg-grain">
      <div className="w-full max-w-sm">
        <p className="call-number text-brass-light text-xs tracking-widest uppercase text-center">
          Pendaftaran Anggota Baru
        </p>
        <h1 className="font-display italic text-parchment text-3xl text-center mt-1 mb-6">
          Daftar Akun
        </h1>

        <form onSubmit={submit} className="catalog-card rounded-sm p-6">
          {error && (
            <p className="mb-4 text-sm rounded-sm border border-burgundy/40 bg-burgundy/5 text-burgundy px-3 py-2">
              {error}
            </p>
          )}

          <label className="text-sm block mb-4">
            Nama Lengkap
            <input required value={form.nama} onChange={(e) => ubah('nama', e.target.value)}
              className="mt-1 w-full border border-charcoal/20 rounded-sm px-3 py-2 text-sm" />
          </label>

          <label className="text-sm block mb-4">
            Username
            <input required value={form.username} onChange={(e) => ubah('username', e.target.value)}
              className="mt-1 w-full border border-charcoal/20 rounded-sm px-3 py-2 text-sm" />
          </label>

          <label className="text-sm block mb-4">
            Email
            <input required type="email" value={form.email} onChange={(e) => ubah('email', e.target.value)}
              className="mt-1 w-full border border-charcoal/20 rounded-sm px-3 py-2 text-sm" />
          </label>

          <label className="text-sm block mb-4">
            Password
            <input required type="password" minLength={8} value={form.password}
              onChange={(e) => ubah('password', e.target.value)}
              className="mt-1 w-full border border-charcoal/20 rounded-sm px-3 py-2 text-sm" />
          </label>

          <label className="text-sm block mb-5">
            Konfirmasi Password
            <input required type="password" minLength={8} value={form.konfirmasiPassword}
              onChange={(e) => ubah('konfirmasiPassword', e.target.value)}
              className="mt-1 w-full border border-charcoal/20 rounded-sm px-3 py-2 text-sm" />
          </label>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-brass hover:bg-brass-light text-ink font-semibold text-sm px-5 py-2.5 rounded-sm transition-colors disabled:opacity-60"
          >
            {loading ? 'Memproses...' : 'Daftar'}
          </button>

          <p className="text-xs text-charcoal/60 mt-5 text-center">
            Sudah punya akun?{' '}
            <Link href="/login" className="text-brass font-semibold hover:underline">
              Masuk di sini
            </Link>
          </p>
        </form>
      </div>
    </div>
  )
}
