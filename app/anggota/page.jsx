'use client'

import { useEffect, useState } from 'react'

const KOSONG = { nama: '', npm: '', email: '' }

export default function AnggotaPage() {
  const [daftar, setDaftar] = useState([])
  const [form, setForm] = useState(KOSONG)
  const [editId, setEditId] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  async function muat() {
    setLoading(true)
    const res = await fetch('/api/anggota')
    setDaftar(await res.json())
    setLoading(false)
  }

  useEffect(() => { muat() }, [])

  function ubahForm(field, value) {
    setForm((f) => ({ ...f, [field]: value }))
  }

  function mulaiEdit(a) {
    setEditId(a.id)
    setForm({ nama: a.nama, npm: a.npm, email: a.email || '' })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function batalEdit() {
    setEditId(null)
    setForm(KOSONG)
  }

  async function simpan(e) {
    e.preventDefault()
    setError('')
    const url = editId ? `/api/anggota/${editId}` : '/api/anggota'
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
    if (!confirm('Hapus anggota ini?')) return
    await fetch(`/api/anggota/${id}`, { method: 'DELETE' })
    muat()
  }

  return (
    <div>
      <p className="call-number text-brass text-xs tracking-widest uppercase">Kartu Indeks &mdash; 03</p>
      <h2 className="font-display text-parchment text-3xl sm:text-4xl mt-2 mb-6">Anggota Perpustakaan</h2>

      <form onSubmit={simpan} className="catalog-card rounded-sm p-6 mb-8 grid sm:grid-cols-3 gap-4">
        <p className="sm:col-span-3 call-number text-[11px] text-charcoal/40 -mb-2">
          {editId ? `Mengubah entri #${editId}` : 'Entri baru'}
        </p>
        <label className="text-sm">
          Nama
          <input required value={form.nama} onChange={(e) => ubahForm('nama', e.target.value)}
            className="mt-1 w-full border border-charcoal/20 rounded-sm px-3 py-2 text-sm" />
        </label>
        <label className="text-sm">
          NPM
          <input required value={form.npm} onChange={(e) => ubahForm('npm', e.target.value)}
            className="mt-1 w-full border border-charcoal/20 rounded-sm px-3 py-2 text-sm" />
        </label>
        <label className="text-sm">
          Email (opsional)
          <input type="email" value={form.email} onChange={(e) => ubahForm('email', e.target.value)}
            className="mt-1 w-full border border-charcoal/20 rounded-sm px-3 py-2 text-sm" />
        </label>

        {error && <p className="sm:col-span-3 text-burgundy text-sm">{error}</p>}

        <div className="sm:col-span-3 flex gap-3">
          <button type="submit" className="bg-brass hover:bg-brass-light text-ink font-semibold text-sm px-5 py-2 rounded-sm transition-colors">
            {editId ? 'Simpan Perubahan' : 'Tambah Anggota'}
          </button>
          {editId && (
            <button type="button" onClick={batalEdit} className="text-sm px-5 py-2 rounded-sm border border-charcoal/20 hover:bg-charcoal/5">
              Batal
            </button>
          )}
        </div>
      </form>

      {loading ? (
        <p className="text-parchment/60 text-sm">Memuat data anggota...</p>
      ) : daftar.length === 0 ? (
        <p className="text-parchment/60 text-sm">Belum ada anggota terdaftar.</p>
      ) : (
        <div className="catalog-card rounded-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left border-b border-charcoal/15 text-charcoal/50 text-xs uppercase call-number">
                <th className="px-5 py-3">NPM</th>
                <th className="px-5 py-3">Nama</th>
                <th className="px-5 py-3">Email</th>
                <th className="px-5 py-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {daftar.map((a) => (
                <tr key={a.id} className="border-b border-charcoal/10 last:border-0">
                  <td className="px-5 py-3 call-number text-brass">{a.npm}</td>
                  <td className="px-5 py-3 font-medium">{a.nama}</td>
                  <td className="px-5 py-3 text-charcoal/60">{a.email || '—'}</td>
                  <td className="px-5 py-3 text-right space-x-2">
                    <button onClick={() => mulaiEdit(a)} className="text-xs px-3 py-1.5 rounded-sm border border-charcoal/20 hover:bg-charcoal/5">
                      Ubah
                    </button>
                    <button onClick={() => hapus(a.id)} className="text-xs px-3 py-1.5 rounded-sm border border-burgundy/40 text-burgundy hover:bg-burgundy/5">
                      Hapus
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
