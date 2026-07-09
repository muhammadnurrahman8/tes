import { NextResponse } from 'next/server'
import { sql, ensureSchema } from '../../../../lib/db'

// Digunakan untuk menandai buku telah dikembalikan
export async function PUT(request, { params }) {
  await ensureSchema()
  const body = await request.json()
  const { aksi } = body // aksi: 'kembalikan'

  if (aksi === 'kembalikan') {
    const existing = await sql`SELECT * FROM peminjaman WHERE id = ${params.id}`
    if (existing.rows.length === 0) {
      return NextResponse.json({ error: 'Data peminjaman tidak ditemukan.' }, { status: 404 })
    }
    if (existing.rows[0].status === 'dikembalikan') {
      return NextResponse.json({ error: 'Buku ini sudah dikembalikan.' }, { status: 409 })
    }

    const { rows } = await sql`
      UPDATE peminjaman
      SET status = 'dikembalikan', tanggal_kembali = CURRENT_DATE
      WHERE id = ${params.id}
      RETURNING *
    `
    await sql`UPDATE buku SET stok = stok + 1 WHERE id = ${existing.rows[0].buku_id}`
    return NextResponse.json(rows[0])
  }

  return NextResponse.json({ error: 'Aksi tidak dikenali.' }, { status: 400 })
}

export async function DELETE(request, { params }) {
  await ensureSchema()
  const existing = await sql`SELECT * FROM peminjaman WHERE id = ${params.id}`
  if (existing.rows.length === 0) {
    return NextResponse.json({ error: 'Data peminjaman tidak ditemukan.' }, { status: 404 })
  }

  // Jika dihapus saat masih berstatus dipinjam, kembalikan stok buku
  if (existing.rows[0].status === 'dipinjam') {
    await sql`UPDATE buku SET stok = stok + 1 WHERE id = ${existing.rows[0].buku_id}`
  }

  await sql`DELETE FROM peminjaman WHERE id = ${params.id}`
  return NextResponse.json({ success: true })
}
