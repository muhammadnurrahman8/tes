import { Pool } from 'pg'
import bcrypt from 'bcryptjs'

// Pool koneksi ke PostgreSQL. Mendukung variabel environment standar
// yang disediakan oleh integrasi database apa pun di Vercel
// (Neon/Postgres) maupun POSTGRES_URL/DATABASE_URL secara umum.
const connectionString =
  process.env.POSTGRES_URL ||
  process.env.DATABASE_URL ||
  process.env.POSTGRES_PRISMA_URL

let pool

function getPool() {
  if (!pool) {
    if (!connectionString) {
      throw new Error(
        'Koneksi database belum diatur. Tambahkan POSTGRES_URL pada environment variable.'
      )
    }
    pool = new Pool({
      connectionString,
      ssl: connectionString.includes('localhost') ? false : { rejectUnauthorized: false },
    })
  }
  return pool
}

// Fungsi tagged-template sederhana yang meniru API @vercel/postgres,
// supaya query di seluruh route API tetap ditulis dengan sql`...`.
export async function sql(strings, ...values) {
  let text = ''
  strings.forEach((chunk, i) => {
    text += chunk
    if (i < values.length) text += `$${i + 1}`
  })
  const result = await getPool().query(text, values)
  return { rows: result.rows }
}

let schemaSiap = false

export async function ensureSchema() {
  if (schemaSiap) return
  await sql`
    CREATE TABLE IF NOT EXISTS buku (
      id SERIAL PRIMARY KEY,
      judul TEXT NOT NULL,
      penulis TEXT NOT NULL,
      penerbit TEXT,
      tahun_terbit INTEGER,
      kode_rak TEXT,
      stok INTEGER NOT NULL DEFAULT 1,
      dibuat_pada TIMESTAMPTZ NOT NULL DEFAULT now()
    );
  `
  await sql`
    CREATE TABLE IF NOT EXISTS anggota (
      id SERIAL PRIMARY KEY,
      nama TEXT NOT NULL,
      npm TEXT NOT NULL UNIQUE,
      email TEXT,
      dibuat_pada TIMESTAMPTZ NOT NULL DEFAULT now()
    );
  `
  await sql`
    CREATE TABLE IF NOT EXISTS peminjaman (
      id SERIAL PRIMARY KEY,
      buku_id INTEGER NOT NULL REFERENCES buku(id) ON DELETE CASCADE,
      anggota_id INTEGER NOT NULL REFERENCES anggota(id) ON DELETE CASCADE,
      tanggal_pinjam DATE NOT NULL DEFAULT CURRENT_DATE,
      tanggal_jatuh_tempo DATE NOT NULL,
      tanggal_kembali DATE,
      status TEXT NOT NULL DEFAULT 'dipinjam',
      dibuat_pada TIMESTAMPTZ NOT NULL DEFAULT now()
    );
  `
  // Tabel akun pengguna untuk fitur Login / Register.
  // Skema disesuaikan dari MySQL ke PostgreSQL (SERIAL, TIMESTAMPTZ)
  // karena project ini memakai Postgres, bukan MySQL.
  await sql`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      nama VARCHAR(100) NOT NULL,
      username VARCHAR(50) UNIQUE NOT NULL,
      email VARCHAR(100) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      role VARCHAR(10) NOT NULL DEFAULT 'user' CHECK (role IN ('admin','user')),
      created_at TIMESTAMPTZ NOT NULL DEFAULT now()
    );
  `

  await seedDefaultUsers()

  schemaSiap = true
}

// Menambahkan akun bawaan (admin & user demo) jika tabel users masih kosong.
// Password disimpan dalam bentuk hash bcrypt, tidak pernah plain text.
async function seedDefaultUsers() {
  const { rows } = await sql`SELECT COUNT(*)::int AS n FROM users`
  if (rows[0].n > 0) return

  const adminHash = await bcrypt.hash('admin123', 10)
  const userHash = await bcrypt.hash('user12345', 10)

  await sql`
    INSERT INTO users (nama, username, email, password, role) VALUES
      ('Administrator', 'admin', 'admin@skillxchange.com', ${adminHash}, 'admin'),
      ('Demo User', 'user', 'user@skillxchange.com', ${userHash}, 'user')
    ON CONFLICT DO NOTHING
  `
}
