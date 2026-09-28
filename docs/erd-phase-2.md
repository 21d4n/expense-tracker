# ERD Expense Tracker — Fase 2

ERD ini menambah `Budget` pada [ERD fase 1](erd.md). Tabel `User`, `Session`, dan `Transaction` tetap dipakai dengan struktur lama; hanya `User` mendapat relasi baru ke `Budget`. Migration dilakukan pada database proyek yang sama tanpa menghapus data lama.

## Entitas baru
`Budget(id PK, userId FK, year Int, month Int, amount Decimal(14,2), createdAt, updatedAt)`.

- `User 1 — 0..N Budget`, setiap budget tepat memiliki satu user; penghapusan user menghapus budget terkait (`onDelete: Cascade`).
- `UNIQUE(userId, year, month)` menjamin satu budget per user per bulan.
- `year`, `month` (1–12), dan nominal positif hingga dua digit desimal divalidasi dengan Zod di server. `amount` tidak boleh melampaui kapasitas `Decimal(14,2)`.
- Pengeluaran, sisa, persentase, dan status tidak disimpan: agregasikan `Transaction` milik user bertipe `EXPENSE` dengan `occurredAt` dalam bulan Asia/Jakarta yang dipilih.

```mermaid
erDiagram
  USER ||--o{ SESSION : has
  USER ||--o{ TRANSACTION : owns
  USER ||--o{ BUDGET : owns
  USER {
    string id PK
    string email UK
    string password_hash
  }
  SESSION {
    string id PK
    string user_id FK
  }
  TRANSACTION {
    string id PK
    string user_id FK
    enum type
    decimal amount
    datetime occurred_at
  }
  BUDGET {
    string id PK
    string user_id FK
    int year
    int month
    decimal amount
    datetime created_at
    datetime updated_at
  }
```

Kontrak implementasi dan otorisasi ada di [SRS fase 2](srs-phase-2.md). Indeks unik `(userId, year, month)` juga melayani query budget per pemilik dan bulan; indeks `Transaction(userId, occurredAt)` dari fase 1 tetap dipakai untuk query pengeluaran bulanan.
