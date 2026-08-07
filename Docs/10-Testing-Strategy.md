# 10 - Testing Strategy

> **Document ID:** DOC-EEKS-010  
> **Project:** e-Ekspedisi  
> **Version:** 1.0.0 (Draft)

---

# 1. Tujuan

Dokumen ini mendefinisikan strategi pengujian untuk memastikan seluruh fitur e-Ekspedisi memenuhi kebutuhan bisnis, aman, dan siap digunakan.

---

# 2. Sasaran Pengujian

- Memastikan Functional Requirement (FR) terpenuhi.
- Memastikan Business Rules berjalan benar.
- Mengurangi defect sebelum produksi.
- Menjamin kualitas setiap rilis.

---

# 3. Pyramid Testing

```text
            End-to-End
          ───────────────
         Integration Test
      ─────────────────────
           Unit Test
```

Prioritas:
1. Unit Test
2. Integration Test
3. UAT
4. Regression

---

# 4. Jenis Pengujian

| Jenis | Tujuan |
|---|---|
| Unit Test | Menguji fungsi individual |
| Integration Test | Menguji interaksi modul |
| System Test | Menguji aplikasi secara utuh |
| UAT | Validasi pengguna |
| Regression | Memastikan fitur lama tetap berjalan |
| Performance | Mengukur performa |
| Security | Menguji keamanan |

---

# 5. Cakupan Pengujian

| Modul | Unit | Integrasi | UAT |
|---|:---:|:---:|:---:|
| Login | ✔ | ✔ | ✔ |
| Surat Keluar | ✔ | ✔ | ✔ |
| Ekspedisi | ✔ | ✔ | ✔ |
| Penerimaan | ✔ | ✔ | ✔ |
| Dashboard | ✔ | ✔ | ✔ |
| Audit Trail | ✔ | ✔ | ✔ |

---

# 6. Contoh Test Case

## TC-LOGIN-001

**Fitur:** Login

**Prasyarat**
- Pengguna terdaftar.

**Langkah**
1. Buka halaman login.
2. Masukkan username & password valid.
3. Klik **Masuk**.

**Hasil yang Diharapkan**
- Login berhasil.
- Dashboard tampil.

---

## TC-RCV-001

**Fitur:** Konfirmasi Penerimaan

**Prasyarat**
- Surat berstatus *Menunggu Pengambilan*.

**Langkah**
1. Buka detail ekspedisi.
2. Isi identitas.
3. Ambil foto.
4. Tanda tangan.
5. Simpan.

**Hasil yang Diharapkan**
- Status menjadi **Diterima**.
- PDF bukti dibuat.
- Audit log tercatat.

---

# 7. Traceability Matrix

| FR | BR | Test Case |
|---|---|---|
| FR-101 | BR-EXP-001 | TC-SURAT-001 |
| FR-201 | BR-RCV-001 | TC-RCV-001 |
| FR-205 | BR-DOC-002 | TC-RCV-002 |
| FR-301 | BR-SYS-001 | TC-DASH-001 |

---

# 8. Data Uji

Gunakan:
- Data dummy
- PDF contoh
- Foto contoh
- Akun uji untuk setiap role

Jangan gunakan data produksi.

---

# 9. Kriteria Kelulusan

- 100% Business Rule kritis lulus.
- Tidak ada bug Critical.
- Tidak ada bug High yang menghambat proses bisnis.
- Semua UAT disetujui.

---

# 10. Defect Severity

| Level | Contoh |
|---|---|
| Critical | Login gagal, data hilang |
| High | Tidak dapat konfirmasi penerimaan |
| Medium | Filter tidak bekerja |
| Low | Salah teks, tata letak |

---

# 11. Checklist Release

- [ ] Unit Test lulus
- [ ] Integration Test lulus
- [ ] UAT disetujui
- [ ] Security review selesai
- [ ] Dokumentasi diperbarui

---

# 12. Referensi

- 03-PRD.md
- 02B-Business-Rules-Catalog.md
- 06A-API-Contract-OpenAPI.md
- 09-Development-Guide.md

---

# 13. Change Log

| Versi | Tanggal | Perubahan |
|---|---|---|
|1.0.0|2026-08-05|Draft awal|
