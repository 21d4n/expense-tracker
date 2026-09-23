# SRS Expense Tracker

## System Overview
Next.js App Router menangani halaman dan Server Actions/logic server. Prisma mengakses PostgreSQL. Browser membawa opaque session cookie, bukan identitas pengguna.

## Technology Stack
Next.js, TypeScript, Tailwind CSS v4, ESLint, PostgreSQL, Prisma, Zod, dan bcryptjs.

## Feature Specifications
- **Auth:** form register/login divalidasi Zod; password di-hash bcryptjs; session dibuat setelah login.
- **Dashboard:** query agregat dan transaksi dengan filter `userId` dari session tepercaya.
- **Transaction:** create/read/update/delete dengan validasi jumlah positif, tipe valid, dan deskripsi wajib.
- **Preference:** cookie biasa untuk preferensi tampilan, tidak dipakai sebagai sumber authorization.

## Main and Error Flows
Alur utama: submit form -> validasi server -> operasi Prisma -> redirect/revalidate. Error validasi ditampilkan dekat form; email duplikat, kredensial salah, session kadaluarsa, dan transaksi tidak ditemukan diberi pesan aman.

## Server-Side Validation
Nama wajib, email format valid, password minimal 8 karakter, nominal lebih besar dari 0, deskripsi tidak kosong, dan tipe hanya `INCOME`/`EXPENSE`.

## Database Entities
`User` memiliki banyak `Session` dan `Transaction`. `Session` menyimpan hash token dan masa berlaku. `Transaction` memiliki tipe, nominal, deskripsi, dan waktu transaksi.

## Business Rules
- **BR-01** Setiap transaksi wajib memiliki satu pemilik.
- **BR-02** Saldo adalah pemasukan dikurangi pengeluaran.
- **BR-03** Semua query transaksi wajib membatasi `userId` pemilik.
- **BR-04** Session kadaluarsa tidak boleh mengakses fitur terlindungi.

## Security Requirements
- **SEC-01** Password tidak pernah disimpan dalam bentuk asli.
- **SEC-02** Session cookie menggunakan `HttpOnly`, `SameSite=Lax`, `Path=/`, dan `Secure` di production.
- **SEC-03** Input divalidasi dengan Zod dan query memakai Prisma API.
- **SEC-04** Error database mentah dan rahasia tidak dikirim ke client.

## Traceability
FR-01..03 -> Auth; FR-04 -> Dashboard; FR-05..06 -> Transactions; FR-07 -> Preference; FR-08 -> Logout. BR-01..04 dan SEC-01..04 berlaku lintas fitur.
