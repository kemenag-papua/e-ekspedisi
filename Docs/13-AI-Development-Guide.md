# 13 - AI Development Guide

> **Document ID:** DOC-EEKS-013  
> **Project:** e-Ekspedisi  
> **Version:** 1.0.0 (Draft)

---

# 1. Tujuan

Dokumen ini menjadi pedoman bagi AI Coding Agent (OpenCode, ChatGPT, Claude Code, Gemini CLI, dll.) agar seluruh kode yang dihasilkan konsisten dengan arsitektur, standar, dan aturan bisnis proyek e‑Ekspedisi.

---

# 2. AI Context

## Ringkasan Proyek
- Nama: e-Ekspedisi
- Domain: Administrasi Persuratan
- Tujuan: Bukti penerimaan dokumen secara digital
- Stack:
  - Frontend: Vue 3 + Vite + Pinia + PrimeVue + Tailwind CSS
  - Backend: Google Apps Script
  - Database: Google Spreadsheet
  - Storage: Google Drive

## Dokumen Referensi Wajib

AI WAJIB membaca dokumen berikut sebelum membuat atau mengubah kode:

1. 02B-Business-Rules-Catalog.md
2. 03-PRD.md
3. 03A-Functional-Specification-Detail.md
4. 04-System-Architecture.md
5. 04A-Google-Apps-Script-Architecture.md
6. 05-Database-Data-Dictionary.md
7. 06A-API-Contract-OpenAPI.md
8. 07.03-Screen-Specification.md
9. 08-Security-Compliance.md
10. 09-Development-Guide.md

---

# 3. Mandatory Rules

AI HARUS:

- Mengikuti Repository Pattern.
- Mengikuti Service Pattern.
- Menjaga Controller tetap tipis (thin controller).
- Menggunakan UUID sebagai primary key.
- Mengikuti API Contract.
- Mengikuti Business Rules.
- Memperbarui dokumentasi jika mengubah desain.

AI TIDAK BOLEH:

- Mengakses Spreadsheet langsung dari Controller.
- Mengubah struktur database tanpa ADR.
- Menambahkan dependensi tanpa alasan.
- Mengubah endpoint API tanpa memperbarui kontrak.
- Mengabaikan Audit Trail.

---

# 4. Workflow AI

```text
Terima Tugas
      │
      ▼
Baca Business Rules
      │
      ▼
Baca PRD
      │
      ▼
Baca API Contract
      │
      ▼
Baca Database
      │
      ▼
Implementasi
      │
      ▼
Unit Test
      │
      ▼
Perbarui Dokumentasi
```

---

# 5. Standar Implementasi

## Backend

Controller
- Validasi request
- Panggil service
- Kembalikan response

Service
- Business rule
- Validasi
- Audit

Repository
- Spreadsheet
- Drive

## Frontend

- Pages
- Components
- Stores
- API Client
- Composables

---

# 6. Prompt Library

## Membuat Fitur Baru

```
Buat implementasi fitur sesuai:
- PRD
- Business Rules
- API Contract
- Database
- Development Guide

Jangan mengubah arsitektur.
```

## Refactor

```
Refactor tanpa mengubah perilaku aplikasi.
Pertahankan API.
Pertahankan Business Rules.
```

## Unit Test

```
Buat unit test untuk service.
Mock repository.
Uji skenario sukses dan gagal.
```

## Bug Fix

```
Analisis akar masalah.
Perbaiki tanpa mengubah kontrak API.
Tambahkan regression test.
```

---

# 7. Checklist AI

Sebelum menyelesaikan pekerjaan:

- [ ] Mengikuti Business Rules
- [ ] Mengikuti PRD
- [ ] Mengikuti API Contract
- [ ] Mengikuti Database
- [ ] Audit Trail tetap berjalan
- [ ] Error Handling lengkap
- [ ] Dokumentasi diperbarui bila diperlukan

---

# 8. Output yang Diharapkan

Setiap implementasi AI sebaiknya menghasilkan:

1. Source code.
2. Unit test.
3. Dokumentasi perubahan.
4. Catatan asumsi.
5. Daftar file yang diubah.

---

# 9. Referensi

- 02B-Business-Rules-Catalog.md
- 03-PRD.md
- 04-System-Architecture.md
- 05-Database-Data-Dictionary.md
- 06A-API-Contract-OpenAPI.md
- 09-Development-Guide.md

---

# 10. Change Log

| Versi | Tanggal | Perubahan |
|---|---|---|
|1.0.0|2026-08-05|Draft awal|
