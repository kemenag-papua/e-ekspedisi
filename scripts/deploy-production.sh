#!/usr/bin/env bash
#
# deploy-production.sh
#
# Panduan otomatis deployment production e-Ekspedisi.
# Menampilkan checklist langkah deployment dan mengeksekusi langkah yang bisa
# dieksekusi otomatis (build frontend, verifikasi konfigurasi).
#
# Prasyarat:
#   - clasp terinstal & login
#   - SPREADSHEET_ID sudah di-set di backend-gas/config/DatabaseConfig.gs
#   - .clasp.json sudah dikonfigurasi
#
# Usage:
#   bash scripts/deploy-production.sh
#

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
FRONTEND_DIR="$ROOT_DIR/frontend"

echo "=============================================="
echo " e-Ekspedisi - Deployment Production"
echo "=============================================="
echo ""
echo "Step 1/6: Verifikasi konfigurasi backend..."

# Cek SPREADSHEET_ID
if grep -q "YOUR_SPREADSHEET_ID" "$ROOT_DIR/backend-gas/config/DatabaseConfig.gs"; then
  echo "  [WARN] SPREADSHEET_ID masih placeholder di DatabaseConfig.gs"
  echo "         Jalankan setup-spreadsheet.gs lalu isi ID-nya."
else
  echo "  [OK] SPREADSHEET_ID sudah dikonfigurasi"
fi

# Cek .clasp.json
if [ -f "$ROOT_DIR/.clasp.json" ] && ! grep -q "YOUR_SCRIPT_ID" "$ROOT_DIR/.clasp.json"; then
  echo "  [OK] .clasp.json sudah dikonfigurasi"
else
  echo "  [WARN] .clasp.json belum dikonfigurasi (scriptId masih placeholder)"
fi

echo ""
echo "Step 2/6: Push backend ke Google Apps Script (clasp push)..."
if command -v clasp &> /dev/null; then
  (cd "$ROOT_DIR" && clasp push -f) || echo "  [SKIP] clasp push gagal - pastikan sudah login"
else
  echo "  [SKIP] clasp tidak terinstal"
fi

echo ""
echo "Step 3/6: Deploy frontend (build)..."
if [ ! -d "$FRONTEND_DIR/node_modules" ]; then
  (cd "$FRONTEND_DIR" && npm install)
fi
(cd "$FRONTEND_DIR" && npm run build)
echo "  [OK] Build selesai di frontend/dist"

echo ""
echo "Step 4/6: Verifikasi .env.production..."
if [ -f "$FRONTEND_DIR/.env.production" ] && ! grep -q "YOUR_DEPLOYMENT_ID" "$FRONTEND_DIR/.env.production"; then
  echo "  [OK] VITE_API_BASE_URL sudah di-set"
else
  echo "  [WARN] .env.production masih placeholder - set VITE_API_BASE_URL"
fi

echo ""
echo "Step 5/6: Checklist manual (lakukan di Google Apps Script Editor):"
echo "  [ ] Deploy Apps Script sebagai Web App (executeAs: USER_ACCESSING)"
echo "  [ ] Catat Web App URL"
echo "  [ ] Set app_url di Spreadsheet konfigurasi (via updateAppUrl)"
echo "  [ ] Share Spreadsheet ke seluruh pengguna (Editor)"
echo "  [ ] Set VITE_API_BASE_URL di .env.production dengan Web App URL"
echo "  [ ] Rebuild frontend setelah set VITE_API_BASE_URL"

echo ""
echo "Step 6/6: Hosting frontend:"
echo "  Opsi A - GitHub Pages:"
echo "    - Push ke GitHub, aktifkan Pages dari branch main (folder /docs) atau via Actions"
echo "    - SPA routing otomatis via 404.html"
echo "  Opsi B - Server internal instansi:"
echo "    - Upload isi frontend/dist ke web server"

echo ""
echo "=============================================="
echo " Deployment selesai. Verifikasi login + generate PDF."
echo "=============================================="
