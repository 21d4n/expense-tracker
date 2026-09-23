# PRD Expense Tracker

## Product Overview
Expense Tracker adalah aplikasi web untuk mencatat pemasukan dan pengeluaran serta melihat kondisi keuangan pribadi.

## Problem Statement
Pengguna membutuhkan catatan keuangan yang mudah dipantau, aman, dan terpisah berdasarkan akun.

## Objectives
- Pengguna dapat membuat akun dan masuk dengan aman.
- Pengguna dapat mengetahui saldo, total pemasukan, dan total pengeluaran.
- Pengguna dapat mengelola transaksi miliknya secara penuh.

## Actors
Satu aktor utama: pengguna terdaftar yang sedang login.

## MVP Scope
Register, login, session, logout, dashboard ringkasan, CRUD transaksi, filter pemasukan/pengeluaran, dan cookie preferensi.

## Out of Scope
Multi-currency, kategori transaksi, laporan grafik, ekspor data, transfer antar pengguna, notifikasi, dan deployment cloud.

## User Stories
- Sebagai pengguna, saya dapat mendaftar dan login.
- Sebagai pengguna, saya dapat melihat ringkasan kondisi keuangan.
- Sebagai pengguna, saya dapat menambah, mengubah, melihat, dan menghapus transaksi saya.
- Sebagai pengguna, saya dapat memfilter riwayat berdasarkan jenis transaksi.
- Sebagai pengguna, saya dapat logout dan menyimpan preferensi tampilan.

## Functional Requirements
- **FR-01** Register dengan nama, email, dan password.
- **FR-02** Login dengan email dan password yang benar.
- **FR-03** Pertahankan status login melalui session server-side.
- **FR-04** Tampilkan nama, saldo, total pemasukan, total pengeluaran, dan riwayat.
- **FR-05** Sediakan CRUD transaksi milik pengguna.
- **FR-06** Filter transaksi berdasarkan `INCOME` atau `EXPENSE`.
- **FR-07** Simpan minimal satu preferensi non-sensitif dalam cookie.
- **FR-08** Logout mengakhiri session.

## Non-Functional Requirements
Validasi server-side, authorization per operasi, password ter-hash, Prisma server-only, dan UI responsif.

## Acceptance Criteria
- Akun baru dengan email duplikat ditolak.
- Halaman terlindungi mengarahkan pengguna anonim ke login.
- Saldo = total pemasukan - total pengeluaran.
- Pengguna tidak dapat membaca atau mengubah transaksi pengguna lain.
- Session cookie `HttpOnly` dan logout menghapus session server-side.
