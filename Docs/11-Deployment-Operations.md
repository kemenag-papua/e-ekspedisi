# 11 - Deployment & Operations

> **Document ID:** DOC-EEKS-011  
> **Project:** e-Ekspedisi  
> **Version:** 1.0.0 (Draft)

---

# 1. Tujuan

Dokumen ini menjadi panduan deployment, operasi harian, backup, monitoring, dan pemulihan aplikasi e-Ekspedisi.

---

# 2. Environment

| Environment | Tujuan |
|---|---|
| Development | Pengembangan |
| Staging | UAT & validasi |
| Production | Operasional |

Konfigurasi setiap environment dipisahkan (Spreadsheet ID, Folder Drive, URL Web App).

---

# 3. Arsitektur Deployment

```text
Developer
    │
 GitHub Repository
    │
   clasp push
    │
Google Apps Script
    │
 Deploy Web App
    │
 Vue 3 Frontend
    │
Spreadsheet + Google Drive
```

---

# 4. Deployment Backend (GAS)

Langkah umum:

1. Sinkronisasi kode dengan Git.
2. Jalankan `clasp push`.
3. Buat Version baru.
4. Deploy sebagai Web App.
5. Catat URL deployment.
6. Uji endpoint utama.

---

# 5. Deployment Frontend

1. Build aplikasi Vue.
2. Publish ke hosting yang dipilih.
3. Atur URL API sesuai environment.
4. Verifikasi konektivitas.

---

# 6. Versioning

| Komponen | Contoh |
|---|---|
| Aplikasi | v1.0.0 |
| Apps Script | Version 12 |
| API | /api/v1 |

---

# 7. Backup

## Spreadsheet
- Backup harian.
- Snapshot mingguan.

## Google Drive
- Sinkronisasi berkala.
- Folder mengikuti struktur standar.

---

# 8. Monitoring

Pantau:

- Kuota Apps Script.
- Error aplikasi.
- Waktu respons.
- Kegagalan generate PDF.
- Kegagalan upload file.

---

# 9. Logging Operasional

Catat:

- Deployment.
- Rollback.
- Perubahan konfigurasi.
- Gangguan layanan.
- Aktivitas administrator.

---

# 10. Rollback

Rollback dilakukan apabila:

- Deployment gagal.
- Terjadi bug kritis.
- Integritas data terganggu.

Langkah:

1. Aktifkan versi Apps Script sebelumnya.
2. Pulihkan konfigurasi bila diperlukan.
3. Verifikasi layanan.
4. Dokumentasikan insiden.

---

# 11. Disaster Recovery

| Risiko | Mitigasi |
|---|---|
| Spreadsheet rusak | Pulihkan dari backup |
| Folder Drive terhapus | Restore dari salinan |
| Deployment gagal | Rollback versi |
| Kuota habis | Tunda proses non-kritis & optimasi |

---

# 12. SOP Operasional

## Harian
- Periksa dashboard.
- Cek error log.
- Verifikasi backup.

## Mingguan
- Uji restore sampel.
- Tinjau kapasitas penyimpanan.
- Bersihkan data sementara.

## Bulanan
- Audit hak akses.
- Tinjau kuota Apps Script.
- Evaluasi performa.

---

# 13. Maintenance Window

- Dilakukan di luar jam kerja.
- Pengguna diberi pemberitahuan.
- Backup selesai sebelum perubahan.

---

# 14. Checklist Deployment

- [ ] Build berhasil
- [ ] clasp push berhasil
- [ ] Version dibuat
- [ ] Web App diperbarui
- [ ] API diuji
- [ ] Login berhasil
- [ ] Generate PDF berhasil
- [ ] Dokumentasi diperbarui

---

# 15. Referensi

- 04-System-Architecture.md
- 04A-Google-Apps-Script-Architecture.md
- 09-Development-Guide.md
- 10-Testing-Strategy.md

---

# 16. Change Log

| Versi | Tanggal | Perubahan |
|---|---|---|
|1.0.0|2026-08-05|Draft awal|
