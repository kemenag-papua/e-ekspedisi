# 09 - Development Guide

> **Document ID:** DOC-EEKS-009  
> **Project:** e-Ekspedisi  
> **Version:** 1.0.0 (Draft)

---

# 1. Tujuan

Dokumen ini menjadi **Developer Handbook** untuk seluruh pengembang dan AI Coding Agent agar implementasi e‑Ekspedisi konsisten.

---

# 2. Tech Stack

| Layer | Teknologi |
|---|---|
| Frontend | Vue 3 + Vite + Pinia + PrimeVue + Tailwind CSS |
| Backend | Google Apps Script |
| Database | Google Spreadsheet |
| Storage | Google Drive |
| Charts | Looker Studio |

---

# 3. Struktur Repository

```text
e-ekspedisi/
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── composables/
│   │   ├── layouts/
│   │   ├── pages/
│   │   ├── router/
│   │   ├── stores/
│   │   ├── utils/
│   │   └── styles/
│   └── public/
├── backend-gas/
│   ├── controllers/
│   ├── services/
│   ├── repositories/
│   ├── middleware/
│   ├── utils/
│   ├── models/
│   └── appsscript.json
├── docs/
└── scripts/
```

---

# 4. Arsitektur Kode

```text
Request
   ↓
Router
   ↓
Controller
   ↓
Service
   ↓
Repository
   ↓
Spreadsheet / Drive
```

Aturan:
- Controller hanya menerima request dan mengembalikan response.
- Service berisi business rule.
- Repository menangani akses Spreadsheet dan Drive.
- Tidak boleh mengakses Spreadsheet langsung dari Controller.

---

# 5. Konvensi Penamaan

## File

- `SuratService.gs`
- `PenerimaanController.gs`
- `AuditRepository.gs`
- `DashboardCard.vue`

## Fungsi

- `createSurat()`
- `updateSurat()`
- `confirmPenerimaan()`

## Variabel

- `camelCase`
- Konstanta: `UPPER_SNAKE_CASE`

---

# 6. Standar API

- Seluruh endpoint berada pada `/api/v1`.
- Response menggunakan format standar.
- Error menggunakan Error Catalog.

---

# 7. Logging

Catat:
- Login
- Logout
- CRUD
- Konfirmasi
- Generate PDF
- Error

---

# 8. Error Handling

| Level | Penanganan |
|---|---|
| Validation | 400 |
| Authentication | 401 |
| Authorization | 403 |
| Business Rule | 409 |
| Internal | 500 |

---

# 9. Git Workflow

## Branch

```text
main
develop
feature/*
bugfix/*
hotfix/*
release/*
```

## Commit

Gunakan Conventional Commits.

Contoh:

```text
feat: tambah modul konfirmasi penerimaan
fix: perbaiki validasi QR
docs: update PRD
refactor: pisahkan repository
```

---

# 10. Code Review Checklist

- [ ] Mengikuti Business Rules
- [ ] Mengikuti PRD
- [ ] Menggunakan Repository Pattern
- [ ] Tidak ada duplikasi kode
- [ ] Logging tersedia
- [ ] Error handling lengkap
- [ ] Nama variabel konsisten

---

# 11. Definition of Ready

Sebuah pekerjaan siap dikerjakan jika:
- Requirement lengkap.
- API tersedia.
- Database telah didefinisikan.
- Acceptance Criteria tersedia.

---

# 12. Definition of Done

- Fitur selesai.
- Unit test lulus.
- UAT lulus.
- Dokumentasi diperbarui.
- Audit log berfungsi.
- Tidak ada error kritis.

---

# 13. Panduan AI Coding Agent

AI harus:
- Mengikuti seluruh Business Rules.
- Tidak membuat akses Spreadsheet langsung dari Controller.
- Menggunakan Service & Repository Pattern.
- Menggunakan nama file sesuai konvensi.
- Mengikuti API Contract.
- Memperbarui dokumentasi jika ada perubahan arsitektur.

AI tidak boleh:
- Mengubah Business Rule tanpa ADR.
- Mengubah struktur database tanpa persetujuan.
- Menambahkan library tanpa analisis.

---

# 14. Checklist Sebelum Merge

- [ ] Build berhasil
- [ ] Lint bersih
- [ ] Review selesai
- [ ] Dokumentasi diperbarui
- [ ] Tidak ada konflik

---

# 15. Referensi

- 03-PRD.md
- 04-System-Architecture.md
- 04A-Google-Apps-Script-Architecture.md
- 06A-API-Contract-OpenAPI.md
- 08-Security-Compliance.md

---

# 16. Change Log

| Versi | Tanggal | Perubahan |
|---|---|---|
|1.0.0|2026-08-05|Draft awal|
