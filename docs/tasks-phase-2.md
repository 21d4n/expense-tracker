# Pembagian Tugas Expense Tracker — Fase 2

[Tugas fase 1](tasks.md) tetap menjadi arsip. Pada fase 2, **Devano Trestanto menjadi PM**; programmer adalah **Farras Hilmy Zaidan**, **Dehar Zaidan Dzaki Amirullah**, dan **Akmal Fazli**. Semua bekerja pada repositori lama dari `main` terbaru setelah kontrak fondasi PM tersedia. Acuan: [PRD](prd-phase-2.md), [SRS](srs-phase-2.md), dan [desain](design.md) fase 2.

## Fondasi awal dan aturan integrasi
PM menetapkan sekaligus: schema/migration Budget dan Prisma Client, `type` + `month` pada URL, aturan batas bulan Asia/Jakarta, kontrak respons aksi/revalidasi, serta token UI. Ini adalah kickoff fondasi, bukan pekerjaan yang menunggu programmer lain selesai. Setelah itu ketiganya dapat mengerjakan modulnya **secara paralel**. Antarmuka konsumsi lintas modul disepakati sebelum perubahan; tiap orang hanya mengedit file miliknya. PR yang perlu mengubah file shared ditangani PM saat integrasi.

| Pemilik | Scope dan kriteria selesai | File milik pemilik |
| --- | --- | --- |
| **Devano — PM** | PRD/SRS/design dan review, schema `Budget` + migration, token global/layout, integrasi, pengujian lintas modul, deployment di proyek lama. Migrasi menjaga data lama. | `docs/**`, `prisma/**`, `src/app/globals.css`, `src/app/layout.tsx`, konfigurasi bersama |
| **Farras — Programmer 1** | Redesain landing dan auth; regresi login/logout/session; halaman pilihan bulan dan Set Budget (buat/ubah) dengan Zod, session/owner guard, loading/error, revalidasi dashboard. | `src/app/page.tsx`, `src/app/(auth)/**`, `src/app/dashboard/budgets/**`, `src/actions/budgets.ts`, `src/components/budgets/**`; `src/actions/auth.ts` dan `src/lib/auth.ts` hanya untuk perbaikan auth yang diperlukan |
| **Dehar — Programmer 2** | Redesain dashboard; evaluasi ringkasan/riwayat; AJAX filter `?type=`; month selector `?month=` tanpa hard reload; budget read, ringkasan, indikator dan alert hanya dari data milik user. | `src/app/dashboard/page.tsx`, `src/app/dashboard/loading.tsx`, `src/app/dashboard/error.tsx`, `src/components/dashboard/**` |
| **Akmal — Programmer 3** | Redesain transaksi; audit dan perbaiki create/update/delete serta komponen filter transaksi lama bila dipakai; pending/error dan tampilan terbaru tanpa hard reload; owner guard tetap berlaku. | `src/app/dashboard/transactions/**`, `src/actions/transactions.ts`, `src/components/transactions/**` |

## Antarmuka lintas pemilik
- Dehar membaca `Budget` dan agregat `Transaction` langsung melalui Prisma server-only dengan schema PM; tidak menunggu UI/aksi Set Budget Farras. Farras menulis melalui `src/actions/budgets.ts`; keduanya menggunakan kontrak `(userId, year, month)` dan `Decimal(14,2)` yang sama.
- Akmal menjaga kontrak komponen tombol hapus agar Dehar dapat menampilkannya di daftar dashboard. Dehar hanya mengimpor/memanggil komponen tersebut; perubahan komponen dilakukan Akmal. Server Action transaksi menginvalidasi `/dashboard` dan `/dashboard/budgets`; panel Dehar mengambil ulang data setelah mutasi tanpa hard reload.
- Pilihan filter di dashboard milik Dehar (`?type=`). Bila komponen Akmal masih menulis `?filter=`, Akmal menyelaraskan komponen miliknya ke kontrak `?type=` atau menghapus jalur duplikat yang tidak dipakai, tanpa mengedit dashboard.
- Farras memiliki auth helper jika perlu perbaikan; programmer lain hanya menggunakannya. PM satu-satunya pemilik schema, global styles dan layout; request perubahan token diajukan ke PM.

## Urutan tanpa saling menunggu
1. PM menyiapkan fondasi schema/migration, kontrak URL/aksi dan desain; distribusikan kontrak kepada ketiga programmer sebelum implementasi paralel.
2. Farras, Dehar dan Akmal mulai bersamaan di area masing-masing; modul read dashboard dan write Set Budget terpisah oleh kontrak, sebagaimana komponen hapus dan pemanggilnya.
3. PM menggabungkan hasil setelah siap, menangani konflik/shared files, dan menguji alur lintas modul. Ketergantungan fungsional diuji saat integrasi, bukan alasan memblokir awal pekerjaan.
4. Jalankan pemeriksaan sukses/gagal, dua akun, batas bulan WIB, mobile/desktop, lint, typecheck, build, migration dan deployment pada repositori yang sama.
