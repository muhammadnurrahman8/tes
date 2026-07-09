-- Jalankan skrip ini di tab "Query" pada dashboard Vercel Postgres
-- jika ingin membuat tabel secara manual sebelum aplikasi pertama kali dijalankan.
-- (Aplikasi ini juga otomatis membuat tabel ini sendiri saat API pertama kali dipanggil.)

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

CREATE TABLE IF NOT EXISTS anggota (
  id SERIAL PRIMARY KEY,
  nama TEXT NOT NULL,
  npm TEXT NOT NULL UNIQUE,
  email TEXT,
  dibuat_pada TIMESTAMPTZ NOT NULL DEFAULT now()
);

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

-- Tabel akun pengguna untuk fitur Login / Register / Logout.
-- Catatan: skema asli pada spesifikasi ditulis dalam sintaks MySQL
-- (INT AUTO_INCREMENT, ENUM). Karena database project ini adalah
-- PostgreSQL, disesuaikan menjadi SERIAL + CHECK constraint, dengan
-- struktur kolom yang sama persis (nama, username, email, password, role, created_at).
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  nama VARCHAR(100) NOT NULL,
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(10) NOT NULL DEFAULT 'user' CHECK (role IN ('admin','user')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Akun bawaan. Password sudah dalam bentuk hash bcrypt (bukan plain text):
--   admin  / admin123    -> role admin
--   user   / user12345   -> role user
INSERT INTO users (nama, username, email, password, role) VALUES
  ('Administrator', 'admin', 'admin@skillxchange.com', '$2b$10$zLBEg9zG9d5UbSUnvzyuSOZYrQ62FTDOn71lxmXyMqVM5SPscEyii', 'admin'),
  ('Demo User', 'user', 'user@skillxchange.com', '$2b$10$6kBZDT839pzs.VppaEzrM.38O2GwEcPTEdI02XlJ3Q4lgbvbu2mYa', 'user')
ON CONFLICT DO NOTHING;

-- Contoh data awal (opsional)
INSERT INTO buku (judul, penulis, penerbit, tahun_terbit, kode_rak, stok) VALUES
  ('Laskar Pelangi', 'Andrea Hirata', 'Bentang Pustaka', 2005, 'F-AND-001', 3),
  ('Bumi Manusia', 'Pramoedya Ananta Toer', 'Hasta Mitra', 1980, 'F-PRA-002', 2)
ON CONFLICT DO NOTHING;
