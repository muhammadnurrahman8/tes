import { NextResponse } from 'next/server'
import { sql, ensureSchema } from '../../../lib/db'

export async function GET() {
  await ensureSchema()
  const { rows } = await sql`SELECT * FROM anggota ORDER BY id DESC`
  return NextResponse.json(rows)
}

export async function POST(request) {
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
      INSERT INTO anggota (nama, npm, email)
      VALUES (${nama}, ${npm}, ${email || null})
      RETURNING *
    `
    return NextResponse.json(rows[0], { status: 201 })
  } catch (err) {
    if (String(err).includes('duplicate key')) {
      return NextResponse.json({ error: 'NPM sudah terdaftar.' }, { status: 409 })
    }
    return NextResponse.json({ error: 'Gagal menyimpan anggota.' }, { status: 500 })
  }
}
