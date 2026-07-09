import { NextResponse } from 'next/server'
import { hapusSessionCookie } from '../../../../lib/session'

export async function POST() {
  hapusSessionCookie()
  return NextResponse.json({ message: 'Logout berhasil.' })
}
