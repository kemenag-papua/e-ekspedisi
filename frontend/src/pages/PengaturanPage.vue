<script setup>
import { ref } from 'vue'

const configItems = ref([
  { key: 'gps_enabled', label: 'GPS Tracking', description: 'Aktifkan pencatatan lokasi GPS pada konfirmasi penerimaan', value: true },
  { key: 'signature_enabled', label: 'Tanda Tangan Digital', description: 'Aktifkan tanda tangan digital pada konfirmasi penerimaan', value: true },
  { key: 'photo_enabled', label: 'Foto Penerima', description: 'Aktifkan pengambilan foto penerima pada konfirmasi', value: true },
  { key: 'auto_backup', label: 'Backup Otomatis', description: 'Aktifkan backup otomatis spreadsheet dan drive', value: false },
])
</script>

<template>
  <div class="mx-auto max-w-2xl space-y-6">
    <div>
      <h3 class="text-xl font-semibold text-slate-900">Pengaturan Aplikasi</h3>
      <p class="text-sm text-slate-500">Konfigurasi umum aplikasi e-Ekspedisi.</p>
    </div>

    <div class="space-y-3">
      <div
        v-for="item in configItems"
        :key="item.key"
        class="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
      >
        <div>
          <p class="text-sm font-medium text-slate-900">{{ item.label }}</p>
          <p class="text-xs text-slate-500">{{ item.description }}</p>
        </div>
        <input
          v-model="item.value"
          type="checkbox"
          class="h-5 w-5 rounded border-slate-300 accent-slate-900"
        />
      </div>
    </div>

    <div class="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <p class="text-sm font-medium text-slate-900">Tentang</p>
      <p class="mt-1 text-sm text-slate-500">e-Ekspedisi v0.1.0 (Development)</p>
      <p class="text-xs text-slate-400">
        TODO: Sprint 9 - Implementasi penyimpanan konfigurasi ke sheet `konfigurasi`
      </p>
    </div>
  </div>
</template>
