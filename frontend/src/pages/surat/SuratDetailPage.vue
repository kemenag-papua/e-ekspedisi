<script setup>
import { ref, onMounted, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useToast } from 'primevue/usetoast'
import Button from 'primevue/button'
import QRCode from 'qrcode'
import { suratApi } from '@/api/surat'
import { ekspedisiApi } from '@/api/ekspedisi'
import { useAuthStore } from '@/stores/auth'

const route = useRoute()
const router = useRouter()
const toast = useToast()
const auth = useAuthStore()

const loading = ref(false)
const surat = ref(null)
const qrCanvas = ref(null)
const qrContent = ref('')
const history = ref([])
const historyLoading = ref(false)

const formatStatus = (status) => {
  const map = {
    draft: { label: 'Draft', class: 'bg-slate-100 text-slate-600' },
    menunggu_pengambilan: { label: 'Menunggu Pengambilan', class: 'bg-amber-100 text-amber-700' },
    diterima: { label: 'Diterima', class: 'bg-green-100 text-green-700' },
  }
  return map[status] || { label: status, class: 'bg-slate-100 text-slate-600' }
}

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
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

const pdfPreviewUrl = () => {
  if (!surat.value?.file_pdf) return ''
  return `https://drive.google.com/file/d/${surat.value.file_pdf}/preview`
}

const verifyBaseUrl = () => {
  return import.meta.env.VITE_APP_URL || window.location.origin
}

const buildQrContent = () => {
  if (!surat.value?.ekspedisi_id || !surat.value?.qr_token) return ''
  return `${verifyBaseUrl()}/verify/${surat.value.ekspedisi_id}?token=${surat.value.qr_token}`
}

const actionMeta = {
  CREATE_SURAT: { label: 'Buat Surat', icon: 'pi pi-file-plus', color: 'bg-blue-100 text-blue-600' },
  CREATE_EKSPEDISI: { label: 'Buat Ekspedisi', icon: 'pi pi-hashtag', color: 'bg-violet-100 text-violet-600' },
  UPDATE_SURAT: { label: 'Ubah Surat', icon: 'pi pi-pencil', color: 'bg-amber-100 text-amber-600' },
  REGENERATE_QR: { label: 'Regenerate QR', icon: 'pi pi-refresh', color: 'bg-cyan-100 text-cyan-600' },
  DELETE_SURAT: { label: 'Hapus Surat', icon: 'pi pi-trash', color: 'bg-red-100 text-red-600' },
  LOGIN: { label: 'Login', icon: 'pi pi-sign-in', color: 'bg-slate-100 text-slate-600' },
}

const getActionMeta = (aksi) => actionMeta[aksi] || { label: aksi, icon: 'pi pi-circle', color: 'bg-slate-100 text-slate-600' }

async function renderQr() {
  await nextTick()
  qrContent.value = buildQrContent()
  if (qrCanvas.value && qrContent.value) {
    await QRCode.toCanvas(qrCanvas.value, qrContent.value, {
      width: 220,
      margin: 2,
      errorCorrectionLevel: 'M',
    })
  }
}

async function handleCopyLink() {
  try {
    await navigator.clipboard.writeText(qrContent.value)
    toast.add({ severity: 'success', summary: 'Berhasil', detail: 'Link verifikasi disalin', life: 3000 })
  } catch {
    toast.add({ severity: 'error', summary: 'Gagal', detail: 'Tidak dapat menyalin link', life: 3000 })
  }
}

function handleDownloadQr() {
  if (!qrContent.value) return
  QRCode.toDataURL(qrContent.value, {
    width: 512,
    margin: 2,
    errorCorrectionLevel: 'M',
  }).then((url) => {
    const link = document.createElement('a')
    link.href = url
    link.download = `QR-${surat.value.nomor_ekspedisi || surat.value.nomor_surat || 'surat'}.png`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  })
}

async function handleRegenerateQr() {
  try {
    const response = await ekspedisiApi.regenerateQr(surat.value.ekspedisi_id)
    toast.add({ severity: 'success', summary: 'Berhasil', detail: 'QR berhasil diperbarui', life: 3000 })
    surat.value.qr_token = response.data?.qr_token || surat.value.qr_token
    await renderQr()
    await loadHistory()
  } catch (e) {
    toast.add({
      severity: 'error',
      summary: 'Gagal',
      detail: e.response?.data?.message || 'Terjadi kesalahan',
      life: 5000,
    })
  }
}

