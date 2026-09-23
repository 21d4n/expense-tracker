# Instruksi Agen Expense Tracker

Sebelum mengedit, baca `docs/prd.md`, `docs/srs.md`, `docs/erd.md`, `docs/design.md`, `docs/tasks.md`, dan kode terkait.

- Implementasikan hanya assignment programmer yang diminta.
- Ikuti struktur dan pola arsitektur yang sudah ada.
- Implementasikan fitur end-to-end: UI, server logic, validasi, dan operasi DB.
- Gunakan Server Components secara default; gunakan `use client` hanya bila perlu.
- Prisma dan akses database harus server-only.
- Validasi input penting di server dengan Zod.
- Terapkan authorization server-side pada setiap operasi terlindungi.
- Session memakai cookie HttpOnly; cookie preference biasa tidak boleh menjadi sumber identitas.
- Ikuti `docs/design.md` dan QuestUI.
- Hormati ownership file di `docs/tasks.md`; hindari edit file shared tanpa kebutuhan.
- Jangan melakukan refactor atau perubahan di luar assignment.
- Gunakan Prisma safe APIs, jangan raw SQL dengan input user.
- Uji alur sukses dan error; jalankan lint, typecheck, dan build bila praktis.
- Laporkan hasil implementasi serta catatan integrasi setelah selesai.
