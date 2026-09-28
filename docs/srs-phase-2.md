# SRS Expense Tracker — Fase 2

## 1. Ruang Lingkup dan Acuan
Dokumen ini merinci [PRD fase 2](prd-phase-2.md) di atas [SRS fase 1](srs.md). Stack tetap Next.js App Router, React, TypeScript, Prisma/PostgreSQL, Zod dan Tailwind CSS. UI merujuk [desain fase 2](design.md) dan relasi data baru ke [ERD fase 2](erd-phase-2.md). Session pengguna tetap berasal dari cookie HttpOnly dan dicek di server. Tidak ada repositori atau database baru.

## 2. Kontrak Integrasi yang Disiapkan PM
PM **Devano Trestanto** menetapkan fondasi sebelum pekerjaan paralel: model/migration Budget dan Prisma Client yang diperbarui, token desain di global styles, serta kontrak berikut. File bersama milik PM; kepemilikan lengkap ada di [tasks-phase-2.md](tasks-phase-2.md).

| Kontrak | Spesifikasi |
| --- | --- |
| Filter dashboard | `?type=all|INCOME|EXPENSE`; nilai tidak valid dinormalisasi ke `all`. Preferensi filter di cookie bila dipakai hanya preferensi, bukan identitas. |
| Bulan dashboard | `?month=YYYY-MM`, format kalender valid; default bulan sekarang di Asia/Jakarta. Parameter `type` dan `month` dipertahankan saat salah satunya berubah. |
| Identitas | Semua aksi/query terlindungi memperoleh `userId` dari session tepercaya (mis. `requireAuth`/helper server), tidak menerima `userId` dari form/query. |
| Perubahan transaksi | Server Action tetap otoritatif; kegagalan mengembalikan pesan aman dan field errors bila relevan. Sukses melakukan invalidasi data yang terdampak (`/dashboard` dan halaman budget bila ada); client menampilkan hasil terbaru lewat navigasi App Router/refresh client-side tanpa hard reload. |
| Perubahan budget | Aksi server membuat atau memperbarui budget bulan milik pengguna, mengembalikan error validasi/akses aman bila gagal, dan menginvalidasi tampilan dashboard/budget bila berhasil. |
| Komponen lintas modul | Programmer dashboard memakai antarmuka tombol hapus transaksi milik programmer transaksi tanpa mengubah implementasi komponen itu. Komponen dashboard budget mengambil data lewat kontrak schema, bukan mengimpor komponen halaman edit budget. |

AJAX di sini berarti browser tidak melakukan document reload; RSC navigation, Server Actions, dan pembaruan client-side sah tanpa kewajiban memakai `fetch()` manual. Status pending/error harus terlihat. Redirect melalui navigasi client-side setelah aksi berhasil boleh bila ringkasan tetap diperbarui dan tidak ada hard reload.

## 3. Data, Tanggal, dan Perhitungan
- PM menambah model `Budget(id String PK, userId String FK, year Int, month Int, amount Decimal(14,2), createdAt DateTime, updatedAt DateTime)` dengan relasi `User 1—N Budget`, penghapusan user `Cascade`, dan constraint unik `@@unique([userId, year, month])`. Migration tidak mengubah/menghapus transaksi yang ada.
- `year` adalah tahun empat digit yang divalidasi; `month` integer 1–12. Input tahun-bulan menggunakan format `YYYY-MM` dan divalidasi dengan Zod, termasuk bulan yang tidak valid. Budget bernilai > 0, presisi maksimal dua desimal, serta tidak melampaui rentang `Decimal(14,2)`. Bandingkan nominal dengan Decimal untuk perhitungan uang; format angka hanya di batas UI.
- Bulan dihitung menurut **Asia/Jakarta**. Query pengeluaran membatasi `userId` dari session, `type: EXPENSE`, dan `occurredAt >= awal bulan WIB` serta `occurredAt < awal bulan berikutnya WIB`, dengan batas dikonversi ke instant UTC untuk Prisma. Tidak menggunakan `createdAt` atau filter transaksi tampilan sebagai sumber total budget.
- `totalExpense = sum(amount)` atau 0; `remaining = amount − totalExpense`; `usagePercent = (totalExpense / amount) × 100`. Perbandingan status menggunakan angka tidak dibulatkan; pembulatan persentase hanya untuk tampilan. Bila belum ada budget, budget/sisa/persentase/status ditandai belum tersedia, pengeluaran tetap ditampilkan, dan ada CTA membuat budget.
- Status: `usagePercent < 80` Aman; `80 <= usagePercent <= 100` Mendekati Batas; `usagePercent > 100` Melebihi Anggaran dan alert tampak. Sisa negatif tidak dipotong ke nol; visual progress boleh dibatasi 100% sambil tetap menampilkan persentase aktual.

## 4. Modul dan Persyaratan

### 4.1 Evaluasi dan AJAX transaksi — Akmal Fazli (FR-09, FR-11)
- Verifikasi create/update/delete, validasi, session, kepemilikan, konfirmasi hapus dan hasil ketika ID tidak ada/milik akun lain; perbaiki masalah yang ditemukan pada area transaksi.
- Form dan tombol hapus menampilkan pending, error per field/pesan aman; cegah pengiriman ganda saat pending. Mutasi berhasil mencerminkan perubahan pada riwayat/ringkasan keuangan dan budget relevan tanpa hard reload.
- Perubahan tipe, jumlah dan `occurredAt` harus memengaruhi kalkulasi budget pada bulan lama/baru secara benar saat data dimuat ulang. Transaksi tetap dapat diedit hanya oleh pemiliknya.
- Pemilik: `src/app/dashboard/transactions/**`, `src/actions/transactions.ts`, `src/components/transactions/**`; tidak mengedit halaman dashboard.

