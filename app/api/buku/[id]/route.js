import { NextResponse } from 'next/server'
import { sql, ensureSchema } from '../../../../lib/db'

export async function GET(request, { params }) {
  await ensureSchema()
  const { rows } = await sql`SELECT * FROM buku WHERE id = ${params.id}`
  if (rows.length === 0) {
    return NextResponse.json({ error: 'Buku tidak ditemukan.' }, { status: 404 })
  }
  return NextResponse.json(rows[0])
}

export async function PUT(request, { params }) {
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
    UPDATE buku
    SET judul = ${judul},
        penulis = ${penulis},
        penerbit = ${penerbit || null},
        tahun_terbit = ${tahun_terbit || null},
        kode_rak = ${kode_rak || null},
        stok = ${stok || 1}
    WHERE id = ${params.id}
    RETURNING *
  `
  if (rows.length === 0) {
    return NextResponse.json({ error: 'Buku tidak ditemukan.' }, { status: 404 })
  }
  return NextResponse.json(rows[0])
}

export async function DELETE(request, { params }) {
  await ensureSchema()
  const { rows } = await sql`DELETE FROM buku WHERE id = ${params.id} RETURNING id`
  if (rows.length === 0) {
    return NextResponse.json({ error: 'Buku tidak ditemukan.' }, { status: 404 })
  }
  return NextResponse.json({ success: true })
}
