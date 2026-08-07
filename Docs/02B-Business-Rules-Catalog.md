# 02B - Business Rules Catalog

> **Document ID:** DOC-EEKS-002B  
> **Project:** e-Ekspedisi  
> **Version:** 1.0.0 (Draft)

---

# 1. Tujuan

Dokumen ini mendefinisikan seluruh aturan bisnis (Business Rules) yang menjadi acuan implementasi aplikasi e-Ekspedisi.

Setiap aturan memiliki kode unik dan akan dirujuk oleh:
- PRD
- Database
- API
- UI/UX
- Testing
- Source Code

---

# 2. Kategori Business Rules

| Prefix | Kategori |
|--------|----------|
| BR-EXP | Ekspedisi |
| BR-RCV | Penerimaan |
| BR-QR | QR Code |
| BR-AUD | Audit Trail |
| BR-SEC | Keamanan |
| BR-DOC | Dokumen |
| BR-USR | Pengguna |
| BR-SYS | Sistem |

---

# 3. Aturan Bisnis

## A. Ekspedisi

### BR-EXP-001
Setiap surat keluar wajib memiliki Nomor Ekspedisi yang unik.

### BR-EXP-002
Satu Nomor Ekspedisi hanya boleh digunakan untuk satu surat.

### BR-EXP-003
Nomor Ekspedisi dibuat otomatis dan tidak dapat diubah.

### BR-EXP-004
Status awal surat adalah **Menunggu Pengambilan**.

---

## B. Penerimaan

### BR-RCV-001
Penerimaan hanya dapat dilakukan satu kali.

### BR-RCV-002
Penerima wajib mengisi identitas sesuai formulir.

### BR-RCV-003
Tanda tangan digital wajib tersedia sebelum konfirmasi.

### BR-RCV-004
Foto penerima wajib diambil.

### BR-RCV-005
GPS dapat diatur menjadi wajib atau opsional melalui konfigurasi aplikasi.

### BR-RCV-006
Setelah diterima, status surat berubah menjadi **Diterima** dan tidak dapat dikembalikan ke status sebelumnya tanpa hak akses khusus.

---

## C. QR Code

### BR-QR-001
QR Code dibuat otomatis saat ekspedisi dibuat.

### BR-QR-002
QR Code berisi ID Ekspedisi dan token validasi.

### BR-QR-003
QR Code tidak boleh menampilkan data sensitif secara langsung.

---

## D. Dokumen

### BR-DOC-001
File surat utama disimpan dalam format PDF.

### BR-DOC-002
Sistem membuat PDF Bukti Penerimaan secara otomatis.

### BR-DOC-003
PDF Bukti Penerimaan bersifat arsip dan tidak boleh diubah.

---

## E. Audit Trail

### BR-AUD-001
Seluruh aktivitas penting dicatat pada Audit Trail.

### BR-AUD-002
Audit Trail minimal mencatat:
- pengguna
- waktu
- aksi
- objek
- hasil

---

## F. Keamanan

### BR-SEC-001
Hak akses menggunakan Role Based Access Control (RBAC).

### BR-SEC-002
Setiap endpoint harus memverifikasi autentikasi pengguna.

### BR-SEC-003
Upload file divalidasi berdasarkan tipe dan ukuran.

---

## G. Pengguna

### BR-USR-001
Peran sistem:
- Super Admin
- Admin Persuratan
- Penerima
- Pimpinan

### BR-USR-002
Penerima tidak dapat mengubah data surat.

---

## H. Sistem

### BR-SYS-001
Database menggunakan Google Spreadsheet.

### BR-SYS-002
Dokumen disimpan pada Google Drive.

### BR-SYS-003
Sistem dikembangkan menggunakan Google Apps Script dan Vue 3.

---

# 4. Traceability Matrix

| Rule | Modul |
|------|-------|
| BR-EXP-* | Surat Keluar |
| BR-RCV-* | Konfirmasi Penerimaan |
| BR-QR-* | QR Code |
| BR-DOC-* | Dokumen |
| BR-AUD-* | Audit Log |
| BR-SEC-* | Security |
| BR-USR-* | User Management |
| BR-SYS-* | Infrastruktur |

---

# 5. Perubahan Aturan

Perubahan terhadap Business Rules wajib dicatat pada **13-Decision-Log.md** dan direview sebelum implementasi.

---

# 6. Change Log

| Versi | Tanggal | Perubahan |
|--------|----------|-----------|
| 1.0.0 | 2026-08-05 | Dokumen awal |
