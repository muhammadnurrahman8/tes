import { NextResponse } from 'next/server'
import { sql, ensureSchema } from '../../../lib/db'

export async function GET() {
  await ensureSchema()
  const { rows } = await sql`SELECT * FROM buku ORDER BY id DESC`
  return NextResponse.json(rows)
}

export async function POST(request) {
  await ensureSchema()
  const body = await request.json()
  const { judul, penulis, penerbit, tahun_terbit, kode_rak, stok } = body

  if (!judul || !penulis) {
    return NextResponse.json(
      { error: 'Judul dan penulis wajib diisi.' },
      { status: 400 }
    )
  }

  const { rows } = await sql`
    INSERT INTO buku (judul, penulis, penerbit, tahun_terbit, kode_rak, stok)
    VALUES (${judul}, ${penulis}, ${penerbit || null}, ${tahun_terbit || null}, ${kode_rak || null}, ${stok || 1})
    RETURNING *
  `
  return NextResponse.json(rows[0], { status: 201 })
}
