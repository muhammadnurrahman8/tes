'use client'

import { useEffect, useState } from 'react'

function tambahHari(n) {
  const d = new Date()
  d.setDate(d.getDate() + n)
  return d.toISOString().slice(0, 10)
}

export default function PeminjamanPage() {
  const [daftar, setDaftar] = useState([])
  const [bukuList, setBukuList] = useState([])
  const [anggotaList, setAnggotaList] = useState([])
  const [form, setForm] = useState({ buku_id: '', anggota_id: '', tanggal_jatuh_tempo: tambahHari(7) })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  async function muat() {
    setLoading(true)
    const [p, b, a] = await Promise.all([
      fetch('/api/peminjaman').then((r) => r.json()),
      fetch('/api/buku').then((r) => r.json()),
      fetch('/api/anggota').then((r) => r.json()),
    ])
    setDaftar(p)
    setBukuList(b)
    setAnggotaList(a)
    setLoading(false)
  }

  useEffect(() => { muat() }, [])

  function ubahForm(field, value) {
    setForm((f) => ({ ...f, [field]: value }))
  }

  async function simpan(e) {
    e.preventDefault()
    setError('')
    const res = await fetch('/api/peminjaman', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
    const data = await res.json()
    if (!res.ok) {
      setError(data.error || 'Gagal mencatat peminjaman.')
      return
    }
    setForm({ buku_id: '', anggota_id: '', tanggal_jatuh_tempo: tambahHari(7) })
    muat()
  }

  async function kembalikan(id) {
    await fetch(`/api/peminjaman/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ aksi: 'kembalikan' }),
    })
    muat()
  }

  async function hapus(id) {
    if (!confirm('Hapus catatan peminjaman ini?')) return
    await fetch(`/api/peminjaman/${id}`, { method: 'DELETE' })
    muat()
  }

  const bukuTersedia = bukuList.filter((b) => b.stok > 0)

  return (
    <div>
      <p className="call-number text-brass text-xs tracking-widest uppercase">Kartu Indeks &mdash; 04</p>
      <h2 className="font-display text-parchment text-3xl sm:text-4xl mt-2 mb-6">Peminjaman</h2>

      <form onSubmit={simpan} className="catalog-card rounded-sm p-6 mb-8 grid sm:grid-cols-3 gap-4">
        <p className="sm:col-span-3 call-number text-[11px] text-charcoal/40 -mb-2">Catat peminjaman baru</p>
        <label className="text-sm">
          Buku
          <select required value={form.buku_id} onChange={(e) => ubahForm('buku_id', e.target.value)}
            className="mt-1 w-full border border-charcoal/20 rounded-sm px-3 py-2 text-sm">
            <option value="">Pilih buku&hellip;</option>
            {bukuTersedia.map((b) => (
              <option key={b.id} value={b.id}>{b.judul} ({b.stok} tersedia)</option>
            ))}
          </select>
        </label>
        <label className="text-sm">
          Anggota
          <select required value={form.anggota_id} onChange={(e) => ubahForm('anggota_id', e.target.value)}
            className="mt-1 w-full border border-charcoal/20 rounded-sm px-3 py-2 text-sm">
            <option value="">Pilih anggota&hellip;</option>
            {anggotaList.map((a) => (
              <option key={a.id} value={a.id}>{a.nama} ({a.npm})</option>
            ))}
          </select>
        </label>
        <label className="text-sm">
          Jatuh Tempo
          <input type="date" required value={form.tanggal_jatuh_tempo}
            onChange={(e) => ubahForm('tanggal_jatuh_tempo', e.target.value)}
            className="mt-1 w-full border border-charcoal/20 rounded-sm px-3 py-2 text-sm" />
        </label>

        {error && <p className="sm:col-span-3 text-burgundy text-sm">{error}</p>}

        <div className="sm:col-span-3">
          <button type="submit" className="bg-brass hover:bg-brass-light text-ink font-semibold text-sm px-5 py-2 rounded-sm transition-colors">
            Catat Peminjaman
          </button>
        </div>
      </form>

      {loading ? (
        <p className="text-parchment/60 text-sm">Memuat data peminjaman...</p>
      ) : daftar.length === 0 ? (
        <p className="text-parchment/60 text-sm">Belum ada transaksi peminjaman.</p>
      ) : (
        <div className="grid gap-3">
          {daftar.map((p) => {
            const telat = p.status === 'dipinjam' && new Date(p.tanggal_jatuh_tempo) < new Date()
            return (
              <div key={p.id} className="catalog-card rounded-sm p-5 pt-6 flex flex-wrap items-center gap-4 justify-between">
                <div>
                  <p className="call-number text-[11px] text-brass">TX-{String(p.id).padStart(4, '0')}</p>
                  <p className="font-display text-lg mt-1">{p.buku_judul}</p>
                  <p className="text-sm text-charcoal/70">{p.anggota_nama} &middot; <span className="call-number">{p.anggota_npm}</span></p>
                  <p className="text-xs text-charcoal/50 mt-1">
                    Pinjam: {p.tanggal_pinjam?.slice(0,10)} &middot; Jatuh tempo: {p.tanggal_jatuh_tempo?.slice(0,10)}
                    {p.tanggal_kembali && ` · Dikembalikan: ${p.tanggal_kembali.slice(0,10)}`}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`stamp text-xs px-3 py-1 uppercase tracking-wide ${
                    p.status === 'dikembalikan' ? 'text-ink-light' : telat ? 'text-burgundy' : 'text-brass'
                  }`}>
                    {p.status === 'dikembalikan' ? 'Kembali' : telat ? 'Terlambat' : 'Dipinjam'}
                  </span>
                  {p.status === 'dipinjam' && (
                    <button onClick={() => kembalikan(p.id)} className="text-xs px-3 py-1.5 rounded-sm border border-ink-light/40 text-ink-light hover:bg-ink-light/5">
                      Kembalikan
                    </button>
                  )}
                  <button onClick={() => hapus(p.id)} className="text-xs px-3 py-1.5 rounded-sm border border-burgundy/40 text-burgundy hover:bg-burgundy/5">
                    Hapus
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
