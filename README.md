# Expense Tracker

Aplikasi web untuk membantu pengguna mencatat, memantau, dan mengelola pemasukan serta pengeluaran pribadi.

## Kesimpulan Sistem

Expense Tracker menggunakan akun pengguna dan session server-side agar setiap pengguna hanya dapat mengakses transaksi miliknya sendiri. Pengguna dapat melihat kondisi keuangan melalui saldo, total pemasukan, total pengeluaran, dan riwayat transaksi.

Sistem dirancang sebagai MVP untuk praktikum dengan arsitektur sederhana, aman, dan mudah dikembangkan secara paralel oleh tiga programmer.

## Fitur Utama

- Register dan login pengguna.
- Session login menggunakan cookie `HttpOnly`.
- Logout untuk mengakhiri session.
- Dashboard ringkasan keuangan.
- CRUD transaksi pemasukan dan pengeluaran.
- Filter transaksi berdasarkan jenis.
- Cookie untuk menyimpan preferensi tampilan non-sensitif.
- Authorization berdasarkan pemilik transaksi.

## Aktor

Pengguna terdaftar yang sudah login. Setiap pengguna hanya dapat melihat, mengubah, dan menghapus transaksi miliknya sendiri.

## Teknologi

- Next.js App Router
- TypeScript
- Tailwind CSS
- PostgreSQL
- Prisma ORM
- Zod
- bcryptjs

## Arsitektur Singkat

Browser mengakses halaman Next.js. Operasi yang membutuhkan database berjalan di server menggunakan Prisma. Password disimpan dalam bentuk hash bcryptjs. Browser hanya menyimpan opaque session token melalui cookie `HttpOnly`; identitas dan authorization tetap diverifikasi dari database di server.

## Struktur Database

- `User`: data akun pengguna dan password hash.
- `Session`: session server-side dengan token hash dan waktu kedaluwarsa.
- `Transaction`: data transaksi yang terhubung ke pemiliknya.

Relasi utama:

```text
User 1 ---- * Session
User 1 ---- * Transaction
```

Saldo dihitung dengan rumus:

```text
Saldo = Total Pemasukan - Total Pengeluaran
```

## Design UI

UI mengikuti QuestUI Design System dengan tema fantasy RPG:

- Background cokelat gelap dan surface berlapis.
- Gold sebagai warna aksi utama.
- Cinzel untuk heading dan Spectral untuk body text.
- Card dengan border, top accent, dan gold glow seperlunya.
- Responsive untuk desktop dan mobile.

## Dokumentasi

- [`docs/prd.md`](docs/prd.md): kebutuhan produk dan acceptance criteria.
- [`docs/srs.md`](docs/srs.md): spesifikasi sistem, business rules, dan security requirements.
- [`docs/erd.md`](docs/erd.md): entitas, relasi, constraints, dan diagram ERD.
- [`docs/design.md`](docs/design.md): panduan halaman dan komponen UI.
- [`docs/tasks.md`](docs/tasks.md): pembagian tugas tiga programmer.
- [`docs/setup.md`](docs/setup.md): langkah setup lokal dan troubleshooting.

## Pembagian Programmer

### Programmer 1: Auth dan Session

Register, login, logout, password hashing, session cookie, dan proteksi halaman.

### Programmer 2: Dashboard Keuangan

Nama pengguna, saldo, total pemasukan, total pengeluaran, riwayat transaksi, serta loading/empty/error state.

### Programmer 3: Manajemen Transaksi

Tambah, lihat, edit, hapus, filter transaksi, validasi transaksi, dan preferensi tampilan.

Semua programmer memakai schema Prisma dan migration yang sama. Fondasi PM menyediakan database contract, struktur project, dokumentasi, dan konfigurasi bersama.

## Setup Lokal

Pastikan PostgreSQL sudah terinstall dan berjalan, lalu buat database:

```sql
CREATE DATABASE expense_tracker;
```

Jalankan perintah berikut dari root project:

```bash
npm install
copy .env.example .env
npx prisma generate
npx prisma migrate dev
npm run dev
```

Isi password PostgreSQL sendiri di `.env`:

```env
DATABASE_URL="postgresql://postgres:PASSWORD_KAMU@localhost:5432/expense_tracker"
```

Aplikasi berjalan di `http://localhost:3000`.

## Verifikasi Fondasi

Fondasi PM telah diverifikasi dengan:

```bash
npx prisma validate
npx prisma generate
npm run lint
npm run build
```

Migration awal tersedia di `prisma/migrations/20260923000000_init/`. Fitur bisnis auth, dashboard, dan CRUD transaksi dikerjakan sesuai pembagian programmer.
