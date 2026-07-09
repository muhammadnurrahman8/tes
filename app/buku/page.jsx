'use client'

import { useEffect, useState } from 'react'

const KOSONG = { judul: '', penulis: '', penerbit: '', tahun_terbit: '', kode_rak: '', stok: 1 }

export default function BukuPage() {
  const [daftar, setDaftar] = useState([])
  const [form, setForm] = useState(KOSONG)
  const [editId, setEditId] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  async function muat() {
    setLoading(true)
    const res = await fetch('/api/buku')
    const data = await res.json()
    setDaftar(data)
    setLoading(false)
  }

  useEffect(() => { muat() }, [])

  function ubahForm(field, value) {
    setForm((f) => ({ ...f, [field]: value }))
  }

  function mulaiEdit(b) {
    setEditId(b.id)
    setForm({
      judul: b.judul,
      penulis: b.penulis,
      penerbit: b.penerbit || '',
      tahun_terbit: b.tahun_terbit || '',
      kode_rak: b.kode_rak || '',
      stok: b.stok,
    })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function batalEdit() {
    setEditId(null)
    setForm(KOSONG)
  }

  async function simpan(e) {
    e.preventDefault()
    setError('')
    const url = editId ? `/api/buku/${editId}` : '/api/buku'
    const method = editId ? 'PUT' : 'POST'
    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
    const data = await res.json()
    if (!res.ok) {
      setError(data.error || 'Gagal menyimpan data.')
      return
    }
    batalEdit()
    muat()
  }

  async function hapus(id) {
    if (!confirm('Hapus buku ini dari katalog?')) return
    await fetch(`/api/buku/${id}`, { method: 'DELETE' })
    muat()
  }

  return (
    <div>
      <p className="call-number text-brass text-xs tracking-widest uppercase">Kartu Indeks &mdash; 02</p>
      <h2 className="font-display text-parchment text-3xl sm:text-4xl mt-2 mb-6">Koleksi Buku</h2>

      <form onSubmit={simpan} className="catalog-card rounded-sm p-6 mb-8 grid sm:grid-cols-2 gap-4">
        <p className="sm:col-span-2 call-number text-[11px] text-charcoal/40 -mb-2">
          {editId ? `Mengubah entri #${editId}` : 'Entri baru'}
        </p>
        <label className="text-sm">
          Judul
          <input required value={form.judul} onChange={(e) => ubahForm('judul', e.target.value)}
            className="mt-1 w-full border border-charcoal/20 rounded-sm px-3 py-2 text-sm" />
        </label>
        <label className="text-sm">
          Penulis
          <input required value={form.penulis} onChange={(e) => ubahForm('penulis', e.target.value)}
            className="mt-1 w-full border border-charcoal/20 rounded-sm px-3 py-2 text-sm" />
        </label>
        <label className="text-sm">
          Penerbit
          <input value={form.penerbit} onChange={(e) => ubahForm('penerbit', e.target.value)}
            className="mt-1 w-full border border-charcoal/20 rounded-sm px-3 py-2 text-sm" />
        </label>
        <label className="text-sm">
          Tahun Terbit
          <input type="number" value={form.tahun_terbit} onChange={(e) => ubahForm('tahun_terbit', e.target.value)}
            className="mt-1 w-full border border-charcoal/20 rounded-sm px-3 py-2 text-sm" />
        </label>
        <label className="text-sm">
          Kode Rak
          <input value={form.kode_rak} onChange={(e) => ubahForm('kode_rak', e.target.value)}
            placeholder="mis. F-AND-001"
            className="mt-1 w-full border border-charcoal/20 rounded-sm px-3 py-2 text-sm" />
        </label>
        <label className="text-sm">
          Stok
          <input type="number" min="0" required value={form.stok} onChange={(e) => ubahForm('stok', e.target.value)}
            className="mt-1 w-full border border-charcoal/20 rounded-sm px-3 py-2 text-sm" />
        </label>

        {error && <p className="sm:col-span-2 text-burgundy text-sm">{error}</p>}

        <div className="sm:col-span-2 flex gap-3">
          <button type="submit" className="bg-brass hover:bg-brass-light text-ink font-semibold text-sm px-5 py-2 rounded-sm transition-colors">
            {editId ? 'Simpan Perubahan' : 'Tambah Buku'}
          </button>
          {editId && (
            <button type="button" onClick={batalEdit} className="text-sm px-5 py-2 rounded-sm border border-charcoal/20 hover:bg-charcoal/5">
              Batal
            </button>
          )}
        </div>
      </form>

      {loading ? (
        <p className="text-parchment/60 text-sm">Memuat katalog...</p>
      ) : daftar.length === 0 ? (
        <p className="text-parchment/60 text-sm">Belum ada buku terdaftar. Tambahkan entri pertama di atas.</p>
      ) : (
        <div className="grid sm:grid-cols-2 gap-4">
          {daftar.map((b) => (
            <div key={b.id} className="catalog-card rounded-sm p-5 pt-6 flex flex-col">
              <div className="flex justify-between items-start">
                <p className="call-number text-[11px] text-brass">{b.kode_rak || `BK-${b.id}`}</p>
                <span className={`text-xs px-2 py-0.5 rounded-full border ${b.stok > 0 ? 'border-ink-light text-ink-light' : 'border-burgundy text-burgundy'}`}>
                  {b.stok > 0 ? `${b.stok} tersedia` : 'Stok habis'}
                </span>
              </div>
              <h3 className="font-display text-xl mt-2">{b.judul}</h3>
              <p className="text-sm text-charcoal/70">{b.penulis}</p>
              <p className="text-xs text-charcoal/50 mt-1">
                {b.penerbit || 'Penerbit tidak diketahui'}{b.tahun_terbit ? ` · ${b.tahun_terbit}` : ''}
              </p>
              <div className="mt-auto pt-4 flex gap-2">
                <button onClick={() => mulaiEdit(b)} className="text-xs px-3 py-1.5 rounded-sm border border-charcoal/20 hover:bg-charcoal/5">
                  Ubah
                </button>
                <button onClick={() => hapus(b.id)} className="text-xs px-3 py-1.5 rounded-sm border border-burgundy/40 text-burgundy hover:bg-burgundy/5">
                  Hapus
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
