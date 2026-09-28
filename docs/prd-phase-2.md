# PRD Expense Tracker — Fase 2

## Konteks Produk
Fase ini melanjutkan aplikasi, repositori, database, dan deployment Expense Tracker dari fase sebelumnya; tidak membuat repositori baru. [PRD fase 1](prd.md) tetap berlaku untuk fitur dasar. PM fase 2 adalah **Devano Trestanto**. Setelah evaluasi deployment, fokusnya ialah mengurangi full page reload, memeriksa kembali fitur yang ada, meredesain seluruh UI menjadi fintech gelap yang modern dan profesional, lalu menambah budget bulanan privat.

## Masalah dan Tujuan
- Aksi pada dashboard, transaksi, dan filter belum konsisten memberi pengalaman yang lancar tanpa hard reload; data yang saling berkaitan harus tetap sinkron.
- Pengguna belum dapat menetapkan batas pengeluaran dan memantau penggunaannya per bulan.
- UI fase pertama bertema fantasy RPG; pengalaman baru perlu konsisten, mudah dibaca, responsif, dan sesuai konteks keuangan.

Keberhasilan fase ini berarti pengguna dapat memakai tiga area AJAX wajib tanpa hard reload, melihat perubahan data terbaru, serta menetapkan dan memantau budget miliknya untuk bulan tertentu tanpa membuka data pengguna lain.

## Aktor dan Cakupan
Aktor utama tetap pengguna terdaftar yang memiliki session valid. Halaman publik dan auth turut diredesain. Evaluasi fitur lama mencakup pemeriksaan alur dashboard, manajemen transaksi, filter, serta regresi register, login, session, dan logout.

## User Stories
- Sebagai pengguna, saya dapat menambah, mengubah, menghapus, dan memfilter transaksi tanpa full page reload, lalu melihat ringkasan yang sesuai.
- Sebagai pengguna, saya dapat membuat dan mengubah nominal budget untuk bulan pilihan saya.
- Sebagai pengguna, saya dapat memilih bulan dan melihat budget, pengeluaran, sisa, persentase, serta status untuk bulan tersebut tanpa full page reload.
- Sebagai pengguna, saya mendapat peringatan dalam aplikasi ketika pengeluaran melebihi budget.
- Sebagai pengguna, saya yakin budget dan transaksi milik akun lain tidak dapat saya akses.

## Functional Requirements Fase 2
- **FR-09 — Evaluasi:** periksa alur sukses dan gagal fitur lama; perbaiki masalah pada dashboard, CRUD transaksi, dan filter sebelum menyatakan optimasi selesai.
- **FR-10 — AJAX dashboard:** ringkasan dan riwayat memuat data terbaru setelah perubahan transaksi tanpa hard reload dokumen browser.
- **FR-11 — AJAX transaksi:** tambah, ubah, dan hapus transaksi menyediakan status pending dan error yang jelas; keberhasilan memperbarui tampilan terkait tanpa hard reload.
- **FR-12 — AJAX filter:** pilihan semua/pemasukan/pengeluaran memperbarui riwayat tanpa hard reload, konsisten dengan URL, dan tetap benar saat tautan dibuka ulang.
- **FR-13 — Set Budget:** pengguna dapat membuat atau mengubah satu nominal budget positif untuk setiap bulan miliknya; duplikasi budget untuk bulan yang sama tidak terjadi.
- **FR-14 — Budget Summary:** tampilkan budget, jumlah transaksi `EXPENSE` pada bulan pilihan, dan sisa = budget − pengeluaran; sisa boleh negatif.
- **FR-15 — Budget Indicator dan alert:** tampilkan persentase penggunaan, status Aman (<80%), Mendekati Batas (80–100%), atau Melebihi Anggaran (>100%). Pada status terlampaui tampilkan alert di aplikasi.
- **FR-16 — Monthly Budget:** pilih bulan untuk memperbarui budget, pengeluaran, sisa, persentase, dan status tanpa hard reload; tautan bulan pilihan dapat dibuka kembali.
- **FR-17 — Privasi:** seluruh pembacaan dan penulisan budget berdasarkan `userId` dari session server-side, bukan nilai dari browser.
- **FR-18 — Redesain:** landing, auth, dashboard, transaksi, dan budget memakai bahasa visual fintech gelap sesuai [panduan desain](design.md), termasuk state loading, kosong, dan error.

