#!/usr/bin/env bash
#
# deploy-frontend.sh
#
# Script untuk build frontend Vue 3 untuk produksi.
# Hasil build berada di frontend/dist dan dapat di-host statis.
#
# Usage:
#   bash scripts/deploy-frontend.sh
#

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
FRONTEND_DIR="$ROOT_DIR/frontend"

echo "==> Build frontend e-Ekspedisi"

if [ ! -d "$FRONTEND_DIR/node_modules" ]; then
  echo "==> Install dependencies..."
  (cd "$FRONTEND_DIR" && npm install)
fi

echo "==> Menjalankan build..."
(cd "$FRONTEND_DIR" && npm run build)

echo "==> Build selesai. Hasil di frontend/dist"
