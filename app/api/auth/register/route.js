import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { sql, ensureSchema } from '../../../../lib/db'

export async function POST(request) {
  await ensureSchema()
  const body = await request.json().catch(() => ({}))
  const nama = (body.nama || '').trim()
  const username = (body.username || '').trim()
  const email = (body.email || '').trim().toLowerCase()
  const password = body.password || ''
  const konfirmasiPassword = body.konfirmasiPassword || body.konfirmasi_password || ''

  if (!nama || !username || !email || !password || !konfirmasiPassword) {
    return NextResponse.json({ error: 'Semua field wajib diisi.' }, { status: 400 })
  }
  if (password.length < 8) {
    return NextResponse.json({ error: 'Password minimal 8 karakter.' }, { status: 400 })
  }
  if (password !== konfirmasiPassword) {
    return NextResponse.json({ error: 'Konfirmasi password tidak cocok.' }, { status: 400 })
  }
  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  if (!emailValid) {
    return NextResponse.json({ error: 'Format email tidak valid.' }, { status: 400 })
  }

  try {
    const cek = await sql`
      SELECT 1 FROM users WHERE username = ${username} OR email = ${email} LIMIT 1
    `
    if (cek.rows.length > 0) {
      return NextResponse.json(
        { error: 'Username atau email sudah terdaftar.' },
        { status: 409 }
      )
    }

    const hash = await bcrypt.hash(password, 10)

    await sql`
      INSERT INTO users (nama, username, email, password, role)
      VALUES (${nama}, ${username}, ${email}, ${hash}, 'user')
    `

    return NextResponse.json(
      { message: 'Registrasi berhasil. Silakan login.' },
      { status: 201 }
    )
  } catch (err) {
    if (String(err).includes('duplicate key')) {
      return NextResponse.json(
        { error: 'Username atau email sudah terdaftar.' },
        { status: 409 }
      )
    }
    return NextResponse.json({ error: 'Gagal mendaftarkan akun.' }, { status: 500 })
  }
}
