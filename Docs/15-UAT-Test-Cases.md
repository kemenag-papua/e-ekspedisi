# UAT e-Ekspedisi v1.0

> Panduan User Acceptance Testing (UAT) sebelum Go Live.
> Tester mengisi checklist di bawah untuk setiap modul.

## Informasi

| Item | Nilai |
|------|-------|
| Tester | |
| Tanggal | |
| Lingkungan | [ ] Development [ ] Staging [ ] Production |
| Versi Aplikasi | v1.0.0 |

---

## 1. Login & RBAC

| No | Test Case | Langkah | Hasil Diharapkan | Hasil |
|----|-----------|---------|------------------|-------|
| 1.1 | Login sukses | Login `admin` / `Admin123!` | Redirect ke Dashboard | [ ] |
| 1.2 | Login gagal | Password salah | Error toast "Username atau password salah" | [ ] |
| 1.3 | Redirect jika belum login | Buka `/surat` tanpa login | Redirect ke `/login` | [ ] |
| 1.4 | RBAC admin | Login `adminpersuratan`, cek menu | Tidak ada menu Pengaturan | [ ] |
| 1.5 | RBAC pimpinan | Login `pimpinan`, cek menu | Hanya Dashboard + Laporan | [ ] |
| 1.6 | Logout | Klik Logout | Kembali ke halaman login | [ ] |

---

## 2. Master Data

| No | Test Case | Langkah | Hasil Diharapkan | Hasil |
|----|-----------|---------|------------------|-------|
| 2.1 | Tambah unit | Menu Master Data > Unit > Tambah | Unit baru tersimpan | [ ] |
| 2.2 | Duplikat unit | Tambah unit nama yang sama | Error "Nama unit sudah digunakan" | [ ] |
| 2.3 | Edit unit | Edit nama unit | Nama terupdate | [ ] |
| 2.4 | Tambah pegawai | Master Data > Pegawai > Tambah | Pegawai baru tersimpan | [ ] |
| 2.5 | Duplikat username | Tambah username yang sama | Error "Username sudah digunakan" | [ ] |
| 2.6 | Edit pegawai | Edit tanpa ganti password | Data terupdate, password tetap | [ ] |

---

## 3. Surat Keluar

| No | Test Case | Langkah | Hasil Diharapkan | Hasil |
|----|-----------|---------|------------------|-------|
| 3.1 | Buat surat | /surat/tambah, isi lengkap + PDF | Surat tersimpan, No. Ekspedisi otomatis | [ ] |
| 3.2 | Upload non-PDF | Upload file .txt | Error "File harus berformat PDF" | [ ] |
| 3.3 | Upload >5MB | Upload PDF > 5MB | Error "Ukuran file maksimal 5 MB" | [ ] |
| 3.4 | Duplikat nomor | Buat surat nomor yang sama | Error "Nomor surat sudah digunakan" | [ ] |
| 3.5 | Detail surat | Buka detail surat | Info + QR + PDF preview tampil | [ ] |
| 3.6 | Cari surat | Search di daftar surat | Data terfilter | [ ] |
| 3.7 | Filter status | Filter "Diterima" | Hanya surat diterima tampil | [ ] |

---

## 4. QR Code & Verifikasi

| No | Test Case | Langkah | Hasil Diharapkan | Hasil |
|----|-----------|---------|------------------|-------|
| 4.1 | QR tampil | Buka detail surat | QR Code ter-render | [ ] |
| 4.2 | Cetak QR | Klik "Cetak QR" | Download PNG berhasil | [ ] |
| 4.3 | Salin link | Klik "Salin Link" | Link verifikasi tercopy | [ ] |
| 4.4 | Buka link verifikasi | Buka link di browser lain | Halaman verifikasi tampil | [ ] |
| 4.5 | Token salah | Ubah token di URL | Error "QR tidak valid" | [ ] |

---

## 5. Konfirmasi Penerimaan

