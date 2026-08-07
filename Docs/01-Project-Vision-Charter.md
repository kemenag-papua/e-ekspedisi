# 01 - Project Vision & Charter

> **Document ID:** DOC-EEKS-001  
> **Project:** e-Ekspedisi  
> **Version:** 1.0.0 (Draft)  
> **Status:** Draft  
> **Last Updated:** 2026-08-05

---

# 1. Pendahuluan

## 1.1 Latar Belakang

Proses pencatatan penerimaan surat keluar di banyak instansi pemerintah masih menggunakan buku ekspedisi manual. Cara tersebut memiliki beberapa kelemahan:

- Sulit mencari riwayat penerimaan.
- Rentan kehilangan atau kerusakan buku.
- Tidak memiliki bukti digital yang kuat.
- Sulit menyusun laporan dan audit.

e-Ekspedisi dikembangkan untuk mendigitalisasi proses tersebut tanpa mengubah alur kerja yang sudah berjalan.

---

# 2. Visi

> Menjadi sistem buku ekspedisi elektronik yang sederhana, aman, dan dapat dipertanggungjawabkan sebagai bukti penerimaan dokumen di lingkungan instansi pemerintah.

---

# 3. Misi

1. Menghilangkan penggunaan buku ekspedisi manual.
2. Menyediakan bukti penerimaan digital yang lengkap.
3. Mempermudah pencarian arsip.
4. Mendukung proses audit.
5. Menggunakan teknologi gratis berbasis Google Workspace.

---

# 4. Tujuan Proyek

## Tujuan Bisnis

- Digitalisasi proses administrasi.
- Meningkatkan akurasi pencatatan.
- Mengurangi penggunaan kertas.

## Tujuan Teknis

- Membangun aplikasi berbasis Google Apps Script.
- Menggunakan Google Spreadsheet sebagai basis data.
- Menyimpan dokumen pada Google Drive.
- Menyediakan REST API untuk frontend Vue 3.

---

# 5. Ruang Lingkup

## In Scope

- Login pengguna.
- Master data.
- Surat keluar.
- Nomor ekspedisi otomatis.
- QR Code.
- Konfirmasi penerimaan.
- Foto penerima.
- Lokasi GPS.
- Tanda tangan digital.
- Audit Trail.
- Dashboard.
- Laporan.
- Bukti penerimaan PDF.

## Out of Scope

- Pengiriman melalui kurir.
- Disposisi surat.
- Manajemen surat masuk.
- Persetujuan elektronik.
- Integrasi dengan sistem eksternal pada fase awal.

---

# 6. Stakeholder

| Stakeholder | Peran |
|-------------|-------|
| Pimpinan | Monitoring dan laporan |
| Admin Persuratan | Mengelola surat dan ekspedisi |
| Super Admin | Konfigurasi aplikasi |
| Penerima | Melakukan konfirmasi penerimaan |

---

# 7. Nilai yang Diharapkan

- Administrasi lebih cepat.
- Bukti penerimaan lebih valid.
- Audit lebih mudah.
- Arsip digital terpusat.

---

# 8. Faktor Keberhasilan (KPI)

| KPI | Target |
|-----|--------|
| Surat tercatat | 100% |
| Bukti penerimaan digital | 100% |
| Waktu pencarian surat | < 10 detik |
| Ketersediaan aplikasi | > 99% selama jam kerja |

---

# 9. Risiko

| Risiko | Mitigasi |
|---------|----------|
| Kuota Google Apps Script | Optimasi kode dan monitoring |
| Kesalahan input | Validasi form |
| Kehilangan akses akun | Pengelolaan akun admin |
| Koneksi internet | Penyimpanan otomatis dan retry |

---

# 10. Asumsi

- Instansi menggunakan Google Workspace.
- Pengguna memiliki akses internet.
- Dokumen sudah tersedia dalam bentuk PDF.

---

# 11. Teknologi

| Komponen | Teknologi |
|----------|-----------|
| Frontend | Vue 3 + Vite |
| Backend | Google Apps Script |
| Database | Google Spreadsheet |
| Storage | Google Drive |
| Dashboard | Looker Studio |

---

# 12. Deliverables

- Dokumentasi lengkap.
- Source code.
- Database Spreadsheet.
- Template Google Drive.
- Panduan instalasi.
- Panduan pengguna.

---

# 13. Referensi

- 00-Project-Index.md
- 02-Business-Requirements.md
- 03-PRD.md

---

# 14. Change Log

| Versi | Tanggal | Perubahan |
|--------|----------|-----------|
| 1.0.0 | 2026-08-05 | Dokumen awal |
