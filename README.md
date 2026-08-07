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
