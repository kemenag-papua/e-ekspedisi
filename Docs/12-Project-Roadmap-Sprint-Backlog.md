# 12 - Project Roadmap & Sprint Backlog

> **Document ID:** DOC-EEKS-012
> **Project:** e-Ekspedisi
> **Version:** 1.0.0 (Draft)

---

# 1. Tujuan

Dokumen ini menjadi acuan perencanaan pengembangan e‑Ekspedisi dari MVP hingga rilis produksi.

---

# 2. Target Rilis

| Rilis | Fokus |
|---|---|
| MVP | Surat, Ekspedisi, Konfirmasi |
| v1.0 | Siap operasional |
| v1.1 | Penyempurnaan & laporan |
| v2.0 | Integrasi & fitur lanjutan |

---

# 3. Epic

| ID | Epic |
|---|---|
| EP-01 | Fondasi Proyek |
| EP-02 | Autentikasi & RBAC |
| EP-03 | Master Data |
| EP-04 | Surat Keluar |
| EP-05 | Ekspedisi |
| EP-06 | Konfirmasi Penerimaan |
| EP-07 | Dashboard & Laporan |
| EP-08 | Audit Trail |
| EP-09 | Administrasi Sistem |

---

# 4. Prioritas (MoSCoW)

## Must
- Login
- Surat Keluar
- QR
- Konfirmasi
- PDF Bukti
- Audit Trail

## Should
- Dashboard
- Laporan
- Pengaturan

## Could
- Email Notifikasi
- PWA
- Tema Gelap

## Won't (MVP)
- Integrasi eksternal
- TTE tersertifikasi

---

# 5. Sprint Plan

## Sprint 1
- Setup repository
- Setup GAS
- Setup Vue
- CI dasar
- Struktur proyek

## Sprint 2
- Login
- RBAC
- Master Pegawai
- Master Unit

## Sprint 3
- Surat Keluar
- Upload PDF
- Nomor Ekspedisi

## Sprint 4
- QR Code
- Detail Surat
- Riwayat

## Sprint 5
- Konfirmasi
- Foto
- Signature
- GPS

## Sprint 6
- Generate PDF
- Audit Trail

## Sprint 7
- Dashboard
- Grafik
- Statistik

## Sprint 8
- Laporan
- Filter
- Export

## Sprint 9
- Hardening
- Security
- Performance

## Sprint 10
- UAT
- Bug Fix
- Go Live

---

# 6. Contoh Product Backlog

| ID | User Story | Prioritas | Story Point |
|---|---|---:|---:|
| US-001 | Sebagai admin saya dapat login | Must | 3 |
| US-002 | Sebagai admin saya dapat membuat surat | Must | 8 |
| US-003 | Sebagai admin saya dapat membuat QR | Must | 5 |
| US-004 | Sebagai penerima saya dapat konfirmasi | Must | 8 |
| US-005 | Sebagai pimpinan saya melihat dashboard | Should | 5 |

---

# 7. Milestone

- M1: Fondasi selesai
- M2: MVP selesai
- M3: UAT selesai
- M4: Go Live
- M5: Stabilization

---

# 8. Risiko

| Risiko | Dampak | Mitigasi |
|---|---|---|
| Perubahan kebutuhan | Jadwal mundur | Change control |
| Kuota GAS | Gangguan | Optimasi & monitoring |
| Bug kritis | Go Live tertunda | Regression test |

---

# 9. Checklist Go Live

- [ ] PRD final
- [ ] Database final
- [ ] API final
- [ ] UAT disetujui
- [ ] Backup aktif
- [ ] Monitoring aktif
- [ ] Dokumentasi lengkap
- [ ] Pelatihan admin selesai

---

# 10. Referensi

- 03-PRD.md
- 09-Development-Guide.md
- 10-Testing-Strategy.md
- 11-Deployment-Operations.md

---

# 11. Change Log

| Versi | Tanggal | Perubahan |
|---|---|---|
|1.0.0|2026-08-05|Draft awal|
