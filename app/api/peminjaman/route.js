import { NextResponse } from 'next/server'
import { sql, ensureSchema } from '../../../lib/db'

export async function GET() {
  await ensureSchema()
  const { rows } = await sql`
    SELECT
      p.id, p.tanggal_pinjam, p.tanggal_jatuh_tempo, p.tanggal_kembali, p.status,
      b.id AS buku_id, b.judul AS buku_judul, b.kode_rak,
      a.id AS anggota_id, a.nama AS anggota_nama, a.npm AS anggota_npm
    FROM peminjaman p
    JOIN buku b ON b.id = p.buku_id
    JOIN anggota a ON a.id = p.anggota_id
    ORDER BY p.id DESC
  `
  return NextResponse.json(rows)
}

export async function POST(request) {
  await ensureSchema()
  const body = await request.json()
  const { buku_id, anggota_id, tanggal_jatuh_tempo } = body

  if (!buku_id || !anggota_id || !tanggal_jatuh_tempo) {
    return NextResponse.json(
      { error: 'Buku, anggota, dan tanggal jatuh tempo wajib diisi.' },
      { status: 400 }
    )
  }

  const stokCek = await sql`SELECT stok FROM buku WHERE id = ${buku_id}`
  if (stokCek.rows.length === 0) {
    return NextResponse.json({ error: 'Buku tidak ditemukan.' }, { status: 404 })
  }
  if (stokCek.rows[0].stok < 1) {
    return NextResponse.json({ error: 'Stok buku habis.' }, { status: 409 })
  }

  const { rows } = await sql`
    INSERT INTO peminjaman (buku_id, anggota_id, tanggal_jatuh_tempo, status)
    VALUES (${buku_id}, ${anggota_id}, ${tanggal_jatuh_tempo}, 'dipinjam')
    RETURNING *
  `
  await sql`UPDATE buku SET stok = stok - 1 WHERE id = ${buku_id}`

  return NextResponse.json(rows[0], { status: 201 })
}
