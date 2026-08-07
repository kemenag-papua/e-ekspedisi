# 03 - Product Requirements Document (PRD)

> **Document ID:** DOC-EEKS-003  
> **Project:** e-Ekspedisi  
> **Version:** 1.0.0 (Draft)  
> **Status:** Draft

---

# 1. Executive Summary

e-Ekspedisi adalah aplikasi berbasis Google Apps Script dan Vue 3 untuk mendigitalisasi buku ekspedisi surat keluar menjadi sistem bukti penerimaan elektronik (Digital Proof of Receipt).

Dokumen ini mendefinisikan kebutuhan produk sebagai dasar implementasi.

---

# 2. Product Goals

- Menghilangkan buku ekspedisi manual.
- Memastikan setiap penyerahan dokumen memiliki bukti digital.
- Mempermudah pencarian arsip.
- Menyediakan dashboard dan laporan.

## Success Metrics

| KPI | Target |
|------|--------|
| Surat tercatat | 100% |
| Bukti digital | 100% |
| Waktu pencarian | < 10 detik |
| Waktu konfirmasi | < 1 menit |

---

# 3. Target Users

| Persona | Deskripsi |
|----------|-----------|
| Super Admin | Mengelola konfigurasi aplikasi |
| Admin Persuratan | Mengelola surat dan ekspedisi |
| Penerima | Mengonfirmasi penerimaan dokumen |
| Pimpinan | Melihat dashboard dan laporan |

---

# 4. Modul Produk

1. Login & Autentikasi
2. Dashboard
3. Master Data
4. Surat Keluar
5. Ekspedisi
6. Konfirmasi Penerimaan
7. Bukti Penerimaan PDF
8. Audit Trail
9. Laporan
10. Pengaturan

---

# 5. Functional Requirements

## Modul Login

| ID | Requirement |
|----|-------------|
| FR-001 | Pengguna dapat login. |
| FR-002 | Sistem memverifikasi hak akses. |

## Modul Surat Keluar

| ID | Requirement |
|----|-------------|
| FR-101 | Admin dapat membuat surat keluar. |
| FR-102 | Sistem membuat Nomor Ekspedisi otomatis. |
| FR-103 | Sistem menghasilkan QR Code. |
| FR-104 | Admin dapat mengunggah PDF surat. |

## Modul Konfirmasi

| ID | Requirement |
|----|-------------|
| FR-201 | Menampilkan data surat. |
| FR-202 | Mengambil foto penerima. |
| FR-203 | Menyimpan tanda tangan digital. |
| FR-204 | Menyimpan GPS (opsional sesuai konfigurasi). |
| FR-205 | Menghasilkan PDF bukti penerimaan. |

## Modul Dashboard

| ID | Requirement |
|----|-------------|
| FR-301 | Menampilkan statistik surat. |
| FR-302 | Menampilkan grafik bulanan. |

---

# 6. Non Functional Requirements

| ID | Requirement |
|----|-------------|
| NFR-001 | Respon < 2 detik untuk operasi umum. |
| NFR-002 | Mendukung browser modern. |
| NFR-003 | Audit trail wajib aktif. |
| NFR-004 | Backup harian Spreadsheet dan Drive. |

---

# 7. User Journey

```mermaid
flowchart LR
A[Admin Input Surat] --> B[Generate QR]
B --> C[Penerima Datang]
C --> D[Konfirmasi]
D --> E[PDF Bukti]
E --> F[Dashboard]
```

---

# 8. Use Case Ringkas

- Login
- Kelola Master Data
- Kelola Surat Keluar
- Generate QR
- Konfirmasi Penerimaan
- Cetak Bukti PDF
- Lihat Dashboard
- Laporan

---

# 9. Mapping Business Rules

| Rule | Requirement |
|------|-------------|
| BR-EXP-001 | FR-102 |
| BR-RCV-003 | FR-203 |
| BR-DOC-002 | FR-205 |
| BR-AUD-001 | NFR-003 |

---

# 10. Acceptance Criteria

Contoh:

**FR-205 - Generate PDF**

**Given** data penerimaan lengkap  
**When** admin menyimpan konfirmasi  
**Then** sistem membuat PDF dan menyimpannya di Google Drive.

---

# 11. Permission Matrix

| Fitur | Super Admin | Admin | Penerima | Pimpinan |
|-------|:-----------:|:-----:|:---------:|:---------:|
| Dashboard | ✔ | ✔ | ✖ | ✔ |
| Surat Keluar | ✔ | ✔ | ✖ | ✖ |
| Konfirmasi | ✖ | ✔ | ✔ | ✖ |
| Audit Log | ✔ | ✔ | ✖ | ✔ |

---

# 12. Future Enhancements

- Integrasi SRIKANDI
- Notifikasi Email
- PWA
- Tanda Tangan Elektronik Tersertifikasi
- REST API Publik

---

# 13. Referensi

- 00-Project-Index.md
- 02-Business-Requirements.md
- 02B-Business-Rules-Catalog.md

---

# 14. Change Log

| Versi | Tanggal | Perubahan |
|--------|----------|-----------|
|1.0.0|2026-08-05|Draft awal PRD|
