# Pustaka Indeks — Sistem Manajemen Perpustakaan

Tugas Akhir Semester (UAS) Mata Kuliah Pemrograman Web — Kelompok 9

**Anggota Kelompok:**
- M. Akbar Putra Sandy — NPM 243510916
- Muhammad Nur Rahman — NPM 243510799
- Ilham Dani — NPM 243510439

## 1. Latar Belakang

Pengelolaan perpustakaan secara manual (pencatatan di buku besar) rentan terhadap kesalahan pencatatan, sulit dilacak, dan tidak efisien. Aplikasi ini dibangun untuk mendigitalkan proses pendataan koleksi buku, keanggotaan, serta transaksi peminjaman dan pengembalian buku.

## 2. Tujuan

- Mempermudah pengelolaan data buku, anggota, dan transaksi peminjaman.
- Menyediakan fitur CRUD (Create, Read, Update, Delete) penuh pada setiap entitas.
- Menjadi studi kasus penerapan aplikasi web full-stack yang ter-deploy dan dapat diakses publik.

## 3. Teknologi yang Digunakan

| Komponen        | Teknologi                             |
|-----------------|----------------------------------------|
| Framework       | Next.js 14 (App Router)                |
| Bahasa          | JavaScript (React)                     |
| Styling         | Tailwind CSS                           |
| Database        | Vercel Postgres (PostgreSQL)           |
| API             | Next.js Route Handlers (REST API)      |
| Hosting/Deploy  | Vercel                                 |
| Version Control | Git & GitHub                           |

## 4. Arsitektur & Alur Kerja

```
Browser (Client Component React)
        │  fetch() → JSON
        ▼
Next.js Route Handler (/app/api/**)
        │  SQL query (@vercel/postgres)
        ▼
Vercel Postgres (PostgreSQL Database)
```

- **buku** — menyimpan data koleksi buku (judul, penulis, penerbit, tahun, kode rak, stok).
- **anggota** — menyimpan data anggota perpustakaan (nama, NPM, email).
- **peminjaman** — mencatat transaksi peminjaman, mereferensikan `buku` dan `anggota`, menyimpan tanggal pinjam/jatuh tempo/kembali serta status.

Saat buku dipinjam, stok otomatis berkurang. Saat dikembalikan, stok otomatis bertambah kembali.

## 5. Fitur Aplikasi

- **Buku**: tambah, lihat, ubah, hapus data buku + kartu stok visual.
- **Anggota**: tambah, lihat, ubah, hapus data anggota (NPM unik).
- **Peminjaman**: catat peminjaman baru (validasi stok), tandai buku dikembalikan, hapus transaksi, indikator "Terlambat" otomatis.
- **Dashboard**: ringkasan jumlah buku, stok, anggota, peminjaman aktif, dan keterlambatan.

## 6. Menjalankan Secara Lokal

```bash
npm install
cp .env.example .env.local
# isi .env.local dengan kredensial database (lihat langkah 7)
npm run dev
```

Buka `http://localhost:3000`.

## 7. Panduan Deploy ke Vercel (langkah demi langkah)

### A. Push ke GitHub
```bash
git init
git add .
git commit -m "Initial commit: Sistem Manajemen Perpustakaan"
git branch -M main
git remote add origin https://github.com/<username-kamu>/<nama-repo>.git
git push -u origin main
```

### B. Deploy di Vercel
1. Buka [vercel.com](https://vercel.com) → login pakai akun GitHub.
2. Klik **Add New → Project**, pilih repository yang baru di-push.
3. Framework Preset otomatis terdeteksi sebagai **Next.js**. Klik **Deploy** (belum akan berhasil sepenuhnya karena database belum ada — tidak apa-apa).

### C. Buat Database Vercel Postgres
1. Di dashboard project Vercel, buka tab **Storage** → **Create Database** → pilih **Postgres**.
2. Beri nama database, pilih region terdekat, klik **Create**.
3. Setelah dibuat, klik **Connect Project** dan hubungkan ke project kamu. Vercel akan otomatis menambahkan environment variable (`POSTGRES_URL`, dll) ke project.

### D. Redeploy
1. Kembali ke tab **Deployments**, klik titik tiga pada deployment terakhir → **Redeploy**.
   (Ini perlu dilakukan agar environment variable database baru terbaca.)
2. Tabel `buku`, `anggota`, dan `peminjaman` akan otomatis dibuat sendiri saat API pertama kali diakses (lihat `lib/db.js`), jadi tidak perlu migrasi manual.
3. Buka URL deployment (misalnya `https://nama-project.vercel.app`) — aplikasi siap dipakai.

> Jika ingin mengisi data contoh secara manual, jalankan isi file `schema.sql` di tab **Query** pada dashboard Vercel Postgres.

## 8. Struktur Folder

```
app/
  api/buku/            → REST API buku (GET, POST, PUT, DELETE)
  api/anggota/         → REST API anggota
  api/peminjaman/      → REST API peminjaman
  buku/page.jsx        → Halaman CRUD Buku
  anggota/page.jsx     → Halaman CRUD Anggota
  peminjaman/page.jsx  → Halaman CRUD Peminjaman
  page.jsx             → Dashboard/Ringkasan
  layout.jsx           → Layout utama + navigasi
lib/db.js              → Koneksi & inisialisasi skema database
schema.sql             → Skema SQL manual (opsional)
```

## 9. Catatan untuk Video Presentasi

Saat presentasi, tunjukkan alur berikut agar sesuai rubrik penilaian:
1. Jelaskan latar belakang, tujuan, dan tools (gunakan bagian 1–3 README ini sebagai referensi PPT).
2. Jelaskan arsitektur/alur kerja (bagian 4).
3. Demokan CRUD penuh: tambah buku → ubah data anggota → catat peminjaman → tandai dikembalikan → hapus salah satu data.
4. Tunjukkan aplikasi diakses lewat browser dari URL Vercel (bukan localhost).
5. Tunjukkan repository GitHub yang berisi source code ini.
