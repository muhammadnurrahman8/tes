import { sql, ensureSchema } from '../lib/db'

export const dynamic = 'force-dynamic'

async function getStats() {
  await ensureSchema()
  const [buku, anggota, aktif, telat] = await Promise.all([
    sql`SELECT COUNT(*)::int AS n, COALESCE(SUM(stok),0)::int AS stok FROM buku`,
    sql`SELECT COUNT(*)::int AS n FROM anggota`,
    sql`SELECT COUNT(*)::int AS n FROM peminjaman WHERE status = 'dipinjam'`,
    sql`SELECT COUNT(*)::int AS n FROM peminjaman WHERE status = 'dipinjam' AND tanggal_jatuh_tempo < CURRENT_DATE`,
  ])
  return {
    judulBuku: buku.rows[0].n,
    totalStok: buku.rows[0].stok,
    anggota: anggota.rows[0].n,
    aktif: aktif.rows[0].n,
    telat: telat.rows[0].n,
  }
}

export default async function Home() {
  const stats = await getStats()

  const cards = [
    { label: 'Judul Buku Terdaftar', value: stats.judulBuku, code: 'B-01' },
    { label: 'Total Eksemplar di Rak', value: stats.totalStok, code: 'B-02' },
    { label: 'Anggota Terdaftar', value: stats.anggota, code: 'A-01' },
    { label: 'Peminjaman Aktif', value: stats.aktif, code: 'P-01' },
    { label: 'Terlambat Dikembalikan', value: stats.telat, code: 'P-02', warn: stats.telat > 0 },
  ]

  return (
    <div>
      <p className="call-number text-brass text-xs tracking-widest uppercase">Kartu Indeks &mdash; Ringkasan</p>
      <h2 className="font-display text-parchment text-3xl sm:text-4xl mt-2 mb-1">
        Ringkasan Perpustakaan
      </h2>
      <p className="text-parchment/60 mb-8 max-w-xl">
        Gambaran singkat koleksi buku, anggota, dan status peminjaman yang sedang berjalan.
      </p>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {cards.map((c) => (
          <div key={c.code} className="catalog-card rounded-sm p-5 pt-6">
            <p className="call-number text-[11px] text-charcoal/40">{c.code}</p>
            <p className={`font-display text-4xl mt-2 ${c.warn ? 'text-burgundy' : 'text-ink'}`}>
              {c.value}
            </p>
            <p className="text-sm text-charcoal/70 mt-1">{c.label}</p>
          </div>
        ))}
      </div>

      <div className="mt-10 catalog-card rounded-sm p-6">
        <p className="call-number text-[11px] text-charcoal/40 mb-2">Panduan Singkat</p>
        <ol className="text-sm text-charcoal/80 space-y-1.5 list-decimal list-inside">
          <li>Tambahkan koleksi buku pada menu <strong>Buku</strong>.</li>
          <li>Daftarkan anggota perpustakaan pada menu <strong>Anggota</strong>.</li>
          <li>Catat transaksi pinjam dan kembali pada menu <strong>Peminjaman</strong>.</li>
        </ol>
      </div>
    </div>
  )
}
