import crypto from 'crypto'
import { cookies } from 'next/headers'

// Padanan "config/session.php" untuk arsitektur Next.js.
// Next.js (App Router) tidak punya $_SESSION bawaan seperti PHP, jadi
// status login disimpan pada cookie HttpOnly yang ditandatangani (signed)
// dengan HMAC-SHA256 agar tidak bisa dipalsukan oleh client.

const COOKIE_NAME = 'sxc_session'
const MAX_AGE = 60 * 60 * 24 * 7 // 7 hari

function getSecret() {
  return process.env.SESSION_SECRET || 'ganti-secret-ini-di-.env.local-sesi-perpustakaan'
}

function base64url(input) {
  return Buffer.from(input).toString('base64url')
}

function sign(payload) {
  const data = base64url(JSON.stringify(payload))
  const hmac = crypto.createHmac('sha256', getSecret()).update(data).digest('base64url')
  return `${data}.${hmac}`
}

function verify(token) {
  if (!token || !token.includes('.')) return null
  const [data, hmac] = token.split('.')
  const expected = crypto.createHmac('sha256', getSecret()).update(data).digest('base64url')
  try {
    if (!crypto.timingSafeEqual(Buffer.from(hmac), Buffer.from(expected))) return null
  } catch {
    return null
  }
  try {
    return JSON.parse(Buffer.from(data, 'base64url').toString('utf8'))
  } catch {
    return null
  }
}

// Dipanggil dari route login untuk membuat "session" setelah kredensial valid.
// Menyimpan: user_id, username, nama, role — sesuai spesifikasi.
export function buatSessionCookie(user) {
  const payload = {
    user_id: user.id,
    username: user.username,
    nama: user.nama,
    role: user.role,
    iat: Date.now(),
  }
  const token = sign(payload)
  cookies().set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: MAX_AGE,
  })
}

// Dipanggil dari route logout untuk menghapus seluruh session.
export function hapusSessionCookie() {
  cookies().set(COOKIE_NAME, '', { path: '/', maxAge: 0 })
}

// Dipanggil dari server component / route API untuk mengecek status login.
// Mengembalikan null jika belum login (padanan "redirect ke login.php").
export function getSession() {
  const token = cookies().get(COOKIE_NAME)?.value
  return verify(token)
}

export { COOKIE_NAME }
