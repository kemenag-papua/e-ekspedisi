# 00 - Project Index

> **Project Name:** e-Ekspedisi  
> **Version:** 1.0.0 (Draft)  
> **Status:** In Progress  
> **Document Owner:** Tim Pengembang e-Ekspedisi  
> **Last Updated:** 2026-08-05

---

# 1. Pendahuluan

## 1.1 Tentang Dokumen

Dokumen ini merupakan **indeks utama (master document)** seluruh dokumentasi proyek **e-Ekspedisi**.

Seluruh dokumen lain dalam proyek ini mengacu pada dokumen ini sebagai titik awal navigasi dan referensi. Dokumen ini juga berfungsi sebagai **Single Source of Truth (SSOT)** sehingga setiap anggota tim memiliki pemahaman yang sama mengenai ruang lingkup proyek.

## 1.2 Tujuan

- Menjelaskan struktur dokumentasi proyek.
- Menentukan hubungan antar dokumen.
- Menjadi panduan bagi developer, analis, tester, dan AI Coding Agent.
- Menentukan status setiap dokumen.
- Mempermudah proses maintenance dokumentasi.

---

# 2. Informasi Proyek

| Item | Nilai |
|------|--------|
| Nama Proyek | e-Ekspedisi |
| Jenis Aplikasi | Web Application |
| Platform | Google Apps Script + Vue 3 |
| Database | Google Spreadsheet |
| File Storage | Google Drive |
| Dashboard | Looker Studio |
| Target Pengguna | Instansi Pemerintah |
| Metodologi | Agile Scrum |
| Repository | (akan diisi) |
| License | Internal Government |

---

# 3. Ringkasan Proyek

**e-Ekspedisi** adalah aplikasi yang mendigitalisasi buku ekspedisi surat keluar menjadi sistem bukti penerimaan elektronik.

Aplikasi ini **tidak mengelola proses pengiriman surat**, melainkan mengelola proses **serah terima dokumen** kepada penerima yang datang langsung ke unit persuratan.

Setiap penerimaan dokumen menghasilkan:

- QR Code
- Identitas penerima
- Foto penerima
- Tanda tangan digital
- Lokasi GPS
- Timestamp
- Audit Trail
- PDF Bukti Penerimaan

---

# 4. Prinsip Pengembangan

- Paperless
- Mobile First
- Audit Ready
- Secure by Design
- API First
- Modular Architecture
- Simple Maintenance
- AI Friendly Documentation

---

# 5. Struktur Dokumentasi

| No | Dokumen | Tujuan | Status |
|----|----------|---------|--------|
| 00 | Project Index | Indeks seluruh dokumentasi | Draft |
| 01 | Project Vision & Charter | Visi, tujuan, stakeholder | Belum dibuat |
| 02 | Business Requirements & Process | Kebutuhan bisnis dan proses | Belum dibuat |
| 03 | Product Requirements (PRD) | Kebutuhan fungsional aplikasi | Belum dibuat |
| 04 | System Architecture | Arsitektur sistem | Belum dibuat |
| 05 | Database & Data Dictionary | Struktur data | Belum dibuat |
| 06 | API Specification | Spesifikasi API | Belum dibuat |
| 07 | UI/UX & User Journey | Desain antarmuka | Belum dibuat |
| 08 | Security & Compliance | Keamanan dan kepatuhan | Belum dibuat |
| 09 | Development Guide | Panduan pengembangan | Belum dibuat |
| 10 | Testing Strategy | Strategi pengujian | Belum dibuat |
| 11 | Deployment & Operations | Deploy dan operasional | Belum dibuat |
| 12 | Project Roadmap & Sprint Backlog | Roadmap proyek | Belum dibuat |
| 13 | Decision Log & Change History | Catatan keputusan | Belum dibuat |
| 14 | AI Development Guide | Panduan AI Coding Agent | Belum dibuat |

---

# 6. Dependensi Dokumen

```text
Project Index
│
├── Vision & Charter
│     ├── Business Requirements
│     │      ├── PRD
│     │      │     ├── Architecture
│     │      │     ├── Database
│     │      │     ├── API
│     │      │     ├── UI/UX
│     │      │     ├── Security
│     │      │     ├── Development
│     │      │     ├── Testing
│     │      │     ├── Deployment
│     │      │     └── Roadmap
│     │      └── Decision Log
│     └── AI Development Guide
```

---

# 7. Standar Dokumentasi

- Markdown (.md)
- Mermaid untuk diagram
- Tabel untuk data terstruktur
- Bahasa Indonesia formal
- Memiliki versi dan change log

---

# 8. Konvensi Penamaan

## Dokumen

```text
00-Project-Index.md
01-Project-Vision-Charter.md
02-Business-Requirements.md
...
```

## Branch Git

```text
main
develop
feature/<nama>
bugfix/<nama>
release/<versi>
```

---

# 9. Siklus Pengembangan

```text
Vision
↓
Business Requirements
↓
PRD
↓
Architecture
↓
Database
↓
API
↓
UI/UX
↓
Development
↓
Testing
↓
Deployment
↓
Release
```

---

# 10. Target Hasil Proyek

- Dokumentasi lengkap
- Arsitektur konsisten
- Siap dikembangkan menggunakan AI Coding Agent
- Mudah dipelihara dan dikembangkan

---

# 11. Riwayat Perubahan

| Versi | Tanggal | Perubahan |
|--------|----------|-----------|
| 1.0.0 | 2026-08-05 | Dokumen awal dibuat |

---

# 12. Dokumen Berikutnya

**01-Project-Vision-Charter.md**