async function loadHistory() {
  historyLoading.value = true
  try {
    const response = await suratApi.getSuratHistory(route.params.id)
    history.value = response.data?.items || []
  } catch {
    history.value = []
  } finally {
    historyLoading.value = false
  }
}

onMounted(async () => {
  loading.value = true
  try {
    const response = await suratApi.getSurat(route.params.id)
    surat.value = response.data
  } catch (e) {
    toast.add({
      severity: 'error',
      summary: 'Gagal Memuat Data',
      detail: e.response?.data?.message || 'Terjadi kesalahan',
      life: 5000,
    })
    router.push('/surat')
  } finally {
    loading.value = false
  }
  await renderQr()
  await loadHistory()
})
</script>

<template>
  <div class="mx-auto max-w-4xl space-y-4">
    <div class="flex items-center gap-3">
      <Button icon="pi pi-arrow-left" severity="secondary" text rounded @click="router.push('/surat')" />
      <h3 class="text-xl font-semibold text-slate-900">Detail Surat</h3>
      <div class="ml-auto flex flex-wrap gap-2">
        <Button
          v-if="surat && surat.status !== 'diterima' && (auth.isAdmin || auth.isSuperAdmin)"
          label="Edit"
          icon="pi pi-pencil"
          severity="secondary"
          @click="router.push(`/surat/${surat.id}/edit`)"
        />
      </div>
    </div>

    <div v-if="loading" class="rounded-xl border border-slate-200 bg-white p-8 text-center text-slate-400">
      Memuat data...
    </div>

    <template v-else-if="surat">
      <div class="rounded-xl border border-slate-200 bg-white shadow-sm">
        <div class="border-b border-slate-200 px-6 py-4">
          <div class="flex items-center justify-between">
            <h4 class="text-base font-semibold text-slate-900">{{ surat.perihal }}</h4>
            <span
              class="rounded-full px-2.5 py-1 text-xs font-medium"
              :class="formatStatus(surat.status).class"
            >
              {{ formatStatus(surat.status).label }}
            </span>
          </div>
        </div>

        <div class="grid grid-cols-1 gap-4 px-6 py-5 sm:grid-cols-2">
          <div>
            <p class="text-xs font-medium uppercase tracking-wide text-slate-400">Nomor Surat</p>
            <p class="mt-1 text-sm font-medium text-slate-900">{{ surat.nomor_surat }}</p>
          </div>
          <div>
            <p class="text-xs font-medium uppercase tracking-wide text-slate-400">Tanggal Surat</p>
            <p class="mt-1 text-sm text-slate-700">{{ formatTanggal(surat.tanggal_surat) }}</p>
          </div>
          <div>
            <p class="text-xs font-medium uppercase tracking-wide text-slate-400">Unit</p>
            <p class="mt-1 text-sm text-slate-700">{{ surat.unit_name || '-' }}</p>
          </div>
          <div>
            <p class="text-xs font-medium uppercase tracking-wide text-slate-400">No. Ekspedisi</p>
            <p class="mt-1 text-sm font-mono font-medium text-slate-900">
              {{ surat.nomor_ekspedisi || '-' }}
            </p>
          </div>
          <div>
            <p class="text-xs font-medium uppercase tracking-wide text-slate-400">Dibuat Oleh</p>
            <p class="mt-1 text-sm text-slate-700">{{ surat.created_by || '-' }}</p>
          </div>
          <div>
            <p class="text-xs font-medium uppercase tracking-wide text-slate-400">Terakhir Diubah</p>
            <p class="mt-1 text-sm text-slate-700">{{ formatTanggal(surat.updated_at) }}</p>
          </div>
        </div>
      </div>

      <div class="rounded-xl border border-slate-200 bg-white shadow-sm">
        <div class="border-b border-slate-200 px-6 py-4">
          <h4 class="text-base font-semibold text-slate-900">Status</h4>
        </div>
        <div class="px-6 py-5">
          <div class="flex items-center">
            <div
              class="flex items-center gap-2"
              :class="surat.status === 'menunggu_pengambilan' || surat.status === 'diterima' ? 'text-amber-600' : 'text-slate-300'"
            >
              <i class="pi pi-hourglass text-lg"></i>
              <span class="text-sm font-medium">Menunggu Pengambilan</span>
            </div>
            <div class="mx-4 h-px flex-1 bg-slate-200"></div>
            <div
              class="flex items-center gap-2"
              :class="surat.status === 'diterima' ? 'text-green-600' : 'text-slate-300'"
            >
              <i class="pi pi-check-circle text-lg"></i>
              <span class="text-sm font-medium">Diterima</span>
            </div>
          </div>
        </div>
      </div>

      <div class="rounded-xl border border-slate-200 bg-white shadow-sm">
        <div class="flex items-center justify-between border-b border-slate-200 px-6 py-4">
          <h4 class="text-base font-semibold text-slate-900">QR Code Verifikasi</h4>
          <Button
            v-if="surat.status !== 'diterima' && (auth.isAdmin || auth.isSuperAdmin)"
            label="Regenerate"
            icon="pi pi-refresh"
            severity="secondary"
            text
            @click="handleRegenerateQr"
          />
        </div>
        <div class="flex flex-col items-center gap-4 px-6 py-6 sm:flex-row sm:items-start">
          <div class="flex-shrink-0 rounded-xl border border-slate-200 p-3">
            <canvas ref="qrCanvas"></canvas>
          </div>
          <div class="w-full space-y-2">
            <p class="text-sm text-slate-600">
              Pindai QR Code untuk verifikasi data surat saat serah terima dokumen.
            </p>
            <div class="rounded-lg bg-slate-50 px-3 py-2">
              <p class="break-all font-mono text-xs text-slate-500">{{ qrContent || '-' }}</p>
            </div>
            <div class="flex flex-wrap gap-2 pt-2">
              <Button label="Cetak QR" icon="pi pi-download" size="small" @click="handleDownloadQr" />
              <Button label="Salin Link" icon="pi pi-copy" size="small" severity="secondary" @click="handleCopyLink" />
            </div>
          </div>
        </div>
      </div>

      <div class="rounded-xl border border-slate-200 bg-white shadow-sm">
        <div class="border-b border-slate-200 px-6 py-4">
          <h4 class="text-base font-semibold text-slate-900">Dokumen Surat</h4>
        </div>
        <div class="p-6">
          <iframe
            v-if="pdfPreviewUrl()"
            :src="pdfPreviewUrl()"
            class="h-[480px] w-full rounded-lg border border-slate-200"
            title="Preview PDF Surat"
          ></iframe>
          <p v-else class="text-sm text-slate-400">Dokumen tidak tersedia.</p>
        </div>
      </div>

      <div class="rounded-xl border border-slate-200 bg-white shadow-sm">
        <div class="border-b border-slate-200 px-6 py-4">
          <h4 class="text-base font-semibold text-slate-900">Riwayat Aktivitas</h4>
        </div>
        <div class="px-6 py-5">
          <div v-if="historyLoading" class="py-4 text-center text-sm text-slate-400">
            Memuat riwayat...
          </div>
          <div v-else-if="history.length === 0" class="py-4 text-center text-sm text-slate-400">
            <i class="pi pi-history mb-2 block text-2xl"></i>
            Belum ada riwayat.
          </div>
          <ol v-else class="relative space-y-4 border-l border-slate-200 pl-6">
            <li v-for="item in history" :key="item.id" class="relative">
              <span
                class="absolute -left-[31px] flex h-6 w-6 items-center justify-center rounded-full"
                :class="getActionMeta(item.aksi).color"
              >
                <i :class="getActionMeta(item.aksi).icon" class="text-xs"></i>
              </span>
              <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p class="text-sm font-medium text-slate-900">
                    {{ getActionMeta(item.aksi).label }}
                  </p>
                  <p class="text-xs text-slate-500">{{ item.user }}</p>
                </div>
                <div class="flex items-center gap-2">
                  <span
                    class="rounded-full px-2 py-0.5 text-xs font-medium"
                    :class="item.hasil === 'Success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'"
                  >
                    {{ item.hasil }}
                  </span>
                  <span class="text-xs text-slate-400">{{ formatDateTime(item.waktu) }}</span>
                </div>
              </div>
            </li>
          </ol>
        </div>
      </div>
    </template>
  </div>
</template>