### 4.2 Dashboard, filter, budget read — Dehar Zaidan Dzaki Amirullah (FR-09, FR-10, FR-12, FR-14..16)
- Dashboard tetap memverifikasi session; saldo/pemasukan/pengeluaran lama global per pengguna, sedangkan `type` hanya memfilter riwayat.
- Filter jenis memperbarui daftar lewat App Router tanpa hard reload; URL adalah sumber pilihan filter. Normalisasi kode lama yang memakai `?filter=` agar UI memakai `?type=` sesuai kontrak.
- Selector bulan mengganti data budget untuk bulan itu tanpa hard reload, memperbarui budget, total `EXPENSE`, sisa, persentase dan status; mempertahankan `type`. URL bulan dapat dibuka ulang.
- Saat budget belum ada tampilkan keadaan kosong dan CTA menuju pengaturan budget. Saat terlampaui tampilkan alert yang dapat dibaca tanpa mengandalkan warna saja. Kueri read harus dibatasi user session, termasuk agregat transaksi.
- Pemilik: `src/app/dashboard/page.tsx`, `src/components/dashboard/**`; tidak mengedit aksi transaksi atau komponen halaman pengaturan budget.

### 4.3 Auth, landing, Set Budget — Farras Hilmy Zaidan (FR-09, FR-13, FR-17)
- Redesain landing dan auth tanpa mengubah keamanan password, proteksi route, dan session. Uji regresi register/login/logout, session kedaluwarsa dan redirect halaman terlindungi.
- Halaman `/dashboard/budgets` menyediakan pilihan bulan dan form untuk membuat atau mengubah satu budget milik pengguna pada bulan pilihan. Form menampilkan nilai yang sudah ada, pending, field errors, dan hasil aman; bulan tanpa budget memiliki CTA membuat budget.
- Aksi memakai Zod untuk bulan dan nominal; upsert aman dengan constraint unik `[userId, year, month]`, tanpa menerima userId client. Baca dan tulis hanya pada milik user yang login; session tidak valid ditolak. Sukses menginvalidasi `/dashboard` dan `/dashboard/budgets`.
- Pemilik: `src/app/page.tsx`, `src/app/(auth)/**`, `src/app/dashboard/budgets/**`, `src/actions/budgets.ts`, `src/components/budgets/**`. Perubahan `src/actions/auth.ts` dan `src/lib/auth.ts` hanya jika diperlukan untuk regresi auth, melalui koordinasi PM; halaman dashboard tetap milik Dehar.

### 4.4 Fondasi dan UI bersama — Devano Trestanto, PM (FR-18)
- Mengelola `prisma/**`, perubahan relasi `User`, `src/app/globals.css`, `src/app/layout.tsx`, dokumen, serta konfigurasi bersama. Menyediakan schema/migration dan kontrak desain di awal agar implementasi programmer lain tidak menunggu pekerjaan satu sama lain.
- Memastikan seluruh halaman mengikuti fintech gelap, responsif dan memiliki empty/loading/error state sesuai desain; mengintegrasikan hasil, mengecek deployment pada proyek yang sama.

## 5. Keamanan, Error dan Kinerja Interaksi
- Semua input sensitif divalidasi Zod di server. Prisma dan akses DB server-only; gunakan Prisma safe APIs, bukan raw SQL dengan input user. Cookie preferensi tidak menjadi sumber identitas.
- Pembacaan, pembuatan, dan pembaruan budget menggunakan user session; manipulasi URL/ID akun lain tidak boleh mengungkap data. Anonymous diarahkan ke login atau menerima error session yang aman pada action; kegagalan DB tidak mengirim detail internal.
- Perubahan filter dan bulan menampilkan pending state tanpa menghilangkan kemampuan membaca konteks pilihan; empty/error state informatif. Jangan menambahkan polling jika tidak dibutuhkan: sinkronkan setelah aksi berhasil dan saat navigasi.

## 6. Verifikasi dan Traceability
| Kebutuhan | Pemilik utama | Verifikasi minimum |
| --- | --- | --- |
| FR-09 | Akmal (transaksi), Dehar (dashboard/filter), Farras (auth), PM (integrasi) | Uji sukses/gagal dan regresi fase 1. |
| FR-10, FR-12 | Dehar | Filter, URL langsung, ringkasan setelah mutasi; tidak ada hard reload. |
| FR-11 | Akmal | Tambah/ubah/hapus dan error; pending tampil; data terbaru tanpa hard reload. |
| FR-13, FR-17 | Farras | Buat/ubah budget; validasi; dua akun dan session kedaluwarsa. |
| FR-14..16 | Dehar | Bulan terpilih WIB, 80%/100%/>100%, bulan kosong, selector tanpa hard reload. |
| FR-18     | PM (shared), tiap programmer (UI miliknya) | Seluruh halaman desktop/mobile mengikuti design.md dan state aksesibel. |

PM menguji lint, typecheck, build, migration, dua akun, batas bulan WIB, dan perilaku tanpa hard reload sebelum deployment. Integrasi dilakukan setelah modul paralel siap; hanya PM mengubah file shared.
