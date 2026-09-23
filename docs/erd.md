# ERD Expense Tracker

## Entitas
- **User:** identitas akun dan hash password.
- **Session:** session server-side yang terkait ke user.
- **Transaction:** catatan pemasukan/pengeluaran milik user.

## Atribut dan Kunci
`User(id PK, name, email UNIQUE, passwordHash, createdAt, updatedAt)`.
`Session(id PK, tokenHash UNIQUE, userId FK, expiresAt, createdAt)`.
`Transaction(id PK, userId FK, type, amount Decimal(14,2), description, occurredAt, createdAt, updatedAt)`.

## Relasi
Satu `User` memiliki nol atau banyak `Session` dan `Transaction`. Setiap session/transaksi tepat memiliki satu user. Penghapusan user menghapus data terkait melalui cascade.

## Constraints
Email dan token hash unik. Nominal divalidasi positif di server. Index tersedia untuk owner, tanggal, tipe, dan session expiry.

## Diagram
```mermaid
erDiagram
  USER ||--o{ SESSION : has
  USER ||--o{ TRANSACTION : owns
  USER {
    string id PK
    string name
    string email UK
    string password_hash
    datetime created_at
    datetime updated_at
  }
  SESSION {
    string id PK
    string token_hash UK
    string user_id FK
    datetime expires_at
    datetime created_at
  }
  TRANSACTION {
    string id PK
    string user_id FK
    enum type
    decimal amount
    string description
    datetime occurred_at
    datetime created_at
    datetime updated_at
  }
```
