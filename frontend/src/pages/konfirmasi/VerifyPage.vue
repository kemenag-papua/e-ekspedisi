<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Button from 'primevue/button'
import { verifyApi } from '@/api/verify'

const route = useRoute()
const router = useRouter()
const loading = ref(true)
const error = ref('')
const result = ref(null)

const formatTanggal = (value) => {
  if (!value) return '-'
  return new Date(value).toLocaleDateString('id-ID', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  })
}

const formatDateTime = (value) => {
  if (!value) return '-'
  return new Date(value).toLocaleString('id-ID', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

onMounted(async () => {
  loading.value = true
  try {
    const response = await verifyApi.verify(route.params.id, route.query.token)
    result.value = response.data
  } catch (e) {
    error.value = e.response?.data?.message || 'QR tidak valid'
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div class="flex min-h-screen items-center justify-center bg-slate-100 px-4 py-8">
    <div class="w-full max-w-md">
      <div class="mb-6 text-center">
        <div class="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-900">
          <i class="pi pi-shield text-2xl text-white"></i>
        </div>
        <h1 class="text-xl font-bold text-slate-900">e-Ekspedisi</h1>
        <p class="text-sm text-slate-500">Verifikasi Dokumen</p>
      </div>

      <div v-if="loading" class="rounded-2xl bg-white p-8 text-center text-slate-400 shadow-sm">
        Memverifikasi...
      </div>

      <div v-else-if="error" class="rounded-2xl bg-white p-8 text-center shadow-sm">
        <div class="mb-3 flex justify-center">
          <div class="flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
            <i class="pi pi-times-circle text-3xl text-red-500"></i>
          </div>
        </div>
        <h3 class="text-lg font-semibold text-slate-900">Verifikasi Gagal</h3>
        <p class="mt-2 text-sm text-slate-500">{{ error }}</p>
      </div>

      <div v-else-if="result" class="overflow-hidden rounded-2xl bg-white shadow-sm">
        <div
          class="px-6 py-4"
          :class="result.sudahDiterima ? 'bg-green-50' : 'bg-amber-50'"
        >
          <div class="flex items-center gap-3">
            <i
              :class="result.sudahDiterima ? 'pi pi-check-circle text-green-600' : 'pi pi-hourglass text-amber-600'"
              class="text-3xl"
            ></i>
            <div>
              <h3 class="text-base font-semibold text-slate-900">
                {{ result.sudahDiterima ? 'Dokumen Diterima' : 'Menunggu Konfirmasi' }}
              </h3>
              <p class="text-xs text-slate-500">
                {{ result.sudahDiterima ? 'Dokumen telah diterima dan tercatat.' : 'Dokumen menunggu konfirmasi di loket persuratan.' }}
              </p>
            </div>
          </div>
        </div>

        <div class="space-y-4 px-6 py-5">
          <div>
            <p class="text-xs font-medium uppercase tracking-wide text-slate-400">Nomor Ekspedisi</p>
            <p class="font-mono text-sm font-medium text-slate-900">{{ result.nomorEkspedisi }}</p>
          </div>
          <div>
            <p class="text-xs font-medium uppercase tracking-wide text-slate-400">Nomor Surat</p>
            <p class="text-sm font-medium text-slate-900">{{ result.surat.nomorSurat }}</p>
          </div>
          <div>
            <p class="text-xs font-medium uppercase tracking-wide text-slate-400">Perihal</p>
            <p class="text-sm text-slate-700">{{ result.surat.perihal }}</p>
          </div>
          <div>
            <p class="text-xs font-medium uppercase tracking-wide text-slate-400">Tanggal Surat</p>
            <p class="text-sm text-slate-700">{{ formatTanggal(result.surat.tanggalSurat) }}</p>
          </div>

          <template v-if="result.sudahDiterima && result.penerimaan">
            <div class="border-t border-slate-200 pt-4">
              <p class="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-400">Informasi Penerima</p>
              <div class="space-y-2">
                <p class="text-sm text-slate-700"><span class="font-medium">Nama:</span> {{ result.penerimaan.nama_penerima }}</p>
                <p class="text-sm text-slate-700"><span class="font-medium">Jabatan:</span> {{ result.penerimaan.jabatan }}</p>
                <p class="text-sm text-slate-700"><span class="font-medium">Instansi:</span> {{ result.penerimaan.instansi }}</p>
                <p class="text-sm text-slate-700"><span class="font-medium">Waktu:</span> {{ formatDateTime(result.penerimaan.diterima_pada) }}</p>
              </div>
            </div>
          </template>
        </div>
      </div>

      <div class="mt-6 text-center">
        <Button label="Kembali ke Awal" severity="secondary" text @click="router.replace(route.fullPath)" />
      </div>
    </div>
  </div>
</template>
