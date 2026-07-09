import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { sql, ensureSchema } from '../../../../lib/db'
import { buatSessionCookie } from '../../../../lib/session'

export async function POST(request) {
  await ensureSchema()
  const body = await request.json().catch(() => ({}))
  const identitas = (body.identitas || body.username || '').trim()
  const password = body.password || ''

  if (!identitas || !password) {
    return NextResponse.json(
      { error: 'Username/email dan password wajib diisi.' },
      { status: 400 }
    )
  }

  const { rows } = await sql`
    SELECT * FROM users WHERE username = ${identitas} OR email = ${identitas.toLowerCase()} LIMIT 1
  `
  const user = rows[0]

  if (!user) {
    return NextResponse.json({ error: 'Username/email atau password salah.' }, { status: 401 })
  }

  const cocok = await bcrypt.compare(password, user.password)
  if (!cocok) {
    return NextResponse.json({ error: 'Username/email atau password salah.' }, { status: 401 })
  }

  buatSessionCookie(user)

  return NextResponse.json({
    message: 'Login berhasil.',
    user: { username: user.username, nama: user.nama, role: user.role },
  })
}
