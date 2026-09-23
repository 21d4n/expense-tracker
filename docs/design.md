# Design UI Expense Tracker

Design mengikuti `questui-DESIGN.md`: antarmuka fantasy RPG bernuansa cokelat gelap, gold, parchment, border angular, dan glow seperlunya.

## Konvensi
- Heading dan label: Cinzel; body: Spectral; kode: Fira Code.
- Background `#1A0F0A`, surface `#2C1A10`, elevated `#3D2517`, gold `#CA8A04`, teks `#F5E6D3`.
- Spacing berbasis 8px, radius 2-4px untuk kontrol utama, kartu dengan border dan top accent gold.
- Tombol primary gold, secondary outline gold, destructive deep red. Disabled opacity 35%.

## Pages dan Navigasi
- `/`: landing singkat dengan CTA Daftar/Masuk.
- `/register`: form nama, email, password, konfirmasi password.
- `/login`: form email dan password, link ke register.
- `/dashboard`: header nama/logout, kartu saldo/pemasukan/pengeluaran, filter, riwayat, CTA tambah transaksi.
- `/dashboard/transactions/new` dan `/dashboard/transactions/[id]/edit`: form transaksi.

Navigasi desktop berupa header sederhana. Mobile menggunakan header wrap dan kontrol full-width bila diperlukan. Area terlindungi hanya dapat dibuka setelah session diverifikasi di server.

## Komponen dan States
Kartu ringkasan memakai top border gold. Tabel/list transaksi menampilkan tanggal, deskripsi, tipe chip, nominal, edit, dan hapus. Hapus memakai dialog konfirmasi.

Setiap halaman memiliki loading skeleton sederhana, empty state yang memberi CTA, dan error state dengan pesan aman. Form menampilkan error per field, status submit, dan disabled state.

## Responsif
Dashboard memakai satu kolom di mobile dan grid ringkasan di desktop. List transaksi berubah menjadi kartu atau tabel yang dapat discroll horizontal pada layar kecil. Touch target minimal 40px.
