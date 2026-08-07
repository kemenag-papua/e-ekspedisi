# 08 - Security & Compliance

> **Document ID:** DOC-EEKS-008  
> **Project:** e-Ekspedisi  
> **Version:** 1.0.0 (Draft)

---

# 1. Tujuan

Dokumen ini menjadi acuan keamanan aplikasi, kepatuhan administrasi, perlindungan data, serta pengelolaan risiko untuk e‑Ekspedisi.

---

# 2. Sasaran Keamanan

- Menjaga kerahasiaan data.
- Menjamin integritas bukti penerimaan.
- Menjamin ketersediaan layanan.
- Mendukung proses audit.

---

# 3. Prinsip Keamanan

- Least Privilege
- Defense in Depth
- Secure by Design
- Audit by Default
- Principle of Least Knowledge

---

# 4. Role Based Access Control (RBAC)

| Fitur | Super Admin | Admin | Penerima | Pimpinan |
|---|:---:|:---:|:---:|:---:|
| Login | ✔ | ✔ | ✔ | ✔ |
| Master Data | ✔ | ✔ | ✖ | ✖ |
| Surat Keluar | ✔ | ✔ | ✖ | ✖ |
| Konfirmasi | ✖ | ✔ | ✔ | ✖ |
| Audit Trail | ✔ | ✔ | ✖ | ✔ |
| Pengaturan | ✔ | ✖ | ✖ | ✖ |

---

# 5. Data yang Dikelola

## Data Administratif
- Nomor surat
- Perihal
- Unit kerja

## Data Bukti Penerimaan
- Nama penerima
- Jabatan
- Instansi
- Foto
- Tanda tangan
- Koordinat GPS (jika diaktifkan)
- Timestamp

---

# 6. Perlindungan Data

- HTTPS wajib.
- Validasi file upload.
- QR menggunakan token acak.
- PDF bukti penerimaan tidak dapat diubah.
- Audit Log bersifat append-only.

---

# 7. Threat Model (Ringkas)

| Ancaman | Mitigasi |
|---|---|
| QR dipalsukan | Token + validasi server |
| Akses tanpa izin | RBAC |
| Upload file berbahaya | Validasi tipe & ukuran |
| Penghapusan data | Hak akses + backup |
| Perubahan bukti | PDF final + audit log |

---

# 8. Audit Trail

Catat minimal:

- Login
- Logout
- Tambah/Ubah/Hapus data
- Konfirmasi penerimaan
- Generate PDF
- Perubahan konfigurasi

Kolom:
- User
- Waktu
- IP (jika tersedia)
- Objek
- Aksi
- Hasil

---

# 9. Backup & Recovery

## Spreadsheet
- Backup harian.
- Salinan mingguan.

## Google Drive
- Backup berkala.
- Struktur folder konsisten.

---

# 10. Retensi Arsip

| Data | Retensi |
|---|---|
| Surat | Permanen |
| Bukti PDF | Permanen |
| Audit Log | Permanen |
| Konfigurasi | Selama aplikasi digunakan |

---

# 11. Kepatuhan

Dokumen ini harus disesuaikan dengan:
- Tata naskah dinas instansi.
- Kebijakan kearsipan instansi.
- Kebijakan keamanan informasi internal.
- Ketentuan perlindungan data yang berlaku.

---

# 12. Risiko

| Risiko | Dampak | Mitigasi |
|---|---|---|
| Kuota GAS habis | Layanan terganggu | Monitoring & optimasi |
| Spreadsheet rusak | Kehilangan data | Backup |
| Salah input | Bukti tidak valid | Validasi & review |
| Akun admin diambil alih | Kebocoran data | MFA (jika tersedia) |

---

# 13. Checklist Keamanan

- [ ] HTTPS aktif
- [ ] RBAC diterapkan
- [ ] Validasi input
- [ ] Audit Trail aktif
- [ ] Backup berjalan
- [ ] Recovery diuji
- [ ] QR Token tervalidasi

---

# 14. Referensi

- 03-PRD.md
- 04-System-Architecture.md
- 05-Database-Data-Dictionary.md
- 06A-API-Contract-OpenAPI.md

---

# 15. Change Log

| Versi | Tanggal | Perubahan |
|---|---|---|
|1.0.0|2026-08-05|Draft awal|
