#!/usr/bin/env bash
#
# deploy-gas.sh
#
# Script untuk deploy backend Google Apps Script.
# Prasyarat:
#   - clasp sudah terinstal (npm install -g @google/clasp)
#   - Sudah login (clasp login)
#   - .clasp.json sudah dikonfigurasi dengan scriptId
#
# Usage:
#   bash scripts/deploy-gas.sh [--version] [--description "deksripsi"]
#

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
GAS_DIR="$ROOT_DIR/backend-gas"

echo "==> Deploy Google Apps Script e-Ekspedisi"

# Cek clasp
if ! command -v clasp &> /dev/null; then
  echo "Error: clasp belum terinstal. Jalankan: npm install -g @google/clasp"
  exit 1
fi

# Cek .clasp.json
if [ ! -f "$ROOT_DIR/.clasp.json" ]; then
  echo "Error: .clasp.json tidak ditemukan. Konfigurasi scriptId terlebih dahulu."
  exit 1
fi

# Cek scriptId
SCRIPT_ID=$(grep -o '"scriptId": *"[^"]*"' "$ROOT_DIR/.clasp.json" | grep -o '"[^"]*"$' | tr -d '"')
if [ -z "$SCRIPT_ID" ] || [ "$SCRIPT_ID" = "YOUR_SCRIPT_ID" ]; then
  echo "Error: scriptId belum dikonfigurasi di .clasp.json"
  exit 1
fi

# Push kode ke Apps Script
echo "==> Push kode ke Apps Script..."
clasp push -f

# Deploy (opsional dengan versi dan deskripsi)
VERSION="${1:-}"
if [ -n "$VERSION" ]; then
  DESCRIPTION="${2:-Deploy dari script}"
  echo "==> Buat deployment versi $VERSION..."
  clasp deploy --description "$DESCRIPTION"
else
  echo "==> Selesai. (Gunakan argumen versi untuk membuat deployment: bash scripts/deploy-gas.sh 1 'desc')"
fi

echo "==> Deploy selesai."
