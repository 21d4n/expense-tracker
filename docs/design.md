# Design UI Expense Tracker — Fase 2

Panduan aktif ini menggantikan tema fantasy RPG fase 1 dengan **fintech gelap yang modern, profesional, dan mudah dibaca**. Berlaku untuk seluruh aplikasi (landing, auth, dashboard, transaksi, budget); [PRD fase 2](prd-phase-2.md) dan [SRS fase 2](srs-phase-2.md) memuat kebutuhan perilakunya. Pertahankan pola komponen/interaksi QuestUI yang masih relevan, tetapi warna, tipografi, bahasa dan ornamen fase 1 tidak lagi menjadi acuan visual.

## Prinsip
- Informasi keuangan adalah fokus: tampilkan nominal dan periode dengan jelas, ringkasan sebelum detail, aksi utama mudah ditemukan.
- Satu sistem visual di seluruh halaman; gunakan token bersama di `src/app/globals.css` milik PM, bukan warna hardcoded berbeda per programmer.
- Hindari istilah/ornamen fantasi, glow dekoratif, font serif, dan border angular. Gunakan bahasa Indonesia yang lugas untuk judul, CTA, status, dan pesan error.
- Responsif dan aksesibel: kontras memadai, fokus keyboard terlihat, label form jelas, touch target minimal 40px, dan status dinyatakan lewat teks selain warna.

## Design Tokens (kontrak PM)
| Peran | Nilai awal | Penggunaan |
| --- | --- | --- |
| Background | `#0B1220` | Latar halaman navy gelap |
| Surface | `#111C2E` | Kartu dan panel |
| Elevated | `#17263B` | Dialog, hover dan kontrol |
| Border | `#31445B` | Pemisah halus |
| Text primary | `#F3F7FC` | Judul dan nominal |
| Text secondary | `#A8B8CA` | Keterangan |
| Primary | `#38BDF8` | CTA dan fokus, dengan teks gelap `#0B1220` |
| Success | `#34D399` | Pemasukan/status Aman |
| Warning | `#FBBF24` | Mendekati Batas |
| Danger | `#FB7185` | Pengeluaran/Melebihi Anggaran dan aksi destruktif |

- Tipografi: sans-serif modern (Inter bila tersedia; fallback system-ui). Gunakan tabular numerals untuk angka nominal dan persentase agar mudah dibandingkan. Judul tegas, body minimal 14–16px, label dan teks sekunder tetap terbaca.
- Spacing kelipatan 8px; jarak antarseksi 24–32px. Kartu radius 12–16px, kontrol 8–12px, border 1px, shadow halus; hindari glow dominan.
- Tombol primary solid biru, secondary outline/permukaan elevated, destructive merah. State hover, focus-visible, pending, disabled dan error dibedakan jelas; jangan mengandalkan opacity rendah yang membuat teks tak terbaca.
- Migrasi kelas/token tema lama (`gold`, `parchment`, `font-display`, `eyebrow`, dll.) dikoordinasikan PM melalui token global; tiap programmer menyesuaikan hanya komponen miliknya.

## Halaman dan Navigasi
| Halaman | Tata letak dan prioritas |
| --- | --- |
| `/` | Hero ringkas menjelaskan manfaat Expense Tracker, CTA Daftar/Masuk yang terlihat jelas. |
| `/register`, `/login` | Form terpusat, label dan error per field, petunjuk validasi, tautan berpindah form. |
| `/dashboard` | Header nama/keluar, ringkasan saldo-pemasukan-pengeluaran, budget bulan terpilih, filter dan riwayat, CTA tambah transaksi. Saldo lama tetap total global; bulan mengatur informasi budget. |
| `/dashboard/transactions/new`, `/dashboard/transactions/[id]/edit` | Form nominal, tipe, deskripsi dan tanggal dalam kartu yang fokus; tombol kembali dan status submit. Hapus tersedia pada riwayat dengan konfirmasi. |
| `/dashboard/budgets` | Pilihan bulan, budget saat ini, form Set Budget untuk membuat/mengubah nominal, tautan kembali ke dashboard. |

Navigasi App Router dan Server Actions mendukung perpindahan filter, bulan, dan aksi transaksi tanpa hard reload; pertahankan state pending serta pilihan URL `type`/`month` yang relevan. Pada mobile, header dan kontrol membungkus atau menjadi full-width; dashboard satu kolom, ringkasan dapat menjadi grid pada desktop. Riwayat transaksi berupa kartu atau daftar responsif tanpa memotong nominal/aksi.

## Komponen dan States
- **Summary cards:** label, nominal dengan `Rp`, keterangan periode/ruang lingkup; bedakan saldo total global dari pengeluaran budget bulan terpilih.
- **Budget summary:** budget, pengeluaran, sisa. Saat belum ada budget, tampilkan pengeluaran bulan tersebut dan CTA Set Budget; jangan tampilkan persentase/status palsu.
- **Budget indicator:** progress bar dengan label persentase dan teks Aman (`<80%`), Mendekati Batas (`80–100%`), atau Melebihi Anggaran (`>100%`). Di atas 100%, bar boleh penuh tetapi teks persentase aktual dan alert tetap terlihat. Sisa negatif tetap ditampilkan.
- **Month selector dan filter:** tampilkan pilihan aktif, gunakan elemen berlabel, pertahankan filter saat bulan berubah dan sebaliknya. Pending state terlihat selama data berganti tanpa hard reload.
- **Transaksi:** tipe chip, tanggal, deskripsi, nominal dan aksi edit/hapus. Dialog hapus menjelaskan konsekuensi; jangan menghapus sebelum konfirmasi.
- **Feedback:** skeleton saat memuat, empty state dengan CTA yang tepat, error aman dan bisa dicoba lagi, error form dekat input, indikator sedang menyimpan/menghapus; jangan menampilkan detail database.

## Kepemilikan Visual
PM membuat token/layout bersama. Farras menerapkan desain pada landing, auth dan halaman Set Budget; Dehar pada dashboard serta panel budget/read; Akmal pada halaman dan komponen transaksi. Gunakan [pembagian tugas fase 2](tasks-phase-2.md) untuk menghindari perubahan silang pada file shared.