Navigasi client-side Next.js dan Server Actions diperbolehkan untuk memenuhi AJAX; penggunaan `fetch()` manual bukan syarat. Berpindah rute di dalam aplikasi boleh, tetapi aksi di atas tidak boleh memuat ulang seluruh dokumen browser.

## Aturan Produk
- Pengeluaran budget hanya menjumlah transaksi `EXPENSE` pemilik berdasarkan `occurredAt` dalam bulan terpilih menurut **Asia/Jakarta**; pemasukan tidak memengaruhi budget. Mengubah tipe, nominal, tanggal, atau menghapus transaksi harus tercermin pada hasil berikutnya.
- Bila budget belum ada, tampilkan keadaan kosong dan ajakan menetapkan budget. Jangan menampilkan angka persentase dari pembagian dengan nol; pengeluaran bulan tersebut tetap dapat diketahui.
- Nominal budget lebih besar dari nol, satu budget untuk kombinasi pengguna/tahun/bulan. Rentang dan presisi nominal mengikuti `Decimal(14,2)` transaksi.
- Alert bersifat tampilan dalam aplikasi, bukan email/push; tepat 100% masih Mendekati Batas dan lebih dari 100% Melebihi Anggaran.

## Non-Functional Requirements
- Validasi input penting dengan Zod di server; authorization pada setiap operasi terproteksi, Prisma server-only, cookie session HttpOnly, dan pesan error tidak membocorkan data pengguna lain.
- Status loading, sukses/gagal, empty state, responsivitas dan aksesibilitas dasar (label, fokus keyboard, teks selain warna untuk status) berlaku di seluruh UI.
- Schema dan migration diterapkan pada database proyek yang sama tanpa menghilangkan data lama; pembagian kepemilikan ada di [tugas fase 2](tasks-phase-2.md).

## Acceptance Criteria
1. Tambah, ubah, hapus, filter, dan memilih bulan tidak menghasilkan hard reload; keadaan pending/error terlihat, data yang terdampak tampil terbaru. Uji juga membuka URL filter/bulan secara langsung.
2. Ringkasan saldo tetap pemasukan − pengeluaran; filter jenis hanya memengaruhi riwayat, bukan total global pada ringkasan lama.
3. Budget untuk September 2026 Rp3.000.000 dengan pengeluaran Rp2.000.000 menampilkan sisa Rp1.000.000 dan penggunaan sekitar 66,67% (Aman).
4. Pada 80% dan 100% status Mendekati Batas; di atas 100% status Melebihi Anggaran, sisa negatif, dan alert tampil.
5. Transaksi `INCOME` dan transaksi `EXPENSE` bulan lain tidak masuk pengeluaran bulan terpilih; perubahan tanggal/nominal/tipe dan penghapusan transaksi mengubah hasil yang sesuai.
6. Pengguna A tidak dapat membaca atau mengubah budget B, termasuk dengan URL/ID yang ditebak; anonymous/session kedaluwarsa ditolak.
7. Bulan tanpa budget memberi empty state tanpa pembagian dengan nol; input nominal/bulan tidak valid ditolak dengan pesan aman.
8. Seluruh halaman mengikuti desain fase 2 dan dapat digunakan di desktop/mobile; fitur fase 1 tetap berjalan.

## Di Luar Cakupan
Budget per kategori, rollover/anggaran berulang otomatis, hapus budget sebagai fitur wajib, notifikasi email/push, berbagi budget, multi-currency, grafik prediksi, serta pembuatan repositori/deployment baru.

## Ketergantungan dan Selesai
PM menyepakati kontrak schema, parameter URL, aturan bulan, antarmuka aksi, dan token desain **sebelum** tiga programmer mulai secara paralel. Pengujian mencakup dua akun, batas bulan WIB, alur sukses/gagal, lint, typecheck, build, migration dan pemeriksaan deployment pada proyek yang sama. Detail implementasi ada di [SRS fase 2](srs-phase-2.md).
