# e-Ekspedisi

Aplikasi digitalisasi buku ekspedisi surat keluar menjadi sistem bukti penerimaan elektronik untuk instansi pemerintah.

## Tech Stack

| Layer | Teknologi |
|-------|-----------|
| Frontend | Vue 3 + Vite + Pinia + PrimeVue + Tailwind CSS |
| Backend | Google Apps Script |
| Database | Google Spreadsheet |
| Storage | Google Drive |
| Charts | Chart.js + Looker Studio |

## Struktur Repository

```text
e-ekspedisi/
├── frontend/           # Vue 3 application
│   └── src/
│       ├── api/        # API client
│       ├── assets/     # Static assets
│       ├── components/ # Reusable components
│       ├── composables/# Composition functions
│       ├── layouts/    # App layouts
│       ├── pages/      # Route pages
│       ├── router/     # Vue Router configuration
│       ├── stores/     # Pinia stores
│       ├── styles/     # Global styles
│       └── utils/      # Helper functions
├── backend-gas/        # Google Apps Script backend
│   ├── controllers/    # HTTP request handlers
│   ├── services/       # Business logic
│   ├── repositories/   # Spreadsheet & Drive access
│   ├── middleware/     # Auth, CORS, error handling
│   ├── models/         # Data models
│   └── utils/          # Helper functions
├── docs/               # Project documentation
└── scripts/            # Deployment scripts
```

## Arsitektur Backend (Layered)

```text
Request
   ↓
Controller
   ↓
Service
   ↓
Repository
   ↓
Spreadsheet / Drive
```

Aturan:
- Controller hanya menerima request dan mengembalikan response.
- Service berisi business rule.
- Repository menangani akses Spreadsheet dan Drive.
- Tidak boleh mengakses Spreadsheet langsung dari Controller.

## Prasyarat

- Node.js >= 20
- npm >= 9
- Google Workspace account
- [clasp](https://github.com/google/clasp) untuk deploy Google Apps Script
- [Git](https://git-scm.com/)

## Setup Development

### 1. Clone dan Install Frontend

```bash
cd frontend
npm install
npm run dev
```

### 2. Setup Google Apps Script

```bash
# Login ke Google
clasp login

# Buat file .clasp.json (ikuti panduan Docs/11-Deployment-Operations.md)
# Set scriptId dengan ID script Apps Script Anda

# Push kode backend
npm run deploy:gas
```

### 3. Setup Spreadsheet Database

Buat Google Spreadsheet dengan sheet berikut (lihat `Docs/05-Database-Data-Dictionary.md`):

- `surat_keluar`
- `ekspedisi`
- `penerimaan`
- `pegawai`
- `master_unit`
- `konfigurasi`
- `audit_log`

## Deployment Production

### 1. Setup Database (Google Spreadsheet)

1. Buka https://script.google.com → **New Project**
2. Tempel isi `scripts/setup-spreadsheet.gs`
3. Jalankan fungsi `setupDatabase()`
4. Dari log, catat **SPREADSHEET_ID**
5. Isi `SPREADSHEET_ID` di `backend-gas/config/DatabaseConfig.gs`
6. Bagikan Spreadsheet ke seluruh pengguna aplikasi (Drive → Share → Editor)

> Untuk data uji UAT: jalankan `seedTestData()` dari `scripts/seed-test-data.gs`.
> Akun uji: `admin`, `adminpersuratan`, `pimpinan` (password: `Admin123!`).

### 2. Deploy Backend (Google Apps Script)

```bash
# Pastikan .clasp.json sudah diisi scriptId
clasp login
clasp push -f
```

Lalu di Google Apps Script Editor:
1. **Deploy → New deployment**
2. Type: **Web app**
3. Execute as: **User accessing the web app**
4. Who has access: **Anyone**
5. Catat **Web App URL** (contoh: `https://script.google.com/macros/s/xxxxx/exec`)
6. Jalankan `updateAppUrl('https://url-frontend-anda')` dari `scripts/setup-spreadsheet.gs` untuk QR verifikasi di PDF

### 3. Deploy Frontend (GitHub Pages / Server)

```bash
cd frontend
# Set VITE_API_BASE_URL ke Web App URL backend
cp .env.production .env.production.local
# Edit .env.production.local: VITE_API_BASE_URL=https://script.google.com/macros/s/xxxxx/exec

npm run build
# Hasil build di frontend/dist
```

**Opsi A — GitHub Pages:**
- SPA routing sudah ditangani via `public/404.html` + redirect di `index.html`
- Jika di-deploy di subpath (`username.github.io/e-ekspedisi`), set `appBase` di `404.html`
- Push ke GitHub → aktifkan Pages dari branch `main`

**Opsi B — Server internal instansi:**
- Upload isi `frontend/dist` ke web server
- Konfigurasi web server agar semua path redirect ke `index.html` (SPA fallback)

### 4. Verifikasi Go Live

```bash
bash scripts/deploy-production.sh  # panduan checklist deployment
```

Uji minimal:
- Login berhasil
- Buat surat → No. Ekspedisi otomatis
- Konfirmasi penerimaan → status Diterima + PDF ter-generate
- Dashboard menampilkan data
- Export CSV laporan & audit

## Scripts

| Command | Deskripsi |
|---------|-----------|
| `npm run dev` | Jalankan dev server frontend |
| `npm run build` | Build frontend untuk produksi |
| `npm run preview` | Preview build produksi |
| `npm run lint` | Jalankan ESLint |
| `npm run format` | Format kode dengan Prettier |
| `npm run deploy:gas` | Deploy backend ke Google Apps Script |

## Git Workflow

```text
main
develop
feature/*
bugfix/*
hotfix/*
release/*
```

Gunakan [Conventional Commits](https://www.conventionalcommits.org/):

```text
feat: tambah modul konfirmasi penerimaan
fix: perbaiki validasi QR
docs: update PRD
refactor: pisahkan repository
```

## Dokumentasi

Seluruh dokumentasi proyek tersedia di folder `docs/` dengan referensi utama:
- `00-Project-Index.md` - Indeks seluruh dokumentasi
- `03-PRD.md` - Product Requirements
- `05-Database-Data-Dictionary.md` - Struktur data
- `06-API-Specification.md` - Spesifikasi API
- `09-Development-Guide.md` - Panduan pengembangan

## Lisensi

Internal Government
