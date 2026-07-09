import { NextResponse } from 'next/server'
import { sql, ensureSchema } from '../../../../lib/db'

export async function PUT(request, { params }) {
  await ensureSchema()
  const body = await request.json()
  const { nama, npm, email } = body

  if (!nama || !npm) {
    return NextResponse.json(
      { error: 'Nama dan NPM wajib diisi.' },
      { status: 400 }
    )
  }

  try {
    const { rows } = await sql`
      UPDATE anggota
      SET nama = ${nama}, npm = ${npm}, email = ${email || null}
      WHERE id = ${params.id}
      RETURNING *
    `
    if (rows.length === 0) {
      return NextResponse.json({ error: 'Anggota tidak ditemukan.' }, { status: 404 })
    }
    return NextResponse.json(rows[0])
  } catch (err) {
    if (String(err).includes('duplicate key')) {
      return NextResponse.json({ error: 'NPM sudah terdaftar.' }, { status: 409 })
    }
    return NextResponse.json({ error: 'Gagal memperbarui anggota.' }, { status: 500 })
  }
}

export async function DELETE(request, { params }) {
  await ensureSchema()
  const { rows } = await sql`DELETE FROM anggota WHERE id = ${params.id} RETURNING id`
  if (rows.length === 0) {
    return NextResponse.json({ error: 'Anggota tidak ditemukan.' }, { status: 404 })
  }
  return NextResponse.json({ success: true })
}
