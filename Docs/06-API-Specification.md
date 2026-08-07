# 06 - API Specification

> **Document ID:** DOC-EEKS-006  
> **Project:** e-Ekspedisi  
> **Version:** 1.0.0 (Draft)

---

# 1. Tujuan

Dokumen ini mendefinisikan kontrak API antara frontend Vue 3 dan backend Google Apps Script.

---

# 2. Standar API

- Arsitektur: REST
- Format Data: JSON
- Encoding: UTF-8
- HTTPS wajib
- Seluruh response menggunakan format yang konsisten.

## Response Berhasil

```json
{
  "success": true,
  "message": "OK",
  "data": {}
}
```

## Response Gagal

```json
{
  "success": false,
  "message": "Validation Error",
  "errors": []
}
```

---

# 3. Autentikasi

| Endpoint | Method | Keterangan |
|----------|--------|------------|
| /auth/login | POST | Login |
| /auth/logout | POST | Logout |
| /auth/me | GET | Profil pengguna |

### Contoh Request

```json
{
  "username":"admin",
  "password":"********"
}
```

---

# 4. Surat Keluar

| Endpoint | Method |
|----------|--------|
| /surat | GET |
| /surat | POST |
| /surat/{id} | GET |
| /surat/{id} | PUT |
| /surat/{id} | DELETE |

### POST /surat

Request

```json
{
  "nomorSurat":"B-001",
  "tanggalSurat":"2026-08-05",
  "perihal":"Undangan",
  "unitId":"UUID"
}
```

Response

```json
{
  "success":true,
  "data":{
    "id":"UUID",
    "nomorEkspedisi":"EXP-2026-000001"
  }
}
```

---

# 5. Ekspedisi

| Endpoint | Method |
|----------|--------|
| /ekspedisi/{id} | GET |
| /ekspedisi/{id}/qr | POST |

---

# 6. Konfirmasi Penerimaan

| Endpoint | Method |
|----------|--------|
| /penerimaan | POST |
| /penerimaan/{id} | GET |

Payload:

```json
{
  "ekspedisiId":"UUID",
  "nama":"Penerima",
  "jabatan":"Analis",
  "instansi":"...",
  "gpsLat":0,
  "gpsLng":0
}
```

---

# 7. Dashboard

| Endpoint | Method |
|----------|--------|
| /dashboard/summary | GET |
| /dashboard/chart | GET |

---

# 8. Audit Log

| Endpoint | Method |
|----------|--------|
| /audit | GET |

---

# 9. Error Code

| Kode | Arti |
|------|------|
|400|Validasi gagal|
|401|Belum login|
|403|Tidak berhak|
|404|Data tidak ditemukan|
|409|Data duplikat|
|500|Kesalahan server|

---

# 10. Mapping API

| Modul | Endpoint |
|--------|----------|
| Login | /auth/* |
| Surat | /surat |
| Ekspedisi | /ekspedisi |
| Penerimaan | /penerimaan |
| Dashboard | /dashboard |

---

# 11. Referensi

- 03-PRD.md
- 05-Database-Data-Dictionary.md

---

# 12. Change Log

|Versi|Tanggal|Perubahan|
|---|---|---|
|1.0.0|2026-08-05|Draft awal|
