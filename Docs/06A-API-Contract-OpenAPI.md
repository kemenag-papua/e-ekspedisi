# 06A - API Contract (OpenAPI Design)

> **Document ID:** DOC-EEKS-006A  
> **Project:** e-Ekspedisi  
> **Version:** 1.0.0 (Draft)

---

# 1. Tujuan

Dokumen ini mendefinisikan kontrak API yang menjadi acuan bersama antara frontend (Vue 3), backend (Google Apps Script), dan AI coding agent.

---

# 2. Standar

- OpenAPI 3.1 (desain)
- REST
- JSON UTF-8
- HTTPS
- Versioning: `/api/v1`

---

# 3. Authentication

```
Authorization: Bearer <token>
Content-Type: application/json
Accept: application/json
```

---

# 4. Resource

| Resource | Endpoint |
|----------|----------|
| Auth | /api/v1/auth |
| Surat | /api/v1/surat |
| Ekspedisi | /api/v1/ekspedisi |
| Penerimaan | /api/v1/penerimaan |
| Dashboard | /api/v1/dashboard |
| Audit | /api/v1/audit |

---

# 5. JSON Schema (Ringkas)

## Surat

```json
{
  "id":"uuid",
  "nomorSurat":"string",
  "tanggalSurat":"date",
  "perihal":"string",
  "status":"MENUNGGU_PENGAMBILAN"
}
```

## Penerimaan

```json
{
  "id":"uuid",
  "ekspedisiId":"uuid",
  "namaPenerima":"string",
  "fotoUrl":"string",
  "signatureUrl":"string",
  "pdfUrl":"string"
}
```

---

# 6. Contoh Endpoint

## POST /api/v1/penerimaan

Request

```json
{
  "ekspedisiId":"uuid",
  "namaPenerima":"Budi",
  "jabatan":"Analis",
  "instansi":"Kemenag"
}
```

Response

```json
{
  "success":true,
  "message":"Penerimaan berhasil",
  "data":{
    "status":"DITERIMA"
  }
}
```

---

# 7. Status Code

| Code | Arti |
|------|------|
|200|OK|
|201|Created|
|400|Bad Request|
|401|Unauthorized|
|403|Forbidden|
|404|Not Found|
|409|Conflict|
|500|Internal Error|

---

# 8. Error Catalog

| Kode | Deskripsi |
|------|-----------|
|E001|Nomor surat sudah digunakan|
|E002|QR tidak valid|
|E003|Surat sudah diterima|
|E004|File PDF tidak ditemukan|
|E005|Generate PDF gagal|

---

# 9. Mapping

| Endpoint | PRD | Business Rule |
|----------|-----|---------------|
|POST /surat|FR-101|BR-EXP-001|
|POST /penerimaan|FR-205|BR-RCV-001|

---

# 10. Change Log

| Versi | Tanggal | Perubahan |
|-------|----------|-----------|
|1.0.0|2026-08-05|Draft awal|
