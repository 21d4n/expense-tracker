# Setup Lokal

1. Clone repository.
2. Jalankan `npm install`.
3. Buat database PostgreSQL lokal:
   ```sql
   CREATE DATABASE expense_tracker;
   ```
4. Salin `.env.example` menjadi `.env` dan isi password PostgreSQL sendiri.
5. Jalankan `npx prisma generate`.
6. Terapkan migration dengan `npx prisma migrate dev`.
7. Buat branch fitur sesuai `docs/tasks.md`:
   `git checkout -b feature/<nama-fitur>`.
8. Jalankan `npm run dev` dan buka `http://localhost:3000`.

## Troubleshooting
- `DATABASE_URL` hilang: pastikan file `.env` ada di root dan format URL benar.
- Connection refused: pastikan service PostgreSQL hidup, port biasanya `5432`, dan database `expense_tracker` sudah dibuat.
- Migration gagal: cek koneksi, lalu jalankan `npx prisma migrate status`; jangan menghapus migration bersama tanpa koordinasi.
- Prisma Client tidak ditemukan: jalankan `npx prisma generate`.
- Port 3000 dipakai: jalankan `npm run dev -- -p 3001`.