| No | Test Case | Langkah | Hasil Diharapkan | Hasil |
|----|-----------|---------|------------------|-------|
| 5.1 | Tombol konfirmasi | Detail surat status menunggu | Tombol "Konfirmasi" tampil | [ ] |
| 5.2 | Isi identitas | Isi nama, jabatan, instansi | Tersimpan | [ ] |
| 5.3 | Foto tanpa kamera | Upload foto dari perangkat | Foto preview tampil | [ ] |
| 5.4 | Tanda tangan | Gambar di signature pad | Terdeteksi | [ ] |
| 5.5 | Tanpa tanda tangan | Submit tanpa TTD | Error "Tanda tangan wajib diisi" | [ ] |
| 5.6 | GPS | Klik "Ambil Lokasi" | Koordinat tampil | [ ] |
| 5.7 | Simpan konfirmasi | Submit lengkap | Status surat jadi "Diterima" | [ ] |
| 5.8 | Konfirmasi ulang | Coba konfirmasi lagi | Error "Surat sudah diterima" | [ ] |

---

## 6. PDF Bukti Penerimaan

| No | Test Case | Langkah | Hasil Diharapkan | Hasil |
|----|-----------|---------|------------------|-------|
| 6.1 | PDF auto-generate | Setelah konfirmasi | PDF tersimpan di Drive (folder Bukti-Penerimaan) | [ ] |
| 6.2 | Isi PDF | Buka PDF | Berisi nomor, identitas, foto, TTD, QR, timestamp | [ ] |

---

## 7. Dashboard

| No | Test Case | Langkah | Hasil Diharapkan | Hasil |
|----|-----------|---------|------------------|-------|
| 7.1 | KPI cards | Buka /dashboard | Total, menunggu, diterima, audit tampil | [ ] |
| 7.2 | Grafik | Lihat statistik bulanan | Line chart 12 bulan tampil | [ ] |
| 7.3 | Surat terbaru | Lihat section surat terbaru | 5 surat terbaru tampil | [ ] |
| 7.4 | Aktivitas terakhir | Lihat section aktivitas | 5 log terakhir tampil | [ ] |

---

## 8. Laporan

| No | Test Case | Langkah | Hasil Diharapkan | Hasil |
|----|-----------|---------|------------------|-------|
| 8.1 | Default bulan ini | Buka /reports | Filter tanggal = bulan ini | [ ] |
| 8.2 | Filter tanggal | Ganti range tanggal | Data terfilter | [ ] |
| 8.3 | Filter status | Filter status tertentu | Data terfilter | [ ] |
| 8.4 | Export CSV | Klik Export CSV | File CSV terdownload, terbuka di Excel | [ ] |

---

## 9. Audit Trail

| No | Test Case | Langkah | Hasil Diharapkan | Hasil |
|----|-----------|---------|------------------|-------|
| 9.1 | Daftar audit | Buka /audit | Tabel audit tampil | [ ] |
| 9.2 | Filter user | Ketik username | Data terfilter | [ ] |
| 9.3 | Filter aksi | Pilih aksi | Data terfilter | [ ] |
| 9.4 | Export CSV | Klik Export CSV | File CSV terdownload | [ ] |
| 9.5 | Riwayat surat | Detail surat > riwayat | Timeline aktivitas tampil | [ ] |

---

## 10. Security & Reliability

| No | Test Case | Langkah | Hasil Diharapkan | Hasil |
|----|-----------|---------|------------------|-------|
| 10.1 | Token expired | Biarkan sesi lama | Auto-logout ke /login | [ ] |
| 10.2 | Rate limit | Request berlebihan | Error 429 ditampilkan | [ ] |
| 10.3 | XSS | Input `<script>` di perihal | Script tidak jalan | [ ] |
| 10.4 | Backup | Cek folder Drive | Folder e-Ekspedisi lengkap | [ ] |

---

## Kesimpulan

| Kategori | Jumlah Test | Lulus | Gagal |
|----------|------------|-------|-------|
| Login & RBAC | 6 | | |
| Master Data | 6 | | |
| Surat Keluar | 7 | | |
| QR & Verifikasi | 5 | | |
| Konfirmasi | 8 | | |
| PDF Bukti | 2 | | |
| Dashboard | 4 | | |
| Laporan | 4 | | |
| Audit Trail | 5 | | |
| Security | 4 | | |
| **Total** | **51** | | |

**Keputusan:** [ ] Setuju Go Live  [ ] Perlu perbaikan

Tanda tangan Tester: ____________________

Tanda tangan Pimpinan: ____________________

Tanggal: ____________________
