# Pembagian Tugas

Semua programmer mulai dari `main` terbaru. Shared layout, global styles, Prisma schema, dan konfigurasi tetap PM-owned setelah fondasi.

## Programmer 1 — Auth dan Session
### Suggested Branch
`feature/auth-session`
### Requirements
- FR-01, FR-02, FR-03, FR-08
### Scope
Register, login, logout, proteksi route, dan cookie session server-side.
### Pages / Routes
- `/register`, `/login`, aksi logout, redirect protected route.
### Server Responsibilities
Hash/compare password, buat dan hapus session, baca session dari cookie, validasi akses.
### Database Models Used
`User`, `Session`.
### Validation
Zod untuk nama, email, password; email case-normalized; pesan error aman.
### Primary File / Module Ownership
- `src/app/(auth)/**`
- `src/actions/auth.ts`
- `src/lib/auth.ts`
### Acceptance Criteria
- [ ] Register dan login berhasil untuk input valid.
- [ ] Password tidak disimpan plaintext dan cookie session HttpOnly.
- [ ] Logout menghapus session dan cookie.
### Dependencies
PM foundation only.
### Can Start Immediately
Yes.

## Programmer 2 — Dashboard Keuangan
### Suggested Branch
`feature/financial-dashboard`
### Requirements
- FR-04
### Scope
Dashboard dengan nama pengguna, tiga ringkasan saldo, dan loading/empty/error state.
### Pages / Routes
- `/dashboard`
### Server Responsibilities
Verifikasi session, query agregat dan riwayat milik user, format nominal/tanggal.
### Database Models Used
`User`, `Transaction`.
### Validation
Filter query hanya menerima `all`, `INCOME`, atau `EXPENSE`.
### Primary File / Module Ownership
- `src/app/dashboard/page.tsx`
- `src/components/dashboard/**`
### Acceptance Criteria
- [ ] Ringkasan sesuai transaksi user yang login.
- [ ] Saldo memakai rumus pemasukan dikurangi pengeluaran.
- [ ] User anonim tidak dapat melihat dashboard.
### Dependencies
PM foundation only.
### Can Start Immediately
Yes.

## Programmer 3 — CRUD dan Filter Transaksi
### Suggested Branch
`feature/transaction-management`
### Requirements
- FR-05, FR-06, FR-07
### Scope
Tambah, edit, hapus, daftar/filter transaksi, dan preference cookie non-sensitif.
### Pages / Routes
- `/dashboard/transactions/new`, `/dashboard/transactions/[id]/edit`
### Server Responsibilities
CRUD terotorisasi dengan owner filter, revalidate dashboard, konfirmasi delete.
### Database Models Used
`Transaction`.
### Validation
Zod untuk tipe, nominal positif, deskripsi, dan tanggal transaksi.
### Primary File / Module Ownership
- `src/app/dashboard/transactions/**`
- `src/actions/transactions.ts`
- `src/components/transactions/**`
### Acceptance Criteria
- [ ] Semua operasi CRUD berhasil untuk transaksi milik sendiri.
- [ ] ID transaksi user lain ditolak/tidak ditemukan.
- [ ] Filter pemasukan/pengeluaran berjalan dan preference cookie tidak sensitif.
### Dependencies
PM foundation only.
### Can Start Immediately
Yes.
